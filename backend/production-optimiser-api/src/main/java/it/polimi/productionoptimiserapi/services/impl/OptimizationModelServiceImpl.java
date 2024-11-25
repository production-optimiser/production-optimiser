package it.polimi.productionoptimiserapi.services.impl;

import it.polimi.productionoptimiserapi.dtos.OptimizationModelDTO;
import it.polimi.productionoptimiserapi.entities.OptimizationModel;
import it.polimi.productionoptimiserapi.entities.OptimizationResult;
import it.polimi.productionoptimiserapi.entities.User;
import it.polimi.productionoptimiserapi.enums.OptimizationModelStatus;
import it.polimi.productionoptimiserapi.repositories.OptimizationModelRepository;
import it.polimi.productionoptimiserapi.repositories.UserRepository;
import it.polimi.productionoptimiserapi.services.OptimizationModelService;
import jakarta.persistence.EntityNotFoundException;
import java.util.List;
import java.util.Optional;
import java.util.Set;
import java.util.stream.Collectors;
import org.springframework.stereotype.Service;
import org.springframework.web.multipart.MultipartFile;

@Service
public class OptimizationModelServiceImpl implements OptimizationModelService {

  private final OptimizationModelRepository optimizationModelRepository;

  private final UserRepository userRepository;

  public OptimizationModelServiceImpl(
      OptimizationModelRepository optimizationModelRepository, UserRepository userRepository) {
    this.optimizationModelRepository = optimizationModelRepository;
    this.userRepository = userRepository;
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
      OptimizationModel model, MultipartFile inputFile) {
    OptimizationResult or = new OptimizationResult();
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
