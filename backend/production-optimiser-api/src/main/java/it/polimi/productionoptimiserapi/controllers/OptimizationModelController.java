package it.polimi.productionoptimiserapi.controllers;

import it.polimi.productionoptimiserapi.dtos.OptimizationModelDTO;
import it.polimi.productionoptimiserapi.entities.OptimizationModel;
import it.polimi.productionoptimiserapi.entities.OptimizationResult;
import it.polimi.productionoptimiserapi.entities.User;
import it.polimi.productionoptimiserapi.exceptions.ForbiddenException;
import it.polimi.productionoptimiserapi.services.OptimizationModelService;
import it.polimi.productionoptimiserapi.services.UserService;
import jakarta.persistence.EntityNotFoundException;
import jakarta.validation.Valid;
import java.io.IOException;
import java.util.Objects;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;
import org.springframework.web.servlet.support.ServletUriComponentsBuilder;

@RestController
@RequestMapping("/api/models")
@RequiredArgsConstructor
public class OptimizationModelController {

  private final OptimizationModelService optimizationModelService;
  private final UserService userService;

  @PostMapping
  @PreAuthorize("hasRole('ADMIN')")
  public ResponseEntity<OptimizationModel> create(
      @Valid @RequestBody OptimizationModelDTO optimizationModelDTO) {
    OptimizationModel om =
        this.optimizationModelService.saveOptimizationModel(optimizationModelDTO);

    userService.updateAdminsWithNewModel(om.getId());

    return ResponseEntity.created(
            ServletUriComponentsBuilder.fromCurrentRequest()
                .path("/{id}")
                .buildAndExpand(om.getId())
                .toUri())
        .body(om);
  }

  @GetMapping
  @PreAuthorize("hasAnyRole('ADMIN')")
  public ResponseEntity<Iterable<OptimizationModel>> getAll() {
    return ResponseEntity.ok(this.optimizationModelService.findAllOptimizationModels());
  }

  @GetMapping("/{id}")
  @PreAuthorize("hasAnyRole('ADMIN', 'CUSTOMER')")
  public ResponseEntity<OptimizationModel> getById(
      @PathVariable String id, @AuthenticationPrincipal User loggedUser) throws ForbiddenException {
    OptimizationModel om =
        this.optimizationModelService
            .findOptimizationModelById(id)
            .orElseThrow(() -> new EntityNotFoundException("Model not found by id " + id));

    if (loggedUser.isCustomer()
        && om.getUsers().stream().noneMatch(u -> Objects.equals(u.getId(), loggedUser.getId()))) {
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

  @PatchMapping("/{id}")
  @PreAuthorize("hasRole('ADMIN')")
  public ResponseEntity<OptimizationModel> update(
      @PathVariable String id, @Valid @RequestBody OptimizationModelDTO optimizationModelDTO) {
    OptimizationModel om =
        this.optimizationModelService.updateOptimizationModel(id, optimizationModelDTO);
    return ResponseEntity.ok(om);
  }

  @PostMapping("/{id}/invoke")
  @PreAuthorize("hasAnyRole('CUSTOMER', 'ADMIN')")
  public ResponseEntity<OptimizationResult> invoke(
      @PathVariable String id,
      @RequestParam("input") MultipartFile inputFile,
      @AuthenticationPrincipal User loggedUser)
      throws ForbiddenException, IOException {
    OptimizationModel om =
        this.optimizationModelService
            .findOptimizationModelById(id)
            .orElseThrow(() -> new EntityNotFoundException("Model not found by id " + id));

    if (loggedUser.isCustomer()
        && om.getUsers().stream().noneMatch(u -> Objects.equals(u.getId(), loggedUser.getId()))) {
      // User is a customer and this optimization model does not belong to them
      throw new ForbiddenException("Can't invoke a model which does not belong to you.");
    }

    OptimizationResult or =
        this.optimizationModelService.invokeOptimizationModel(om, inputFile, loggedUser);
    return ResponseEntity.ok(or);
  }
}
