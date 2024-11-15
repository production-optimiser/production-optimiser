package it.polimi.productionoptimiserapi.controllers;

import it.polimi.productionoptimiserapi.dtos.OptimizationModelDTO;
import it.polimi.productionoptimiserapi.entities.OptimizationModel;
import it.polimi.productionoptimiserapi.services.OptimizationModelService;
import jakarta.validation.Valid;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;
import org.springframework.web.servlet.support.ServletUriComponentsBuilder;

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
}
