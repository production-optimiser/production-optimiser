FROM eclipse-temurin:21-jdk-alpine

RUN ls -la

COPY .target/production-optimiser-api.jar ./production-optimiser-api.jar

CMD ["java", "-jar", "production-optimiser-api.jar"]
