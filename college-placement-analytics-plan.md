# College Placement Analytics — MVP Plan

## Top-Level Overview

Build a full-stack **College Placement Analytics** web application that runs entirely on localhost.

- **Backend**: Python + FastAPI, SQLite database, SQLAlchemy ORM, JWT-based authentication
- **Frontend**: React (Vite), Recharts / Chart.js for interactive visualizations
- **Data Ingestion**: CSV/Excel file upload + manual entry form
- **Analytics Focus**: Placement Rate, Salary, Branch, CGPA Correlation, Recruitment Trends
- **User Roles**: Admin, Management, Student (JWT-protected routes)
- **Student View**: Students see their own personal placement record + anonymized aggregate benchmarks
- **Export**: PDF and Excel report generation from the dashboard
- **Sample Data Branches**: CSE, ECE, Mechanical, Civil, Chemical (pre-seeded in sample CSV)

The application will be fully operable on localhost with a single `npm run dev` (frontend) and `uvicorn main:app` (backend) command pair.

---

## Architecture

```
college-placement-analytics/
├── backend/
│   ├── main.py                        # FastAPI app entry, CORS, router registration
│   ├── database.py                    # SQLAlchemy engine, session, Base
│   ├── models/
│   │   ├── student.py                 # Student ORM model
│   │   ├── placement.py               # Placement ORM model
│   │   └── company.py                 # Company ORM model
│   ├── schemas/
│   │   ├── student.py                 # Pydantic request/response schemas
│   │   ├── placement.py
│   │   └── auth.py
│   ├── routes/
│   │   ├── auth.py                    # Login, register, JWT token issue
│   │   ├── upload.py                  # CSV/Excel file upload + parsing
│   │   ├── students.py                # Student CRUD
│   │   ├── placements.py              # Placement CRUD
│   │   └── analytics.py              # All analytics endpoints
│   ├── services/
│   │   ├── placement_rate.py          # Placement rate calculations
│   │   ├── salary_analytics.py        # Salary statistics
│   │   ├── branch_analytics.py        # Branch-wise metrics
│   │   ├── cgpa_correlation.py        # CGPA vs package correlation
│   │   └── recruitment_trends.py      # Month/year/company trend analysis
│   ├── auth/
│   │   ├── jwt_handler.py             # JWT encode/decode, secret key
│   │   └── dependencies.py            # get_current_user, role guards
│   └── requirements.txt
├── frontend/
│   ├── src/
│   │   ├── main.jsx
│   │   ├── App.jsx                    # Router + auth guard
│   │   ├── api/
│   │   │   └── client.js              # Axios instance with JWT interceptor
│   │   ├── context/
│   │   │   └── AuthContext.jsx        # Login state, role, token storage
│   │   ├── pages/
│   │   │   ├── Login.jsx
│   │   │   ├── Dashboard.jsx          # KPI overview page
│   │   │   ├── PlacementRate.jsx
│   │   │   ├── SalaryAnalysis.jsx
│   │   │   ├── BranchAnalysis.jsx
│   │   │   ├── CGPACorrelation.jsx
│   │   │   ├── RecruitmentTrends.jsx
│   │   │   ├── DataUpload.jsx         # Admin-only: CSV/Excel upload
│   │   │   └── ManualEntry.jsx        # Admin-only: manual student form
│   │   └── components/
│   │       ├── Navbar.jsx
│   │       ├── Sidebar.jsx
│   │       ├── KPICard.jsx
│   │       ├── ProtectedRoute.jsx     # Role-based route guard
│   │       └── ExportToolbar.jsx      # PDF / Excel export buttons
│   ├── package.json
│   └── vite.config.js
├── data/
│   └── sample_placement_data.csv      # Seed data for testing
└── README.md
```

---

## Data Model

### Student
| Field | Type | Notes |
|---|---|---|
| id | Integer PK | Auto-increment |
| name | String | Full name |
| roll_number | String | Unique |
| branch | String | CSE, ECE, Mech, Civil, etc. |
| cgpa | Float | 0.0 – 10.0 |
| graduation_year | Integer | e.g. 2024 |

### Placement
| Field | Type | Notes |
|---|---|---|
| id | Integer PK | Auto-increment |
| student_id | Integer FK | References Student |
| company_id | Integer FK | References Company |
| job_role | String | SDE, Analyst, etc. |
| package_lpa | Float | CTC in LPA |
| offer_type | String | Full-Time, Intern, PPO |
| placement_date | Date | ISO date |
| status | String | Placed, Unplaced, Offer-Withdrawn |

