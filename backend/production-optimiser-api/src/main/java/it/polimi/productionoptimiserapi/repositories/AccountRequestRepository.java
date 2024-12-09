package it.polimi.productionoptimiserapi.repositories;

import it.polimi.productionoptimiserapi.entities.AccountRequest;
import jakarta.validation.constraints.NotNull;
import org.springframework.data.jpa.repository.JpaRepository;

public interface AccountRequestRepository extends JpaRepository<AccountRequest, String> {
  boolean existsAccountRequestByEmail(@NotNull String email);
}
