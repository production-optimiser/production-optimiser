package it.polimi.productionoptimiserapi.controllers;

import it.polimi.productionoptimiserapi.dtos.UserDTO;
import it.polimi.productionoptimiserapi.enums.UserRole;
import it.polimi.productionoptimiserapi.services.UserService;
import jakarta.persistence.EntityNotFoundException;
import jakarta.servlet.http.HttpServletResponse;
import jakarta.validation.Valid;
import java.io.IOException;
import java.util.List;
import java.util.Set;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PatchMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequestMapping("/api/users")
@RequiredArgsConstructor
@Slf4j
public class UserController {

  private final UserService userService;

  @GetMapping
  @PreAuthorize("hasRole('ADMIN')")
  public List<UserDTO> getUsers() {
    log.info("Received GET request for fetching all users");
    return userService.getUsers();
  }

  @GetMapping("/{id}")
  @PreAuthorize("hasRole('ADMIN') or #id == authentication.principal.id")
  public UserDTO getUser(@PathVariable String id) {
    return userService
        .getUser(id)
        .orElseThrow(
            () -> {
              String msg = "User with id " + id + " not found";
              log.warn(msg);
              return new EntityNotFoundException(msg);
            });
  }

  @PostMapping
  @PreAuthorize("hasRole('ADMIN')")
  public UserDTO createUser(@Valid @RequestBody UserDTO userDTO) {
    log.info("Received POST request for creating new user");
    return userService.createUser(userDTO);
  }

  @PatchMapping("/{id}")
  @PreAuthorize("hasRole('ADMIN') or #id == authentication.principal.id")
  public UserDTO updateUser(
      @PathVariable String id,
      @RequestParam(required = false) String email,
      @RequestParam(required = false) String password,
      @RequestParam(required = false) UserRole requestedRole,
      @RequestParam(required = false) Set<String> optimizationModelIds) {

    log.info("Received PATCH for updating user with id=" + id);
    if (email == null
        && password == null
        && requestedRole == null
        && (optimizationModelIds == null || optimizationModelIds.isEmpty())) {
      String msg = "At least one parameter must be provided";
      log.warn(msg);
      throw new IllegalArgumentException(msg);
    }

    return userService.updateUser(id, email, password, requestedRole, optimizationModelIds);
  }

  @DeleteMapping("/{id}")
  @PreAuthorize("hasRole('ADMIN')")
  public UserDTO deleteUser(@PathVariable String id) {
    log.info("Received DELETE request for deleting user with id=" + id);
    return userService.deleteUser(id);
  }

  @GetMapping("/{id}/audit")
  @PreAuthorize("hasRole('ADMIN') or #id == authentication.principal.id")
  public void getUserAudit(@PathVariable String id, HttpServletResponse response)
      throws IOException {
    userService.getUserAudit(id, response);
  }
}
