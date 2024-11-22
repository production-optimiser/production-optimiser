package it.polimi.productionoptimiserapi.dto;

import java.time.LocalDateTime;
import java.util.HashMap;
import java.util.List;

import it.polimi.productionoptimiserapi.entities.ExcelDefinedPallets;
import it.polimi.productionoptimiserapi.entities.Graph;
import it.polimi.productionoptimiserapi.entities.MaximumPalletsUsed;
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
  private HashMap<String, String> graphs;
}
