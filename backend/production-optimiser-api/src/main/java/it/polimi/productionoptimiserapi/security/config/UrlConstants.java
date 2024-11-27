package it.polimi.productionoptimiserapi.security.config;

public class UrlConstants {
  public static final String BASE_URL = "/api";
  public static final String AUTH_URL = BASE_URL + "/auth";
  public static final String LOGIN_URL = AUTH_URL + "/login";
  public static final String REGISTER_USER_URL = BASE_URL + "/users/register";
  public static final String DOCS_URL = "/docs/**";
  public static final String SWAGGER_URL = "/swagger-ui/**";
  public static final String ACTUATOR_URL = "/actuator/**";
  public static final String ACCOUNT_REQUEST_URL = BASE_URL + "/account-requests/form";
}
