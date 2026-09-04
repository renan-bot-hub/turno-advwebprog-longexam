# Bulldogs Exchange API

REST API for the Bulldogs Exchange product catalog using Express.js and MongoDB.

## Setup

```bash
cd turno-server
npm install
copy .env.example .env
npm run dev
```

Seed the catalog after MongoDB is available:

```bash
npm run seed
```

Set `MONGODB_URI` in `.env` to a local MongoDB instance or MongoDB Atlas connection string.

## Endpoints

- `GET /api/health`
- `GET /api/products?page=1&limit=10&category=Campus%20Apparel&search=hoodie&minPrice=500&maxPrice=2000&sort=price&order=asc`
- `GET /api/products/:id`
- `POST /api/products`
- `PUT /api/products/:id`
- `DELETE /api/products/:id`

Product JSON fields: `name`, `title`, `category`, `price`, `stock`, `description` (array), and `imageUrl`.
