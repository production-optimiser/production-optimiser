package it.polimi.productionoptimiserapi.mappers;

import it.polimi.productionoptimiserapi.dtos.AccountRequestDTO;
import it.polimi.productionoptimiserapi.entities.AccountRequest;

public class AccountRequestMapper {
  public static AccountRequestDTO toDto(AccountRequest accountRequest) {
    return AccountRequestDTO.builder()
        .id(accountRequest.getId())
        .email(accountRequest.getEmail())
        .message(accountRequest.getMessage())
        .build();
  }
}
