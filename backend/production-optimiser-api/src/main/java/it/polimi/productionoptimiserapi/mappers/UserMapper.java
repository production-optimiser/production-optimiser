package it.polimi.productionoptimiserapi.mappers;

import it.polimi.productionoptimiserapi.dtos.UserDTO;
import it.polimi.productionoptimiserapi.entities.BaseEntity;
import it.polimi.productionoptimiserapi.entities.User;
import java.util.stream.Collectors;

public class UserMapper {
  public static UserDTO toDto(User user) {
    return UserDTO.builder()
        .id(user.getId())
        .email(user.getEmail())
        .password(user.getPassword())
        .role(user.getRole())
        .optimizationModelIds(
            user.getAvailableOptimizationModels().stream()
                .map(BaseEntity::getId)
                .collect(Collectors.toSet()))
        .build();
  }
}
