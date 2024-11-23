package it.polimi.productionoptimiserapi.repositories;

import it.polimi.productionoptimiserapi.entities.User;
import java.util.Optional;
import org.springframework.data.jpa.repository.JpaRepository;

public interface UserRepository extends JpaRepository<User, String> {
  Optional<User> findByEmail(String email);

  Optional<User> findById(String id);
}
