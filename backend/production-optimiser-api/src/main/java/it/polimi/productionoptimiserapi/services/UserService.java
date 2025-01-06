package it.polimi.productionoptimiserapi.services;

import it.polimi.productionoptimiserapi.dtos.UserDTO;
import it.polimi.productionoptimiserapi.entities.OptimizationModel;
import it.polimi.productionoptimiserapi.entities.User;
import it.polimi.productionoptimiserapi.enums.UserRole;
import java.util.List;
import java.util.Optional;
import java.util.Set;

public interface UserService {

  UserDTO createUser(UserDTO userDTO);

  List<UserDTO> getUsers();

  Optional<UserDTO> getUser(String id);

  UserDTO updateUser(
      String id, String email, String password, UserRole role, Set<String> optimizationModelIds);

  UserDTO deleteUser(String id);

  List<UserDTO> updateAdminsWithNewModel(String modelId);

  UserDTO addModelToUser(String userId, OptimizationModel model);

  void validateExistingEmail(String email);

  void incrementLoginCount(User user);
}
