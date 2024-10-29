FROM eclipse-temurin:21-jdk-alpine
WORKDIR /app

ARG MAVEN_VERSION=3.9.6
ARG USER_HOME_DIR="/root"
ARG BASE_URL=https://apache.osuosl.org/maven/maven-3/${MAVEN_VERSION}/binaries

# Update and install curl
RUN apk update; apk add curl

# Install Bash
RUN apk update && apk add bash

# Install Maven
RUN mkdir -p /usr/share/maven /usr/share/maven/ref \
 && curl -fsSL -o /tmp/apache-maven.tar.gz ${BASE_URL}/apache-maven-${MAVEN_VERSION}-bin.tar.gz \
 && tar -xzf /tmp/apache-maven.tar.gz -C /usr/share/maven --strip-components=1 \
 && rm -f /tmp/apache-maven.tar.gz \
 && ln -s /usr/share/maven/bin/mvn /usr/bin/mvn

# Export Maven environment variables
ENV MAVEN_HOME /usr/share/maven
ENV MAVEN_CONFIG "$USER_HOME_DIR/.m2"

# Build project
COPY src/ src/
COPY pom.xml .
RUN mvn install -DskipTests

ENTRYPOINT ["java", "-jar", "/app/target/productionoptimiser-1.0.0.jar"]
EXPOSE 8000
