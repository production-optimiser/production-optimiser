package it.polimi.productionoptimiserapi.controllers;

import it.polimi.productionoptimiserapi.dtos.OptimizationResultDto;
import it.polimi.productionoptimiserapi.services.OptimizationResultService;
import java.util.List;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequestMapping("/api/results")
@RequiredArgsConstructor
@Slf4j
public class OptimizationResultController {
  private final OptimizationResultService resultService;

  @GetMapping
  public List<OptimizationResultDto> getAllResults(@RequestParam String userId) {
    log.info("Received GET request for fetching all optimization results");
    return resultService.getAllResults(userId);
  }

  @GetMapping("/{id}")
  public OptimizationResultDto getResultById(@PathVariable String id) {
    log.info("Received GET request for fetching optimization result with id=" + id);
    return resultService.getResultById(id);
  }
}
