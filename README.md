# production-optimiser

Mono-repo for the production optimiser project. This project is a collaboration between Politecnico di Milano and University of Zagreb with guidance from MITC - Sweden.

https://www.polimi.it/en

https://www.unizg.hr/homepage/

https://mitc.se/en/home/

## Overview

The production optimiser project aims to develop a software tool that users can use to execute different optimisation algorithms. Along with the optimisation algorithms tool provides support for linking whatever algorithm or service customer has. 
The only constraint being is that service/algorithm has REST API interface.

## Technologies

Backend - Java 21, Maven, Spring Boot, PostgreSQL, Docker

Frontend - React, Vite, Shadcn-UI, Docker

Services - Python, FastAPI, Docker

## Installation

All backend services are dockerised and can be run using docker-compose. To run specific service check separate docker-compose files under /backend

Frontend is not dockerised and can be run using npm.

```bash
cd backend/production-optimiser-api
docker compose up -d
```

```bash
cd frontend
npm install
npm run dev
```

After this you can access the frontend at http://localhost:5173

#### Running the api without docker (requires postgres database running)
```bash
maven spring-boot:run
```

Initial DB values are stored in ```/backend/production-optimiser-api/src/main/resources/data.sql```

Configuration for the backend is stored in ```/backend/production-optimiser-api/src/main/resources/application.properties```
