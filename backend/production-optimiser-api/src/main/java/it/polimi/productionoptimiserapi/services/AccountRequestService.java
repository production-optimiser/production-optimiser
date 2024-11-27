package it.polimi.productionoptimiserapi.services;

import it.polimi.productionoptimiserapi.dtos.AccountRequestDTO;
import it.polimi.productionoptimiserapi.dtos.KeyValueDTO;
import it.polimi.productionoptimiserapi.dtos.UserDTO;
import java.util.List;

public interface AccountRequestService {
  AccountRequestDTO getAccountRequest(String id);

  List<AccountRequestDTO> getAccountRequests();

  AccountRequestDTO createAccountRequest(AccountRequestDTO accountRequestDTO);

  UserDTO approveAccountRequest(KeyValueDTO keyValueDTO);

  void denyAccountRequest(KeyValueDTO keyValueDTO);
}
