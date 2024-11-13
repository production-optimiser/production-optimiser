package it.polimi.productionoptimiserapi.services;

import it.polimi.productionoptimiserapi.dto.OptimisationResultDto;
import java.util.List;

public interface OptimisationResultService {
  List<OptimisationResultDto> getAllResults(String userId);
}
