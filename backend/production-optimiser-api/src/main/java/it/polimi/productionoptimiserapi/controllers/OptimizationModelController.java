package it.polimi.productionoptimiserapi.controllers;

import it.polimi.productionoptimiserapi.dtos.OptimizationModelDTO;
import it.polimi.productionoptimiserapi.entities.OptimizationModel;
import it.polimi.productionoptimiserapi.entities.User;
import it.polimi.productionoptimiserapi.exceptions.ForbiddenException;
import it.polimi.productionoptimiserapi.services.OptimizationModelService;
import jakarta.persistence.EntityNotFoundException;
import jakarta.validation.Valid;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.servlet.support.ServletUriComponentsBuilder;

import java.util.Objects;

@RestController
@RequestMapping("/api/models")
public class OptimizationModelController {

  private final OptimizationModelService optimizationModelService;

  public OptimizationModelController(OptimizationModelService optimizationModelService) {
    this.optimizationModelService = optimizationModelService;
  }

  @PostMapping
  @PreAuthorize("hasRole('ADMIN')")
  public ResponseEntity<OptimizationModel> create(
      @Valid @RequestBody OptimizationModelDTO optimizationModelDTO) {
    OptimizationModel om =
        this.optimizationModelService.saveOptimizationModel(optimizationModelDTO);
    return ResponseEntity.created(
            ServletUriComponentsBuilder.fromCurrentRequest()
                .path("/{id}")
                .buildAndExpand(om.getId())
                .toUri())
        .body(om);
  }

  @GetMapping("/{id}")
  @PreAuthorize("hasAnyRole('ADMIN', 'CUSTOMER')")
  public ResponseEntity<OptimizationModel> getById(@PathVariable String id, @AuthenticationPrincipal User loggedUser) throws ForbiddenException {
    OptimizationModel om = this.optimizationModelService.findOptimizationModelById(id).orElseThrow(() -> new EntityNotFoundException("Model not found by id " + id));

    if (loggedUser.isCustomer() && om.getUsers().stream().noneMatch(u -> Objects.equals(u.getId(), loggedUser.getId()))) {
      // User is a customer and this optimization model does not belong to them
      throw new ForbiddenException("This optimization model does not belong to you!");
    }

    return ResponseEntity.ok(om);
  }

  @PatchMapping("/{id}/retire")
  @PreAuthorize("hasRole('ADMIN')")
  public ResponseEntity<OptimizationModel> retire(@PathVariable String id) {
    OptimizationModel om = this.optimizationModelService.retireOptimizationModel(id);
    return ResponseEntity.ok(om);
  }
}