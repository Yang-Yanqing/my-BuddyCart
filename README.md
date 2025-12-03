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
    subgraph Client
        B[Browser\nReact SPA]
    end

    subgraph Edge[AWS Edge]
        CF[CloudFront\nCDN & HTTPS]
    end

    subgraph App[AWS / Render Layer]
        API[BuddyCart API\nNode.js + Express 5\nDocker on EC2]
    end

    subgraph Data[Data Layer]
        DB[(MongoDB Atlas\nCluster)]
    end

    B -->|HTTPS| CF
    CF -->|/api/*| API
    API -->|MongoDB Driver| DB
    B <-->|WebSocket\n(Socket.IO)| API



## 👨‍💻 Author

**Yang Yanqing (杨彦青)** — Full-Stack Developer  
📍 Berlin, Germany  
🔗 GitHub: https://github.com/Yang-Yanqing
