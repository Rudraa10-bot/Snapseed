# SnapSeed — Receipt-to-Budget Tracker

A full-stack expense tracking application built as a semester project for Full Stack Development. SnapSeed helps users track daily expenses, manage monthly budgets by category, and monitor spending with visual alerts.

---

## Tech Stack

| Layer | Technology |
|-------|------------|
| Frontend | React 19 + Vite, plain CSS |
| Backend | Spring Boot 4.1.1, Spring Data JPA, Spring Web MVC, Bean Validation |
| Database | H2 (in-memory, dev) |
| Build | Maven (backend), npm/Vite (frontend) |
| Java | JDK 25 (required — backend tests only pass on JDK 25) |

---

## Folder Structure

```
Snapseed/
├── expense-service/          # Spring Boot backend (port 8081)
│   ├── src/main/java/...     # Controllers, services, entities, repositories
│   ├── src/test/...          # Unit & integration tests
│   └── pom.xml               # Maven build
├── snapseed-react/           # React frontend (port 5173)
│   ├── src/
│   │   ├── api.js            # Fetch helpers for backend API
│   │   ├── App.jsx           # Root component, state & data fetching
│   │   ├── components/       # UI components (ExpenseTable, BudgetOverview, etc.)
│   │   └── data.js           # Shared constants (category labels, date formatter)
│   ├── package.json
│   └── vite.config.js
├── .gitignore                # Ignores target/, node_modules/, dist/, .idea/, *.iml, data/
└── README.md                 # This file
```

---

## Running the Application

### Prerequisites
- **JDK 25** (the backend tests only pass on JDK 25; other versions will fail)
- Node.js 18+ and npm
- Maven (or use the included `mvnw` wrapper)

### 1. Start the Backend (expense-service)

```bash
cd expense-service

# Windows PowerShell
$env:JAVA_HOME = "C:\Program Files\Java\jdk-25.0.5.0.2"
.\mvnw spring-boot:run

# Linux/macOS
export JAVA_HOME=/path/to/jdk-25
./mvnw spring-boot:run
```

The backend starts on **http://localhost:8081**.

- H2 Console: http://localhost:8081/h2-console
  - JDBC URL: `jdbc:h2:mem:snapseeddb`
  - Username: `sa`
  - Password: *(empty)*

### 2. Start the Frontend (snapseed-react)

```bash
cd snapseed-react
npm install
npm run dev
```

The frontend starts on **http://localhost:5173** and proxies `/api` calls to the backend.

---

## API Endpoints

Base URL: `http://localhost:8081`

### Expenses

| Method | Endpoint | Description |
|--------|----------|-------------|
| GET    | `/expenses` | List all expenses (newest first) |
| POST   | `/expenses` | Create an expense |
| DELETE | `/expenses/{id}` | Delete an expense |
| GET    | `/expenses/summary` | Totals by category |

**Expense JSON:**
```json
{
  "id": 1,
  "date": "2026-08-18",
  "desc": "Domino's Pizza",
  "category": "food",
  "amount": 450,
  "payment": "UPI"
}
```

**POST /expenses request body:**
```json
{
  "date": "2026-08-18",
  "desc": "Domino's Pizza",
  "category": "food",
  "amount": 450,
  "payment": "UPI"
}
```

*Validation: `category` must be one of `food|transport|shopping|utilities|other`. `amount` must be > 0. `date` format `yyyy-MM-dd`. On 400, returns `{field: "message"}`.*

### Budgets

| Method | Endpoint | Description |
|--------|----------|-------------|
| GET    | `/budgets` | List all budget statuses (spent, limit, percent, status) |
| GET    | `/budgets/alerts` | Categories at ≥ 80% |
| PUT    | `/budgets/{category}` | Update limit for a category |

**BudgetStatus JSON:**
```json
{
  "category": "food",
  "spent": 450,
  "limit": 5000,
  "percent": 9,
  "status": "ON_TRACK"
}
```

**PUT /budgets/{category} request body:**
```json
{ "limit": 6000 }
```

*Status values: `ON_TRACK`, `NEARING_LIMIT` (≥ 80%), `OVER_BUDGET` (≥ 100%).*

---

## Features Implemented

- **Expense CRUD**: Add, list, delete expenses via the UI
- **Budget Management**: Set per-category monthly limits, see spent/limit/progress
- **Budget Alerts**: Automatic warning when a category hits 80% or 100%
- **Validation**: Server-side validation with readable error messages shown in the UI
- **Loading & Error States**: Spinner on initial load, retryable error banner if backend is down
- **H2 Console**: In-memory database browser for debugging

---

## Development Notes

- Backend uses `@CrossOrigin` on controllers — no extra CORS config needed
- Frontend uses Vite dev server; API calls go to `http://localhost:8081` (configurable via `VITE_API_URL`)
- No authentication yet — single-user demo mode
- Receipt upload (OCR) and charts are planned but not yet implemented

---

## Testing the Backend

```bash
cd expense-service
$env:JAVA_HOME = "C:\Program Files\Java\jdk-25.0.5.0.2"
.\mvnw test
```

Expected: All tests pass (requires JDK 25).

---

## Building the Frontend for Production

```bash
cd snapseed-react
npm run build
# Output in dist/
npm run lint   # Runs oxlint
```