package it.polimi.productionoptimiserapi.entities;

import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.Table;
import jakarta.validation.constraints.NotNull;
import lombok.*;

@Entity
@Table(name = "user_requests")
@AllArgsConstructor
@NoArgsConstructor
@Getter
@Setter
@Builder
public class UserRequest extends BaseEntity {

  @Column(unique = true)
  @NotNull
  private String email;

  @Column @NotNull private String message;
}
