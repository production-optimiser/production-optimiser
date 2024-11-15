package it.polimi.productionoptimiserapi.services;

import it.polimi.productionoptimiserapi.dtos.UserDTO;
import it.polimi.productionoptimiserapi.entities.User;

public interface UserService {

  User createUser(UserDTO userDTO);
}
