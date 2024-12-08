package it.polimi.productionoptimiserapi.services;

import it.polimi.productionoptimiserapi.dto.OptimizationResultDTO;
import java.util.List;

public interface OptimizationResultService {
  List<OptimizationResultDTO> getAllResults(String userId);

  OptimizationResultDTO getResultById(String resultId);
}
