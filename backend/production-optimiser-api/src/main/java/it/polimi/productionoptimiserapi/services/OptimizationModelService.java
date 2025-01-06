package it.polimi.productionoptimiserapi.services;

import it.polimi.productionoptimiserapi.dtos.OptimizationModelDTO;
import it.polimi.productionoptimiserapi.entities.OptimizationModel;
import it.polimi.productionoptimiserapi.entities.OptimizationResult;
import it.polimi.productionoptimiserapi.entities.User;
import jakarta.persistence.EntityNotFoundException;
import java.io.IOException;
import java.util.List;
import java.util.Optional;
import org.springframework.web.multipart.MultipartFile;

public interface OptimizationModelService {

  OptimizationModel saveOptimizationModel(OptimizationModelDTO optimizationModelDTO);

  Optional<OptimizationModel> findOptimizationModelById(String id);

  OptimizationModel retireOptimizationModel(String id);

  List<OptimizationModel> findAllOptimizationModels();

  List<OptimizationModel> findAllOptimizationModelsByUser(User user);

  OptimizationModel updateOptimizationModel(String id, OptimizationModelDTO optimizationModelDTO);

  OptimizationResult invokeOptimizationModel(
      OptimizationModel model, MultipartFile inputFile, String inputString, User invoker)
      throws EntityNotFoundException, IOException;
}
