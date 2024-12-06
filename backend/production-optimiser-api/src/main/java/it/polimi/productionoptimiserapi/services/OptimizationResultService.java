package it.polimi.productionoptimiserapi.services;

import it.polimi.productionoptimiserapi.dtos.OptimizationResultDTO;
import java.util.List;

public interface OptimizationResultService {
  List<OptimizationResultDTO> getAllResults(String userId);

  OptimizationResultDTO getResultById(String resultId);
}
