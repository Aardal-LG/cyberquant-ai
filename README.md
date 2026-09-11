# CyberQuant AI — Continuous Cyber Risk Quantification & Investment Optimization

Welcome to the **CyberQuant AI** repository! This platform quantifies cyber risk into financial metrics (Expected Annual Loss, 95% VaR, 95% CVaR) and optimizes cybersecurity investments under budget constraints using Return on Security Investment (ROSI).

---

## 1. Project Overview & Architecture

CyberQuant AI ingests security data from multiple sources (NVD, CISA KEV, SIEM, EDR, CMDB), constructs an Asset Security Graph, predicts exploit probabilities, computes Monte Carlo loss distributions, and outputs optimal security control recommendations.

```
Data Sources (NVD, CISA KEV, Nmap, SIEM, EDR)
    ↓
Data Ingestion & Normalization Framework (Member 1)
    ↓
Asset Security Graph & Attack Paths (Member 2 — Neo4j)
    ↓
Threat Intelligence & Anomaly Engine (Member 3 — GBDT & DBSCAN)
    ↓
Financial Risk Engine (Member 4 — Monte Carlo EAL, VaR, CVaR)
    ↓
Investment Optimizer (Member 4 — OR-Tools MILP & ROSI)
    ↓
FastAPI Unified Integration REST API (Member 1)
    ↓
Dashboards (Member 5 Executive & Member 6 Topology)
```

---

## 2. Team Member Responsibilities & Division of Labor

- **Member 1 (Backend/Integration)**: System Architecture, Master `mock_data.json` contract, Unified FastAPI REST API, Data Ingestion engine, `seed_demo.py`, Database/Redis foundation, Docker orchestration, and Integration gateways.
- **Member 2**: Neo4j security graph database, attack path algorithms, and compliance mapping matrix.
- **Member 3**: GBDT/XGBoost exploit probability predictions and DBSCAN anomaly detection models.
- **Member 4**: Monte Carlo financial simulation engine (EAL, 95% VaR, 95% CVaR) and OR-Tools control selection optimizer.
- **Member 5**: Executive & Compliance Next.js Dashboard.
- **Member 6**: Technical Topology & Graph Visualization Next.js Dashboard.

---

## 3. Master `mock_data.json` Data Contract (v1.0)

The root [`mock_data.json`](file:///c:/Users/TANVI%20SINGH/OneDrive/Desktop/cyberquant-ai/mock_data.json) serves as the single source of truth contract for all team members.

Top-Level Schema:
- `schema_version`: `"1.0"`
- `assets`: 20 realistic assets (servers, DBs, cloud storage, endpoints) with security posture and vulnerability IDs.
- `vulnerabilities`: 5 CVEs (Log4Shell, MOVEit RCE, Outlook NTLM, Windows Wi-Fi, runc breakout) with CVSS, CISA KEV flag, exploit probability, and age.
- `network_connections`: Graph connections between assets (ports, protocols, relationship types).
- `users`: User access mappings and privilege levels.
- `risk_metrics`: Technical risk score, Expected Annual Loss ($1,250,000 baseline), 95% VaR ($2,100,000), 95% CVaR ($2,850,000).
- `controls`: 6 security controls with costs, risk reduction factors, and framework mappings (NIST 800-53, ISO 27001, CIS Controls).
- `optimization_results`: Pre/post-control EAL, net risk reduction, and ROSI calculation output (~150.81%).

---

## 4. Quickstart & Local Setup Guide

### Step 1: Clone & Configure Environment
Create a local `.env` file from `.env.example`:
```bash
cp .env.example .env
```

### Step 2: Set Up Python Virtual Environment
```bash
cd backend
python -m venv venv

# Windows PowerShell:
.\venv\Scripts\Activate.ps1

# Linux / macOS:
source venv/bin/activate

pip install -r requirements.txt
```

### Step 3: Seed & Validate Demo Contract
Run the validation and seeding script:
```bash
python seed_demo.py
```

### Step 4: Launch FastAPI Server
```bash
uvicorn app.main:app --host 0.0.0.0 --port 8000 --reload
```
Interactive API Documentation will be available at:
- Swagger UI: `http://localhost:8000/api/v1/docs`
- ReDoc: `http://localhost:8000/api/v1/redoc`
- Health Check: `http://localhost:8000/health`

---

## 5. API Endpoint Reference (`/api/v1`)

| Method | Endpoint | Description | Integration Owner |
|---|---|---|---|
| `GET` | `/health` | System health check | Member 1 |
| `GET` | `/api/v1/assets` | List inventory assets & risk scores | Member 1 |
| `GET` | `/api/v1/assets/{id}` | Get single asset details | Member 1 |
| `GET` | `/api/v1/threats/anomalies` | ML anomalies & GBDT exploit predictions | Member 3 |
| `GET` | `/api/v1/risk/financial` | Monte Carlo metrics (EAL, VaR, CVaR) | Member 4 |
| `POST` | `/api/v1/optimize` | OR-Tools control optimizer & ROSI | Member 4 |
| `GET` | `/api/v1/compliance` | Compliance framework mapping matrix | Member 2 |
| `GET` | `/api/v1/topology` | Neo4j graph nodes, edges & attack paths | Member 2 |
| `POST` | `/api/v1/ingest` | Data ingestion & normalization endpoint | Member 1 |

---

## 6. Container Orchestration (Docker Compose)

To launch the complete infrastructure (FastAPI Backend, PostgreSQL, Redis, Neo4j):

```bash
# Build and start all services in detached mode
docker compose up -d --build

# View container logs
docker compose logs -f backend

# Stop all services
docker compose down
```

---

## 7. Integration Guidelines for Team Members

- **Member 2 (Neo4j & Topology)**: Implement your graph query logic inside [`backend/app/services/topology_service.py`](file:///c:/Users/TANVI%20SINGH/OneDrive/Desktop/cyberquant-ai/backend/app/services/topology_service.py).
- **Member 3 (ML Threat Intelligence)**: Plug your trained GBDT and DBSCAN models into [`backend/app/services/threat_service.py`](file:///c:/Users/TANVI%20SINGH/OneDrive/Desktop/cyberquant-ai/backend/app/services/threat_service.py).
- **Member 4 (Monte Carlo & Optimization)**: Replace mock calculations in [`backend/app/services/risk_service.py`](file:///c:/Users/TANVI%20SINGH/OneDrive/Desktop/cyberquant-ai/backend/app/services/risk_service.py) and [`backend/app/services/optimize_service.py`](file:///c:/Users/TANVI%20SINGH/OneDrive/Desktop/cyberquant-ai/backend/app/services/optimize_service.py) with your Monte Carlo engine and OR-Tools MILP solver.
