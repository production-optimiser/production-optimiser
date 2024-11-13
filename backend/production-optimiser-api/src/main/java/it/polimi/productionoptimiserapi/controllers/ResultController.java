package it.polimi.productionoptimiserapi.controllers;

import it.polimi.productionoptimiserapi.dto.OptimisationResultDto;
import it.polimi.productionoptimiserapi.services.OptimisationResultService;
import java.util.List;
import lombok.RequiredArgsConstructor;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequiredArgsConstructor
public class ResultController {
  private final OptimisationResultService resultService;

  @GetMapping
  public List<OptimisationResultDto> getAllResults(@RequestParam String userId) {
    return resultService.getAllResults(userId);
  }
}
