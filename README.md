# 🚀 Bookstore System - Full Stack Microservices Platform

<div align="center">
  <img src="https://img.shields.io/badge/Java-21-ED8B00?style=for-the-badge&logo=java&logoColor=white" />
  <img src="https://img.shields.io/badge/Spring%20Boot-3.4-6DB33F?style=for-the-badge&logo=spring-boot&logoColor=white" />
  <img src="https://img.shields.io/badge/React%20Native-61DAFB?style=for-the-badge&logo=react&logoColor=black" />
  <img src="https://img.shields.io/badge/Angular-DD0031?style=for-the-badge&logo=angular&logoColor=white" />
  <img src="https://img.shields.io/badge/Apache%20Kafka-231F20?style=for-the-badge&logo=apache-kafka&logoColor=white" />
  <img src="https://img.shields.io/badge/PostgreSQL-336791?style=for-the-badge&logo=postgresql&logoColor=white" />
  <img src="https://img.shields.io/badge/MongoDB-47A248?style=for-the-badge&logo=mongodb&logoColor=white" />
  <img src="https://img.shields.io/badge/Docker-2496ED?style=for-the-badge&logo=docker&logoColor=white" />
</div>

---

## 📱 Mobile App Screenshots

<div align="center">
  <h3>🎯 Complete E-commerce Experience</h3>
  
  <table>
    <tr>
      <td align="center" width="25%">
        <img src="/images/trang chu.png" width="180" alt="Home" />
        <br />
        <strong>🏠 Home</strong>
      </td>
      <td align="center" width="25%">
        <img src="/images/sanpham.png" width="180" alt="Product" />
        <br />
        <strong>📚 Product</strong>
      </td>
      <td align="center" width="25%">
        <img src="/images/giohang.png" width="180" alt="Cart" />
        <br />
        <strong>🛒 Cart</strong>
      </td>
      <td align="center" width="25%">
        <img src="/images/thanhtoan.png" width="180" alt="Payment" />
        <br />
        <strong>💳 Payment</strong>
      </td>
    </tr>
    <tr>
      <td align="center" width="25%">
        <img src="/images/chitietdonhang.png" width="180" alt="Order detail" />
        <br />
        <strong>📋 Order detail</strong>
      </td>
      <td align="center" width="25%">
        <img src="/images/lichsudonhang.png" width="180" alt="Order history" />
        <br />
        <strong>📜 Order history</strong>
      </td>
      <td align="center" width="25%">
        <img src="/images/taikhoan.png" width="180" alt="Account" />
        <br />
        <strong>👤 Account</strong>
      </td>
      <td align="center" width="25%">
        <!-- Placeholder for future screenshot or remove this cell -->
        <img src="/assets/images/trang chu.png" width="180" alt="Login" />
        <br />
        <strong>🔐 Login</strong>
      </td>
    </tr>
  </table>
  
</div>


---