### Company
| Field | Type | Notes |
|---|---|---|
| id | Integer PK | Auto-increment |
| name | String | Unique |
| sector | String | IT, Core, Finance, Consulting, PSU |
| type | String | MNC, Startup, Government |

### User (Auth)
| Field | Type | Notes |
|---|---|---|
| id | Integer PK | Auto-increment |
| username | String | Unique |
| hashed_password | String | bcrypt |
| role | String | admin, management, student |

---

## Analytics Metrics

### 1. Placement Rate
- Overall placement % = (Placed Students / Eligible Students) × 100
- Branch-wise placement %
- Year-over-year comparison delta

### 2. Salary Analytics
- Min, Max, Average, Median CTC overall and per branch
- Package band distribution: <4 LPA, 4–8 LPA, 8–15 LPA, 15+ LPA
- Top 10 highest-paying companies

### 3. Branch Analysis
- Placement count per branch (bar chart)
- Average CTC per branch
- Companies visiting per branch

### 4. CGPA Correlation
- Scatter plot: CGPA (x-axis) vs Package LPA (y-axis)
- CGPA band placement rates: <6, 6–7, 7–8, 8–9, 9–10
- Pearson correlation coefficient display

### 5. Recruitment Trends
- Month-wise offer count timeline (line chart)
- Year-over-year company participation
- Sector-wise hiring split (pie/donut chart)
- Top recurring companies (bar chart)

---

## Role-Based Access

| Feature | Admin | Management | Student |
|---|---|---|---|
| View all dashboards | ✅ | ✅ | ✅ (anonymized aggregates) |
| View own placement record | ✅ | ✅ | ✅ (personal record only) |
| Upload CSV/Excel | ✅ | ❌ | ❌ |
| Manual entry form | ✅ | ❌ | ❌ |
| Export PDF/Excel | ✅ | ✅ | ❌ |
| Manage users | ✅ | ❌ | ❌ |

---

## Sub-Tasks

---

### Sub-Task 1 — Project Scaffolding & Environment Setup

**Status**: [ ] pending

**Intent**
Create the directory structure, install all backend and frontend dependencies, and verify both servers start on localhost without errors. This forms the base every subsequent sub-task builds on.

**Expected Outcomes**
- `backend/` folder with virtual environment, FastAPI running on `http://localhost:8000`
- `frontend/` folder with Vite + React running on `http://localhost:5173`
- CORS configured so frontend can call backend
- `README.md` with start-up instructions

**Todo List**
1. Create `backend/` directory with `main.py`, `database.py`, `requirements.txt`
2. Create `frontend/` with Vite React scaffold using `npm create vite@latest`
3. Install backend packages: `fastapi`, `uvicorn`, `sqlalchemy`, `pydantic`, `python-jose[cryptography]`, `passlib[bcrypt]`, `pandas`, `openpyxl`, `python-multipart`, `reportlab`
4. Install frontend packages: `axios`, `recharts`, `react-router-dom`, `react-hook-form`
5. Configure CORS in `main.py` to allow `http://localhost:5173`
6. Write `README.md` with `uvicorn main:app --reload` and `npm run dev` commands

**Relevant Context**
- Backend entry: `backend/main.py`
- Frontend entry: `frontend/src/main.jsx`

---

### Sub-Task 2 — Database Models & Schema

**Status**: [ ] pending

**Intent**
Define the SQLAlchemy ORM models and Pydantic schemas for all entities. Running `main.py` must auto-create all tables in `placement.db` (SQLite).

**Expected Outcomes**
- `placement.db` file auto-created on first startup
- Tables: `students`, `placements`, `companies`, `users`
- Pydantic schemas for request/response validation exist for each model

**Todo List**
1. Create `backend/database.py` — SQLAlchemy engine, `SessionLocal`, `Base`
2. Create `backend/models/student.py` — Student ORM model
3. Create `backend/models/placement.py` — Placement ORM model with FK to Student and Company
4. Create `backend/models/company.py` — Company ORM model
5. Create `backend/models/user.py` — User ORM model with role field
6. Create `backend/schemas/` Pydantic schemas for each model (Create, Read, Update variants)
7. Call `Base.metadata.create_all(bind=engine)` in `main.py` startup

