package it.polimi.productionoptimiserapi.services.impl;

import it.polimi.productionoptimiserapi.config.Constants;
import it.polimi.productionoptimiserapi.dtos.UserDTO;
import it.polimi.productionoptimiserapi.entities.OptimizationModel;
import it.polimi.productionoptimiserapi.entities.User;
import it.polimi.productionoptimiserapi.entities.UserStatistics;
import it.polimi.productionoptimiserapi.enums.UserRole;
import it.polimi.productionoptimiserapi.enums.UserStatisticsType;
import it.polimi.productionoptimiserapi.enums.UserStatus;
import it.polimi.productionoptimiserapi.mappers.UserMapper;
import it.polimi.productionoptimiserapi.repositories.AccountRequestRepository;
import it.polimi.productionoptimiserapi.repositories.UserRepository;
import it.polimi.productionoptimiserapi.services.EmailService;
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
import lombok.extern.slf4j.Slf4j;
import org.springframework.stereotype.Service;

@Service
@RequiredArgsConstructor
@Slf4j
public class UserServiceImpl implements UserService {

  private final UserRepository userRepository;
  private final AccountRequestRepository accountRequestRepository;

  private final OptimizationModelService optimizationModelService;
  private final EmailService emailService;

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
                        () -> {
                          String msg = "Model not found by id " + modelId;
                          log.warn(msg);
                          return new EntityNotFoundException(msg);
                        }))
        .collect(Collectors.toSet());
  }

  public UserDTO createUser(UserDTO userDTO) {
    validateExistingEmail(userDTO.getEmail());

    User user = userDTO.toEntity();
    user.setStatus(UserStatus.ACTIVE);

    HashSet<OptimizationModel> updatedModels =
        new HashSet<>(this.mapModelIdsToModels(userDTO.getOptimizationModelIds()));
    if (user.getRole() == UserRole.ADMIN) {
      updatedModels.addAll(
          this.optimizationModelService.findAllOptimizationModels().stream().toList());
    }

    user.setAvailableOptimizationModels(updatedModels);
    log.info("Creating user " + userDTO.getEmail());
    user = userRepository.save(user);

    emailService.sendHtmlEmail(
        user.getEmail(),
        Constants.EMAIL_SUBJECT_NEW_ACCOUNT,
        Constants.EMAIL_BODY_NEW_ACCOUNT + userDTO.getPassword());

    return UserMapper.toDto(user);
  }

  @Override
  public List<UserDTO> getUsers() {
    log.info("Getting all users");
    return userRepository.findAll().stream().map(UserMapper::toDto).collect(Collectors.toList());
  }

  @Override
  public Optional<UserDTO> getUser(String id) {
    log.info("Getting user with id " + id);
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
            .orElseThrow(
                () -> {
                  String msg = "User not found by id " + id;
                  log.warn(msg);
                  return new EntityNotFoundException(msg);
                });

    if (email != null) {
      log.info("Updating email=" + email);
      user.setEmail(email);
    }

    if (password != null) {
      log.info("Updating password");
      user.setPassword(password);
    }

    if (requestedRole != null) {
      if (user.getRole() == UserRole.ADMIN && requestedRole == UserRole.CUSTOMER) {
        // TODO if we allow this customer will keep all of the models permissions, we can clear them
        log.warn("Cannot change role of an admin user to customer");
        throw new IllegalArgumentException("Cannot change role of an admin user to customer");
      }

      log.info("Updating role " + requestedRole);
      user.setRole(requestedRole);

      log.info("Updating optimization models");
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
            .orElseThrow(
                () -> {
                  String msg = "User not found by id " + id;
                  log.warn(msg);
                  return new EntityNotFoundException(msg);
                });

    if (user.getRole() == UserRole.ADMIN) {
      String msg = "Cannot delete an admin user";
      log.warn(msg);
      throw new IllegalArgumentException(msg);
    }

    UserDTO userDTO = UserMapper.toDto(user);
    log.info("Deleting user " + userDTO.getId());
    userRepository.delete(user);

    return userDTO;
  }

  @Override
  // TODO refactor this method to be more efficient with db query
  public List<UserDTO> updateAdminsWithNewModel(String modelId) {
    OptimizationModel model =
        this.optimizationModelService
            .findOptimizationModelById(modelId)
            .orElseThrow(
                () -> {
                  String msg = "Model not found by id " + modelId;
                  log.warn(msg);
                  return new EntityNotFoundException(msg);
                });

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
            .orElseThrow(
                () -> {
                  String msg = "User not found by id " + userId;
                  log.warn(msg);
                  return new EntityNotFoundException(msg);
                });

    log.info("Adding model " + model.getId() + " to user " + userId);
    Set<OptimizationModel> updatedModels = new HashSet<>(user.getAvailableOptimizationModels());
    updatedModels.add(model);

    user.setAvailableOptimizationModels(updatedModels);

    return UserMapper.toDto(userRepository.save(user));
  }

  @Override
  public void validateExistingEmail(String email) {
    log.info("Validating email " + email + "...");
    if (userRepository.existsUserByEmail(email)) {
      String msg = "User with email address: " + email + " already exists.";
      log.warn(msg);
      throw new EntityExistsException(msg);
    }

    if (accountRequestRepository.existsAccountRequestByEmail(email)) {
      String msg = "Account request with email address: " + email + " already exists.";
      log.warn(msg);
      throw new EntityExistsException(msg);
    }
  }

  @Override
  public void incrementLoginCount(User user) {
    // If not present create a new UserStatistics with LOGIN_COUNT
    if (user.getStatistics().stream()
        .noneMatch(stat -> stat.getType() == UserStatisticsType.LOGIN_COUNT)) {
      UserStatistics us = new UserStatistics();
      us.setType(UserStatisticsType.LOGIN_COUNT);
      us.setValue(0);
      user.getStatistics().add(us);
    }

    user.getStatistics().stream()
        .filter(stat -> stat.getType() == UserStatisticsType.LOGIN_COUNT)
        .findFirst()
        .ifPresent(stat -> stat.setValue(stat.getValue() + 1));

    userRepository.save(user);
  }
}
