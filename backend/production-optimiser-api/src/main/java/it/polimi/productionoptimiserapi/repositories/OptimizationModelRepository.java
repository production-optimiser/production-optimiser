package it.polimi.productionoptimiserapi.repositories;

import it.polimi.productionoptimiserapi.entities.OptimizationModel;
import org.springframework.data.jpa.repository.JpaRepository;

public interface OptimizationModelRepository extends JpaRepository<OptimizationModel, String> {}
