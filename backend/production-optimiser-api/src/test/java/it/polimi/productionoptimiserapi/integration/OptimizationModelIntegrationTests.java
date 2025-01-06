package it.polimi.productionoptimiserapi.integration;

import static io.restassured.RestAssured.given;
import static org.hamcrest.CoreMatchers.equalTo;
import static org.junit.jupiter.api.Assertions.assertEquals;
import static org.junit.jupiter.api.Assertions.assertTrue;

import io.restassured.http.ContentType;
import it.polimi.productionoptimiserapi.dtos.OptimizationModelDTO;
import it.polimi.productionoptimiserapi.dtos.UserDTO;
import it.polimi.productionoptimiserapi.entities.OptimizationModel;
import it.polimi.productionoptimiserapi.entities.User;
import it.polimi.productionoptimiserapi.enums.InputType;
import it.polimi.productionoptimiserapi.enums.OptimizationModelStatus;
import it.polimi.productionoptimiserapi.enums.UserRole;
import it.polimi.productionoptimiserapi.repositories.OptimizationModelRepository;
import it.polimi.productionoptimiserapi.repositories.UserRepository;
import it.polimi.productionoptimiserapi.security.dtos.UserLoginDTO;
import it.polimi.productionoptimiserapi.services.OptimizationModelService;
import it.polimi.productionoptimiserapi.services.OptimizationResultService;
import it.polimi.productionoptimiserapi.services.UserService;
import jakarta.persistence.EntityNotFoundException;
import java.io.File;
import java.io.IOException;
import java.util.Optional;
import java.util.Set;
import org.junit.jupiter.api.AfterAll;
import org.junit.jupiter.api.BeforeAll;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.context.SpringBootTest;
import org.springframework.core.io.ClassPathResource;
import org.springframework.http.HttpStatus;
import org.springframework.test.context.DynamicPropertyRegistry;
import org.springframework.test.context.DynamicPropertySource;
import org.testcontainers.containers.PostgreSQLContainer;

@SpringBootTest(webEnvironment = SpringBootTest.WebEnvironment.RANDOM_PORT)
public class OptimizationModelIntegrationTests extends BaseIntegrationTestSetup {

  static PostgreSQLContainer<?> postgres = new PostgreSQLContainer<>("postgres:15-alpine");

  @DynamicPropertySource
  static void configureProperties(DynamicPropertyRegistry registry) {
    registry.add("spring.datasource.url", postgres::getJdbcUrl);
    registry.add("spring.datasource.username", postgres::getUsername);
    registry.add("spring.datasource.password", postgres::getPassword);
    registry.add("spring.sql.init.data-locations", () -> "");
    registry.add("spring.jpa.defer-datasource-initialization", () -> "false");
    registry.add("spring.jpa.hibernate.ddl-auto", () -> "update");
  }

  @Autowired private UserRepository userRepository;

  @Autowired private OptimizationModelRepository optimizationModelRepository;

  User admin, customer;
  String adminAccessToken, customerAccessToken;

  @BeforeAll
  static void beforeAll() {
    postgres.start();
  }

  @BeforeEach
  void beforeEach() {
    userRepository.deleteAll();
    optimizationModelRepository.deleteAll();

    userService.createUser(
        UserDTO.builder()
            .email("admin@potest.it")
            .password("password!")
            .role(UserRole.ADMIN)
            .build());

    userService.createUser(
        UserDTO.builder()
            .email("customer@potest.it")
            .password("password!")
            .role(UserRole.CUSTOMER)
            .build());

    admin =
        userRepository
            .findByEmail("admin@potest.it")
            .orElseThrow(() -> new EntityNotFoundException("Admin not found"));

    customer =
        userRepository
            .findByEmail("customer@potest.it")
            .orElseThrow(() -> new EntityNotFoundException("Customer not found"));

    UserLoginDTO adminLoginDTO =
        UserLoginDTO.builder().email("admin@potest.it").password("password!").build();
    UserLoginDTO customerLoginDTO =
        UserLoginDTO.builder().email("customer@potest.it").password("password!").build();

    adminAccessToken =
        given()
            .contentType(ContentType.JSON)
            .body(adminLoginDTO)
            .when()
            .post("/api/auth/login")
            .jsonPath()
            .getString("token");

    customerAccessToken =
        given()
            .contentType(ContentType.JSON)
            .body(customerLoginDTO)
            .when()
            .post("/api/auth/login")
            .jsonPath()
            .getString("token");
  }

  @AfterAll
  static void afterAll() {
    postgres.stop();
  }

  @Autowired private UserService userService;

  @Autowired private OptimizationModelService optimizationModelService;

  @Autowired private OptimizationResultService optimizationResultService;

  @Test
  void shouldCreateOptimizationModel() {
    OptimizationModelDTO optimizationModelDTO =
        OptimizationModelDTO.builder()
            .name("Test Model")
            .apiUrl("http://localhost:5000/optimizer-tool")
            .inputType(InputType.FILE)
            .build();

    given()
        .contentType(ContentType.JSON)
        .headers("Authorization", "Bearer " + adminAccessToken)
        .body(optimizationModelDTO)
        .when()
        .post("/api/models")
        .then()
        .statusCode(HttpStatus.CREATED.value())
        .body("name", equalTo(optimizationModelDTO.getName()));
  }

