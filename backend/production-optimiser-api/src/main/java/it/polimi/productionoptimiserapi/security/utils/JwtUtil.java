package it.polimi.productionoptimiserapi.security.utils;

import com.auth0.jwt.JWT;
import com.auth0.jwt.algorithms.Algorithm;
import com.auth0.jwt.exceptions.JWTVerificationException;
import it.polimi.productionoptimiserapi.entities.User;
import jakarta.annotation.PostConstruct;
import lombok.RequiredArgsConstructor;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.context.annotation.Configuration;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.GrantedAuthority;
import org.springframework.stereotype.Service;

import java.security.interfaces.RSAPrivateKey;
import java.security.interfaces.RSAPublicKey;
import java.util.Collection;
import java.util.Date;
import java.util.List;

@Service
@Configuration
@RequiredArgsConstructor
public class JwtUtil {
    private final RSAPrivateKey privateKey;
    private final RSAPublicKey publicKey;
    private Algorithm algorithm;

    @Value("${jwt.token-expiration}")
    private String tokenExpirationTime;

    @PostConstruct
    public void init(){
        this.algorithm  = Algorithm.RSA256(publicKey, privateKey);
    }

    public String generateToken(final Authentication authentication) {
        Collection<? extends GrantedAuthority> authorities = authentication.getAuthorities();

        //extracts user roles
        List<String> roles = authorities.stream()
                .map(grantedAuthority -> grantedAuthority.getAuthority().replace("ROLE_", ""))
                .toList();

        return JWT.create()
                .withSubject(((User) authentication.getPrincipal()).getEmail())
                .withIssuer("production-optimiser")
                .withIssuedAt(new Date())
                .withExpiresAt(new Date(new Date().getTime() + Integer.parseInt(tokenExpirationTime)))
                .withClaim("roles", roles)
                .sign(algorithm);
    }

    public boolean validate(String token) {
        try {
            JWT.require(algorithm).build().verify(token);
            return true;
        } catch (JWTVerificationException e) {
            return false;
        }
    }

    public String getEmail(String token) {
        return JWT.require(algorithm)
                .build()
                .verify(token)
                .getSubject();
    }
}