**Relevant Context**
- `backend/database.py`
- `backend/models/`
- `backend/schemas/`

---

### Sub-Task 3 — JWT Authentication

**Status**: [ ] pending

**Intent**
Implement login, token generation, and route protection so that all subsequent analytics and data endpoints can be guarded by role.

**Expected Outcomes**
- `POST /auth/register` creates a new user
- `POST /auth/login` returns a JWT access token
- `get_current_user` dependency extracts user from token
- Role guard functions: `require_admin`, `require_management_or_above`
- Protected routes return 401/403 for unauthorized access

**Todo List**
1. Create `backend/auth/jwt_handler.py` — `create_access_token`, `decode_access_token` using `python-jose`
2. Create `backend/auth/dependencies.py` — `get_current_user` FastAPI dependency, role guard helpers
3. Create `backend/routes/auth.py` — `/auth/register` and `/auth/login` endpoints
4. Hash passwords using `passlib` bcrypt on register, verify on login
5. Register auth router in `main.py`
6. Create `frontend/src/context/AuthContext.jsx` — stores token in localStorage, exposes login/logout
7. Create `frontend/src/api/client.js` — Axios instance that attaches `Authorization: Bearer <token>` header

**Relevant Context**
- `backend/auth/`
- `backend/routes/auth.py`
- `frontend/src/context/AuthContext.jsx`
- `frontend/src/api/client.js`

---

### Sub-Task 4 — Data Ingestion (CSV/Excel Upload + Manual Entry)

**Status**: [ ] pending

**Intent**
Allow admins to bulk-load placement data via file upload or enter individual records via a form — the two primary data sources for the MVP.

**Expected Outcomes**
- `POST /upload/csv` accepts a `.csv` or `.xlsx` file and inserts parsed rows into the database
- File validation rejects malformed or missing required columns with a clear error message
- Manual entry form on frontend submits to `POST /students` and `POST /placements`
- A sample CSV file exists in `data/` for testing

**Todo List**
1. Create `backend/routes/upload.py` — file upload endpoint using `python-multipart`
2. Use `pandas.read_csv` / `pandas.read_excel` to parse uploaded file into DataFrames
3. Validate required columns: `roll_no`, `name`, `branch`, `cgpa`, `company`, `package_lpa`, `placement_date`
4. Insert valid rows into DB, collect and return a summary of skipped rows with reasons
5. Create `backend/routes/students.py` and `backend/routes/placements.py` — CRUD endpoints
6. Create `frontend/src/pages/DataUpload.jsx` — drag-and-drop or click-to-upload file input (Admin only)
7. Create `frontend/src/pages/ManualEntry.jsx` — form with `react-hook-form` for student + placement fields
8. Create `data/sample_placement_data.csv` with 20+ rows of realistic test data

**Relevant Context**
- `backend/routes/upload.py`
- `frontend/src/pages/DataUpload.jsx`
- `data/sample_placement_data.csv`

---

### Sub-Task 5 — Analytics Engine (Backend Services)

**Status**: [ ] pending

**Intent**
Implement all five analytics computation services as pure Python functions operating on the database. These services feed the analytics API endpoints consumed by the dashboard.

**Expected Outcomes**
- Each service returns clean, structured Python dicts/lists ready for JSON serialization
- All five analytics areas covered: placement rate, salary, branch, CGPA correlation, recruitment trends
- `GET /analytics/{module}` endpoints return correct data for frontend charts

**Todo List**
1. Create `backend/services/placement_rate.py` — overall %, branch-wise %, YoY delta
2. Create `backend/services/salary_analytics.py` — min/max/avg/median, band distribution, top companies
3. Create `backend/services/branch_analytics.py` — placements per branch, avg CTC per branch
4. Create `backend/services/cgpa_correlation.py` — CGPA vs package data points, band analysis, Pearson r
5. Create `backend/services/recruitment_trends.py` — monthly timeline, YoY company count, sector split
6. Create `backend/routes/analytics.py` — one route per service, apply role guards (management + admin)
7. Register analytics router in `main.py`
8. Filter all service queries by optional `year` query param for multi-year support

**Relevant Context**
- `backend/services/`
- `backend/routes/analytics.py`

---

### Sub-Task 6 — React Dashboard & Charts

**Status**: [ ] pending

**Intent**
Build the frontend dashboard with interactive charts for each analytics module, consuming the backend analytics API.

