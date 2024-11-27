package it.polimi.productionoptimiserapi.services.impl;

import it.polimi.productionoptimiserapi.dtos.AccountRequestDTO;
import it.polimi.productionoptimiserapi.dtos.KeyValueDTO;
import it.polimi.productionoptimiserapi.dtos.UserDTO;
import it.polimi.productionoptimiserapi.entities.AccountRequest;
import it.polimi.productionoptimiserapi.entities.User;
import it.polimi.productionoptimiserapi.enums.UserRole;
import it.polimi.productionoptimiserapi.mappers.AccountRequestMapper;
import it.polimi.productionoptimiserapi.mappers.UserMapper;
import it.polimi.productionoptimiserapi.repositories.AccountRequestRepository;
import it.polimi.productionoptimiserapi.repositories.UserRepository;
import it.polimi.productionoptimiserapi.services.AccountRequestService;
import it.polimi.productionoptimiserapi.services.UserService;
import jakarta.persistence.EntityExistsException;
import jakarta.persistence.EntityNotFoundException;
import java.util.List;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

@Service
@RequiredArgsConstructor
public class AccountRequestServiceImpl implements AccountRequestService {

  private final AccountRequestRepository accountRequestRepository;
  private final UserRepository userRepository;
  private final UserService userService;

  @Override
  public AccountRequestDTO getAccountRequest(String id) {
    return accountRequestRepository
        .findById(id)
        .map(AccountRequestMapper::toDto)
        .orElseThrow(
            () -> new EntityNotFoundException("Account request with id " + id + " not found"));
  }

  @Override
  public List<AccountRequestDTO> getAccountRequests() {
    return accountRequestRepository.findAll().stream().map(AccountRequestMapper::toDto).toList();
  }

  @Override
  @Transactional
  public AccountRequestDTO createAccountRequest(AccountRequestDTO accountRequestDTO) {
    validateAccountRequestEmail(accountRequestDTO.getEmail());

    AccountRequest accountRequest = accountRequestDTO.toEntity();
    accountRequest = accountRequestRepository.save(accountRequest);

    return AccountRequestMapper.toDto(accountRequest);
  }

  @Override
  @Transactional
  public UserDTO approveAccountRequest(KeyValueDTO keyValueDTO) {
    AccountRequest accountRequest =
        accountRequestRepository
            .findById(keyValueDTO.getKey())
            .orElseThrow(
                () ->
                    new EntityNotFoundException(
                        "Account request with id " + keyValueDTO.getKey() + " not found"));

    UserDTO userDTO =
        UserDTO.builder()
            .email(accountRequest.getEmail())
            .password(keyValueDTO.getValue())
            .role(UserRole.CUSTOMER)
            .build();

    accountRequestRepository.delete(accountRequest);

    User user = userService.createUser(userDTO);
    return UserMapper.toDto(user);
  }

  // TODO send email when denying a request
  @Override
  @Transactional
  public void denyAccountRequest(KeyValueDTO keyValueDTO) {
    if (!accountRequestRepository.existsById(keyValueDTO.getKey())) {
      throw new EntityNotFoundException(
          "Account request with id " + keyValueDTO.getKey() + " not found");
    }

    accountRequestRepository.deleteById(keyValueDTO.getKey());
  }

  private void validateAccountRequestEmail(String email) {
    if (accountRequestRepository.existsAccountRequestByEmail(email)) {
      throw new EntityExistsException(
          "Account request with email address: " + email + " already exists.");
    }

    if (userRepository.existsUserByEmail(email)) {
      throw new EntityExistsException("User with email address: " + email + " already exists.");
    }
  }
}
