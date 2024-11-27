package it.polimi.productionoptimiserapi.services.impl;

import it.polimi.productionoptimiserapi.dtos.UserDTO;
import it.polimi.productionoptimiserapi.entities.OptimizationModel;
import it.polimi.productionoptimiserapi.entities.User;
import it.polimi.productionoptimiserapi.enums.UserRole;
import it.polimi.productionoptimiserapi.enums.UserStatus;
import it.polimi.productionoptimiserapi.mappers.UserMapper;
import it.polimi.productionoptimiserapi.repositories.AccountRequestRepository;
import it.polimi.productionoptimiserapi.repositories.UserRepository;
import it.polimi.productionoptimiserapi.services.OptimizationModelService;
import it.polimi.productionoptimiserapi.services.UserService;
import jakarta.persistence.EntityExistsException;
import jakarta.persistence.EntityNotFoundException;
import java.util.HashSet;
import java.util.List;
import java.util.Optional;
import java.util.Set;
import java.util.stream.Collectors;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

@Service
@RequiredArgsConstructor
public class UserServiceImpl implements UserService {

  private final UserRepository userRepository;
  private final AccountRequestRepository accountRequestRepository;

  private final OptimizationModelService optimizationModelService;

  private Set<OptimizationModel> mapModelIdsToModels(Set<String> modelIds)
      throws EntityNotFoundException {
    if (modelIds == null) {
      return Set.of();
    }

    return modelIds.stream()
        .map(
            modelId ->
                this.optimizationModelService
                    .findOptimizationModelById(modelId)
                    .orElseThrow(
                        () -> new EntityNotFoundException("Model not found by id " + modelId)))
        .collect(Collectors.toSet());
  }

  // TODO send email when creating a user
  public User createUser(UserDTO userDTO) {
    validateUserEmail(userDTO.getEmail());

    User user = userDTO.toEntity();
    user.setStatus(UserStatus.ACTIVE);

    HashSet<OptimizationModel> updatedModels =
        new HashSet<>(this.mapModelIdsToModels(userDTO.getOptimizationModelIds()));
    if (user.getRole() == UserRole.ADMIN) {
      updatedModels.addAll(
          this.optimizationModelService.findAllOptimizationModels().stream().toList());
    }

    user.setAvailableOptimizationModels(updatedModels);
    return this.userRepository.save(user);
  }

  @Override
  public List<UserDTO> getUsers() {
    return userRepository.findAll().stream().map(UserMapper::toDto).collect(Collectors.toList());
  }

  @Override
  public Optional<UserDTO> getUser(String id) {
    return userRepository.findById(id).map(UserMapper::toDto);
  }

  @Override
  public UserDTO updateUser(
      String id,
      String email,
      String password,
      UserRole requestedRole,
      Set<String> optimizationModelIds) {
    User user =
        userRepository
            .findById(id)
            .orElseThrow(() -> new EntityNotFoundException("User not found by id " + id));

    if (email != null) {
      user.setEmail(email);
    }

    if (password != null) {
      user.setPassword(password);
    }

    if (requestedRole != null) {
      if (user.getRole() == UserRole.ADMIN && requestedRole == UserRole.CUSTOMER) {
        // TODO if we allow this customer will keep all of the models permissions, we can clear them
        throw new IllegalArgumentException("Cannot change role of an admin user to customer");
      }
      user.setRole(requestedRole);
      user.setAvailableOptimizationModels(
          requestedRole == UserRole.ADMIN
              ? new HashSet<>(this.optimizationModelService.findAllOptimizationModels())
              : Set.of());
    }

    if (optimizationModelIds != null) {
      user.setAvailableOptimizationModels(this.mapModelIdsToModels(optimizationModelIds));
    }

    return UserMapper.toDto(userRepository.save(user));
  }

  @Override
  public UserDTO deleteUser(String id) {
    User user =
        userRepository
            .findById(id)
            .orElseThrow(() -> new EntityNotFoundException("User not found by id " + id));

    if (user.getRole() == UserRole.ADMIN) {
      throw new IllegalArgumentException("Cannot delete an admin user");
    }
    user.setStatus(UserStatus.DELETED);

    return UserMapper.toDto(userRepository.save(user));
  }

  @Override
  // TODO refactor this method to be more efficient with db query
  public List<UserDTO> updateAdminsWithNewModel(String modelId) {
    OptimizationModel model =
        this.optimizationModelService
            .findOptimizationModelById(modelId)
            .orElseThrow(() -> new EntityNotFoundException("Model not found by id " + modelId));

    return userRepository.findAll().stream()
        .filter(user -> user.getRole() == UserRole.ADMIN)
        .map(user -> addModelToUser(user.getId(), model))
        .toList();
  }

  @Override
  public UserDTO addModelToUser(String userId, OptimizationModel model) {
    User user =
        userRepository
            .findById(userId)
            .orElseThrow(() -> new EntityNotFoundException("User not found by id " + userId));

    Set<OptimizationModel> updatedModels = new HashSet<>(user.getAvailableOptimizationModels());
    updatedModels.add(model);

    user.setAvailableOptimizationModels(updatedModels);

    return UserMapper.toDto(userRepository.save(user));
  }

  private void validateUserEmail(String email) {
    if (userRepository.existsUserByEmail(email)) {
      throw new EntityExistsException("User with email address: " + email + " already exists.");
    }

    if (accountRequestRepository.existsAccountRequestByEmail(email)) {
      throw new EntityExistsException(
          "Account request with email address: " + email + " already exists.");
    }
  }
}
