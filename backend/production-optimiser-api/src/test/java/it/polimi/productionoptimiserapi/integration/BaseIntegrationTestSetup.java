package it.polimi.productionoptimiserapi.integration;

import io.restassured.RestAssured;
import org.junit.jupiter.api.BeforeEach;
import org.springframework.boot.test.web.server.LocalServerPort;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.test.context.DynamicPropertyRegistry;
import org.springframework.test.context.DynamicPropertySource;

public class BaseIntegrationTestSetup {

  @LocalServerPort private Integer port;

  @DynamicPropertySource
  static void setDynamicProperties(DynamicPropertyRegistry registry) {
    registry.add("environment.test", () -> true);
  }

  @BeforeEach
  void setup() {
    RestAssured.baseURI = "http://localhost:" + port;
  }
}
