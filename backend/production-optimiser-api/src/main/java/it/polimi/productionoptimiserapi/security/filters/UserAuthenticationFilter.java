package it.polimi.productionoptimiserapi.security.filters;

import com.fasterxml.jackson.databind.ObjectMapper;
import it.polimi.productionoptimiserapi.security.dtos.UserLoginDto;
import it.polimi.productionoptimiserapi.security.utils.JwtUtil;
import jakarta.servlet.FilterChain;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;
import org.springframework.http.HttpHeaders;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.authentication.dao.DaoAuthenticationProvider;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.AuthenticationException;
import org.springframework.security.web.authentication.UsernamePasswordAuthenticationFilter;

import java.io.BufferedReader;
import java.io.IOException;

public class UserAuthenticationFilter extends UsernamePasswordAuthenticationFilter {
    private final JwtUtil jwtUtil;
    private final DaoAuthenticationProvider daoAuthenticationProvider;

    public UserAuthenticationFilter(JwtUtil jwtUtil, DaoAuthenticationProvider daoAuthenticationProvider) {
        this.jwtUtil = jwtUtil;
        this.daoAuthenticationProvider = daoAuthenticationProvider;
    }

    @Override
    public Authentication attemptAuthentication(HttpServletRequest request, HttpServletResponse response) throws AuthenticationException {
        UserLoginDto userLoginDto;
        try {
            BufferedReader bufferedReader = request.getReader();
            ObjectMapper objectMapper = new ObjectMapper();
            userLoginDto = objectMapper.readValue(bufferedReader, UserLoginDto.class);
        } catch (IOException e) {
            throw new RuntimeException(e);
        }
        return daoAuthenticationProvider.authenticate(
                new UsernamePasswordAuthenticationToken(
                        userLoginDto.getEmail(), userLoginDto.getPassword()));
    }

    @Override
    protected void successfulAuthentication(HttpServletRequest request, HttpServletResponse response, FilterChain chain, Authentication authResult){
        String token = jwtUtil.generateToken(authResult);
        response.setHeader(HttpHeaders.AUTHORIZATION, token);
    }
}
