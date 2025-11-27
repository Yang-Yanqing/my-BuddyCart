<!-- CI & Coverage -->
![Run Server Tests](https://github.com/Yang-Yanqing/my-BuddyCart/actions/workflows/server-ci.yml/badge.svg)
[![codecov](https://codecov.io/github/Yang-Yanqing/my-BuddyCart/graph/badge.svg?token=J6NQDKXX20Y)](https://codecov.io/github/Yang-Yanqing/my-BuddyCart)

<!-- Tech Stack (core + credibility) -->
![Node.js](https://img.shields.io/badge/Node.js-20.x-339933?logo=node.js&logoColor=white)
![Express](https://img.shields.io/badge/Express-5.x-000000?logo=express&logoColor=white)
![MongoDB](https://img.shields.io/badge/MongoDB-Atlas-47A248?logo=mongodb&logoColor=white)
![Socket.IO](https://img.shields.io/badge/Realtime-Socket.IO-010101?logo=socket.io&logoColor=white)

<!-- Engineering Badges -->
![Dockerized](https://img.shields.io/badge/Backend-Dockerized-2496ED?logo=docker)
![Healthchecks](https://img.shields.io/badge/Health-%2Fhealth%20%7C%20%2Fready-brightgreen)

<!-- Deployment -->
![Render](https://img.shields.io/badge/API-Render-46E3B7?logo=render&logoColor=white)
![Fly.io](https://img.shields.io/badge/Frontend-Fly.io-007AFF?logo=flydotio&logoColor=white)

---

# 🛒 BuddyCart  
A minimal full-stack **e-commerce + real-time chat** platform designed to demonstrate:

- **Backend architecture**
- **Authentication / authorization**
- **Real-time communication**
- **Production-ready CI/CD**

Backend-first design focused on **clean data flow**, **secure APIs**, **reliable infrastructure**.

---

## 🚀 Features

- **JWT Authentication** for both REST API and WebSocket  
- **Role-Based Access Control** (admin / vendor / customer)  
- **Product CRUD** with ownership enforcement  
- **Real-time Chat** (`/chat` namespace with product sharing)  
- **Lazy Seeding** when DB is empty  
- **Modular API Architecture** (auth, products, vendor, checkout, preferences)  
- **Health & Ready Endpoints**  
  - `/health` – liveness  
  - `/ready` – readiness (checks Mongo connection)

---

## 🧱 System Overview

Client (React, Fly.io)
↕ REST / WebSocket
Server (Node + Express, Render)
↕
MongoDB Atlas (Cloud Database)
- JWT is validated for both HTTP routes and Socket.IO  
- Controllers enforce **role + ownership** rules  
- Socket.IO propagates product events in real time  
- CI pipeline runs tests + uploads coverage on every push  

---

## 📦 Modules

- **Auth** – registration, login, token refresh  
- **Products** – CRUD + admin overrides  
- **Chat** – real-time messaging with product preview  
- **Vendor** – shop management  
- **Checkout** – payment mock + order flow  
- **Admin** – user elevation + role request handling  

---

## 🛡 Production-Ready Engineering

- Automated CI (GitHub Actions)  
- Coverage reporting (Codecov)  
- Dockerized backend  
- Liveness + readiness probes  
- Cloud deployment across **Render**, **Fly.io**, **MongoDB Atlas**  
- Environment-based configuration + secret protection  

---

## 📈 Future Improvements

- E2E tests  
- Better recommendation logic  
- Persistent chat history  
- AWS App Runner deployment (in progress)

---

## 👨‍💻 Author  
**Yang Yanqing (杨彦青)** — Full-Stack Developer  
📍 Berlin, Germany  
🔗 GitHub: https://github.com/Yang-Yanqing
