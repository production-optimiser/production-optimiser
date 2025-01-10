package it.polimi.productionoptimiserapi.controllers;

import static it.polimi.productionoptimiserapi.config.Constants.ALLOWED_FILE_EXTENSIONS;
import static it.polimi.productionoptimiserapi.config.Constants.ALLOWED_IMAGE_EXTENSIONS;

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
import java.util.Set;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.apache.commons.io.FilenameUtils;
import org.springframework.http.HttpHeaders;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;
import org.springframework.web.servlet.support.ServletUriComponentsBuilder;

@RestController
@RequestMapping("/api/models")
@RequiredArgsConstructor
@Slf4j
public class OptimizationModelController {

  private final OptimizationModelService optimizationModelService;
  private final UserService userService;

  @PostMapping
  @PreAuthorize("hasRole('ADMIN')")
  public ResponseEntity<OptimizationModel> create(
      @Valid @RequestBody OptimizationModelDTO optimizationModelDTO) {

    log.info("Received POST request for creating optimization model");
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
  @PreAuthorize("hasAnyRole('ADMIN', 'CUSTOMER')")
  public ResponseEntity<Iterable<OptimizationModel>> getAll(
      @AuthenticationPrincipal User loggedUser) {

    log.info("Received GET request for fetching all optimization model");
    if (loggedUser.isAdmin()) {
      return ResponseEntity.ok(this.optimizationModelService.findAllOptimizationModels());
    }

    return ResponseEntity.ok(
        this.optimizationModelService.findAllOptimizationModelsByUser(loggedUser));
  }

  @GetMapping("/{id}")
  @PreAuthorize("hasAnyRole('ADMIN', 'CUSTOMER')")
  public ResponseEntity<OptimizationModel> getById(
      @PathVariable String id, @AuthenticationPrincipal User loggedUser) throws ForbiddenException {
    OptimizationModel om =
        this.optimizationModelService
            .findOptimizationModelById(id)
            .orElseThrow(
                () -> {
                  String msg = "Model not found by id " + id;
                  log.warn(msg);
                  return new EntityNotFoundException(msg);
                });

    if (loggedUser.isCustomer()
        && om.getUsers().stream().noneMatch(u -> Objects.equals(u.getId(), loggedUser.getId()))) {
      // User is a customer and this optimization model does not belong to them
      String msg = "This optimization model does not belong to you!";
      log.error(msg);
      throw new ForbiddenException(msg);
    }

    Set<String> allowedExtensions =
        switch (om.getInputType()) {
          case FILE -> ALLOWED_FILE_EXTENSIONS;
          case IMAGE -> ALLOWED_IMAGE_EXTENSIONS;
          default -> Set.of();
        };
    HttpHeaders responseHeaders = new HttpHeaders();
    responseHeaders.set("Allowed-Extensions", String.join(", ", allowedExtensions));
    return new ResponseEntity<>(om, responseHeaders, HttpStatus.OK);
  }

  @PatchMapping("/{id}/retire")
  @PreAuthorize("hasRole('ADMIN')")
  public ResponseEntity<OptimizationModel> retire(@PathVariable String id) {
    log.info("Received PATCH request for retiring model id=" + id);
    OptimizationModel om = this.optimizationModelService.retireOptimizationModel(id);
    return ResponseEntity.ok(om);
  }

  @PatchMapping("/{id}")
  @PreAuthorize("hasRole('ADMIN')")
  public ResponseEntity<OptimizationModel> update(
      @PathVariable String id, @Valid @RequestBody OptimizationModelDTO optimizationModelDTO) {

    log.info("Received PATCH request for updating model id=" + id);
    OptimizationModel om =
        this.optimizationModelService.updateOptimizationModel(id, optimizationModelDTO);
    return ResponseEntity.ok(om);
  }

  @PostMapping("/{id}/invoke")
  @PreAuthorize("hasAnyRole('CUSTOMER', 'ADMIN')")
  public ResponseEntity<OptimizationResult> invoke(
      @PathVariable String id,
      @RequestParam(value = "inputFile", required = false) MultipartFile inputFile,
      @RequestParam(value = "inputString", required = false) String inputString,
      @RequestParam(value = "name") String name,
      @AuthenticationPrincipal User loggedUser)
      throws ForbiddenException, IOException {

    log.info("Received POST request for invoking model id=" + id);
    OptimizationModel om =
        this.optimizationModelService
            .findOptimizationModelById(id)
            .orElseThrow(
                () -> {
                  String msg = "Model not found by id " + id;
                  log.warn(msg);
                  return new EntityNotFoundException(msg);
                });

    validateInput(om, inputFile, inputString);

    if (loggedUser.isCustomer()
        && om.getUsers().stream().noneMatch(u -> Objects.equals(u.getId(), loggedUser.getId()))) {
      // User is a customer and this optimization model does not belong to them
      String msg = "Can't invoke a model(" + id + ") which does not belong to you.";
      log.error(msg);
      throw new ForbiddenException(msg);
    }

    OptimizationResult or =
        this.optimizationModelService.invokeOptimizationModel(
            om, name, inputFile, inputString, loggedUser);
    return ResponseEntity.ok(or);
  }

  private void validateInput(OptimizationModel om, MultipartFile inputFile, String input) {
    if (inputFile != null && input != null) {
      throw new IllegalArgumentException("Only one input type is allowed.");
    }
    if (inputFile == null && input == null) {
      throw new IllegalArgumentException("Model needs either a file or a string input.");
    }
    switch (om.getInputType()) {
      case FILE:
        if (inputFile == null) {
          throw new IllegalArgumentException("Model requires a file input.");
        } else {
          if (!ALLOWED_FILE_EXTENSIONS.contains(
              FilenameUtils.getExtension(inputFile.getOriginalFilename()))) {
            throw new IllegalArgumentException(
                "Invalid file extension. Allowed extensions are: "
                    + String.join(", ", ALLOWED_FILE_EXTENSIONS));
          }
        }
        break;
      case IMAGE:
        if (inputFile == null) {
          throw new IllegalArgumentException("Model requires an image input.");
        } else {
          if (!ALLOWED_IMAGE_EXTENSIONS.contains(
              FilenameUtils.getExtension(inputFile.getOriginalFilename()))) {
            throw new IllegalArgumentException(
                "Invalid file extension. Allowed extensions are: "
                    + String.join(", ", ALLOWED_IMAGE_EXTENSIONS));
          }
        }
        break;
      case STRING:
        if (input == null) {
          throw new IllegalArgumentException("Model requires a string input.");
        } else {
          if (input.isBlank()) {
            throw new IllegalArgumentException("Model requires a non-empty string input.");
          }
        }
        break;
      default:
        throw new IllegalArgumentException("Invalid model input type.");
    }
  }
}
