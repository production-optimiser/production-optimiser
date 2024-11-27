package it.polimi.productionoptimiserapi.integration;

import static io.restassured.RestAssured.given;
import static org.hamcrest.CoreMatchers.equalTo;
import static org.junit.jupiter.api.Assertions.*;

import io.restassured.http.ContentType;
import it.polimi.productionoptimiserapi.dtos.AccountRequestDTO;
import it.polimi.productionoptimiserapi.dtos.KeyValueDTO;
import it.polimi.productionoptimiserapi.dtos.UserDTO;
import it.polimi.productionoptimiserapi.enums.UserRole;
import it.polimi.productionoptimiserapi.repositories.AccountRequestRepository;
import it.polimi.productionoptimiserapi.repositories.UserRepository;
import it.polimi.productionoptimiserapi.security.dtos.UserLoginDTO;
import it.polimi.productionoptimiserapi.services.AccountRequestService;
import it.polimi.productionoptimiserapi.services.UserService;
import org.junit.jupiter.api.AfterAll;
import org.junit.jupiter.api.BeforeAll;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.context.SpringBootTest;
import org.springframework.http.HttpStatus;
import org.springframework.test.context.DynamicPropertyRegistry;
import org.springframework.test.context.DynamicPropertySource;
import org.testcontainers.containers.PostgreSQLContainer;

@SpringBootTest(webEnvironment = SpringBootTest.WebEnvironment.RANDOM_PORT)
public class AccountRequestIntegrationTests extends BaseIntegrationTestSetup {

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
  @Autowired private AccountRequestRepository accountRequestRepository;
  @Autowired private UserService userService;
  @Autowired private AccountRequestService accountRequestService;

  String adminAccessToken;

  @BeforeAll
  static void beforeAll() {
    postgres.start();
  }

  @BeforeEach
  void beforeEach() {
    userRepository.deleteAll();
    accountRequestRepository.deleteAll();

    userService.createUser(
        UserDTO.builder()
            .email("admin@potest.it")
            .password("password!")
            .role(UserRole.ADMIN)
            .build());

    UserLoginDTO userLoginDTO =
        UserLoginDTO.builder().email("admin@potest.it").password("password!").build();

    adminAccessToken =
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

  @Test
  void shouldCreateAccountRequest() {
    AccountRequestDTO accountRequestDTO =
        AccountRequestDTO.builder()
            .email("newuser@example.com")
            .message("Please create an account for me")
            .build();

    given()
        .contentType(ContentType.JSON)
        .body(accountRequestDTO)
        .when()
        .post("/api/account-requests/form")
        .then()
        .statusCode(HttpStatus.OK.value())
        .body("email", equalTo(accountRequestDTO.getEmail()))
        .body("message", equalTo(accountRequestDTO.getMessage()));
  }

  @Test
  void givenAccountRequest_adminShouldGetById() {
    AccountRequestDTO accountRequestDTO =
        AccountRequestDTO.builder()
            .email("newuser@example.com")
            .message("Please create an account for me")
            .build();

    String accountRequestId = accountRequestService.createAccountRequest(accountRequestDTO).getId();

    given()
        .headers("Authorization", "Bearer " + adminAccessToken)
        .when()
        .get("/api/account-requests/" + accountRequestId)
        .then()
        .statusCode(HttpStatus.OK.value())
        .body("email", equalTo(accountRequestDTO.getEmail()))
        .body("message", equalTo(accountRequestDTO.getMessage()));
  }

  @Test
  void givenAccountRequest_adminShouldApprove() {
    AccountRequestDTO accountRequestDTO =
        AccountRequestDTO.builder()
            .email("newuser@example.com")
            .message("Please create an account for me")
            .build();

    String accountRequestId = accountRequestService.createAccountRequest(accountRequestDTO).getId();

    KeyValueDTO approvalDTO =
        KeyValueDTO.builder().key(accountRequestId).value("newpassword123").build();

    given()
        .contentType(ContentType.JSON)
        .headers("Authorization", "Bearer " + adminAccessToken)
        .body(approvalDTO)
        .when()
        .post("/api/account-requests/approve")
        .then()
        .statusCode(HttpStatus.OK.value())
        .body("email", equalTo(accountRequestDTO.getEmail()))
        .body("role", equalTo("CUSTOMER"));

    // Verify that the account request has been deleted
    assertTrue(accountRequestRepository.findById(accountRequestId).isEmpty());
  }

  @Test
  void givenAccountRequest_adminShouldDeny() {
    AccountRequestDTO accountRequestDTO =
        AccountRequestDTO.builder()
            .email("newuser@example.com")
            .message("Please create an account for me")
            .build();

    String accountRequestId = accountRequestService.createAccountRequest(accountRequestDTO).getId();

    KeyValueDTO denialDTO =
        KeyValueDTO.builder()
            .key(accountRequestId)
            .value("Request denied due to insufficient information")
            .build();

    given()
        .contentType(ContentType.JSON)
        .headers("Authorization", "Bearer " + adminAccessToken)
        .body(denialDTO)
        .when()
        .post("/api/account-requests/deny")
        .then()
        .statusCode(HttpStatus.OK.value())
        .body(equalTo("Account request with id: " + accountRequestId + " was denied."));

    // Verify that the account request has been deleted
    assertTrue(accountRequestRepository.findById(accountRequestId).isEmpty());
  }
}
