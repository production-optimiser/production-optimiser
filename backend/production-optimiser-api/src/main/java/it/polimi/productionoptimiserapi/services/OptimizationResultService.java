package it.polimi.productionoptimiserapi.services;

import it.polimi.productionoptimiserapi.dto.OptimizationResultDto;
import java.util.List;

public interface OptimizationResultService {
  List<OptimizationResultDto> getAllResults(String userId);

  OptimizationResultDto getResultById(String resultId);
}