**Expected Outcomes**
- Login page authenticates and stores JWT
- Dashboard home shows 5 KPI cards (total students, placed %, avg CTC, top company, top branch)
- Each analytics module has its own page with at least one Recharts / Chart.js visualization
- Sidebar navigation links to all 5 analytics pages
- Admin-only pages (Upload, Manual Entry) hidden from other roles
- `ProtectedRoute` component redirects unauthenticated users to login

**Todo List**
1. Create `frontend/src/App.jsx` — React Router routes with `ProtectedRoute` wrapper
2. Create `frontend/src/components/Navbar.jsx` and `Sidebar.jsx` — navigation with role-aware menu items
3. Create `frontend/src/components/KPICard.jsx` — reusable metric card component
4. Create `frontend/src/pages/Dashboard.jsx` — 5 KPI cards + summary charts
5. Create `frontend/src/pages/PlacementRate.jsx` — bar chart (branch-wise) + line chart (YoY)
6. Create `frontend/src/pages/SalaryAnalysis.jsx` — histogram (package bands) + top companies bar chart
7. Create `frontend/src/pages/BranchAnalysis.jsx` — grouped bar chart (placements + avg CTC per branch)
8. Create `frontend/src/pages/CGPACorrelation.jsx` — scatter plot (CGPA vs Package) + band table
9. Create `frontend/src/pages/RecruitmentTrends.jsx` — line chart (monthly) + pie chart (sector split)
10. Create `frontend/src/components/ProtectedRoute.jsx` — checks auth + role before rendering

**Relevant Context**
- `frontend/src/pages/`
- `frontend/src/components/`
- `frontend/src/context/AuthContext.jsx`

---

### Sub-Task 7 — Export Functionality (PDF + Excel)

**Status**: [ ] pending

**Intent**
Allow Admin and Management users to export the currently viewed analytics module as a formatted PDF or Excel report.

**Expected Outcomes**
- `GET /export/pdf?module={name}` returns a downloadable PDF with a table + summary stats
- `GET /export/excel?module={name}` returns a downloadable `.xlsx` file
- Frontend `ExportToolbar` component visible on each analytics page for authorized roles
- Clicking export triggers a file download in the browser

**Todo List**
1. Create `backend/routes/export.py` — two endpoints: `/export/pdf` and `/export/excel`
2. Use `reportlab` to generate PDF with a title, summary stats table, and data table
3. Use `openpyxl` to generate Excel with column headers and data rows
4. Apply role guard: management and admin only
5. Create `frontend/src/components/ExportToolbar.jsx` — "Export PDF" and "Export Excel" buttons
6. Call export endpoints via Axios with `responseType: 'blob'` and trigger `URL.createObjectURL` download
7. Mount `ExportToolbar` on each analytics page, hidden for Student role

**Relevant Context**
- `backend/routes/export.py`
- `frontend/src/components/ExportToolbar.jsx`

---

### Sub-Task 8 — Integration Testing & Localhost Verification

**Status**: [ ] pending

**Intent**
Verify end-to-end that the complete application works on localhost: upload data, view all dashboards, export reports, and confirm role-based access blocks work correctly.

**Expected Outcomes**
- Both servers start cleanly with no import or dependency errors
- Sample CSV uploads successfully and populates all dashboard charts
- All 5 analytics pages display data correctly
- JWT login works for all 3 roles; role restrictions enforced
- PDF and Excel exports download correctly
- `README.md` documents every step needed to start the app fresh

**Todo List**
1. Load `data/sample_placement_data.csv` via the upload endpoint and verify DB population
2. Test all 5 analytics API endpoints return correct JSON
3. Test each frontend page renders charts with real data
4. Test login with admin, management, and student accounts; verify restricted pages block correctly
5. Test PDF and Excel export downloads for placement rate and salary modules
6. Update `README.md` with full setup instructions: venv, pip install, npm install, seed data, start commands

**Relevant Context**
- `README.md`
- `data/sample_placement_data.csv`
- All routes in `backend/routes/`
- All pages in `frontend/src/pages/`

---

## Local Development Start Commands

```bash
# Backend
cd backend
python -m venv venv
venv\Scripts\activate        # Windows
pip install -r requirements.txt
uvicorn main:app --reload --port 8000

# Frontend
cd frontend
npm install
npm run dev                  # Starts on http://localhost:5173
```

API docs auto-available at: `http://localhost:8000/docs` (Swagger UI)
