package it.polimi.productionoptimiserapi.services;

import it.polimi.productionoptimiserapi.dtos.OptimizationResultDto;
import it.polimi.productionoptimiserapi.entities.OptimizationResult;
import it.polimi.productionoptimiserapi.entities.User;
import java.util.List;

public interface OptimizationResultService {
  List<OptimizationResultDto> getAllResults(String userId);

  OptimizationResultDto getResultById(String resultId);

  String saveOptimizationResult(byte[] inputFile, OptimizationResultDto dto, User user);

  void deleteAll();
}
