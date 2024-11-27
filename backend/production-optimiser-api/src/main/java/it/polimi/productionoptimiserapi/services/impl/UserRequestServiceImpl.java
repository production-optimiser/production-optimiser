package it.polimi.productionoptimiserapi.services.impl;

import it.polimi.productionoptimiserapi.dtos.KeyValueDTO;
import it.polimi.productionoptimiserapi.dtos.UserDTO;
import it.polimi.productionoptimiserapi.dtos.UserRequestDTO;
import it.polimi.productionoptimiserapi.entities.User;
import it.polimi.productionoptimiserapi.entities.UserRequest;
import it.polimi.productionoptimiserapi.enums.UserRole;
import it.polimi.productionoptimiserapi.mappers.UserMapper;
import it.polimi.productionoptimiserapi.mappers.UserRequestMapper;
import it.polimi.productionoptimiserapi.repositories.UserRepository;
import it.polimi.productionoptimiserapi.repositories.UserRequestRepository;
import it.polimi.productionoptimiserapi.services.UserRequestService;
import it.polimi.productionoptimiserapi.services.UserService;
import jakarta.persistence.EntityExistsException;
import jakarta.persistence.EntityNotFoundException;
import java.util.List;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

@Service
@RequiredArgsConstructor
public class UserRequestServiceImpl implements UserRequestService {

  private final UserRequestRepository userRequestRepository;
  private final UserRepository userRepository;
  private final UserService userService;

  @Override
  public UserRequestDTO getUserRequest(String id) {
    return userRequestRepository
        .findById(id)
        .map(UserRequestMapper::toDto)
        .orElseThrow(
            () -> new EntityNotFoundException("User request with id " + id + " not found"));
  }

  @Override
  public List<UserRequestDTO> getUserRequests() {
    return userRequestRepository.findAll().stream().map(UserRequestMapper::toDto).toList();
  }

  @Override
  @Transactional
  public UserRequestDTO createUserRequest(UserRequestDTO userRequestDTO) {
    validateUserRequestEmail(userRequestDTO.getEmail());

    UserRequest userRequest = userRequestDTO.toEntity();
    userRequest = userRequestRepository.save(userRequest);

    return UserRequestMapper.toDto(userRequest);
  }

  @Override
  @Transactional
  public UserDTO approveUserRequest(KeyValueDTO keyValueDTO) {
    UserRequest userRequest =
        userRequestRepository
            .findById(keyValueDTO.getKey())
            .orElseThrow(
                () ->
                    new EntityNotFoundException(
                        "User request with id " + keyValueDTO.getKey() + " not found"));

    UserDTO userDTO =
        UserDTO.builder()
            .email(userRequest.getEmail())
            .password(keyValueDTO.getValue())
            .role(UserRole.CUSTOMER)
            .build();

    userRequestRepository.delete(userRequest);

    User user = userService.createUser(userDTO);
    return UserMapper.toDto(user);
  }

  // TODO send email when denying a request
  @Override
  @Transactional
  public void denyUserRequest(KeyValueDTO keyValueDTO) {
    if (!userRequestRepository.existsById(keyValueDTO.getKey())) {
      throw new EntityNotFoundException(
          "User request with id " + keyValueDTO.getKey() + " not found");
    }

    userRequestRepository.deleteById(keyValueDTO.getKey());
  }

  private void validateUserRequestEmail(String email) {
    if (userRequestRepository.existsUserRequestByEmail(email)) {
      throw new EntityExistsException(
          "User request with email address: " + email + " already exists.");
    }

    if (userRepository.existsUserByEmail(email)) {
      throw new EntityExistsException("User with email address: " + email + " already exists.");
    }
  }
}
