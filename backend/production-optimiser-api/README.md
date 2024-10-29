# Production Optimiser - API

This is the backend layer of Production Optimiser, which exposes a REST API interface to interact with internal services.

## Getting Started

### Prerequisites

- [JDK 21](https://adoptium.net/temurin/releases/?version=21) installed on the system.
    - Ensure that the `JAVA_HOME` environment variable points to the correct JDK version.
- [PostgreSQL](https://www.postgresql.org/download/) installed and running on the system.

Run the following SQL command on your PostgreSQL instance to create the database:

```sql
CREATE DATABASE production_optimiser;
```

## Installing and running locally

Run the following commands:

```shell
./mvnw install -DskipTests
./mvnw spring-boot:run
```

Alternatively, it is possible to use [JetBrains IntelliJ IDEA](https://www.jetbrains.com/idea/download) to run the application and manage dependencies directly.

## Building for production

Run the following command:

```shell
./mvnw compile
```

The build output will be located in the `target/` directory.

`Dockerfile` contains instructions to build the Docker image for production usage, useful for CI/CD.

## Running tests

*... Work in progress ...*
