# 🛒 BuddyCart — Full-Stack E-Commerce & Real-Time Communication Platform

<!-- CI & Coverage -->
![CI](https://github.com/Yang-Yanqing/my-BuddyCart/actions/workflows/server-ci.yml/badge.svg)
[![Coverage](https://codecov.io/github/Yang-Yanqing/my-BuddyCart/graph/badge.svg?token=J6NQDKXX20Y)](https://codecov.io/github/Yang-Yanqing/my-BuddyCart)

### 🌍 AWS Deployment (Frontend)

BuddyCart is a backend-first full-stack **e-commerce + real-time chat** platform designed to demonstrate
enterprise-grade architecture, clean data flow, reliable automation, and production-ready engineering.

It focuses on **secure APIs**, **authentication/authorization**, **real-time communication**, and a complete CI/CD workflow across cloud environments.

---

## 💻 Tech Stack (Production Grade)

**Frontend:** React · Context API · Fly.io  
**Backend:** Node.js (Express 5) · REST API · WebSocket (Socket.IO)  
**Database:** MongoDB Atlas (Cloud)  
**Infra / DevOps:** Docker · GitHub Actions · Render (API) · Fly.io (Client)  
**Security:** JWT Auth · RBAC · Ownership Enforcement  
**Quality:** Automated Tests · Code Coverage · Health & Readiness Probes

---

## 🚀 Features

- **JWT Authentication** (HTTP + WebSocket)
- **Role-Based Access Control** (admin / vendor / customer)
- **Product CRUD** with strict ownership validation
- **Real-Time Chat System** (`/chat` namespace with product sharing)
- **Lazy DB Seeding** on first boot
- **Modular API Architecture** (auth, products, vendor, checkout, preferences)
- **Health & Readiness Endpoints**  
  - `/health` → liveness  
  - `/ready` → MongoDB connection check

---

## 🧱 System Overview

Client (React, Fly.io)
↕ REST / WebSocket
Server (Node.js + Express 5, Render)
↕
MongoDB Atlas (Cloud Database)

- JWT validated consistently for HTTP routes and Socket.IO events  
- Controllers enforce **role + ownership** rules  
- Socket.IO propagates product updates in real time  
- CI pipeline runs tests + uploads coverage + validates build on every push  

---

## 📦 Modules

- **Auth** → registration, login, token refresh  
- **Products** → CRUD + admin overrides  
- **Chat** → live messaging, product preview sharing  
- **Vendor** → shop configuration & product ownership  
- **Checkout** → mock payment + order flow  
- **Admin** → user elevation & role request processing  

---

## 🛡 Production-Ready Engineering

- Automated CI pipeline (GitHub Actions)  
- Test coverage reporting (Codecov)  
- Dockerized backend application  
- Health & readiness probes  
- Multi-cloud deployment across **Render**, **Fly.io**, **MongoDB Atlas**  
- Environment-based configuration & secret management  

---

## 📈 Future Improvements

- End-to-End tests  
- Product recommendation logic  
- Persistent chat history  
- Optional AWS App Runner deployment  

---

## 🧱 Architecture Overview

```mermaid
flowchart LR
    subgraph Client[Client Layer]
        B[Browser\nReact SPA]
    end

    subgraph Edge[AWS Edge Layer]
        CF[CloudFront\nCDN & HTTPS]
    end

    subgraph FE[AWS Frontend Hosting]
        S3[S3 Bucket\nStatic React Build]
    end

    subgraph App[AWS Application Layer]
        API[BuddyCart API\nNode.js + Express 5\nDocker on EC2]
    end

    subgraph Data[Data Layer]
        DB[(MongoDB Atlas\nCluster)]
    end

    B -->|HTTPS| CF
    CF -->|GET index.html / static assets| S3
    CF -->|/api/*| API
    API -->|MongoDB Driver| DB
    B <-->|WebSocket / Socket.IO| API
```
---

## 🗄 Data Model (MongoDB Atlas)

```mermaid
erDiagram
    USER {
      string  _id
      string  name
      string  email
      string  passwordHash
      string  role          
      boolean isVerified
      date    createdAt
    }

    SHOP {
      string  _id
      string  name
      string  slug
      string  ownerId       
      date    createdAt
    }

    PRODUCT {
      string  _id
      number  externalId
      string  title
      string  category
      number  price
      number  stock
      number  rating
      string  availabilityStatus
      string  ownerId        
      string  shopId        
      date    createdAt
    }

    REVIEW {
      string  _id
      string  productId     
      number  rating
      string  comment
      string  reviewerName
      string  reviewerEmail
      date    createdAt
    }

    ROLE_REQUEST {
      string  _id
      string  userId         
      string  requestedRole  
      string  status         
      string  reviewStatus  
      date    reviewDate
    }

    ORDER {
      string  _id
      string  userId        
      number  totalAmount
      string  status        
      date    createdAt
    }

    ORDER_ITEM {
      string  _id
      string  orderId        
      string  productId      
      number  quantity
      number  unitPrice
    }

    CHAT_MESSAGE {
      string  _id
      string  roomId
      string  senderId       
      string  text
      string  productId      
      date    createdAt
    }

    %% --- Relationships ---

    USER      ||--|| SHOP          : "owns (vendor has one shop)"
    USER      ||--o{ ROLE_REQUEST  : "submits"
    USER      ||--o{ PRODUCT       : "owns (legacy owner)"
    SHOP      ||--o{ PRODUCT       : "lists products"
    PRODUCT   ||--o{ REVIEW        : "has"
    USER      ||--o{ ORDER         : "places"
    ORDER     ||--o{ ORDER_ITEM    : "contains"
    USER      ||--o{ CHAT_MESSAGE  : "sends"
    PRODUCT   ||--o{ CHAT_MESSAGE  : "shared-in"
```
---

## 🔁 Checkout Flow

```mermaid
sequenceDiagram
    participant U as User (Browser)
    participant C as Client (React)
    participant A as API (Express)
    participant DB as MongoDB Atlas
    participant P as PayPal API

    U->>C: Click "Checkout"
    C->>A: POST /api/orders
    A->>DB: Validate products
    DB-->>A: OK
    A->>P: Create PayPal payment
    P-->>A: Approval URL
    A-->>C: Order + redirect URL
    U->>P: Approve payment
    P->>A: Webhook: success
    A->>DB: Update order status=paid
    A-->>C: (WebSocket) status update
```
---

## 👨‍💻 Author

**Yang Yanqing (杨彦青)** — Full-Stack Developer  
📍 Berlin, Germany  
🔗 GitHub: https://github.com/Yang-Yanqing
