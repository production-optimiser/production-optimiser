package it.polimi.productionoptimiserapi.controllers;

import it.polimi.productionoptimiserapi.dto.OptimizationResultDto;
import it.polimi.productionoptimiserapi.services.OptimizationResultService;
import java.util.List;
import lombok.RequiredArgsConstructor;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequestMapping("/api/results")
@RequiredArgsConstructor
public class ResultController {
  private final OptimizationResultService resultService;

  @GetMapping
  public List<OptimizationResultDto> getAllResults(@RequestParam String userId) {
    return resultService.getAllResults(userId);
  }

  @GetMapping("/{id}")
  public OptimizationResultDto getResultById(@PathVariable String id) {
    return resultService.getResultById(id);
  }
}
