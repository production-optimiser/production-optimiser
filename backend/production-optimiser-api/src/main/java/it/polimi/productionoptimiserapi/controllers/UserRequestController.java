package it.polimi.productionoptimiserapi.controllers;

import it.polimi.productionoptimiserapi.dtos.KeyValueDTO;
import it.polimi.productionoptimiserapi.dtos.UserDTO;
import it.polimi.productionoptimiserapi.dtos.UserRequestDTO;
import it.polimi.productionoptimiserapi.services.UserRequestService;
import jakarta.validation.Valid;
import java.util.List;
import lombok.RequiredArgsConstructor;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/user-requests")
@RequiredArgsConstructor
public class UserRequestController {

  private final UserRequestService userRequestService;

  @GetMapping("/{id}")
  @PreAuthorize("hasRole('ADMIN')")
  public UserRequestDTO getUserRequest(@PathVariable String id) {
    return userRequestService.getUserRequest(id);
  }

  @GetMapping("/all")
  @PreAuthorize("hasRole('ADMIN')")
  public List<UserRequestDTO> getUserRequests() {
    return userRequestService.getUserRequests();
  }

  @PostMapping("/form")
  public UserRequestDTO createUserRequest(@Valid @RequestBody UserRequestDTO userRequestDTO) {
    return userRequestService.createUserRequest(userRequestDTO);
  }

  /*
  key = userRequest.id
  value = password
   */
  @PostMapping("/approve")
  @PreAuthorize("hasRole('ADMIN')")
  public UserDTO approveUserRequest(@RequestBody KeyValueDTO keyValueDTO) {
    return userRequestService.approveUserRequest(keyValueDTO);
  }

  /*
  key = userRequest.id
  value = reason
   */
  @PostMapping("/deny")
  @PreAuthorize("hasRole('ADMIN')")
  public String denyUserRequest(@RequestBody KeyValueDTO keyValueDTO) {
    userRequestService.denyUserRequest(keyValueDTO);
    return "User request with id: " + keyValueDTO.getKey() + " was denied.";
  }
}
