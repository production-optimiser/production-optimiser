package it.polimi.productionoptimiserapi.controllers;

import it.polimi.productionoptimiserapi.dto.OptimizationResultDto;
import it.polimi.productionoptimiserapi.services.OptimizationResultService;
import java.io.IOException;
import java.nio.file.Files;
import java.nio.file.Paths;
import java.util.List;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
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

  @GetMapping("/dummy")
  public ResponseEntity<String> getDummyResult() {
    try {
      // Path to the JSON file, e.g., in src/main/resources or any other path
      String filePath =
          "src/main/resources/dummy_results/result.json"; // Adjust this path as needed

      // Read the file content as a String
      String jsonContent = new String(Files.readAllBytes(Paths.get(filePath)));

      // Return the JSON content as a response with the proper content type
      return ResponseEntity.ok().header("Content-Type", "application/json").body(jsonContent);
    } catch (IOException e) {
      return ResponseEntity.status(500).body("Error reading JSON file");
    }
  }
}
