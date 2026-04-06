# 🎧 Beatflow

Beatflow is a modern demo music streaming platform showcasing a microservices architecture, real-time playback, and a polished frontend experience.

- 👉 Live demo: https://beatflow.akurilo.com
- 🎥 Demo video: (add your recording here)

## ✨ Features

- 🔐 JWT-based authentication (Auth service)
- 🎵 Music catalog browsing (Catalog service)
- ▶️ Secure playback via dedicated Playback service
- 📡 Streaming with range requests (audio streaming backend)
- 🧠 Playback session handling & access control
- ⚡ Kafka integration (event-ready architecture)
- 💅 Modern React + Zustand frontend
- 🎛 Global player with progress, seek, volume, queue
- 🔄 Multi-tab sync playback

## 🧱 Architecture

Beatflow is built as a microservices system:

- Auth Service — authentication & JWT issuing
- Catalog Service — tracks, artists, metadata
- Playback Service — streaming, access checks, sessions
- Common Module — shared security & utilities

Infrastructure:

- PostgreSQL
- Redis
- Kafka
- MinIO (object storage)

## 🖥 Tech Stack

Backend

- Java 21
- Spring Boot 4
- Spring Security
- Spring Data JPA
- Flyway
- Kafka

Frontend

- React
- TypeScript
- Zustand
- Vite

DevOps

- Docker & Docker Compose
- MinIO (S3-compatible storage)

## 🚀 Running locally

```bash
docker compose up --build
```

## Services:

- Auth → http://localhost:8181
- Catalog → http://localhost:8182
- Playback → http://localhost:8183
- Analytics → http://localhost:8184
- Frontend → http://localhost:5173

---

## ⚠️ Disclaimer

This project is a **technical demo**.

- Music used is **royalty-free or demo-only**
- No ownership of third-party audio is claimed
- Intended for portfolio and educational purposes only

See:

- `/credits`
- `/disclaimer`

---

## 📌 Notes

- This is not a production-ready streaming platform
- Focus is on architecture, system design, and UX
- Built as a portfolio project

---

## 👨‍💻 Author

**Andrei Kurilo**

- GitHub: https://github.com/andreikurilo
- LinkedIn: https://www.linkedin.com/in/akurilo
- X: https://x.com/andreikurilo
