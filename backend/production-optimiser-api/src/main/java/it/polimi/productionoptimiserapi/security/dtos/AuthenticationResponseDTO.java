package it.polimi.productionoptimiserapi.security.dtos;

import lombok.AllArgsConstructor;
import lombok.Data;

@Data
@AllArgsConstructor
public class AuthenticationResponseDTO {
  private String userId;
  private String token;
}
