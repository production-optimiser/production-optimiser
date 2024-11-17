package it.polimi.productionoptimiserapi.controllers;

import it.polimi.productionoptimiserapi.dto.OptimizationResultDto;
import it.polimi.productionoptimiserapi.services.OptimizationResultService;
import java.util.List;
import lombok.RequiredArgsConstructor;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequiredArgsConstructor
public class ResultController {
  private final OptimizationResultService resultService;

  @GetMapping("/api/results")
  public List<OptimizationResultDto> getAllResults(@RequestParam String userId) {
    return resultService.getAllResults(userId);
  }
}
