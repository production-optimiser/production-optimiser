package it.polimi.productionoptimiserapi.security.dtos;

import lombok.AllArgsConstructor;
import lombok.Data;

@Data
@AllArgsConstructor
public class UserLoginDto {
    String email;
    String password;
}
