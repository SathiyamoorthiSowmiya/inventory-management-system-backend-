# InvenTrack — Inventory Management System (Backend)

REST API for a full-stack MERN inventory management application. Handles authentication, products, categories, stock movement tracking and dashboard analytics.

🔗 **Live API**: https://inventory-management-system-backend-wm6i.onrender.com
📦 **Live App**:  https://inventory-management-system-fronten-lemon.vercel.app/ 
💻 **Frontend Repo**: https://github.com/SathiyamoorthiSowmiya/inventory-management-system-frontend

> Hosted on Render's free tier — the server sleeps after inactivity, so the first request after a while may take 30-50s to wake up.

## Tech Stack

- Node.js + Express.js
- MongoDB + Mongoose
- JWT authentication + Bcrypt password hashing

## Features

- User login with JWT auth
- Product CRUD with category assignment and low-stock threshold
- Category management
- Stock In/Out transaction logging with automatic quantity adjustment
- Dashboard analytics: total value, low stock alerts, out-of-stock alerts, category breakdown, recent activity

## Getting Started

### Prerequisites

- Node.js (v18+)
- MongoDB running locally or a MongoDB Atlas connection string

### Setup

```bash
npm install
```

Create a `.env` file in the root:

```
PORT=5000
MONGO_URI=mongodb://127.0.0.1:27017/inventory_management
JWT_SECRET=your_secret_key
```

Seed the database with demo categories, products and an admin account:

```bash
npm run seed
```

This creates an admin user: `admin@inventory.com` / `Admin@123`

Run the server:

```bash
npm run dev
```

Server runs on `http://localhost:5000`.

## API Endpoints

| Method | Endpoint | Description |
|---|---|---|
| POST | /api/auth/register | Register a new user |
| POST | /api/auth/login | Login |
| GET | /api/products | List products (with category populated) |
| POST | /api/products | Create a product |
| PUT | /api/products/:id | Update a product |
| DELETE | /api/products/:id | Delete a product |
| GET | /api/categories | List categories |
| POST | /api/categories | Create a category |
| PUT | /api/categories/:id | Update a category |
| DELETE | /api/categories/:id | Delete a category |
| GET | /api/stock | Recent stock transactions |
| POST | /api/stock | Record a stock in/out movement |
| GET | /api/dashboard/stats | Dashboard summary stats |

All endpoints (except register/login) require a `Bearer` token in the `Authorization` header.