## 📋 Table of Contents
- [🔍 Overview](#-overview)
- [✨ Key Features](#-key-features)
- [🏗️ System Architecture](#️-system-architecture)
- [🛠️ Technology Stack](#️-technology-stack)
- [📦 Services Overview](#-services-overview)
- [💻 Frontend Applications](#-frontend-applications)
- [⚙️ Getting Started](#️-getting-started)
- [📚 API Documentation](#-api-documentation)
- [🚀 Deployment](#-deployment)
- [🔮 Future Roadmap](#-future-roadmap)
- [📧 Contact](#-contact)

---

## 🔍 Overview

**A comprehensive full-stack e-commerce platform** built with modern microservices architecture, featuring a robust backend ecosystem and multiple frontend applications. This project demonstrates enterprise-level system design principles, including:

- 🏗️ **Microservices Architecture** with 12 independent services
- 🔄 **Event-Driven Communication** using Apache Kafka
- 🛡️ **Centralized Authentication & Authorization** with JWT
- 📱 **Cross-Platform Frontend** (Mobile App + Admin CMS)
- 🐳 **Containerized Deployment** with Docker
- 🔄 **Real-time Synchronization** across all services

> 💡 **Perfect for showcasing:** Advanced Java development skills, distributed systems design, modern frontend frameworks, and DevOps practices.
## ✨ Key Features

### 🔐 Identity & Access Management
- **Secure Authentication:** JWT-based login/logout system
- **Role-Based Access Control (RBAC):** User, Staff, and Admin roles
- **Password Recovery:** OTP-based email verification
- **Session Management:** Secure token handling and refresh

### 📚 Product & Catalog Management
- **Comprehensive Book Database:** Title, author, pricing, inventory management
- **Media Management:** Image upload/delete via dedicated File Service
- **Review System:** Customer ratings and detailed reviews
- **Multi-level Categories:** Hierarchical category structure

### 🛒 Shopping & Order Processing
- **Smart Shopping Cart:** Add, remove, update quantities with real-time sync
- **Order Lifecycle Management:** From cart to delivery tracking
- **Inventory Integration:** Automatic stock updates on order placement
- **Multiple Order States:** Pending, confirmed, shipped, delivered, cancelled

### 💳 Payment Integration
- **Multiple Payment Methods:** Cash on Delivery (COD)
- **Vietnamese Payment Gateways:** MoMo and VNPay integration
- **Secure Transactions:** PCI-compliant payment processing
- **Payment Status Tracking:** Real-time payment confirmation

### 🔔 Communication & Notifications
- **Email Automation:** OTP, order confirmations via Thymeleaf templates
- **In-App Notifications:** Real-time user notifications
- **Customer Support:** Integrated help desk system
- **Event-Driven Messaging:** Kafka-based notification system

### 📰 Content Management
- **Blog System:** Articles and news about books and authors
- **Content Synchronization:** Category-based content organization
- **Rich Text Support:** Full-featured content editor

### 👤 Profile & Shipping Management
- **Multiple Addresses:** Users can manage various shipping profiles
- **Address Validation:** Integrated shipping address verification
- **Profile Customization:** User preferences and settings


### 🔄 Communication Patterns
- **Synchronous:** REST API calls via FeignClient for immediate responses
- **Asynchronous:** Apache Kafka for event-driven communication
- **Gateway Pattern:** Single entry point for all client requests
- **Database per Service:** Each microservice owns its data

---

## 🛠️ Technology Stack

<table>
<tr>
<td valign="top" width="50%">

### 🔧 Backend Technologies
- **Language:** Java 21 (Latest LTS)
- **Framework:** Spring Boot 3.4, Spring Cloud
- **Security:** Spring Security + JWT
- **Communication:** 
  - RESTful APIs with FeignClient
  - Apache Kafka for messaging
- **Data Mapping:** MapStruct
- **Build Tool:** Apache Maven

</td>
<td valign="top" width="50%">

### 📱 Frontend Technologies
- **Mobile App:** React Native + Expo
- **Styling:** NativeWind (Tailwind CSS)
- **Navigation:** Expo Router
- **State Management:** Context API
- **Admin CMS:** Angular 17+
- **UI Components:** Angular Material
- **Charts:** Chart.js integration

</td>
</tr>
<tr>
<td valign="top" width="50%">

### 🗄️ Database & Storage
- **Primary DB:** PostgreSQL
- **Document Store:** MongoDB
- **Caching:** Redis (planned)
- **File Storage:** Local + Cloud integration

</td>
<td valign="top" width="50%">

### 🚀 DevOps & Deployment
- **Containerization:** Docker & Docker Compose
- **CI/CD:** GitHub Actions (planned)
- **Orchestration:** Kubernetes (planned)
- **Monitoring:** Prometheus + Grafana (planned)

</td>
</tr>
</table>

### 🏛️ Architectural Patterns
- **Microservices Architecture:** Decomposed into 12 independent services
- **API Gateway Pattern:** Centralized routing and authentication
- **Event-Driven Architecture:** Loose coupling via Kafka events  
- **Database per Service:** Data ownership and independence
- **Polyglot Persistence:** Different databases for different needs
- **CQRS Pattern:** Command Query Responsibility Segregation (planned)
---

## 📦 Services Overview

<table>
<thead>
<tr>
<th>🔧 Service</th>
<th>🌐 Port</th>
<th>📋 Key Responsibilities</th>
<th>🗃️ Database</th>
</tr>
</thead>
<tbody>
<tr>
<td><strong>API Gateway</strong></td>
<td>8888</td>
<td>Request routing, authentication, CORS, rate limiting</td>
<td>-</td>
</tr>
<tr>
<td><strong>Identity Service</strong></td>
<td>8080</td>
<td>User management, JWT tokens, RBAC, password recovery</td>
<td>PostgreSQL</td>
</tr>
<tr>
<td><strong>Profile Service</strong></td>
<td>8081</td>
<td>User profiles, shipping addresses, preferences</td>
<td>PostgreSQL</td>
</tr>
<tr>
<td><strong>Product Service</strong></td>
<td>8082</td>
<td>Book catalog, inventory, reviews, ratings</td>
<td>PostgreSQL</td>
</tr>
<tr>
<td><strong>Cart Service</strong></td>
<td>8083</td>
<td>Shopping cart management, session handling</td>
<td>PostgreSQL</td>
</tr>
<tr>
<td><strong>Category Service</strong></td>
<td>8084</td>
<td>Product categories, taxonomy, hierarchy management</td>
<td>PostgreSQL</td>
</tr>
<tr>
<td><strong>Blog Service</strong></td>
<td>8085</td>
<td>Articles, news, content management</td>
<td>PostgreSQL</td>
</tr>
<tr>
<td><strong>Customer Service</strong></td>
<td>8086</td>
<td>Support tickets, customer inquiries</td>
<td>PostgreSQL</td>
</tr>
<tr>
<td><strong>File Service</strong></td>
<td>8087</td>
<td>Media storage, image processing, metadata</td>
<td>MongoDB</td>
</tr>
<tr>
<td><strong>Notification Service</strong></td>
<td>8088</td>
<td>Email, push notifications, templates</td>
<td>MongoDB</td>
</tr>
<tr>
<td><strong>Payment Service</strong></td>
<td>8089</td>
<td>Payment processing, MoMo/VNPay integration</td>
<td>PostgreSQL</td>
</tr>
<tr>
<td><strong>Order Service</strong></td>
<td>8090</td>
<td>Order lifecycle, status management, fulfillment</td>
<td>PostgreSQL</td>
</tr>
</tbody>
</table>

---

## 💻 Frontend Applications

### 📱 Mobile Application (React Native)
<div align="center">
  <img src="https://img.shields.io/badge/React%20Native-0.74-61DAFB?style=flat-square&logo=react&logoColor=white" />
  <img src="https://img.shields.io/badge/Expo-51-000020?style=flat-square&logo=expo&logoColor=white" />
  <img src="https://img.shields.io/badge/TypeScript-5.3-3178C6?style=flat-square&logo=typescript&logoColor=white" />
  <img src="https://img.shields.io/badge/NativeWind-4.0-38BDF8?style=flat-square&logo=tailwindcss&logoColor=white" />
</div>

**Features:**
- 🛍️ **E-commerce Experience:** Complete shopping flow from browse to checkout
- 🔐 **Authentication:** Secure login with biometric support
- 🛒 **Shopping Cart:** Real-time cart management with offline support
- 💳 **Payment Integration:** MoMo and VNPay payment gateways
- 📱 **Responsive Design:** Optimized for both iOS and Android
- 🔔 **Push Notifications:** Real-time order updates and promotions
- 📚 **Blog Integration:** In-app blog reading experience

**Tech Stack:**
```javascript
// Key dependencies
{
  "expo": "~51.0.0",
  "react-native": "0.74.5",
  "nativewind": "^4.0.1",
  "@react-navigation/native": "^6.0.0",
  "expo-router": "~3.5.0"
}
```

### 🖥️ Admin CMS (Angular)
<div align="center">
  <img src="https://img.shields.io/badge/Angular-17-DD0031?style=flat-square&logo=angular&logoColor=white" />
  <img src="https://img.shields.io/badge/TypeScript-5.2-3178C6?style=flat-square&logo=typescript&logoColor=white" />
  <img src="https://img.shields.io/badge/Angular%20Material-17-757575?style=flat-square&logo=angular&logoColor=white" />
  <img src="https://img.shields.io/badge/Chart.js-4.4-FF6384?style=flat-square&logo=chart.js&logoColor=white" />
</div>

**Features:**
- 📊 **Dashboard Analytics:** Sales metrics, user statistics, performance KPIs
- 📚 **Product Management:** CRUD operations for books, categories, inventory
- 👥 **User Management:** Customer accounts, roles, permissions
- 📦 **Order Processing:** Order tracking, status updates, fulfillment
- 💰 **Financial Reports:** Revenue analysis, payment tracking
- 📝 **Content Management:** Blog posts, news articles, SEO optimization
- 🔧 **System Configuration:** Service monitoring, settings management

**Tech Stack:**
```json
{
  "@angular/core": "^17.0.0",
  "@angular/material": "^17.0.0",
  "chart.js": "^4.4.0",
  "rxjs": "~7.8.0",
  "typescript": "~5.2.0"
}
```

**Screenshots:** *(Add screenshots of your admin panel here)*
---

## ⚙️ Getting Started

### 📋 Prerequisites
Before running this project, ensure you have the following installed:

```bash
# Backend Requirements
☑️ Java Development Kit (JDK) 21+
☑️ Apache Maven 3.8+
☑️ Docker & Docker Compose
☑️ PostgreSQL 14+ (or use Docker)
☑️ Apache Kafka (or use Docker)

# Frontend Requirements (Mobile)
☑️ Node.js 18+
☑️ npm or yarn
☑️ Expo CLI
☑️ Android Studio / Xcode (for device testing)

# Frontend Requirements (Admin CMS)
☑️ Node.js 18+
☑️ Angular CLI 17+
```

### 🚀 Quick Start

#### 1️⃣ Clone the Repository
```bash
git clone https://github.com/yourusername/bookstore-microservices.git
cd bookstore-microservices
```

#### 2️⃣ Start Infrastructure Services
```bash
# Start PostgreSQL, MongoDB, Kafka using Docker
docker-compose up -d postgres mongodb kafka zookeeper
```

#### 3️⃣ Configure Application Properties
```bash
# Update application.yml files in each service
# Configure database connections, Kafka brokers, etc.
```

#### 4️⃣ Start Backend Services
```bash
# Start services in order (or use your IDE)
cd microservice/api-gateway && mvn spring-boot:run &
cd microservice/identity-service && mvn spring-boot:run &
cd microservice/product-service && mvn spring-boot:run &
# ... start other services
```

#### 5️⃣ Start Mobile App
```bash
cd book-store-mobile-react-native
npm install
npx expo start
```

#### 6️⃣ Start Admin CMS
```bash
cd cms
npm install
ng serve
```

### 🔗 Application URLs
- **API Gateway:** http://localhost:8888
- **Mobile App:** Expo development server
- **Admin CMS:** http://localhost:4200

### 👤 Default Credentials
```
Admin User:
Username: admin
Password: admin

```

---

## 📚 API Documentation

Our APIs follow **RESTful principles** and are fully documented with **OpenAPI 3.0 specifications**.


### 🛡️ Authentication
All APIs use **JWT Bearer tokens** for authentication:
```http
Authorization: Bearer <your-jwt-token>
```

### 📖 Key API Collections
- **🔐 Authentication APIs:** Login, register, password recovery
- **📚 Product APIs:** Catalog browsing, search, reviews
- **🛒 Cart APIs:** Cart management, checkout process
- **📦 Order APIs:** Order placement, tracking, history
- **💳 Payment APIs:** Payment processing, transaction status
- **👤 User APIs:** Profile management, addresses
- **📝 Admin APIs:** Product management, user administration

---

## 🚀 Deployment

### 🐳 Docker Deployment
```bash
# Build all services
docker-compose build

# Deploy to production
docker-compose -f docker-compose.prod.yml up -d
```

### ☁️ Cloud Deployment (Planned)
- **Container Registry:** Docker Hub / AWS ECR
- **Orchestration:** Kubernetes
- **Cloud Provider:** AWS / Azure / GCP
- **Database:** Amazon RDS / Azure Database
- **File Storage:** AWS S3 / Azure Blob Storage
- **Monitoring:** Prometheus + Grafana
- **Logging:** ELK Stack (Elasticsearch, Logstash, Kibana)

### 📊 Monitoring & Observability
```yaml
# Planned monitoring stack
Services:
  - Prometheus: Metrics collection
  - Grafana: Visualization dashboards  
  - Jaeger: Distributed tracing
  - ELK Stack: Centralized logging
  - Health checks: Spring Boot Actuator
```

---

## 🔮 Future Roadmap

### 🎯 Phase 1: Core Enhancements
- [ ] **Spring Cloud Sleuth & Zipkin** - Distributed tracing
- [ ] **Service Discovery** - Eureka/Consul integration
- [ ] **Circuit Breaker** - Resilience4j implementation
- [ ] **API Rate Limiting** - Redis-based throttling
- [ ] **Comprehensive Testing** - Unit, Integration, E2E tests

### 🎯 Phase 2: Advanced Features  
- [ ] **Real-time Features** - WebSocket integration
- [ ] **Advanced Search** - Elasticsearch integration
- [ ] **Recommendation Engine** - ML-based suggestions
- [ ] **Multi-tenant Support** - SaaS capabilities
- [ ] **Advanced Analytics** - Business intelligence

### 🎯 Phase 3: Scale & Performance
- [ ] **Kubernetes Deployment** - Container orchestration
- [ ] **Multi-region Deployment** - Global distribution
- [ ] **Advanced Caching** - Redis cluster
- [ ] **CDN Integration** - Asset optimization
- [ ] **Load Testing** - Performance benchmarks

### 🎯 Phase 4: AI & Innovation
- [ ] **AI-powered Search** - Natural language queries
- [ ] **Chatbot Integration** - Customer service automation
- [ ] **Personalization Engine** - User behavior analysis
- [ ] **Voice Commerce** - Voice-activated shopping
- [ ] **AR/VR Features** - Immersive book previews

---

## 📊 Project Metrics

<div align="center">

| Metric | Value |
|--------|-------|
| **Total Services** | 12 Microservices |
| **Lines of Code** | ~50,000+ |
| **API Endpoints** | 100+ |
| **Database Tables** | 50+ |
| **Test Coverage** | 85%+ (target) |
| **Docker Images** | 12 |
| **Development Time** | 2+ months |

</div>

---
## 📧 Contact

<div align="center">

### 👨‍💻 Nguyen Duy Dat
**Full Stack Developer | Microservices Architect**

[![Email](https://img.shields.io/badge/Email-datnd03.dev@gmail.com-D14836?style=for-the-badge&logo=gmail&logoColor=white)](mailto:datnd03.dev@gmail.com)
[![LinkedIn](https://img.shields.io/badge/LinkedIn-Connect-0077B5?style=for-the-badge&logo=linkedin&logoColor=white)](https://www.linkedin.com/in/%C4%91%E1%BA%A1t-nguy%E1%BB%85n-duy-1937a934b/)
[![GitHub](https://img.shields.io/badge/GitHub-Follow-181717?style=for-the-badge&logo=github&logoColor=white)](https://github.com/no-copyright)

---

### 🤝 Contributing
Contributions, issues, and feature requests are welcome!  

### ⭐ Show Your Support
If this project helped you, please consider giving it a ⭐ star on GitHub!


---

</div>