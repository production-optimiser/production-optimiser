package it.polimi.productionoptimiserapi.services;

import it.polimi.productionoptimiserapi.dtos.OptimizationModelDTO;
import it.polimi.productionoptimiserapi.entities.OptimizationModel;
import it.polimi.productionoptimiserapi.entities.OptimizationResult;
import it.polimi.productionoptimiserapi.entities.User;
import jakarta.persistence.EntityNotFoundException;
import org.springframework.web.multipart.MultipartFile;

import java.io.IOException;
import java.util.List;
import java.util.Optional;

public interface OptimizationModelService {

  OptimizationModel saveOptimizationModel(OptimizationModelDTO optimizationModelDTO);

  Optional<OptimizationModel> findOptimizationModelById(String id);

  OptimizationModel retireOptimizationModel(String id);

  List<OptimizationModel> findAllOptimizationModels();

  OptimizationModel updateOptimizationModel(String id, OptimizationModelDTO optimizationModelDTO);

  OptimizationResult invokeOptimizationModel(OptimizationModel model, MultipartFile inputFile, User invoker) throws EntityNotFoundException, IOException;
}
