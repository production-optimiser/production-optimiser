package it.polimi.productionoptimiserapi.services.impl;

import com.fasterxml.jackson.databind.JsonNode;
import com.fasterxml.jackson.databind.ObjectMapper;
import it.polimi.productionoptimiserapi.dtos.OptimizationModelDTO;
import it.polimi.productionoptimiserapi.entities.*;
import it.polimi.productionoptimiserapi.enums.GraphType;
import it.polimi.productionoptimiserapi.enums.OptimizationModelStatus;
import it.polimi.productionoptimiserapi.repositories.OptimizationModelRepository;
import it.polimi.productionoptimiserapi.repositories.OptimizationResultRepository;
import it.polimi.productionoptimiserapi.repositories.UserRepository;
import it.polimi.productionoptimiserapi.services.OptimizationModelService;
import jakarta.persistence.EntityNotFoundException;

import java.io.IOException;
import java.util.*;
import java.util.stream.Collectors;

import org.apache.hc.client5.http.classic.methods.HttpPost;
import org.apache.hc.client5.http.entity.mime.HttpMultipartMode;
import org.apache.hc.client5.http.entity.mime.MultipartEntityBuilder;
import org.apache.hc.client5.http.impl.classic.CloseableHttpClient;
import org.apache.hc.client5.http.impl.classic.HttpClients;
import org.apache.hc.core5.http.HttpEntity;
import org.apache.hc.core5.http.io.entity.EntityUtils;
import org.springframework.stereotype.Service;
import org.springframework.web.multipart.MultipartFile;

@Service
public class OptimizationModelServiceImpl implements OptimizationModelService {

  private final OptimizationModelRepository optimizationModelRepository;

  private final UserRepository userRepository;

  private final OptimizationResultRepository optimizationResultRepository;

  public OptimizationModelServiceImpl(
      OptimizationModelRepository optimizationModelRepository, UserRepository userRepository,
      OptimizationResultRepository optimizationResultRepository) {
    this.optimizationModelRepository = optimizationModelRepository;
    this.userRepository = userRepository;
    this.optimizationResultRepository = optimizationResultRepository;
  }

  private Set<User> mapUserIdsToUsers(Set<String> userIds) throws EntityNotFoundException {
    if (userIds == null) {
      return Set.of();
    }

    return userIds.stream()
        .map(
            userId ->
                this.userRepository
                    .findById(userId)
                    .orElseThrow(
                        () -> new EntityNotFoundException("User not found by id " + userId)))
        .collect(Collectors.toSet());
  }

  public OptimizationModel saveOptimizationModel(OptimizationModelDTO optimizationModelDTO)
      throws EntityNotFoundException {
    OptimizationModel om = optimizationModelDTO.toEntity();
    om.setUsers(this.mapUserIdsToUsers(optimizationModelDTO.getUserIds()));
    return this.optimizationModelRepository.save(om);
  }

  public Optional<OptimizationModel> findOptimizationModelById(String id) {
    return this.optimizationModelRepository.findById(id);
  }

  public OptimizationModel retireOptimizationModel(String id) throws EntityNotFoundException {
    OptimizationModel om =
        this.optimizationModelRepository
            .findById(id)
            .orElseThrow(() -> new EntityNotFoundException("Model not found by id " + id));
    om.setStatus(OptimizationModelStatus.RETIRED);
    return this.optimizationModelRepository.save(om);
  }

