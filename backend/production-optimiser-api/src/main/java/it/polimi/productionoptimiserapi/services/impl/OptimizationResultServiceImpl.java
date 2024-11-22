package it.polimi.productionoptimiserapi.services.impl;

import it.polimi.productionoptimiserapi.dto.OptimizationResultDto;
import it.polimi.productionoptimiserapi.entities.OptimizationResult;
import it.polimi.productionoptimiserapi.repositories.OptimizationResultRepository;
import it.polimi.productionoptimiserapi.services.OptimizationResultService;
import java.util.Base64;
import java.util.HashMap;
import java.util.List;
import java.util.stream.Collectors;

import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.stereotype.Service;

@RequiredArgsConstructor
@Service
@Slf4j
public class OptimizationResultServiceImpl implements OptimizationResultService {

  private final OptimizationResultRepository resultRepository;

  public List<OptimizationResultDto> getAllResults(String userId) {
    return resultRepository.findByUserId(userId).stream()
            .map((result) -> {
             HashMap<String, Integer> maximumPalletsUsed = new HashMap<>();
             HashMap<String, Integer> palletsDefinedInExcel = new HashMap<>();
             HashMap<String, String> graphs = new HashMap<>();

             result.getMaximumPalletsUsed().forEach((pallet) -> maximumPalletsUsed.put(pallet.getDefinedPallets(), pallet.getCount()));
             result.getPalletsDefinedInExcel().forEach((pallet) -> palletsDefinedInExcel.put(pallet.getDefinedPallets(), pallet.getCount()));
             result.getGraphs().forEach((graph) -> graphs.put(graph.getType().toString(), graph.getBase64EncodedImage()));




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
                      graphs
              );
            })
            .toList();
  }
}
