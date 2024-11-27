package it.polimi.productionoptimiserapi.controllers;

import it.polimi.productionoptimiserapi.dtos.AccountRequestDTO;
import it.polimi.productionoptimiserapi.dtos.KeyValueDTO;
import it.polimi.productionoptimiserapi.dtos.UserDTO;
import it.polimi.productionoptimiserapi.services.AccountRequestService;
import jakarta.validation.Valid;
import java.util.List;
import lombok.RequiredArgsConstructor;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/account-requests")
@RequiredArgsConstructor
public class AccountRequestController {

  private final AccountRequestService accountRequestService;

  @GetMapping("/{id}")
  @PreAuthorize("hasRole('ADMIN')")
  public AccountRequestDTO getAccountRequest(@PathVariable String id) {
    return accountRequestService.getAccountRequest(id);
  }

  @GetMapping("/all")
  @PreAuthorize("hasRole('ADMIN')")
  public List<AccountRequestDTO> getAccountRequests() {
    return accountRequestService.getAccountRequests();
  }

  @PostMapping("/form")
  public AccountRequestDTO createAccountRequest(
      @Valid @RequestBody AccountRequestDTO accountRequestDTO) {
    return accountRequestService.createAccountRequest(accountRequestDTO);
  }

  /*
  key = accountRequest.id
  value = password
   */
  @PostMapping("/approve")
  @PreAuthorize("hasRole('ADMIN')")
  public UserDTO approveAccountRequest(@RequestBody KeyValueDTO keyValueDTO) {
    return accountRequestService.approveAccountRequest(keyValueDTO);
  }

  /*
  key = accountRequest.id
  value = reason
   */
  @PostMapping("/deny")
  @PreAuthorize("hasRole('ADMIN')")
  public String denyAccountRequest(@RequestBody KeyValueDTO keyValueDTO) {
    accountRequestService.denyAccountRequest(keyValueDTO);
    return "Account request with id: " + keyValueDTO.getKey() + " was denied.";
  }
}
