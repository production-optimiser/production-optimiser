package it.polimi.productionoptimiserapi.services;

import it.polimi.productionoptimiserapi.dtos.UserDTO;
import it.polimi.productionoptimiserapi.entities.User;
import it.polimi.productionoptimiserapi.enums.UserRole;
import java.util.List;
import java.util.Set;

public interface UserService {

  User createUser(UserDTO userDTO);

  List<UserDTO> getUsers();

  UserDTO getUser(String id);

  UserDTO updateUser(
      String id, String email, String password, UserRole role, Set<String> optimizationModelIds);

  UserDTO deleteUser(String id);
}
