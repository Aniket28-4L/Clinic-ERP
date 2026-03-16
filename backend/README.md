# Clinic ERP Backend

Production-grade Node.js backend for the Clinic ERP system.

## Tech
- Node.js + Express
- MongoDB + Mongoose
- JWT authentication + RBAC
- Security hardening: Helmet, CORS, rate limiting, Mongo sanitize, XSS sanitization

## Getting started

1) Create environment file:

- Copy `.env.example` → `.env`
- Set a real `JWT_ACCESS_SECRET` (32+ chars)
- Set `MONGODB_URI`

2) Start MongoDB (local example):

- `mongodb://127.0.0.1:27017/clinic_erp`

3) Run the API:

- Dev: `npm run dev`
- Prod: `npm start`

## Endpoints (initial)
- `GET /health`
- `POST /auth/register`
- `POST /auth/login`
- `GET /auth/me` (requires `Authorization: Bearer <token>`)

