package it.polimi.productionoptimiserapi.security.config;

import it.polimi.productionoptimiserapi.security.filters.JwtTokenFilter;
import it.polimi.productionoptimiserapi.security.filters.UserAuthenticationFilter;
import it.polimi.productionoptimiserapi.security.utils.JwtUtil;
import java.util.List;
import lombok.RequiredArgsConstructor;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.authentication.dao.DaoAuthenticationProvider;
import org.springframework.security.config.Customizer;
import org.springframework.security.config.annotation.authentication.builders.AuthenticationManagerBuilder;
import org.springframework.security.config.annotation.method.configuration.EnableMethodSecurity;
import org.springframework.security.config.annotation.web.builders.HttpSecurity;
import org.springframework.security.config.annotation.web.configuration.EnableWebSecurity;
import org.springframework.security.config.annotation.web.configurers.AbstractHttpConfigurer;
import org.springframework.security.config.http.SessionCreationPolicy;
import org.springframework.security.core.userdetails.UserDetailsService;
import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;
import org.springframework.security.web.SecurityFilterChain;
import org.springframework.security.web.authentication.UsernamePasswordAuthenticationFilter;
import org.springframework.web.cors.CorsConfiguration;
import org.springframework.web.cors.CorsConfigurationSource;

@Configuration
@EnableWebSecurity
@EnableMethodSecurity
@RequiredArgsConstructor
public class SecurityConfig {
  private final JwtUtil jwtUtil;
  private final UserDetailsService userDetailsService;
  private final JwtTokenFilter jwtTokenFilter;

  @Bean
  public BCryptPasswordEncoder passwordEncoder() {
    return new BCryptPasswordEncoder();
  }

  @Bean
  public CorsConfigurationSource corsConfigurationSource() {
    return request -> {
      var cors = new CorsConfiguration();
      cors.setAllowedOrigins(
          List.of(
              "http://localhost:3000",
              "http://localhost:5173",
              "https://production-optimiser.github.io",
              "https://production-optimiser.github.io/production-optimiser",
              "https://production-optimiser.github.io/production-optimiser/"));
      cors.setAllowedMethods(List.of("*"));
      cors.setAllowedHeaders(List.of("*"));
      cors.setExposedHeaders(List.of("Authorization"));
      cors.setAllowCredentials(true);
      return cors;
    };
  }

  @Bean
  public DaoAuthenticationProvider authenticationProvider() {
    DaoAuthenticationProvider provider = new DaoAuthenticationProvider();
    provider.setPasswordEncoder(passwordEncoder());
    provider.setUserDetailsService(userDetailsService);
    return provider;
  }

  @Bean
  public AuthenticationManager authenticationManager(HttpSecurity http) throws Exception {
    return http.getSharedObject(AuthenticationManagerBuilder.class)
        .authenticationProvider(authenticationProvider())
        .build();
  }

  @Bean
  public SecurityFilterChain filterChain(HttpSecurity http) throws Exception {
    UserAuthenticationFilter userAuthenticationFilter =
        new UserAuthenticationFilter(jwtUtil, authenticationProvider());
    userAuthenticationFilter.setFilterProcessesUrl(UrlConstants.LOGIN_URL);

    http.cors(Customizer.withDefaults())
        .csrf(AbstractHttpConfigurer::disable)
        .sessionManagement(
            session -> session.sessionCreationPolicy(SessionCreationPolicy.STATELESS))
        .authorizeHttpRequests(
            authorize ->
                authorize
                    .requestMatchers(
                        UrlConstants.LOGIN_URL, UrlConstants.DOCS_URL, UrlConstants.SWAGGER_URL)
                    .permitAll()
                    .requestMatchers(UrlConstants.REGISTER_USER_URL)
                    .hasRole("ADMIN")
                    .anyRequest()
                    .authenticated())
        .addFilter(userAuthenticationFilter)
        .addFilterBefore(jwtTokenFilter, UsernamePasswordAuthenticationFilter.class);

    return http.build();
  }
}
