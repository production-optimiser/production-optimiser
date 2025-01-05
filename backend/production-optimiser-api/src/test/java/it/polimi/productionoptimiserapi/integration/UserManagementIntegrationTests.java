package it.polimi.productionoptimiserapi.integration;

import static io.restassured.RestAssured.given;
import static org.hamcrest.Matchers.is;

import io.restassured.http.ContentType;
import it.polimi.productionoptimiserapi.dtos.UserDTO;
import it.polimi.productionoptimiserapi.enums.UserRole;
import it.polimi.productionoptimiserapi.repositories.UserRepository;
import it.polimi.productionoptimiserapi.security.dtos.UserLoginDTO;
import it.polimi.productionoptimiserapi.services.UserService;
import org.junit.jupiter.api.AfterAll;
import org.junit.jupiter.api.BeforeAll;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.context.SpringBootTest;
import org.springframework.test.context.DynamicPropertyRegistry;
import org.springframework.test.context.DynamicPropertySource;
import org.testcontainers.containers.PostgreSQLContainer;

@SpringBootTest(webEnvironment = SpringBootTest.WebEnvironment.RANDOM_PORT)
public class UserManagementIntegrationTests extends BaseIntegrationTestSetup {

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

  String adminAccessToken;
  String customer1AccessToken;
  String customer2AccessToken;

  String adminId;
  String customer1Id;
  String customer2Id;

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

    userService.createUser(
        UserDTO.builder()
            .email("testing@testing.com")
            .password("password!")
            .role(UserRole.CUSTOMER)
            .build());

    userService.createUser(
        UserDTO.builder()
            .email("testing2@testing.com")
            .password("password!")
            .role(UserRole.CUSTOMER)
            .build());

    UserLoginDTO userLoginDTO =
        UserLoginDTO.builder().email("admin@potest.it").password("password!").build();

    UserLoginDTO customer1LoginDTO =
        UserLoginDTO.builder().email("testing@testing.com").password("password!").build();

    UserLoginDTO customer2LoginDTO =
        UserLoginDTO.builder().email("testing2@testin.com").password("password!").build();

    adminId = userRepository.findByEmail("admin@potest.it").get().getId();
    customer1Id = userRepository.findByEmail("testing@testing.com").get().getId();
    customer2Id = userRepository.findByEmail("testing2@testing.com").get().getId();

    adminAccessToken =
        given()
            .contentType(ContentType.JSON)
            .body(userLoginDTO)
            .when()
            .post("/api/auth/login")
            .jsonPath()
            .getString("token");

    customer1AccessToken =
        given()
            .contentType(ContentType.JSON)
            .body(customer1LoginDTO)
            .when()
            .post("/api/auth/login")
            .jsonPath()
            .getString("token");

    customer2AccessToken =
        given()
            .contentType(ContentType.JSON)
            .body(customer2LoginDTO)
            .when()
            .post("/api/auth/login")
            .jsonPath()
            .getString("token");
  }

  @AfterAll
  static void afterAll() {
    postgres.stop();
  }

  @Test
  void testGetUsers() {

    //  admin access
    given()
        .header("Authorization", "Bearer " + adminAccessToken)
        .when()
        .get("/api/users")
        .then()
        .statusCode(200)
        .body("size()", is(2))
        .body("[0].email", is("admin@potest.it"))
        .body("[0].role", is("ADMIN"))
        .body("[1].email", is("testing@testing.com"))
        .body("[1].role", is("CUSTOMER"));

    //  customer access
    given()
        .header("Authorization", "Bearer " + customer1AccessToken)
        .when()
        .get("/api/users")
        .then()
        .statusCode(403);
  }

  @Test
  void testGetUser() {

    //  admin access - 200
    given()
        .header("Authorization", "Bearer " + adminAccessToken)
        .when()
        .get("/api/users/" + customer1Id)
        .then()
        .statusCode(200)
        .body("email", is("testing@testing.com"));

    //  customer access - accessing himself - 200
    given()
        .header("Authorization", "Bearer " + customer1AccessToken)
        .when()
        .get("/api/users/" + customer1Id)
        .then()
        .statusCode(200)
        .body("email", is("testing@testing.com"));

    //  customer access - accessing another customer - 403
    given()
        .header("Authorization", "Bearer " + customer1AccessToken)
        .when()
        .get("/api/users/" + customer2Id)
        .then()
        .statusCode(403);
  }

  @Test
  void testCreateUser() {
    UserDTO userDTO =
        UserDTO.builder()
            .email("created@created.com")
            .password("password!")
            .role(UserRole.CUSTOMER)
            .build();

    //  admin access - 202
    given()
        .header("Authorization", "Bearer " + adminAccessToken)
        .contentType(ContentType.JSON)
        .body(userDTO)
        .when()
        .post("/api/users")
        .then()
        .statusCode(200)
        .body("email", is("created@created.com"))
        .body("role", is("CUSTOMER"));

    //  customer access - 403
    given()
        .header("Authorization", "Bearer " + customer1AccessToken)
        .contentType(ContentType.JSON)
        .body(userDTO)
        .when()
        .post("/api/users")
        .then()
        .statusCode(403);
  }

  @Test
  void testUpdateUser() {

    //    bad request - no parameters
    given()
        .header("Authorization", "Bearer " + adminAccessToken)
        .when()
        .patch("/api/users/" + customer1Id)
        .then()
        .statusCode(400);

    //  customer access - accessing another customer - 403
    given()
        .header("Authorization", "Bearer " + customer1AccessToken)
        .param("email", "testing@fail.com")
        .when()
        .patch("/api/users/" + customer2Id)
        .then()
        .statusCode(403);

    //    customer access - accessing himself - 200
    given()
        .header("Authorization", "Bearer " + customer1AccessToken)
        .param("email", "testing@changed.com")
        .when()
        .patch("/api/users/" + customer1Id)
        .then()
        .statusCode(200);

    //    admin access - 200
    given()
        .header("Authorization", "Bearer " + adminAccessToken)
        .param("email", "testing@changed.com")
        .param("password", "password!changed")
        .param("requestedRole", UserRole.ADMIN)
        .when()
        .patch("/api/users/" + customer1Id)
        .then()
        .statusCode(200);

    given()
        .header("Authorization", "Bearer " + adminAccessToken)
        .when()
        .get("/api/users/" + customer1Id)
        .then()
        .statusCode(200)
        .body("email", is("testing@changed.com"))
        .body("role", is("ADMIN"));
  }

  @Test
  void testDeleteUser() {
    given()
        .header("Authorization", "Bearer " + adminAccessToken)
        .when()
        .delete("/api/users/" + customer1Id)
        .then()
        .statusCode(200);

    given()
        .header("Authorization", "Bearer " + adminAccessToken)
        .when()
        .get("/api/users/" + customer1Id)
        .then()
        .statusCode(404);
  }
}
