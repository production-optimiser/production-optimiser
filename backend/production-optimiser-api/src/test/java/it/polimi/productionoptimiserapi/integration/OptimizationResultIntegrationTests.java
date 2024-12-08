package it.polimi.productionoptimiserapi.integration;

import static io.restassured.RestAssured.given;
import static org.hamcrest.CoreMatchers.equalTo;

import io.restassured.http.ContentType;
import it.polimi.productionoptimiserapi.dtos.OptimizationResultDto;
import it.polimi.productionoptimiserapi.entities.User;
import it.polimi.productionoptimiserapi.enums.GraphType;
import it.polimi.productionoptimiserapi.enums.UserRole;
import it.polimi.productionoptimiserapi.repositories.UserRepository;
import it.polimi.productionoptimiserapi.security.dtos.UserLoginDTO;
import it.polimi.productionoptimiserapi.services.OptimizationResultService;
import it.polimi.productionoptimiserapi.services.UserService;
import java.io.File;
import java.io.IOException;
import java.nio.file.Files;
import java.time.LocalDateTime;
import java.util.HashMap;
import org.junit.jupiter.api.AfterAll;
import org.junit.jupiter.api.BeforeAll;
import org.junit.jupiter.api.BeforeEach;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.context.SpringBootTest;
import org.springframework.core.io.ClassPathResource;
import org.springframework.http.HttpStatus;
import org.springframework.test.context.DynamicPropertyRegistry;
import org.springframework.test.context.DynamicPropertySource;
import org.testcontainers.containers.PostgreSQLContainer;

@SpringBootTest(webEnvironment = SpringBootTest.WebEnvironment.RANDOM_PORT)
public class OptimizationResultIntegrationTests extends BaseIntegrationTestSetup {
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
  @Autowired private UserService userService;

  @Autowired private OptimizationResultService resultService;

  String accessToken;
  String userID;

  String resultID;

  @BeforeAll
  static void beforeAll() {
    postgres.start();
  }

  @BeforeEach
  void beforeEach() {
    resultService.deleteAll();
    userRepository.deleteAll();

    User user =
        User.builder().email("admin@potest.it").password("password!").role(UserRole.ADMIN).build();

    userID = user.getId();

    UserLoginDTO userLoginDTO =
        UserLoginDTO.builder().email("admin@potest.it").password("password!").build();

    HashMap<String, Integer> maximumPalletsUsed = new HashMap<>();
    HashMap<String, Integer> palletsDefinedInExcel = new HashMap<>();
    HashMap<GraphType, String> graphs = new HashMap<>();

    maximumPalletsUsed.put("skibidi,b,c", 10);
    maximumPalletsUsed.put("d,e,f", 2);

    palletsDefinedInExcel.put("skibidi,b,c", 10);
    palletsDefinedInExcel.put("d,e,f", 2);

    graphs.put(GraphType.OCCUPANCY_GRAPH, "sad");
    graphs.put(GraphType.PRODUCT_FLOW, "sad");
    graphs.put(GraphType.PALLET_GRAPH, "sad");

    OptimizationResultDto dto =
        new OptimizationResultDto(
            "",
            LocalDateTime.now(),
            LocalDateTime.now(),
            31.34,
            49.81,
            816.0,
            513.5,
            37.07,
            302.5,
            513.5,
            maximumPalletsUsed,
            palletsDefinedInExcel,
            513.5,
            18.46,
            "g skibidi skibidi e skibidi g skibidi skibidi b e e d i b b h h g c c c h i c c d f h e d g d d f h d h d d d c d e i b e h b c e g e h b c b f i skibidi skibidi skibidi c b f b f b f f g f c g skibidi g g g h skibidi h i f",
            graphs);

    try {
      File testInputFile = new ClassPathResource("test_input.xlsx").getFile();
      resultID =
          resultService.saveOptimizationResult(
              Files.readAllBytes(testInputFile.toPath()), dto, user);
    } catch (IOException e) {
      throw new RuntimeException(e);
    }

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

  // TODO Fix and refactor test in next Sprint, currently has weird behaviour
  //    @Test
  //    public void givenUserId_shouldGetAll() {
  //        given()
  //                .headers("Authorization", "Bearer " + accessToken)
  //                .param("userId", userID)
  //                .when()
  //                .get("/api/results")
  //                .then()
  //                .statusCode(HttpStatus.OK.value());
  //    }

  // TODO Refactor test in next Sprint
  // @Test
  public void givenResultId_shouldFetch() {
    HashMap<String, String> requestParams = new HashMap<>();
    given()
        .headers("Authorization", "Bearer " + accessToken)
        .when()
        .get("/api/results/" + resultID)
        .then()
        .statusCode(HttpStatus.OK.value())
        .body("id", equalTo(resultID));
  }
}
