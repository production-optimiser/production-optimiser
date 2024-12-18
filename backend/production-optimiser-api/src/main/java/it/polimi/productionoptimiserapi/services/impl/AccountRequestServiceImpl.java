package it.polimi.productionoptimiserapi.services.impl;

import it.polimi.productionoptimiserapi.config.Constants;
import it.polimi.productionoptimiserapi.dtos.AccountRequestDTO;
import it.polimi.productionoptimiserapi.dtos.KeyValueDTO;
import it.polimi.productionoptimiserapi.dtos.UserDTO;
import it.polimi.productionoptimiserapi.entities.AccountRequest;
import it.polimi.productionoptimiserapi.enums.UserRole;
import it.polimi.productionoptimiserapi.mappers.AccountRequestMapper;
import it.polimi.productionoptimiserapi.repositories.AccountRequestRepository;
import it.polimi.productionoptimiserapi.services.AccountRequestService;
import it.polimi.productionoptimiserapi.services.EmailService;
import it.polimi.productionoptimiserapi.services.UserService;
import jakarta.persistence.EntityNotFoundException;
import java.util.List;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

@Service
@RequiredArgsConstructor
@Slf4j
public class AccountRequestServiceImpl implements AccountRequestService {

  private final AccountRequestRepository accountRequestRepository;
  private final UserService userService;
  private final EmailService emailService;

  @Override
  public AccountRequestDTO getAccountRequest(String id) {
    log.info("Fetching account request with id " + id + "...");
    return accountRequestRepository
        .findById(id)
        .map(AccountRequestMapper::toDto)
        .orElseThrow(
            () -> {
              String message = "Account request with id " + id + " not found";
              log.warn(message);
              return new EntityNotFoundException(message);
            });
  }

  @Override
  public List<AccountRequestDTO> getAccountRequests() {
    log.info("Fetching all account requests...");
    return accountRequestRepository.findAll().stream().map(AccountRequestMapper::toDto).toList();
  }

  @Override
  @Transactional
  public AccountRequestDTO createAccountRequest(AccountRequestDTO accountRequestDTO) {
    userService.validateExistingEmail(accountRequestDTO.getEmail());

    log.info("Creating account request with id=" + accountRequestDTO.getId());
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
                () -> {
                  String msg = "Account request with id " + keyValueDTO.getKey() + " not found";
                  log.warn(msg);
                  return new EntityNotFoundException(msg);
                });

    UserDTO userDTO =
        UserDTO.builder()
            .email(accountRequest.getEmail())
            .password(keyValueDTO.getValue())
            .role(UserRole.CUSTOMER)
            .build();

    log.info("Deleting account request with id=" + accountRequest.getId());
    accountRequestRepository.delete(accountRequest);

    return userService.createUser(userDTO);
  }

  @Override
  @Transactional
  public AccountRequestDTO denyAccountRequest(KeyValueDTO keyValueDTO) {
    AccountRequest accountRequest =
        accountRequestRepository
            .findById(keyValueDTO.getKey())
            .orElseThrow(
                () -> {
                  String msg = "Account request with id " + keyValueDTO.getKey() + " not found";
                  log.warn(msg);
                  return new EntityNotFoundException(msg);
                });

    emailService.sendHtmlEmail(
        accountRequest.getEmail(),
        Constants.EMAIL_SUBJECT_DENIED_ACCOUNT,
        Constants.EMAIL_BODY_DENIED_ACCOUNT + keyValueDTO.getValue());

    AccountRequestDTO accountRequestDTO = AccountRequestMapper.toDto(accountRequest);

    log.info("Deleting account request with id=" + accountRequest.getId());
    accountRequestRepository.deleteById(keyValueDTO.getKey());

    return accountRequestDTO;
  }
}
