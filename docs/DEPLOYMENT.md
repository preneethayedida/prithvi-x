# PRITHVI-X Deployment Guide

PRITHVI-X supports both local multi-process execution and full containerized deployment via Docker Compose.

---

## 1. Local Development Execution

### Prerequisites
- Node.js v18+ or v20+
- Python 3.11+ or 3.12+
- npm v9+

### Step-by-Step Launch
1. **Clone and Configure Environment:**
   ```bash
   cp .env.example .env
   ```
2. **Install Root and Microservice Dependencies:**
   ```bash
   npm run install:all
   ```
3. **Set Up Python Analytics Virtual Environment:**
   ```bash
   cd analytics
   python -m venv venv
   .\venv\Scripts\pip install -r requirements.txt
   cd ..
   ```
4. **Launch Entire Stack Concurrently:**
   ```bash
   # Starts Backend (port 5000) and Frontend (port 5173)
   npm run dev
   ```
   In a second terminal:
   ```bash
   cd analytics
   .\venv\Scripts\uvicorn.exe app.main:app --port 8000
   ```
5. **Access Application:**
   - Frontend UI: `http://localhost:5173`
   - Backend API: `http://localhost:5000/api/health`
   - Python FastAPI Docs: `http://localhost:8000/docs`

---

## 2. Docker & Containerized Orchestration

To run the entire system (MongoDB, Python Analytics, Backend, Frontend Nginx):
```bash
docker-compose up --build -d
```
All containers communicate using internal Docker network service names:
- `http://localhost:5173` (Frontend Nginx reverse proxy)
- `http://localhost:5000` (Backend API)
- `http://localhost:8000` (Analytics FastAPI)
- `localhost:27017` (MongoDB)

---

## 3. Cloud Deployment Targets

### Render / Railway (PaaS)
- Deploy `/backend` as a Node web service (`npm start`).
- Deploy `/analytics` as a Python web service (`uvicorn app.main:app --host 0.0.0.0 --port $PORT`).
- Deploy `/frontend` as a Static Site with build command `npm run build` and publish directory `dist`.
- Set `MONGO_URI` to a free MongoDB Atlas connection string.

### AWS / OCI (VPS / EC2)
- Clone repository onto Ubuntu instance.
- Run `docker compose up -d`.
- Configure Nginx reverse proxy with SSL (`certbot`).
