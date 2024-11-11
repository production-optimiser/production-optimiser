package it.polimi.productionoptimiserapi.security.filters;

import com.fasterxml.jackson.databind.ObjectMapper;
import it.polimi.productionoptimiserapi.security.dtos.AuthenticationResponseDto;
import it.polimi.productionoptimiserapi.security.dtos.UserLoginDto;
import it.polimi.productionoptimiserapi.security.utils.JwtUtil;
import jakarta.servlet.FilterChain;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;
import java.io.IOException;
import java.util.Map;
import lombok.extern.slf4j.Slf4j;
import org.springframework.http.HttpHeaders;
import org.springframework.http.HttpStatus;
import org.springframework.http.MediaType;
import org.springframework.security.authentication.AuthenticationServiceException;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.authentication.dao.DaoAuthenticationProvider;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.AuthenticationException;
import org.springframework.security.web.authentication.UsernamePasswordAuthenticationFilter;

@Slf4j
public class UserAuthenticationFilter extends UsernamePasswordAuthenticationFilter {
  private final JwtUtil jwtUtil;
  private final DaoAuthenticationProvider authenticationProvider;
  private final ObjectMapper objectMapper = new ObjectMapper();

  public UserAuthenticationFilter(
      JwtUtil jwtUtil, DaoAuthenticationProvider authenticationProvider) {
    this.jwtUtil = jwtUtil;
    this.authenticationProvider = authenticationProvider;
  }

  @Override
  public Authentication attemptAuthentication(
      HttpServletRequest request, HttpServletResponse response) throws AuthenticationException {
    try {
      UserLoginDto loginDto = objectMapper.readValue(request.getReader(), UserLoginDto.class);

      UsernamePasswordAuthenticationToken authRequest =
          new UsernamePasswordAuthenticationToken(loginDto.getEmail(), loginDto.getPassword());

      return authenticationProvider.authenticate(authRequest);
    } catch (IOException e) {
      throw new AuthenticationServiceException("Failed to parse authentication request", e);
    }
  }

  @Override
  protected void successfulAuthentication(
      HttpServletRequest request,
      HttpServletResponse response,
      FilterChain chain,
      Authentication authResult)
      throws IOException {
    String token = jwtUtil.generateToken(authResult);

    AuthenticationResponseDto responseDto = new AuthenticationResponseDto(token);
    response.setContentType(MediaType.APPLICATION_JSON_VALUE);
    response.setHeader(HttpHeaders.AUTHORIZATION, "Bearer " + token);

    objectMapper.writeValue(response.getWriter(), responseDto);
  }

  @Override
  protected void unsuccessfulAuthentication(
      HttpServletRequest request, HttpServletResponse response, AuthenticationException failed)
      throws IOException {
    response.setStatus(HttpStatus.UNAUTHORIZED.value());
    response.setContentType(MediaType.APPLICATION_JSON_VALUE);

    Map<String, String> error =
        Map.of("error", "Authentication failed", "message", failed.getMessage());

    objectMapper.writeValue(response.getWriter(), error);
  }
}
