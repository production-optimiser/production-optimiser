package it.polimi.productionoptimiserapi.repositories;

import it.polimi.productionoptimiserapi.entities.OptimizationModel;
import lombok.NonNull;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;

import java.util.Optional;

public interface OptimizationModelRepository extends JpaRepository<OptimizationModel, String> {
    @Override
    @Query("SELECT om from OptimizationModel om WHERE om.status <> 'RETIRED'")
    Optional<OptimizationModel> findById(@NonNull String id);
}
