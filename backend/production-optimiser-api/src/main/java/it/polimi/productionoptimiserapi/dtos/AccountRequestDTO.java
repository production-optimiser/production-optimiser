package it.polimi.productionoptimiserapi.dtos;

import it.polimi.productionoptimiserapi.entities.AccountRequest;
import jakarta.validation.constraints.Email;
import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.Size;
import lombok.Builder;
import lombok.Data;

@Data
@Builder
public class AccountRequestDTO {

  private String id;

  @NotNull
  @Size(min = 1, max = 50)
  @Email
  private String email;

  @NotNull private String message;

  public AccountRequest toEntity() {
    return AccountRequest.builder().email(email).message(message).build();
  }
}
