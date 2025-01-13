package it.polimi.productionoptimiserapi.services;

import it.polimi.productionoptimiserapi.dtos.OptimizationResultDto;
import it.polimi.productionoptimiserapi.entities.OptimizationModel;
import it.polimi.productionoptimiserapi.entities.User;
import java.util.List;

public interface OptimizationResultService {
  List<OptimizationResultDto> getAllResults(String userId);

  OptimizationResultDto getResultById(String resultId);

  String saveOptimizationResult(
      String name,
      byte[] inputFile,
      String inputString,
      OptimizationResultDto dto,
      User user,
      OptimizationModel optimizationModel);

  void deleteAll();
}
