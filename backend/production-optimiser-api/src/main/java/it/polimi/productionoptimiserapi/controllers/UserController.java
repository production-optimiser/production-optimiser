package it.polimi.productionoptimiserapi.controllers;

import it.polimi.productionoptimiserapi.dtos.UserDTO;
import it.polimi.productionoptimiserapi.enums.UserRole;
import it.polimi.productionoptimiserapi.mappers.UserMapper;
import it.polimi.productionoptimiserapi.services.UserService;
import jakarta.validation.Valid;
import java.util.List;
import java.util.Set;
import lombok.RequiredArgsConstructor;
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
public class UserController {

  private final UserService userService;

  @GetMapping
  @PreAuthorize("hasRole('ADMIN')")
  public List<UserDTO> getUsers() {
    return userService.getUsers();
  }

  @GetMapping("/{id}")
  @PreAuthorize("hasRole('ADMIN') or #id == authentication.principal.id")
  public UserDTO getUser(@PathVariable String id) {
    return userService.getUser(id);
  }

  @PostMapping
  @PreAuthorize("hasRole('ADMIN')")
  public UserDTO createUser(@Valid @RequestBody UserDTO userDTO) {
    return UserMapper.toDto(userService.createUser(userDTO));
  }

  @PatchMapping("/{id}")
  @PreAuthorize("hasRole('ADMIN') or #id == authentication.principal.id")
  public UserDTO updateUser(
      @PathVariable String id,
      @RequestParam(required = false) String email,
      @RequestParam(required = false) String password,
      @RequestParam(required = false) UserRole requestedRole,
      @RequestParam(required = false) Set<String> optimizationModelIds) {
    if (email == null
        && password == null
        && requestedRole == null
        && (optimizationModelIds == null || optimizationModelIds.isEmpty())) {
      throw new IllegalArgumentException("At least one parameter must be provided");
    }

    return userService.updateUser(id, email, password, requestedRole, optimizationModelIds);
  }

  @DeleteMapping("/{id}")
  @PreAuthorize("hasRole('ADMIN')")
  public UserDTO deleteUser(@PathVariable String id) {
    return userService.deleteUser(id);
  }
}
