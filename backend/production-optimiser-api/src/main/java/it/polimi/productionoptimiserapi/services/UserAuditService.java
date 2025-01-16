package it.polimi.productionoptimiserapi.services;

import it.polimi.productionoptimiserapi.entities.OptimizationResult;
import jakarta.servlet.http.HttpServletResponse;
import java.io.IOException;
import java.util.Set;

public interface UserAuditService {
  void exportAuditToExcel(HttpServletResponse response, Set<OptimizationResult> optimizationResults)
      throws IOException;
}
