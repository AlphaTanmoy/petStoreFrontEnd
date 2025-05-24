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