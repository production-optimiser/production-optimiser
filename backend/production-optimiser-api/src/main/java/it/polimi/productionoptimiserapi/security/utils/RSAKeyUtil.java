package it.polimi.productionoptimiserapi.security.utils;

import org.springframework.beans.factory.annotation.Value;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;

import java.io.FileOutputStream;
import java.io.IOException;
import java.io.OutputStream;
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

            try (OutputStream privateOut = new FileOutputStream(getClass().getClassLoader()
                    .getResource(privateKeyPath).getFile())) {
                privateOut.write(Base64.getEncoder().encode(keyPair.getPrivate().getEncoded()));
            }

            try (OutputStream publicOut = new FileOutputStream(getClass().getClassLoader()
                    .getResource(publicKeyPath).getFile())) {
                publicOut.write(Base64.getEncoder().encode(keyPair.getPublic().getEncoded()));
            }
        } catch (NoSuchAlgorithmException e) {
            throw new RuntimeException("Failed to generate RSA keys: " + e.getMessage(), e);
        } catch (IOException e) {
            throw new RuntimeException("Failed to save keys: " + e.getMessage(), e);
        }
    }

    private RSAPrivateKey loadPrivateKey() {
        try {
            String key = new String(getClass().getClassLoader()
                    .getResourceAsStream(privateKeyPath)
                    .readAllBytes());
            key = key.replace("-----BEGIN PRIVATE KEY-----", "").replace("-----END PRIVATE KEY-----", "").replaceAll("\\s", "");

            byte[] keyBytes = Base64.getDecoder().decode(key);
            PKCS8EncodedKeySpec spec = new PKCS8EncodedKeySpec(keyBytes);

            KeyFactory keyFactory = KeyFactory.getInstance("RSA");
            return (RSAPrivateKey) keyFactory.generatePrivate(spec);
        } catch (IOException e) {
            throw new RuntimeException("Failed to load private key: " + e.getMessage(), e);
        } catch (NoSuchAlgorithmException e) {
            throw new RuntimeException(e);
        } catch (InvalidKeySpecException e) {
            throw new RuntimeException(e);
        }
    }

    private RSAPublicKey loadPublicKey() {
        try {
            String key = new String(getClass().getClassLoader()
                    .getResourceAsStream(publicKeyPath)
                    .readAllBytes());
            key = key.replace("-----BEGIN PUBLIC KEY-----", "").replace("-----END PUBLIC KEY-----", "").replaceAll("\\s", "");
            byte[] keyBytes = Base64.getDecoder().decode(key);
            X509EncodedKeySpec spec = new X509EncodedKeySpec(keyBytes);
            KeyFactory keyFactory = KeyFactory.getInstance("RSA");
            return (RSAPublicKey) keyFactory.generatePublic(spec);
        } catch (IOException e) {
            throw new RuntimeException("Failed to load public key: " + e.getMessage(), e);
        } catch (NoSuchAlgorithmException e) {
            throw new RuntimeException(e);
        } catch (InvalidKeySpecException e) {
            throw new RuntimeException(e);
        }
    }

    //TODO fix exception handling
}
