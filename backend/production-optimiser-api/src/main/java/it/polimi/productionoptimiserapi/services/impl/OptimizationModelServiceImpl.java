package it.polimi.productionoptimiserapi.services.impl;

import com.fasterxml.jackson.databind.JsonNode;
import com.fasterxml.jackson.databind.ObjectMapper;
import it.polimi.productionoptimiserapi.dtos.OptimizationModelDTO;
import it.polimi.productionoptimiserapi.entities.*;
import it.polimi.productionoptimiserapi.enums.GraphType;
import it.polimi.productionoptimiserapi.enums.OptimizationModelStatus;
import it.polimi.productionoptimiserapi.mappers.MultipartFileResource;
import it.polimi.productionoptimiserapi.repositories.OptimizationModelRepository;
import it.polimi.productionoptimiserapi.repositories.OptimizationResultRepository;
import it.polimi.productionoptimiserapi.repositories.UserRepository;
import it.polimi.productionoptimiserapi.services.OptimizationModelService;
import jakarta.persistence.EntityNotFoundException;

import java.io.IOException;
import java.util.*;
import java.util.stream.Collectors;

import org.springframework.http.*;
import org.springframework.stereotype.Service;
import org.springframework.util.LinkedMultiValueMap;
import org.springframework.util.MultiValueMap;
import org.springframework.web.client.RestTemplate;
import org.springframework.web.multipart.MultipartFile;

@Service
public class OptimizationModelServiceImpl implements OptimizationModelService {

  private final OptimizationModelRepository optimizationModelRepository;

  private final UserRepository userRepository;

  private final RestTemplate restTemplate;

  private final OptimizationResultRepository optimizationResultRepository;

  public OptimizationModelServiceImpl(
      OptimizationModelRepository optimizationModelRepository,
      UserRepository userRepository,
      RestTemplate restTemplate,
      OptimizationResultRepository optimizationResultRepository) {
    this.optimizationModelRepository = optimizationModelRepository;
    this.userRepository = userRepository;
    this.restTemplate = restTemplate;
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
    OptimizationModel model =
        this.optimizationModelRepository
            .findById(id)
            .orElseThrow(() -> new EntityNotFoundException("Model not found by id " + id));
    model.setStatus(OptimizationModelStatus.RETIRED);
    return this.optimizationModelRepository.save(model);
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

  public OptimizationResult invokeOptimizationModel(
    OptimizationModel model, MultipartFile inputFile, User invoker) throws IOException {
      OptimizationResult or = new OptimizationResult();
      or.setInputFile(inputFile.getBytes());

      HttpHeaders headers = new HttpHeaders();
      headers.setContentType(MediaType.MULTIPART_FORM_DATA);

      MultiValueMap<String, Object> body = new LinkedMultiValueMap<>();
      body.add("file", new MultipartFileResource(inputFile));

      HttpEntity<MultiValueMap<String, Object>> requestEntity = new HttpEntity<>(body, headers);

      ResponseEntity<String> responseEntity = restTemplate.exchange(
        model.getApiUrl(),
        HttpMethod.POST,
        requestEntity,
        String.class
      );

      if (!responseEntity.getStatusCode().is2xxSuccessful()) {
        throw new RuntimeException("Error: " + responseEntity);
      }

      String response = responseEntity.getBody();
      ObjectMapper objectMapper = new ObjectMapper();

      // TODO: All of this can be made into a singular JSONB to store freely on Postgres...
      JsonNode content = objectMapper.readTree(response);

      or.setInitialTotalProductionTime(content.get("initial_total_production_time").asDouble());
      or.setOptimizedTotalProductionTime(content.get("optimized_total_production_time").asDouble());
      or.setTimeImprovement(content.get("time_improvement").asDouble());
      or.setPercentageImprovement(content.get("percentage_improvement").asDouble());
      or.setAverageInitialTotalMachineUtilization(content.get("average_initial_total_machine_utilization").asDouble());
      or.setAverageOptimizedTotalMachineUtilization(content.get("average_optimized_total_machine_utilization").asDouble());
      or.setUtilizationImprovement(content.get("utilization_improvement").asDouble());

      JsonNode maximumPalletsUsed = content.get("maximum_pallets_used");
      List<MaximumPalletsUsed> maximumPalletsUseds = new ArrayList<>();

      for (Iterator<Map.Entry<String, JsonNode>> it = maximumPalletsUsed.fields(); it.hasNext(); ) {
        Map.Entry<String, JsonNode> entry = it.next();

        MaximumPalletsUsed mpu = new MaximumPalletsUsed();
        mpu.setDefinedPallets(entry.getKey());
        mpu.setCount(entry.getValue().asInt());

        maximumPalletsUseds.add(mpu);
      }
      or.setMaximumPalletsUsed(maximumPalletsUseds);

      // TODO: Correct key here, should be `pallets_defined_in_excel`
      JsonNode palletsDefinedInExcel = content.get("pallets_defined_in_Excel:");
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
      or.setBestSequenceOfProducts(content.get("best_sequence_of_products").asText(""));

      JsonNode graphsNode = content.get("graphs");
      List<Graph> graphs = new ArrayList<>();

      for (Iterator<Map.Entry<String, JsonNode>> it = graphsNode.fields(); it.hasNext(); ) {
        Map.Entry<String, JsonNode> entry = it.next();

        Graph g = new Graph();
        g.setType(GraphType.fromKey(entry.getKey()));
        g.setBase64EncodedImage(entry.getValue().asText(""));

        graphs.add(g);
      }
      or.setGraphs(graphs);

      or.setUser(invoker);
      optimizationResultRepository.save(or);

      return or;
    }
}
