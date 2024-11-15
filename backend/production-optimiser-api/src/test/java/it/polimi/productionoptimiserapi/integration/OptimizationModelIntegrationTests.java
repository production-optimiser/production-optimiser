package it.polimi.productionoptimiserapi.integration;

import static io.restassured.RestAssured.given;
import static org.hamcrest.CoreMatchers.equalTo;

import io.restassured.http.ContentType;
import it.polimi.productionoptimiserapi.dtos.OptimizationModelDTO;
import it.polimi.productionoptimiserapi.dtos.UserDTO;
import it.polimi.productionoptimiserapi.entities.User;
import it.polimi.productionoptimiserapi.enums.UserRole;
import it.polimi.productionoptimiserapi.repositories.OptimizationModelRepository;
import it.polimi.productionoptimiserapi.security.dtos.UserLoginDTO;
import it.polimi.productionoptimiserapi.services.UserService;
import java.util.Set;
import org.junit.jupiter.api.AfterAll;
import org.junit.jupiter.api.BeforeAll;
import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.context.SpringBootTest;
import org.springframework.http.HttpStatus;
import org.springframework.test.context.DynamicPropertyRegistry;
import org.springframework.test.context.DynamicPropertySource;
import org.testcontainers.containers.PostgreSQLContainer;

@SpringBootTest(webEnvironment = SpringBootTest.WebEnvironment.RANDOM_PORT)
public class OptimizationModelIntegrationTests extends BaseIntegrationTestSetup {

  static PostgreSQLContainer<?> postgres = new PostgreSQLContainer<>("postgres:15-alpine");

  @BeforeAll
  static void beforeAll() {
    postgres.start();
  }

  @AfterAll
  static void afterAll() {
    postgres.stop();
  }

  @Autowired private UserService userService;

  @DynamicPropertySource
  static void configureProperties(DynamicPropertyRegistry registry) {
    registry.add("spring.datasource.url", postgres::getJdbcUrl);
    registry.add("spring.datasource.username", postgres::getUsername);
    registry.add("spring.datasource.password", postgres::getPassword);
  }

  public OptimizationModelIntegrationTests(@Autowired OptimizationModelRepository repository) {
    super(repository);
  }

  @Test
  void shouldCreateOptimizationModel() {
    userService.createUser(
        UserDTO.builder()
            .email("admin@potest.it")
            .password("password!")
            .role(UserRole.ADMIN)
            .build());

    UserLoginDTO userLoginDTO =
        UserLoginDTO.builder().email("admin@potest.it").password("password!").build();

    String accessToken =
        given()
            .contentType(ContentType.JSON)
            .body(userLoginDTO)
            .when()
            .post("/api/auth/login")
            .jsonPath()
            .getString("token");

    User customer =
        userService.createUser(
            UserDTO.builder()
                .email("customer@potest.it")
                .password("password!")
                .role(UserRole.CUSTOMER)
                .build());

    OptimizationModelDTO optimizationModelDTO =
        OptimizationModelDTO.builder()
            .name("Test Model")
            .apiUrl("http://localhost:5000/optimizer-tool")
            .userIds(Set.of(customer.getId()))
            .build();

    given()
        .contentType(ContentType.JSON)
        .headers("Authorization", "Bearer " + accessToken)
        .body(optimizationModelDTO)
        .when()
        .post("/api/models")
        .then()
        .statusCode(HttpStatus.CREATED.value())
        .body("name", equalTo(optimizationModelDTO.getName()));
  }
}
