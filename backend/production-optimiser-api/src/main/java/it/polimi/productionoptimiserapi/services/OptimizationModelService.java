package it.polimi.productionoptimiserapi.services;

import it.polimi.productionoptimiserapi.dtos.OptimizationModelDTO;
import it.polimi.productionoptimiserapi.entities.OptimizationModel;
import it.polimi.productionoptimiserapi.entities.OptimizationResult;
import jakarta.persistence.EntityNotFoundException;
import java.io.IOException;
import java.util.List;
import java.util.Optional;
import org.springframework.web.multipart.MultipartFile;

public interface OptimizationModelService {

  OptimizationModel saveOptimizationModel(OptimizationModelDTO optimizationModelDTO)
      throws EntityNotFoundException;

  Optional<OptimizationModel> findOptimizationModelById(String id);

  OptimizationModel retireOptimizationModel(String id) throws EntityNotFoundException;

  OptimizationResult invokeOptimizationModel(OptimizationModel model, MultipartFile inputFile)
      throws EntityNotFoundException, IOException;

  List<OptimizationModel> findAllOptimizationModels();

  OptimizationModel updateOptimizationModel(String id, OptimizationModelDTO optimizationModelDTO);
}
