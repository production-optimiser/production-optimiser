package it.polimi.productionoptimiserapi.services.impl;

import it.polimi.productionoptimiserapi.dtos.UserDTO;
import it.polimi.productionoptimiserapi.entities.OptimizationModel;
import it.polimi.productionoptimiserapi.entities.User;
import it.polimi.productionoptimiserapi.repositories.OptimizationModelRepository;
import it.polimi.productionoptimiserapi.repositories.UserRepository;
import it.polimi.productionoptimiserapi.services.UserService;
import jakarta.persistence.EntityNotFoundException;
import java.util.Set;
import java.util.stream.Collectors;
import org.springframework.stereotype.Service;

@Service
public class UserServiceImpl implements UserService {

  private final UserRepository userRepository;

  private final OptimizationModelRepository optimizationModelRepository;

  public UserServiceImpl(
      UserRepository userRepository, OptimizationModelRepository optimizationModelRepository) {
    this.userRepository = userRepository;
    this.optimizationModelRepository = optimizationModelRepository;
  }

  private Set<OptimizationModel> mapModelIdsToModels(Set<String> modelIds)
      throws EntityNotFoundException {
    if (modelIds == null) {
      return Set.of();
    }

    return modelIds.stream()
        .map(
            modelId ->
                this.optimizationModelRepository
                    .findById(modelId)
                    .orElseThrow(
                        () -> new EntityNotFoundException("Model not found by id " + modelId)))
        .collect(Collectors.toSet());
  }

  public User createUser(UserDTO userDTO) {
    User user = userDTO.toEntity();
    user.setAvailableOptimizationModels(
        this.mapModelIdsToModels(userDTO.getOptimizationModelIds()));
    return this.userRepository.save(user);
  }
}
