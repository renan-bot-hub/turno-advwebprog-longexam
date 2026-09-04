# BulldogEx Shop

BulldogEx is a campus e-commerce web application for selling official and campus-inspired products. The project includes a React frontend, an Express REST API, and MongoDB data storage for products, users, orders, carts, and reviews.

## Project Overview

This system simulates a campus store where customers can:

- browse products by category
- view product details
- add items to cart
- register and sign in
- place orders
- view order history and profile information

Admins can also:

- manage products
- manage users
- manage orders
- review and moderate store activity

## Tech Stack

- Frontend: React 19 + Vite
- Routing: React Router DOM
- UI: custom CSS and responsive layout
- Backend: Express.js
- Database: MongoDB with Mongoose
- Auth: JWT and bcryptjs
- Environment config: dotenv

## Project Structure

```text
turno-webprog-longexam/
├── README.md
├── turno-client/
│   ├── package.json
│   ├── src/
│   │   ├── api/
│   │   ├── assets/
│   │   ├── components/
│   │   ├── context/
│   │   ├── layouts/
│   │   ├── pages/
│   │   ├── App.jsx
│   │   └── main.jsx
│   └── vite.config.js
└── turno-server/
    ├── package.json
    ├── seed.js
    ├── README.md
    └── src/
        ├── app.js
        ├── server.js
        ├── config/
        ├── middleware/
        ├── models/
        └── routes/
```

## Features

- responsive landing page with hero banner and product highlights
- product catalog with category and search support
- detailed product page with pricing, stock, and description
- cart and order workflow
- user authentication and protected routes
- admin dashboard access for store management
- seeded sample data for products, users, orders, carts, and reviews

## Local Setup

### 1) Install dependencies

Frontend:

```bash
cd turno-webprog-longexam/turno-client
npm install
```

Backend:

```bash
cd turno-webprog-longexam/turno-server
npm install
```

### 2) Configure environment

Create a `.env` file inside the server folder based on the example:

```bash
cd turno-webprog-longexam/turno-server
copy .env.example .env
```

Then verify your MongoDB URI:

```env
MONGODB_URI=mongodb://127.0.0.1:27017/bulldogs_exchange
PORT=5000
JWT_SECRET=your_secret_key_here
```

### 3) Start the app

Backend:

```bash
cd turno-webprog-longexam/turno-server
npm run dev
```

Frontend:

```bash
cd turno-webprog-longexam/turno-client
npm run dev -- --host 0.0.0.0
```

Then open:

- frontend: http://localhost:5173
- backend health check: http://localhost:5000/api/health

## Seed Data and Login Accounts

The backend includes seeded demo users. These are the default login credentials for the system:

- Admin: `admin@nu.edu.ph` / `hashed_admin_password`
- Customer: `juan.delacruz@nu.edu.ph` / `hashed_password_1`
- Customer: `maria.santos@nu.edu.ph` / `hashed_password_2`

To reseed the database:

```bash
cd turno-webprog-longexam/turno-server
npm run seed
```

## Main Routes

### Public

- `/` - home page
- `/about` - about page
- `/products` - product catalog
- `/products/:id` - product detail page
- `/auth/signin` - sign in
- `/auth/signup` - sign up

### Customer

- `/cart` - cart
- `/orders` - order history
- `/profile` - profile page

### Admin

- `/admin/products` - manage products
- `/admin/orders` - manage orders
- `/admin/users` - manage users
- `/admin/reviews` - manage reviews

## API Overview

The server exposes REST endpoints for the store, including product and auth routes. See [turno-server/README.md](turno-server/README.md) for the detailed API documentation.

## Notes

- The project is structured as a split frontend/backend application.
- The frontend uses local storage for auth session behavior and route guarding.
- Product and user data are seeded for testing and demonstration.

## Build and Linting

Frontend:

```bash
cd turno-webprog-longexam/turno-client
npm run build
npm run lint
```

Backend is started with nodemon during development and runs through Node in production.
