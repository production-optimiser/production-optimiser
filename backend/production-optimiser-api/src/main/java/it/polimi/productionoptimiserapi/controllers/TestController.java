package it.polimi.productionoptimiserapi.controllers;

import lombok.extern.slf4j.Slf4j;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequestMapping("/api/test")
@Slf4j
public class TestController {

  @GetMapping("/admin")
  @PreAuthorize("hasRole('ADMIN')")
  public ResponseEntity<String> adminEndpoint() {
    log.info("Received GET request for testing admin endpoint");
    return ResponseEntity.ok("Admin access successful");
  }

  @GetMapping("/user")
  @PreAuthorize("hasRole('CUSTOMER')")
  public ResponseEntity<String> userEndpoint() {
    log.info("Received GET request for testing customer endpoint");
    return ResponseEntity.ok("User access successful");
  }
}