  public OptimizationResult invokeOptimizationModel(
      OptimizationModel model, MultipartFile inputFile) throws IOException {
    OptimizationResult or = new OptimizationResult();
    or.setInputData(inputFile.getBytes());

    try (CloseableHttpClient httpClient = HttpClients.createDefault()) {
      HttpPost httpPost = new HttpPost(model.getApiUrl() + "/optimize");

      try (HttpEntity httpEntity = MultipartEntityBuilder.create()
          .setMode(HttpMultipartMode.EXTENDED)
          .addBinaryBody("file", inputFile.getBytes())
          .build()) {

        httpPost.setEntity(httpEntity);

        httpClient.execute(httpPost, response -> {
          if (response.getCode() != 200) {
            throw new RuntimeException("Error: " + response.getReasonPhrase());
          }

          ObjectMapper objectMapper = new ObjectMapper();
          String responseContent = EntityUtils.toString(response.getEntity());
          or.setPltData(EntityUtils.toByteArray(response.getEntity()));

          // TODO: All of this can be made into a singular JSONB to store freely on Postgres...
          JsonNode content = objectMapper.readTree(responseContent);

          or.setInitialTotalProductionTime(content.get("initial_total_production_time").asDouble());
          or.setOptimizedTotalProductionTime(content.get("optimized_total_production_time").asDouble());
          or.setTimeImprovement(content.get("time_improvement").asDouble());
          or.setPercentageImprovement(content.get("percentage_improvement").asDouble());
          or.setAverageInitialTotalMachineUtilization(content.get("average_initial_total_machine_utilization").asDouble());
          or.setAverageOptimizedTotalMachineUtilization(content.get("average_optimized_total_machine_utilization").asDouble());
          or.setUtilizationImprovement(content.get("utilization_improvement").asDouble());

          JsonNode maximumPallestsUsed = content.get("maximum_pallets_used");
          List<MaximumPalletsUsed> maximumPalletsUseds = new ArrayList<>();

          for (Iterator<Map.Entry<String, JsonNode>> it = maximumPallestsUsed.fields(); it.hasNext(); ) {
              Map.Entry<String, JsonNode> entry = it.next();

              MaximumPalletsUsed mpu = new MaximumPalletsUsed();
              mpu.setDefinedPallets(entry.getKey());
              mpu.setCount(entry.getValue().asInt());

              maximumPalletsUseds.add(mpu);
          }
          or.setMaximumPalletsUsed(maximumPalletsUseds);

          JsonNode palletsDefinedInExcel = content.get("pallets_defined_in_Excel");
          List<ExcelDefinedPallets> excelDefinedPallets = new ArrayList<>();

          for (Iterator<Map.Entry<String, JsonNode>> it = palletsDefinedInExcel.fields(); it.hasNext(); ) {
            Map.Entry<String, JsonNode> entry = it.next();

            ExcelDefinedPallets edp = new ExcelDefinedPallets();
            edp.setDefinedPallets(entry.getKey());
            edp.setCount(entry.getValue().asInt());

            excelDefinedPallets.add(edp);
          }
          or.setPalletsDefinedInExcel(excelDefinedPallets);

          or.setTotalTimeWithOptimizedPallets(content.get("total_time_with_optimized_pallets").asDouble());
          or.setTotalTimeWithExcelPallets(content.get("total_time_with_excel_pallets").asDouble());
          or.setBestSequenceOfProducts(content.get("best_sequence_of_products").asToken().asString());

          JsonNode graphsNode = content.get("graphs");
          List<Graph> graphs = new ArrayList<>();

          for (Iterator<Map.Entry<String, JsonNode>> it = graphsNode.fields(); it.hasNext(); ) {
            Map.Entry<String, JsonNode> entry = it.next();

            Graph g = new Graph();
            g.setType(GraphType.fromKey(entry.getKey()));
            g.setBase64EncodedImage(entry.getValue().asToken().asString());

            graphs.add(g);
          }
          or.setGraphs(graphs);

          return null;
        });
      }
    } catch (IOException e) {
        throw new RuntimeException(e);
    }

    optimizationResultRepository.save(or);

      return or;
  }

  @Override
  public List<OptimizationModel> findAllOptimizationModels() {
    return this.optimizationModelRepository.findAll();
  }

  @Override
  public OptimizationModel updateOptimizationModel(
      String id, OptimizationModelDTO optimizationModelDTO) {
    OptimizationModel model =
        this.optimizationModelRepository
            .findById(id)
            .orElseThrow(() -> new EntityNotFoundException("Model not found by id " + id));
    model.setName(optimizationModelDTO.getName());
    model.setApiUrl(optimizationModelDTO.getApiUrl());
    return this.optimizationModelRepository.save(model);
  }
}
