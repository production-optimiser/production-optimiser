package it.polimi.productionoptimiserapi.repositories;

import it.polimi.productionoptimiserapi.entities.OptimizationModel;
import java.util.Optional;
import lombok.NonNull;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;

public interface OptimizationModelRepository extends JpaRepository<OptimizationModel, String> {
  @Override
  @Query("SELECT om from OptimizationModel om WHERE om.status <> 'RETIRED' and om.id = :id")
  Optional<OptimizationModel> findById(@NonNull String id);
}
