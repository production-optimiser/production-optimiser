package it.polimi.productionoptimiserapi.security.utils;

import com.auth0.jwt.JWT;
import com.auth0.jwt.algorithms.Algorithm;
import com.auth0.jwt.exceptions.JWTVerificationException;
import jakarta.annotation.PostConstruct;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.GrantedAuthority;
import org.springframework.stereotype.Service;

import java.security.interfaces.RSAPrivateKey;
import java.security.interfaces.RSAPublicKey;
import java.util.Collection;
import java.util.Date;
import java.util.List;

@Slf4j
@Service
@RequiredArgsConstructor
public class JwtUtil {
    private final RSAPrivateKey privateKey;
    private final RSAPublicKey publicKey;
    private Algorithm algorithm;

    @Value("${jwt.token-expiration}")
    private Long tokenExpirationTime;

    @PostConstruct
    public void init() {
        this.algorithm = Algorithm.RSA256(publicKey, privateKey);
        log.info("JWT algorithm initialized with RSA keys");
    }

    public String generateToken(final Authentication authentication) {
        String username = authentication.getName();
        Collection<? extends GrantedAuthority> authorities = authentication.getAuthorities();
        
        List<String> roles = authorities.stream()
                .map(GrantedAuthority::getAuthority)
                .toList();
        
        log.debug("Generating token for user: {} with roles: {}", username, roles);

        return JWT.create()
                .withSubject(username)
                .withIssuer("production-optimiser")
                .withIssuedAt(new Date())
                .withExpiresAt(new Date(System.currentTimeMillis() + tokenExpirationTime))
                .withClaim("roles", roles)
                .sign(algorithm);
    }

    public boolean validate(String token) {
        try {
            JWT.require(algorithm)
                .withIssuer("production-optimiser")
                .build()
                .verify(token);
            log.debug("Token validation successful");
            return true;
        } catch (JWTVerificationException e) {
            log.error("Token validation failed: {}", e.getMessage());
            return false;
        }
    }

    public String getEmail(String token) {
        return JWT.require(algorithm)
                .withIssuer("production-optimiser")
                .build()
                .verify(token)
                .getSubject();
    }

    public List<String> getRoles(String token) {
        return JWT.require(algorithm)
                .withIssuer("production-optimiser")
                .build()
                .verify(token)
                .getClaim("roles")
                .asList(String.class);
    }
}
