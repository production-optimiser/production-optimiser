package it.polimi.productionoptimiserapi.repositories;

import it.polimi.productionoptimiserapi.entities.OptimizationResult;
import java.util.List;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;

public interface OptimisationResultRepository extends JpaRepository<OptimizationResult, String> {

  @Query("""
            SELECT r from OptimisationResult r WHERE r.User.id = ?1
            """)
  List<OptimizationResult> findByUser(String userId);
}
