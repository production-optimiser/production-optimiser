package it.polimi.productionoptimiserapi.security.filters;

import com.fasterxml.jackson.databind.ObjectMapper;
import it.polimi.productionoptimiserapi.security.utils.JwtUtil;
import jakarta.servlet.FilterChain;
import jakarta.servlet.ServletException;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.http.HttpHeaders;
import org.springframework.http.HttpStatus;
import org.springframework.http.MediaType;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.security.core.userdetails.UserDetailsService;
import org.springframework.security.web.authentication.WebAuthenticationDetailsSource;
import org.springframework.stereotype.Component;
import org.springframework.web.filter.OncePerRequestFilter;

import java.io.IOException;
import java.util.Map;

@Slf4j
@Component
@RequiredArgsConstructor
public class JwtTokenFilter extends OncePerRequestFilter {
  private final UserDetailsService userDetailsService;
  private final JwtUtil jwtUtil;
  private final ObjectMapper objectMapper = new ObjectMapper();

  @Override
  protected void doFilterInternal(
      HttpServletRequest request, HttpServletResponse response, FilterChain filterChain)
      throws ServletException, IOException {
    try {
      String header = request.getHeader(HttpHeaders.AUTHORIZATION);

      if (header == null || !header.startsWith("Bearer ")) {
        filterChain.doFilter(request, response);
        return;
      }

      String token = header.substring(7);

      if (!jwtUtil.validate(token)) {
        handleInvalidToken(response, "Invalid token");
        return;
      }

      String email = jwtUtil.getEmail(token);
      UserDetails userDetails = userDetailsService.loadUserByUsername(email);

      UsernamePasswordAuthenticationToken authentication =
          new UsernamePasswordAuthenticationToken(userDetails, null, userDetails.getAuthorities());
      authentication.setDetails(new WebAuthenticationDetailsSource().buildDetails(request));
      SecurityContextHolder.getContext().setAuthentication(authentication);

      filterChain.doFilter(request, response);
    } catch (Exception e) {
      log.error("Cannot set user authentication", e);
      handleInvalidToken(response, e.getMessage());
    }
  }

  private void handleInvalidToken(HttpServletResponse response, String message) throws IOException {
    response.setStatus(HttpStatus.UNAUTHORIZED.value());
    response.setContentType(MediaType.APPLICATION_JSON_VALUE);

    Map<String, String> error = Map.of("error", "Invalid token", "message", message);

    objectMapper.writeValue(response.getWriter(), error);
  }
}
