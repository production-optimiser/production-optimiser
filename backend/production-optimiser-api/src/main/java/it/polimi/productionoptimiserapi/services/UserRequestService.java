package it.polimi.productionoptimiserapi.services;

import it.polimi.productionoptimiserapi.dtos.KeyValueDTO;
import it.polimi.productionoptimiserapi.dtos.UserDTO;
import it.polimi.productionoptimiserapi.dtos.UserRequestDTO;
import java.util.List;

public interface UserRequestService {
  UserRequestDTO getUserRequest(String id);

  List<UserRequestDTO> getUserRequests();

  UserRequestDTO createUserRequest(UserRequestDTO userRequestDTO);

  UserDTO approveUserRequest(KeyValueDTO keyValueDTO);

  void denyUserRequest(KeyValueDTO keyValueDTO);
}
