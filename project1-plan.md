# Project 1: Personal Finance Dashboard

## The Idea

A web app where you can log your income and expenses, organize them by category, and see visual trends over time. The goal is to answer questions like "Where is my money going?" and "Am I spending more than I earn this month?" — with a clean dashboard that gives you an honest picture of your finances at a glance.

---

## Features

### Core (MVP)
- **User authentication** — register and log in with email + password
- **Add transactions** — log an income or expense with amount, category, date, and an optional note
- **Edit / delete transactions** — fix mistakes or remove entries
- **Dashboard summary** — current month's total income, total expenses, and net balance
- **Spending by category** — pie or donut chart showing where money went this month
- **Income vs. Expenses over time** — bar chart by month for the last 6–12 months
- **Transaction history** — paginated list with filters by date range, type (income/expense), and category

### Nice to Have (after MVP)
- Custom categories with color labels
- CSV export of transactions
- Monthly budget goals per category (e.g., "limit Food to $400/month")
- Recurring transaction support (e.g., rent on the 1st of every month)

---

## Pages

| Page | Route | Description |
|---|---|---|
| Register | `/register` | Sign up with name, email, password |
| Login | `/login` | Log in to existing account |
| Dashboard | `/` | Summary cards + charts for current month |
| Transactions | `/transactions` | Full list with filters; add/edit/delete |
| Add Transaction | `/transactions/new` | Form to log a new income or expense |
| Edit Transaction | `/transactions/:id/edit` | Pre-filled form to update an entry |
| Categories | `/categories` | View and manage spending categories |

---

## Database Schema

### `users`
| Column | Type | Notes |
|---|---|---|
| id | SERIAL PRIMARY KEY | |
| name | VARCHAR(100) | |
| email | VARCHAR(255) UNIQUE NOT NULL | |
| password_hash | VARCHAR(255) NOT NULL | bcrypt |
| created_at | TIMESTAMP | DEFAULT NOW() |

---

### `categories`
| Column | Type | Notes |
|---|---|---|
| id | SERIAL PRIMARY KEY | |
| user_id | INTEGER REFERENCES users(id) | |
| name | VARCHAR(100) NOT NULL | e.g. "Food", "Rent", "Salary" |
| type | VARCHAR(10) NOT NULL | `'income'` or `'expense'` |
| color | VARCHAR(7) | Hex color, e.g. `#FF5733` |
| created_at | TIMESTAMP | DEFAULT NOW() |

---

### `transactions`
| Column | Type | Notes |
|---|---|---|
| id | SERIAL PRIMARY KEY | |
| user_id | INTEGER REFERENCES users(id) | |
| category_id | INTEGER REFERENCES categories(id) | |
| type | VARCHAR(10) NOT NULL | `'income'` or `'expense'` |
| amount | NUMERIC(10, 2) NOT NULL | Always positive |
| date | DATE NOT NULL | When the transaction occurred |
| note | TEXT | Optional description |
| created_at | TIMESTAMP | DEFAULT NOW() |
| updated_at | TIMESTAMP | DEFAULT NOW() |

---

## Tech Stack

| Layer | Technology |
|---|---|
| Frontend | React (Vite), React Router, Recharts (for charts), Tailwind CSS |
| Backend | Node.js + Express (or Python + FastAPI) |
| Database | PostgreSQL |
| Auth | JWT tokens stored in httpOnly cookies |
| Deployment | Railway or Render (backend + DB), Vercel (frontend) |

---

## Suggested Build Order

1. Set up DB + backend auth (register/login with JWT)
2. CRUD API for categories and transactions
3. React app shell with routing and auth context
4. Transactions page (list, add, edit, delete)
5. Dashboard page with summary cards
6. Add charts (spending by category, monthly trend)
7. Polish UI, deploy
