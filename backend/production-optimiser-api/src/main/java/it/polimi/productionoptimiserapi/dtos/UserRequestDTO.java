package it.polimi.productionoptimiserapi.dtos;

import it.polimi.productionoptimiserapi.entities.UserRequest;
import jakarta.validation.constraints.Email;
import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.Size;
import lombok.Builder;
import lombok.Data;

@Data
@Builder
public class UserRequestDTO {

  private String id;

  @NotNull
  @Size(min = 1, max = 50)
  @Email
  private String email;

  @NotNull @Email private String message;

  public UserRequest toEntity() {
    return UserRequest.builder().email(email).message(message).build();
  }
}
