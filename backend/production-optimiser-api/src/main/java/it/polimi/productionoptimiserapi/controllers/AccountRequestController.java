package it.polimi.productionoptimiserapi.controllers;

import it.polimi.productionoptimiserapi.dtos.AccountRequestDTO;
import it.polimi.productionoptimiserapi.dtos.KeyValueDTO;
import it.polimi.productionoptimiserapi.dtos.UserDTO;
import it.polimi.productionoptimiserapi.services.AccountRequestService;
import jakarta.validation.Valid;
import java.util.List;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/account-requests")
@RequiredArgsConstructor
@Slf4j
public class AccountRequestController {

  private final AccountRequestService accountRequestService;

  @GetMapping("/{id}")
  @PreAuthorize("hasRole('ADMIN')")
  public AccountRequestDTO getAccountRequest(@PathVariable String id) {
    log.info("Received GET request for account request with id " + id);
    return accountRequestService.getAccountRequest(id);
  }

  @GetMapping()
  @PreAuthorize("hasRole('ADMIN')")
  public List<AccountRequestDTO> getAccountRequests() {
    log.info("Received GET request for all account requests");
    return accountRequestService.getAccountRequests();
  }

  @PostMapping()
  public AccountRequestDTO createAccountRequest(
      @Valid @RequestBody AccountRequestDTO accountRequestDTO) {
    log.info("Received POST request for creating account request " + accountRequestDTO);
    return accountRequestService.createAccountRequest(accountRequestDTO);
  }

  /*
  key = accountRequest.id
  value = password
   */
  @PostMapping("/approve")
  @PreAuthorize("hasRole('ADMIN')")
  public UserDTO approveAccountRequest(@RequestBody KeyValueDTO keyValueDTO) {
    log.info("Received POST request for account request approval" + keyValueDTO.getKey());
    return accountRequestService.approveAccountRequest(keyValueDTO);
  }

  /*
  key = accountRequest.id
  value = reason
   */
  @PostMapping("/deny")
  @PreAuthorize("hasRole('ADMIN')")
  public AccountRequestDTO denyAccountRequest(@RequestBody KeyValueDTO keyValueDTO) {
    log.info("Received POST request for denying account request " + keyValueDTO.getKey());
    return accountRequestService.denyAccountRequest(keyValueDTO);
  }
}
