🛒 BuddyCart — Full-Stack E-Commerce & Real-Time Communication Platform
🎯 Project Overview

BuddyCart is a full-stack e-commerce and chat platform built as a capstone project to demonstrate enterprise-grade architecture, end-to-end logic, and full-stack engineering skills.
Rather than focusing on a consumer-facing UI, the project emphasizes scalable backend design, clean data flow, and cross-layer integration between authentication, product management, and real-time communication.

🧱 System Architecture
Layer	Technology	Key Features
Frontend	React, React Router, Context API	Role-based routing, protected pages, integrated chat & showcase view
Backend	Node.js (Express 5), MongoDB (Mongoose)	RESTful APIs, ACL enforcement, JWT authentication
Real-Time	Socket.IO (namespace /chat)	Authenticated bi-directional messaging, product showcase exchange
Security	JWT (access tokens), role-based access control	Unified auth for both HTTP and WebSocket layers
Deployment	Render (API) + MongoDB Atlas + Vercel (client)	Production-ready CI/CD configuration
⚙️ Technical Highlights

🔐 Unified Authentication Layer — Single JWT verification for both API and WebSocket connections.

🧩 Role-Based Access Control (RBAC) — Admins manage all products; vendors manage their own; customers handle profiles only.

📦 Product Ownership Logic — Each product is bound to its creator (vendor/admin), ensuring clear resource separation.

🪄 Lazy Data Seeding — When the product database is empty, the server auto-fetches and populates demo data.

💬 Real-Time Chat Integration — Each chat room supports product showcasing, rating, and contextual conversation.

🎨 Personalized UI Behavior — User color theme adapts dynamically to interaction patterns (male/female category click preferences).

🧠 Clean Data Flow — End-to-end consistency between REST endpoints, database operations, and WebSocket updates.

🚀 Cloud Deployment — Backend deployed on Render; MongoDB Atlas database; frontend hosted separately for modular scaling.

🗺️ Data Flow Design

Every user action is traceable through a clear, consistent pipeline:

Frontend Trigger: React component dispatches a REST or WebSocket event (e.g., product CRUD or chat message).

Middleware Verification: requireAuth and verifyAccessToken decode JWT and inject real-time user context.

Controller Execution: Validates ownership and role before performing DB operations or emitting socket events.

Database / Socket Response: Updates stored data and pushes the result back to authorized clients in real time.

This transparent flow ensures that state is synchronized between all connected layers — API, database, and UI.

🧩 Core Modules

Auth Module: Register, login, and JWT-protected routes for all user roles.

Product Module: Full CRUD with ownership enforcement; admin can sync or reset datasets.

Chat Namespace: Authenticated socket connection with real-time product showcase, rating system, and state synchronization.

User Preference Module: Color theme personalization logic based on behavioral analytics.

🧠 Engineering Focus

BuddyCart demonstrates not just how to build a working product, but how to engineer a scalable system.
It reflects key production-level abilities:

Designing maintainable backend architecture

Implementing secure, real-time client communication

Managing complex data flow between multiple layers

Deploying and debugging full-stack systems in a cloud environment

📈 Future Improvements

Add unit/integration tests with Jest & Supertest.

Introduce Docker containerization for local and production parity.

Implement message persistence in chat namespace.

Expand recommendation logic via user preference analytics.

👨‍💻 Author

Yang Yanqing (杨彦青)
Full-Stack Web Developer | React · Node.js · MongoDB · Express
📍 Based in Berlin, Germany
🔗 GitHub: @Yang-Yanqing
