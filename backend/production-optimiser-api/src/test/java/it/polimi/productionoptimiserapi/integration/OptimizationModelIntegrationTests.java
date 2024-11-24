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
import it.polimi.productionoptimiserapi.enums.OptimizationModelStatus;
import it.polimi.productionoptimiserapi.enums.UserRole;
import it.polimi.productionoptimiserapi.repositories.OptimizationModelRepository;
import it.polimi.productionoptimiserapi.repositories.UserRepository;
import it.polimi.productionoptimiserapi.security.dtos.UserLoginDTO;
import it.polimi.productionoptimiserapi.services.OptimizationModelService;
import it.polimi.productionoptimiserapi.services.UserService;
import java.util.Optional;
import java.util.Set;
import org.junit.jupiter.api.AfterAll;
import org.junit.jupiter.api.BeforeAll;
import org.junit.jupiter.api.BeforeEach;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.context.SpringBootTest;
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
  }

  public OptimizationModelIntegrationTests(@Autowired OptimizationModelRepository repository) {
    super(repository);
  }

  @Autowired private UserRepository userRepository;

  String accessToken;

  @BeforeAll
  static void beforeAll() {
    postgres.start();
  }

  @BeforeEach
  void beforeEach() {
    userRepository.deleteAll();

    userService.createUser(
        UserDTO.builder()
            .email("admin@potest.it")
            .password("password!")
            .role(UserRole.ADMIN)
            .build());

    UserLoginDTO userLoginDTO =
        UserLoginDTO.builder().email("admin@potest.it").password("password!").build();

    accessToken =
        given()
            .contentType(ContentType.JSON)
            .body(userLoginDTO)
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

  // @Test
  void shouldCreateOptimizationModel() {
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

  // @Test
  void givenCreatedModel_shouldGetById() {
    OptimizationModelDTO optimizationModelDTO =
        OptimizationModelDTO.builder()
            .name("Test Model")
            .apiUrl("http://localhost:5000/optimizer-tool")
            .userIds(Set.of())
            .build();

    OptimizationModel om = optimizationModelService.saveOptimizationModel(optimizationModelDTO);

    given()
        .headers("Authorization", "Bearer " + accessToken)
        .when()
        .get("/api/models/" + om.getId())
        .then()
        .statusCode(HttpStatus.OK.value())
        .body("name", equalTo(optimizationModelDTO.getName()));
  }

  // @Test
  void givenCreatedModel_customerShouldGetForbidden() {
    OptimizationModelDTO optimizationModelDTO =
        OptimizationModelDTO.builder()
            .name("Test Model")
            .apiUrl("http://localhost:5000/optimizer-tool")
            .userIds(Set.of())
            .build();

    OptimizationModel om = optimizationModelService.saveOptimizationModel(optimizationModelDTO);

    userService.createUser(
        UserDTO.builder()
            .email("customer@potest.it")
            .password("password!")
            .role(UserRole.CUSTOMER)
            .build());

    UserLoginDTO userLoginDTO =
        UserLoginDTO.builder().email("customer@potest.it").password("password!").build();

    String customerAccessToken =
        given()
            .contentType(ContentType.JSON)
            .body(userLoginDTO)
            .when()
            .post("/api/auth/login")
            .jsonPath()
            .getString("token");

    given()
        .headers("Authorization", "Bearer " + customerAccessToken)
        .when()
        .get("/api/models/" + om.getId())
        .then()
        .statusCode(HttpStatus.FORBIDDEN.value());
  }

  // @Test
  void givenCreatedModel_shouldRetire() {
    OptimizationModelDTO optimizationModelDTO =
        OptimizationModelDTO.builder()
            .name("Test Model")
            .apiUrl("http://localhost:5000/optimizer-tool")
            .userIds(Set.of())
            .build();

    OptimizationModel om = optimizationModelService.saveOptimizationModel(optimizationModelDTO);
    assertEquals(om.getStatus(), OptimizationModelStatus.ACTIVE);

    om = optimizationModelService.retireOptimizationModel(om.getId());
    assertEquals(om.getStatus(), OptimizationModelStatus.RETIRED);

    Optional<OptimizationModel> oom =
        optimizationModelService.findOptimizationModelById(om.getId());
    assertTrue(oom.isEmpty());

    System.out.println(accessToken);

    given()
        .headers("Authorization", "Bearer " + accessToken)
        .when()
        .get("/api/models/" + om.getId())
        .then()
        .statusCode(HttpStatus.NOT_FOUND.value());
  }
}
