package it.polimi.productionoptimiserapi.security.utils;

import org.springframework.beans.factory.annotation.Value;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;

import java.io.IOException;
import java.nio.file.Files;
import java.nio.file.Path;
import java.nio.file.Paths;
import java.security.KeyFactory;
import java.security.KeyPair;
import java.security.KeyPairGenerator;
import java.security.NoSuchAlgorithmException;
import java.security.interfaces.RSAPrivateKey;
import java.security.interfaces.RSAPublicKey;
import java.security.spec.InvalidKeySpecException;
import java.security.spec.PKCS8EncodedKeySpec;
import java.security.spec.X509EncodedKeySpec;
import java.util.Base64;

@Configuration
public class RSAKeyUtil {
    @Value("${jwt.private-key.path}")
    private String privateKeyPath;

    @Value("${jwt.public-key.path}")
    private String publicKeyPath;

    @Bean
    public RSAPrivateKey getPrivateKey() {
        Path privateKeyFile = Paths.get(privateKeyPath);
        if(!Files.exists(privateKeyFile)){
            generateAndSaveKeys();
        }
        return loadPrivateKey();
    }

    @Bean
    public RSAPublicKey getPublicKey() {
        Path publicKeyFile = Paths.get(publicKeyPath);
        if(!Files.exists(publicKeyFile)){
            generateAndSaveKeys();
        }
        return loadPublicKey();
    }

    private void generateAndSaveKeys() {
        try {
            KeyPairGenerator keyPairGenerator = KeyPairGenerator.getInstance("RSA");
            keyPairGenerator.initialize(2048);
            KeyPair keyPair = keyPairGenerator.generateKeyPair();

            Path privateKeyFile = Paths.get(privateKeyPath);
            Files.write(privateKeyFile, Base64.getEncoder().encode(keyPair.getPrivate().getEncoded()));

            Path publicKeyFile = Paths.get(publicKeyPath);
            Files.write(publicKeyFile, Base64.getEncoder().encode(keyPair.getPublic().getEncoded()));
        } catch (NoSuchAlgorithmException e) {
            // TODO handle exception 2
            throw new RuntimeException(e);
        } catch (IOException e) {
            // TODO handle exception 1
            throw new RuntimeException(e);
        }
    }

    private RSAPrivateKey loadPrivateKey() {
        Path path = Paths.get(privateKeyPath);
        try {
            String key = new String(Files.readAllBytes(path));
            key = key.replace("-----BEGIN PRIVATE KEY-----", "").replace("-----END PRIVATE KEY-----", "").replaceAll("\\s", "");

            byte[] keyBytes = Base64.getDecoder().decode(key);
            PKCS8EncodedKeySpec spec = new PKCS8EncodedKeySpec(keyBytes);

            KeyFactory keyFactory = KeyFactory.getInstance("RSA");
            return (RSAPrivateKey) keyFactory.generatePrivate(spec);
        } catch (IOException e) {
            // TODO handle exception 1
            throw new RuntimeException(e);
        } catch (NoSuchAlgorithmException e) {
            // TODO handle exception 2
            throw new RuntimeException(e);
        } catch (InvalidKeySpecException e) {
            // TODO handle exception 3
            throw new RuntimeException(e);
        }
    }

    private RSAPublicKey loadPublicKey() {
        Path path = Paths.get(publicKeyPath);
        try {
            String key = new String(Files.readAllBytes(path));
            key = key.replace("-----BEGIN PUBLIC KEY-----", "").replace("-----END PUBLIC KEY-----", "").replaceAll("\\s", "");
            byte[] keyBytes = Base64.getDecoder().decode(key);
            X509EncodedKeySpec spec = new X509EncodedKeySpec(keyBytes);
            KeyFactory keyFactory = KeyFactory.getInstance("RSA");
            return (RSAPublicKey) keyFactory.generatePublic(spec);
        } catch (IOException e) {
            // TODO handle exception 1
            throw new RuntimeException(e);
        } catch (NoSuchAlgorithmException e) {
            // TODO handle exception 2
            throw new RuntimeException(e);
        } catch (InvalidKeySpecException e) {
            // TODO handle exception 3
            throw new RuntimeException(e);
        }
    }
}
