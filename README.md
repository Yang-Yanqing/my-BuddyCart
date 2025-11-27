<!-- Tests & Coverage -->
![Run Server Tests](https://github.com/Yang-Yanqing/my-BuddyCart/actions/workflows/server-ci.yml/badge.svg)
[![codecov](https://codecov.io/github/Yang-Yanqing/my-BuddyCart/graph/badge.svg?token=J6NQDKXX20Y)](https://codecov.io/github/Yang-Yanqing/my-BuddyCart)

<!-- Tech Stack -->
![Node.js](https://img.shields.io/badge/Node.js-20.x-339933?logo=node.js&logoColor=white)
![Express](https://img.shields.io/badge/Express-5.x-000000?logo=express&logoColor=white)
![MongoDB](https://img.shields.io/badge/MongoDB-Atlas-47A248?logo=mongodb&logoColor=white)
![Socket.IO](https://img.shields.io/badge/Socket.IO-Realtime-010101?logo=socket.io&logoColor=white)
![Vitest](https://img.shields.io/badge/Tests-Vitest-6E9F18?logo=vitest&logoColor=white)
![GitHub Actions](https://img.shields.io/badge/CI-GitHub%20Actions-2088FF?logo=githubactions&logoColor=white)
![Render](https://img.shields.io/badge/Deploy-Render-46E3B7?logo=render&logoColor=white)

---

# 🛒 BuddyCart  
A minimal full-stack **e-commerce + real-time chat** platform, designed to demonstrate **backend architecture**, **authentication logic**, and **real-time communication** using Socket.IO.

Backend-first design.  
Focus on **clean data flow**, **secure APIs**, and **production-ready CI/CD**.

---

## 🚀 Features

- **JWT Authentication** (shared by REST API + WebSocket)
- **Role-Based Access Control** (admin/vendor/customer)
- **Product CRUD** with ownership enforcement
- **Real-time Chat** with Socket.IO (product sharing, rating, contextual messaging)
- **Lazy Data Seeding** when DB is empty
- **Modular API Architecture** (auth, products, chat, preferences)

---

## 🧱 System Overview

Client (React)
↕ REST / WebSocket
Server (Node + Express)
↕
MongoDB Atlas


- JWT is verified for both HTTP routes and Socket.IO connections  
- Controllers enforce role + ownership before DB operations  
- Real-time events broadcast updates to authorized clients  
- CI pipeline runs tests & uploads coverage automatically  

---

## 📦 Modules

- **Auth** – login, registration, token verification  
- **Products** – CRUD, admin overrides, ownership logic  
- **Chat** – real-time namespace `/chat` with product showcase  
- **Preferences** – color theme + simple behavioral analytics  

---

## 🎯 Why This Project Matters

BuddyCart highlights practical engineering skills:

- Designing **secure** & **scalable** backend systems  
- Managing **real-time** state sync across API + WebSocket  
- Building **clean controllers** with consistent data flow  
- Cloud deployment using **Render + MongoDB Atlas**  
- Setting up **professional CI/CD** with tests + coverage  

---

## 📈 Future Improvements

- Add integration tests  
- Docker support  
- Persistent chat history  
- Better recommendation logic  

---

## 👨‍💻 Author  
Yang Yanqing (杨彦青) — Full-Stack Developer  
📍 Berlin, Germany  
🔗 GitHub: https://github.com/Yang-Yanqing
