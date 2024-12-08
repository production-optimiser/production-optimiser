package it.polimi.productionoptimiserapi.mappers;

import it.polimi.productionoptimiserapi.dtos.OptimizationResultDto;
import it.polimi.productionoptimiserapi.entities.*;
import it.polimi.productionoptimiserapi.enums.GraphType;
import java.util.ArrayList;
import java.util.HashMap;
import java.util.List;

public class OptimizationResultMapper {
  public static OptimizationResult dtoToResult(
      byte[] inputFile, OptimizationResultDto dto, User user) {
    List<ExcelDefinedPallets> excelDefinedPallets = new ArrayList<>();
    List<MaximumPalletsUsed> maximumPalletsUsed = new ArrayList<>();
    List<Graph> graphs = new ArrayList<>();

    dto.getPalletsDefinedInExcel()
        .forEach(
            (pallets, count) -> excelDefinedPallets.add(new ExcelDefinedPallets(pallets, count)));

    dto.getMaximumPalletsUsed()
        .forEach(
            (pallets, count) -> maximumPalletsUsed.add(new MaximumPalletsUsed(pallets, count)));

    dto.getGraphs()
        .forEach(
            (type, content) -> {
              Graph g = new Graph();
              g.setType(type);
              g.setBase64EncodedImage(content);
              graphs.add(g);
            });

    return new OptimizationResult(
        inputFile,
        dto.getInitialTotalProductionTime(),
        dto.getOptimizedTotalProductionTime(),
        dto.getTimeImprovement(),
        dto.getPercentageImprovement(),
        dto.getAverageInitialTotalMachineUtilization(),
        dto.getAverageOptimizedTotalMachineUtilization(),
        dto.getUtilizationImprovement(),
        excelDefinedPallets,
        maximumPalletsUsed,
        dto.getTotalTimeWithOptimizedPallets(),
        dto.getTotalTimeWithExcelPallets(),
        dto.getBestSequenceOfProducts(),
        graphs,
        user);
  }

  public static OptimizationResultDto resultToDto(OptimizationResult result) {
    HashMap<String, Integer> maximumPalletsUsed = new HashMap<>();
    HashMap<String, Integer> palletsDefinedInExcel = new HashMap<>();
    HashMap<GraphType, String> graphs = new HashMap<>();

    result
        .getMaximumPalletsUsed()
        .forEach((pallet) -> maximumPalletsUsed.put(pallet.getDefinedPallets(), pallet.getCount()));
    result
        .getPalletsDefinedInExcel()
        .forEach(
            (pallet) -> palletsDefinedInExcel.put(pallet.getDefinedPallets(), pallet.getCount()));
    result
        .getGraphs()
        .forEach((graph) -> graphs.put(graph.getType(), graph.getBase64EncodedImage()));

    System.out.println("Creating result dto");
    return new OptimizationResultDto(
        result.getId(),
        result.getCreatedAt(),
        result.getUpdatedAt(),
        result.getInitialTotalProductionTime(),
        result.getOptimizedTotalProductionTime(),
        result.getTimeImprovement(),
        result.getPercentageImprovement(),
        result.getAverageInitialTotalMachineUtilization(),
        result.getAverageOptimizedTotalMachineUtilization(),
        result.getUtilizationImprovement(),
        maximumPalletsUsed,
        palletsDefinedInExcel,
        result.getTotalTimeWithOptimizedPallets(),
        result.getTotalTimeWithExcelPallets(),
        result.getBestSequenceOfProducts(),
        graphs);
  }
}
