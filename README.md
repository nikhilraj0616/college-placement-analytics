# College Placement Analytics

A full-stack web application for analytics on college placements — covering placement rate, salary, branch analysis, CGPA correlation, and recruitment trends.

**Backend**: Python + FastAPI + SQLite  
**Frontend**: React (Vite) + Recharts  
**Auth**: JWT (3 roles: admin / management / student)  
**Export**: PDF and Excel from every analytics page

---

## Quick Start

### Prerequisites

| Tool | Version |
|---|---|
| Python | 3.10+ |
| Node.js | 18+ |
| npm | 9+ |

---

### 1. Backend Setup

```bash
cd backend

# Create and activate virtual environment
python -m venv venv

# Windows
venv\Scripts\activate

# macOS / Linux
source venv/bin/activate

# Install dependencies
pip install -r requirements.txt

# Seed the database (creates demo users + loads 30 sample placement records)
python seed.py

# Start the API server
uvicorn main:app --reload --port 8000
```

**API is now running at** → http://localhost:8000  
**Swagger UI (interactive docs)** → http://localhost:8000/docs

---

### 2. Frontend Setup

Open a **new terminal**:

```bash
cd frontend
npm install
npm run dev
```

**App is now running at** → http://localhost:5173

---

## Demo Login Accounts

| Username | Password | Role | Access |
|---|---|---|---|
| `admin` | `admin123` | Admin | Full access (upload, CRUD, export, all dashboards) |
| `mgmt` | `mgmt123` | Management | Read all dashboards + export |
| `student` | `student123` | Student | Own placement record + anonymized dashboards |

---

## Features

### 5 Analytics Modules

| Page | URL | Description |
|---|---|---|
| Dashboard | `/` | KPI summary cards + branch overview charts |
| Placement Rate | `/placement-rate` | Overall %, branch-wise %, year-over-year trend |
| Salary Analysis | `/salary` | Min/max/avg/median, package bands, top companies |
| Branch Analysis | `/branch` | Grouped bar charts, avg CTC, companies per branch |
| CGPA Correlation | `/cgpa` | Scatter plot, Pearson r, CGPA band table |
| Recruitment Trends | `/trends` | Monthly timeline, sector pie, top companies, YoY |

### Admin-only Pages

| Page | URL | Description |
|---|---|---|
| Upload Data | `/upload` | Drag-and-drop CSV/Excel bulk import |
| Manual Entry | `/manual-entry` | Individual student + placement form |

---

## Sample CSV Format

Place your CSV at `data/sample_placement_data.csv`. Required columns:

```
roll_no, name, branch, cgpa, graduation_year, company, sector, company_type,
job_role, package_lpa, offer_type, placement_date, status
```

Example row:
```
CS001, Aarav Sharma, CSE, 9.1, 2024, Google, IT, MNC, SDE, 28.0, Full-Time, 2024-09-10, Placed
```

**Supported branches**: CSE, ECE, Mechanical, Civil, Chemical (and any custom branch name)  
**Supported sectors**: IT, Core, Finance, Consulting, PSU  
**Status values**: Placed, Unplaced, Offer-Withdrawn

---

## Export Reports

From any analytics page, click **Export Excel** or **Export PDF** (Admin/Management only).  
Downloads a formatted report for:
- `placement-rate` → placement % tables and branch breakdown
- `salary` → salary stats, band distribution, top companies
- `branch` → full branch analytics table

---

## Project Structure

```
college-placement-analytics/
├── backend/
│   ├── main.py              # FastAPI app, CORS, router registration
│   ├── database.py          # SQLite engine and session
│   ├── seed.py              # First-run seed: users + sample data
│   ├── models/              # SQLAlchemy ORM models
│   ├── schemas/             # Pydantic request/response schemas
│   ├── auth/                # JWT handler + role dependencies
│   ├── routes/              # API route handlers
│   │   ├── auth.py          # /auth/login, /auth/register
│   │   ├── students.py      # /students CRUD
│   │   ├── placements.py    # /placements + /companies CRUD
│   │   ├── upload.py        # /upload/csv bulk import
│   │   ├── analytics.py     # /analytics/* endpoints
│   │   └── export.py        # /export/pdf, /export/excel
│   ├── services/            # Analytics computation logic
│   └── requirements.txt
├── frontend/
│   ├── src/
│   │   ├── App.jsx          # React Router + layout
│   │   ├── api/client.js    # Axios instance with JWT interceptor
│   │   ├── context/         # AuthContext (login state)
│   │   ├── components/      # Sidebar, KPICard, ExportToolbar, ProtectedRoute
│   │   └── pages/           # One page per analytics module
│   ├── package.json
│   └── vite.config.js
├── data/
│   └── sample_placement_data.csv   # 30-row seed dataset
└── README.md
```

---

## API Reference

All endpoints require JWT Bearer token except `/auth/login` and `/auth/register`.

| Method | Endpoint | Auth | Description |
|---|---|---|---|
| POST | `/auth/login` | — | Get JWT token |
| POST | `/auth/register` | — | Register user |
| GET | `/analytics/summary` | Any | Dashboard KPI summary |
| GET | `/analytics/placement-rate` | Any | Placement rate data |
| GET | `/analytics/salary` | Any | Salary analytics |
| GET | `/analytics/branch` | Any | Branch analytics |
| GET | `/analytics/cgpa` | Any | CGPA correlation |
| GET | `/analytics/trends` | Any | Recruitment trends |
| POST | `/upload/csv` | Admin | Bulk CSV/Excel import |
| GET | `/export/excel?module=...` | Admin/Mgmt | Excel download |
| GET | `/export/pdf?module=...` | Admin/Mgmt | PDF download |

Full interactive docs at **http://localhost:8000/docs**
