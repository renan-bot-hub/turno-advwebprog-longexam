# Bulldogs Exchange API

Bulldogs Exchange is the backend service for the campus e-commerce application. It exposes REST endpoints for products, authentication, users, carts, orders, and reviews using Express.js and MongoDB.

## Tech Stack

- Node.js
- Express.js
- MongoDB with Mongoose
- JWT authentication
- bcryptjs password hashing
- dotenv environment configuration
- nodemon for development

## Setup

```bash
cd turno-server
npm install
copy .env.example .env
npm run dev
```

Create an environment file with your MongoDB connection and app settings:

```env
MONGODB_URI=mongodb://127.0.0.1:27017/bulldogs_exchange
PORT=5000
JWT_SECRET=your_secret_key_here
```

Seed the database after MongoDB is available:

```bash
npm run seed
```

## Seeded Accounts

The app includes demo users for testing:

- Admin: `admin@nu.edu.ph` / `hashed_admin_password`
- Customer: `juan.delacruz@nu.edu.ph` / `hashed_password_1`
- Customer: `maria.santos@nu.edu.ph` / `hashed_password_2`

## Authentication Endpoints

### Register

```http
POST /api/auth/register
```

Request body:

```json
{
  "firstName": "Jane",
  "lastName": "Doe",
  "email": "jane@example.com",
  "password": "123456"
}
```

### Login

```http
POST /api/auth/login
```

Request body:

```json
{
  "email": "admin@nu.edu.ph",
  "password": "hashed_admin_password"
}
```

### Get Current User

```http
GET /api/auth/me
```

### Update Profile

```http
PUT /api/auth/me
```

### Change Password

```http
PUT /api/auth/me/password
```

## Product Endpoints

### Get all products

```http
GET /api/products
```

Query parameters:

- `page`
- `limit`
- `category`
- `search`
- `minPrice`
- `maxPrice`
- `sort`
- `order`

Example:

```http
GET /api/products?page=1&limit=10&category=Campus%20Apparel&search=hoodie&minPrice=500&maxPrice=2000&sort=price&order=asc
```

### Get product by ID

```http
GET /api/products/:id
```

### Create product

```http
POST /api/products
```

Admin only.

### Update product

```http
PUT /api/products/:id
```

Admin only.

### Delete product

```http
DELETE /api/products/:id
```

Admin only.

## User Endpoints

### Get all users

```http
GET /api/user
```

Admin only.

### Get user by ID

```http
GET /api/user/:id
```

Admin only.

### Create user

```http
POST /api/user
```

Admin only.

### Update user

```http
PUT /api/user/:id
```

Admin only.

## Cart Endpoints

- `GET /api/cart`
- `POST /api/cart`
- `PUT /api/cart/:id`
- `DELETE /api/cart/:id`

## Order Endpoints

- `GET /api/order`
- `POST /api/order`
- `PUT /api/order/:id`
- `DELETE /api/order/:id`

## Review Endpoints

- `GET /api/review`
- `POST /api/review`
- `PUT /api/review/:id`
- `DELETE /api/review/:id`

## Health Check

```http
GET /api/health
```

Example response:

```json
{
  "status": "ok",
  "database": "connected"
}
```

## Postman Collection

A Postman collection is included in this folder:

- `Bulldogs-Exchange.postman_collection.json`

Import it into Postman to test the app endpoints quickly. The collection includes sample requests for:

- health check
- product listing and filtering
- create/update/delete products
- login and registration flow
- carts, orders, reviews, and user management

Base URL used by the collection:

```text
http://localhost:5000/api
```

## Notes

- Product data includes fields such as `name`, `title`, `category`, `price`, `stock`, `description`, and `imageUrl`.
- Passwords are hashed with `bcryptjs` before saving.
- JWT tokens are used to protect authenticated routes.
- Admin-only routes require the user role to be `admin`.
