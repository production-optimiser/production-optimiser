package it.polimi.productionoptimiserapi.dtos;

import it.polimi.productionoptimiserapi.enums.GraphType;
import java.time.LocalDateTime;
import java.util.HashMap;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@NoArgsConstructor
@AllArgsConstructor
@Data
public class OptimizationResultDto {
  private String id;
  private LocalDateTime createdAt;
  private LocalDateTime updatedAt;
  private Double initialTotalProductionTime;
  private Double optimizedTotalProductionTime;
  private Double timeImprovement;
  private Double percentageImprovement;
  private Double averageInitialTotalMachineUtilization;
  private Double averageOptimizedTotalMachineUtilization;
  private Double utilizationImprovement;
  private HashMap<String, Integer> maximumPalletsUsed;
  private HashMap<String, Integer> palletsDefinedInExcel;
  private Double totalTimeWithOptimizedPallets;
  private Double totalTimeWithExcelPallets;
  private String bestSequenceOfProducts;
  private HashMap<GraphType, String> graphs;
}
