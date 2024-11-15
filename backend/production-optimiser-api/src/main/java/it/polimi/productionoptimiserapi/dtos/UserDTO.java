package it.polimi.productionoptimiserapi.dtos;

import it.polimi.productionoptimiserapi.entities.User;
import it.polimi.productionoptimiserapi.enums.UserRole;
import jakarta.validation.constraints.Email;
import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.Size;
import java.util.Set;
import lombok.Builder;
import lombok.Data;

@Data
@Builder
public class UserDTO {

  @NotNull
  @Size(min = 1, max = 50)
  @Email
  private String email;

  @NotNull
  @Size(min = 8, max = 1000)
  private String password;

  @NotNull private UserRole role;

  Set<String> optimizationModelIds;

  public User toEntity() {
    User user = new User();
    user.setEmail(email);
    user.setPassword(password);
    user.setRole(role);
    return user;
  }
}
