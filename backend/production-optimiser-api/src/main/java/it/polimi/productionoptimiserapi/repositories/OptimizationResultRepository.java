package it.polimi.productionoptimiserapi.repositories;

import it.polimi.productionoptimiserapi.entities.OptimizationResult;
import java.util.List;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.stereotype.Repository;

@Repository
public interface OptimizationResultRepository extends JpaRepository<OptimizationResult, String> {

  @Query("""
            SELECT r from OptimizationResult r WHERE r.user.id = ?1
            """)
  List<OptimizationResult> findByUserId(String userID);
}
