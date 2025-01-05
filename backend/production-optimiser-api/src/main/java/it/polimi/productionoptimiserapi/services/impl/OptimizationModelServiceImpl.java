package it.polimi.productionoptimiserapi.services.impl;

import com.fasterxml.jackson.core.type.TypeReference;
import com.fasterxml.jackson.databind.ObjectMapper;
import it.polimi.productionoptimiserapi.dtos.OptimizationModelDTO;
import it.polimi.productionoptimiserapi.entities.*;
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
    return this.optimizationModelRepository.save(optimizationModelDTO.toEntity());
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
  public List<OptimizationModel> findAllOptimizationModelsByUser(User user) {
    return this.optimizationModelRepository.findAllByUser(user.getId());
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
    model.setInputType(optimizationModelDTO.getInputType());
    return this.optimizationModelRepository.save(model);
  }

  public OptimizationResult invokeOptimizationModel(
      OptimizationModel model, MultipartFile inputFile, String inputString, User invoker)
      throws IOException {
    OptimizationResult or = new OptimizationResult();
    if (inputFile == null && inputString == null) {
      throw new IllegalArgumentException("Either inputFile or inputString must be provided");
    }
    if (inputFile != null && inputString != null) {
      throw new IllegalArgumentException("Only one of inputFile or inputString must be provided");
    }

    ResponseEntity<String> responseEntity = null;

    if (inputFile != null) {
      or.setInputFile(inputFile.getBytes());
      HttpHeaders headers = new HttpHeaders();
      headers.setContentType(MediaType.MULTIPART_FORM_DATA);

      MultiValueMap<String, Object> body = new LinkedMultiValueMap<>();
      body.add("file", new MultipartFileResource(inputFile));

      HttpEntity<MultiValueMap<String, Object>> requestEntity = new HttpEntity<>(body, headers);

      responseEntity =
          restTemplate.exchange(model.getApiUrl(), HttpMethod.POST, requestEntity, String.class);
    } else {
      or.setInputString(inputString);

      HttpHeaders headers = new HttpHeaders();
      headers.setContentType(MediaType.APPLICATION_JSON);

      String jsonPayload = String.format("{\"input\": \"%s\"}", inputString);

      HttpEntity<String> requestEntity = new HttpEntity<>(jsonPayload, headers);

      responseEntity =
          restTemplate.exchange(model.getApiUrl(), HttpMethod.POST, requestEntity, String.class);
    }

    if (!responseEntity.getStatusCode().is2xxSuccessful()) {
      throw new RuntimeException("Error: " + responseEntity);
    }

    String response = responseEntity.getBody();
    ObjectMapper objectMapper = new ObjectMapper();
    Map<String, Object> responseMap = objectMapper.readValue(response, new TypeReference<>() {});

    or.setOutputJSON(responseMap);

    or.setUser(invoker);
    optimizationResultRepository.save(or);

    return or;
  }
}