  @Test
  void givenCreatedModel_shouldGetById() {
    OptimizationModelDTO optimizationModelDTO =
        OptimizationModelDTO.builder()
            .name("Test Model")
            .apiUrl("http://localhost:5000/optimizer-tool")
            .inputType(InputType.FILE)
            .build();

    OptimizationModel om = optimizationModelService.saveOptimizationModel(optimizationModelDTO);

    given()
        .headers("Authorization", "Bearer " + adminAccessToken)
        .when()
        .get("/api/models/" + om.getId())
        .then()
        .statusCode(HttpStatus.OK.value())
        .body("name", equalTo(optimizationModelDTO.getName()));
  }

  @Test
  void givenCreatedModel_customerShouldGetForbidden() {
    OptimizationModelDTO optimizationModelDTO =
        OptimizationModelDTO.builder()
            .name("Test Model")
            .apiUrl("http://localhost:5000/optimizer-tool")
            .inputType(InputType.FILE)
            .build();

    OptimizationModel om = optimizationModelService.saveOptimizationModel(optimizationModelDTO);

    given()
        .headers("Authorization", "Bearer " + customerAccessToken)
        .when()
        .get("/api/models/" + om.getId())
        .then()
        .statusCode(HttpStatus.FORBIDDEN.value());
  }

  @Test
  void givenCreatedModel_shouldRetire() {
    OptimizationModelDTO optimizationModelDTO =
        OptimizationModelDTO.builder()
            .name("Test Model")
            .apiUrl("http://localhost:5000/optimizer-tool")
            .inputType(InputType.FILE)
            .build();

    OptimizationModel om = optimizationModelService.saveOptimizationModel(optimizationModelDTO);
    assertEquals(OptimizationModelStatus.ACTIVE, om.getStatus());

    om = optimizationModelService.retireOptimizationModel(om.getId());
    assertEquals(OptimizationModelStatus.RETIRED, om.getStatus());

    Optional<OptimizationModel> oom =
        optimizationModelService.findOptimizationModelById(om.getId());
    assertTrue(oom.isEmpty());

    given()
        .headers("Authorization", "Bearer " + adminAccessToken)
        .when()
        .get("/api/models/" + om.getId())
        .then()
        .statusCode(HttpStatus.NOT_FOUND.value());

    given()
        .headers("Authorization", "Bearer " + adminAccessToken)
        .when()
        .get("/api/models")
        .then()
        .statusCode(HttpStatus.OK.value())
        .body("size()", equalTo(0));
  }

  // @Test
  void givenCreatedModel_shouldInvoke() throws IOException {
    OptimizationModelDTO optimizationModelDTO =
        OptimizationModelDTO.builder()
            .name("Test Model")
            .apiUrl("http://127.0.0.1:5000/optimize")
            .inputType(InputType.FILE)
            .build();

    OptimizationModel om = optimizationModelService.saveOptimizationModel(optimizationModelDTO);

    File testInputFile = new ClassPathResource("test_input.xlsx").getFile();

    given()
        .headers("Authorization", "Bearer " + adminAccessToken)
        .multiPart("input", testInputFile)
        .when()
        .post("/api/models/" + om.getId() + "/invoke")
        .then()
        .statusCode(HttpStatus.OK.value());

    given()
        .headers("Authorization", "Bearer " + adminAccessToken)
        .when()
        .get("/api/results?userId=" + admin.getId())
        .then()
        .statusCode(HttpStatus.OK.value());
  }

  @Test
  void givenCreatedModels_customersOnlySeeTheirModels() {
    OptimizationModel omAdmin =
        optimizationModelService.saveOptimizationModel(
            OptimizationModelDTO.builder()
                .name("Test Model Admin")
                .apiUrl("http://127.0.0.1:5000/optimize")
                .inputType(InputType.FILE)
                .build());

    OptimizationModel omCustomer =
        optimizationModelService.saveOptimizationModel(
            OptimizationModelDTO.builder()
                .name("Test Model Customer")
                .apiUrl("http://127.0.0.1:5000/optimize")
                .inputType(InputType.FILE)
                .build());

    admin.setAvailableOptimizationModels(Set.of(omAdmin));
    userRepository.save(admin);

    customer.setAvailableOptimizationModels(Set.of(omCustomer));
    userRepository.save(customer);

    given()
        .headers("Authorization", "Bearer " + adminAccessToken)
        .when()
        .get("/api/models")
        .then()
        .statusCode(HttpStatus.OK.value())
        .body("size()", equalTo(2));

    given()
        .headers("Authorization", "Bearer " + customerAccessToken)
        .when()
        .get("/api/models")
        .then()
        .statusCode(HttpStatus.OK.value())
        .body("size()", equalTo(1));
  }
}
