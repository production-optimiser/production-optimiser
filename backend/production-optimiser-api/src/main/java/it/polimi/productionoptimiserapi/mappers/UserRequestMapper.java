package it.polimi.productionoptimiserapi.mappers;

import it.polimi.productionoptimiserapi.dtos.UserRequestDTO;
import it.polimi.productionoptimiserapi.entities.UserRequest;

public class UserRequestMapper {
  public static UserRequestDTO toDto(UserRequest userRequest) {
    return UserRequestDTO.builder()
        .id(userRequest.getId())
        .email(userRequest.getEmail())
        .message(userRequest.getMessage())
        .build();
  }
}
