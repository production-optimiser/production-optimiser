package it.polimi.productionoptimiserapi.repositories;

import it.polimi.productionoptimiserapi.entities.UserRequest;
import jakarta.validation.constraints.NotNull;
import org.springframework.data.jpa.repository.JpaRepository;

public interface UserRequestRepository extends JpaRepository<UserRequest, String> {
  boolean existsUserRequestByEmail(@NotNull String email);
}
