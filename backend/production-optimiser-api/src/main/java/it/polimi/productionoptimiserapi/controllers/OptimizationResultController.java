package it.polimi.productionoptimiserapi.controllers;

import it.polimi.productionoptimiserapi.dtos.OptimizationResultDto;
import it.polimi.productionoptimiserapi.entities.User;
import it.polimi.productionoptimiserapi.exceptions.ForbiddenException;
import it.polimi.productionoptimiserapi.services.OptimizationResultService;
import java.util.List;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
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
  @PreAuthorize("hasAnyRole('ADMIN', 'CUSTOMER')")
  public List<OptimizationResultDto> getAllResults(
      @RequestParam String userId, @AuthenticationPrincipal User loggedUser)
      throws ForbiddenException {
    log.info("Received GET request for fetching all optimization results");

    if (loggedUser.isCustomer() && !loggedUser.getId().equals(userId)) {
      throw new ForbiddenException("You can only access your own results");
    }

    return resultService.getAllResults(userId);
  }

  @GetMapping("/{id}")
  @PreAuthorize("hasAnyRole('ADMIN', 'CUSTOMER')")
  public OptimizationResultDto getResultById(
      @PathVariable String id, @AuthenticationPrincipal User loggedUser) throws ForbiddenException {
    log.info("Received GET request for fetching optimization result with id=" + id);
    OptimizationResultDto result = resultService.getResultById(id);
    if (loggedUser.isCustomer() && !loggedUser.getId().equals(result.getUserId())) {
      throw new ForbiddenException("You can only access your own results");
    }

    return result;
  }
}
