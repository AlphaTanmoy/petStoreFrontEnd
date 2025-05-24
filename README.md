# PetStoreFrontEnd

This project was generated using [Angular CLI](https://github.com/angular/angular-cli) version 19.2.6.

# Live Link

https://pet-store-front-end-alpha.vercel.app/

## Development server

To start a local development server, run:

```bash
ng serve
```

Once the server is running, open your browser and navigate to `http://localhost:4200/`. The application will automatically reload whenever you modify any of the source files.

## Code scaffolding

Angular CLI includes powerful code scaffolding tools. To generate a new component, run:

```bash
ng generate component component-name
```

For a complete list of available schematics (such as `components`, `directives`, or `pipes`), run:

```bash
ng generate --help
```

## Building

To build the project run:

```bash
ng build
```

This will compile your project and store the build artifacts in the `dist/` directory. By default, the production build optimizes your application for performance and speed.

## Running unit tests

To execute unit tests with the [Karma](https://karma-runner.github.io) test runner, use the following command:

```bash
ng test
```

## Running end-to-end tests

For end-to-end (e2e) testing, run:

```bash
ng e2e
```

Angular CLI does not come with an end-to-end testing framework by default. You can choose one that suits your needs.

## Additional Resources

For more information on using the Angular CLI, including detailed command references, visit the [Angular CLI Overview and Command Reference](https://angular.dev/tools/cli) page.

# 🐾 PetStore Microservices Ecosystem

## 🔍 Live Preview
[![Live on Vercel](https://img.shields.io/badge/Live-Vercel-000?logo=vercel&logoColor=white)](https://pet-store-front-end-alpha.vercel.app/)

## 🌟 Features

- **Multi-role System** (MASTER, ADMIN, DOCTOR, SELLER, CUSTOMER, CUSTOMER_CARE, RAIDER)
- **JWT Authentication** with OAuth2 integration
- **Real-time Communication** using WebSockets
- **AI-powered** pet health recommendations
- **Multi-payment Gateway** (Stripe, Razorpay)
- **Document Verification** (KYC) with OCR
- **AWS S3 Integration** for media storage
- **Centralized Configuration** management
- **Comprehensive Monitoring** dashboards

## 🏗 Architecture

| Component               | Technology Stack                         |
|-------------------------|------------------------------------------|
| **Frontend**            | Angular 15, TypeScript, NgRx, PrimeNG    |
| **API Gateway**         | Spring Cloud Gateway                     |
| **Microservices**       | Spring Boot 3, Java 17                   |
| **Database**            | PostgreSQL with Flyway migrations        |
| **Messaging**           | RabbitMQ                                 |
| **Caching**             | Redis                                    |
| **Monitoring**          | Prometheus + Grafana, ELK Stack          |

## 📦 Microservices

| Service | Repository | Description |
|---------|------------|-------------|
| Authentication | [petStoreMicroService_authentication](https://github.com/AlphaTanmoy/petStoreMicroService_authentication) | JWT token generation, OAuth2 |
| Core | [petStoreMicroService_core](https://github.com/AlphaTanmoy/petStoreMicroService_core) | Central configuration |
| User | [petStoreMicroService_user](https://github.com/AlphaTanmoy/petStoreMicroService_user) | User profile management |
| Seller | [petStoreMicroService_seller](https://github.com/AlphaTanmoy/petStoreMicroService_seller) | Inventory management |
| Payment | [petStoreMicroService_payment](https://github.com/AlphaTanmoy/petStoreMicroService_payment) | Payment processing |
| Doctor | [petStoreMicroService_doctor](https://github.com/AlphaTanmoy/petStoreMicroService_doctor) | Veterinary services |
| KYC | [petStoreMicroService_kyc](https://github.com/AlphaTanmoy/petStoreMicroService_kyc) | Document verification |
| S3 | [petStoreMicroService_S3](https://github.com/AlphaTanmoy/petStoreMicroService_S3) | File storage |
| Management | [petStoreMicroService_management](https://github.com/AlphaTanmoy/petStoreMicroService_management) | System monitoring |
| Frontend | [petStoreFrontEnd](https://github.com/AlphaTanmoy/petStoreFrontEnd) | Angular |

## 🚀 Quick Start

### Prerequisites
- Java 21+
- Node 22+
- Docker
- PostgreSQL
- RabbitMQ
- Redis

### Installation
```bash
# Clone all repositories
mkdir petstore && cd petstore
for service in user admin authentication kyc core doctor S3 seller payment management; do
  git clone https://github.com/AlphaTanmoy/petStoreMicroService_${service}.git
done
git clone https://github.com/AlphaTanmoy/petStoreFrontEnd.git

# Start infrastructure
docker-compose -f core/docker-compose-infra.yml up -d

# Build services
mvn clean install -DskipTests

# Run services
cd authentication && mvn spring-boot:run
# Repeat for other services...

# Run frontend
cd petStoreFrontEnd
npm install
ng serve