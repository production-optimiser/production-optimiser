package it.polimi.productionoptimiserapi.repositories;

import it.polimi.productionoptimiserapi.entities.OptimizationModel;

import java.util.List;
import java.util.Optional;

import it.polimi.productionoptimiserapi.entities.User;
import lombok.NonNull;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;

public interface OptimizationModelRepository extends JpaRepository<OptimizationModel, String> {
  @Override
  @Query("SELECT om from OptimizationModel om WHERE om.status <> 'RETIRED' and om.id = :id")
  Optional<OptimizationModel> findById(@NonNull String id);

  @Override
  @Query("SELECT om from OptimizationModel om WHERE om.status <> 'RETIRED'")
  List<OptimizationModel> findAll();

  @Query("SELECT om from OptimizationModel om JOIN om.users u WHERE u.id = :userId AND om.status <> 'RETIRED'")
  List<OptimizationModel> findAllByUser(@NonNull String userId);
}
