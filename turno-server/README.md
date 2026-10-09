# Bulldogs Exchange API

REST API for the Bulldogs Exchange shop, built with Express.js and MongoDB in an MVC structure.

## Setup

```bash
cd turno-server
npm install
copy .env.example .env
```

Edit `.env`:

- `JWT_SECRET` is required. The server refuses to start without it.
- `MONGODB_URI` is your local MongoDB or MongoDB Atlas connection string.
- `USE_MEMORY_DB=true` (optional): if MongoDB is unreachable, use a temporary in-memory database pre-filled with sample data. Everything is lost when the server stops.
- `CLIENT_URL` (optional): comma-separated extra origins allowed by CORS, e.g. a deployed frontend.
- `CLOUDINARY_*`: needed for product image uploads.

Seed the database, then start the API:

```bash
npm run seed
npm run dev
```

`npm run seed` never deletes or changes your products. It converts products saved by older versions (text categories) to category references, adds the sample categories and suppliers if they are missing, adds sample products only when the database has none, and creates the admin account (`ADMIN_EMAIL` / `ADMIN_PASSWORD`, default `admin@bulldogex.com` / `admin1234`). The same category conversion also runs automatically when the server starts.

`npm run check` syntax-checks every server file.

## Project structure

```text
src/
├── server.js        Connects to MongoDB and starts the API
├── app.js           Middleware order, routes (/api/... and /api/v1/...), error handling
├── seed.js          npm run seed
├── seedData.js      Sample categories, suppliers, products, and the admin account
├── config/          cloudinary.js, constants.js (HttpStatus codes)
├── models/          productModel, categoryModel, supplierModel, cartModel, orderModel, reviewModel, userModel, logModel
├── controllers/     One controller per resource: request logic lives here
├── routes/          One router per resource: middleware chain → controller
├── middleware/
│   ├── authentication.js         Verifies the JWT and that the account is still active
│   ├── authorization.js          authorize('Admin', ...) role check (RBAC)
│   ├── validationMiddleware.js   express-validator rules for every input
│   ├── rateLimiterMiddleware.js  express-rate-limit limiters + failed-login lockout
│   ├── uploadImageMiddleware.js  Multer (JPEG/PNG/WebP, 5 MB) + real file-content check
│   ├── auditLoggerMiddleware.js  Saves every request to the logs collection
│   └── errorHandlerMiddleware.js Central error handler and 404 handler
└── utils/migrateLegacyData.js     Text category → category reference conversion
```

## Data model

| Collection | Key fields | Relationships |
|---|---|---|
| Product | name (unique slug), title, price, stock, description[], imageUrl, imagePublicId | `category` → Category (required), `supplier` → Supplier (optional) |
| Category | name (unique), description, imageUrl, isActive | referenced by Product |
| Supplier | name (unique), contactPerson, email, phone, address, isActive | referenced by Product |
| Cart | items[{ product, quantity, price }] (embedded), total | `user` → User (one cart per user) |
| Order | items[{ product, name, quantity, price }] (embedded), total, status, shippingAddress (embedded), paymentMethod | `user` → User, `items.product` → Product |
| Review | rating (1–5), comment | `user` → User, `product` → Product (one review per user per product) |
| User | name, firstName, lastName, email (unique), password (bcrypt), role (Customer/Admin), isActive | |
| Log | level, message, method, path, statusCode, ip, metadata | `userId` → User (auto-deleted after 30 days) |

Indexes: product category, supplier, price, and a text index for keyword search; order user and status; review product and user+product (unique); log level/date.

## Authentication

Send `Authorization: Bearer <token>` with the token returned by `POST /api/user/login` (also `/api/auth/login`).

## Routes and allowed roles

Every route also works under `/api/v1/...` (e.g. `/api/v1/product`). "Owner" means the controller checks that the record belongs to the logged-in user.

| Collection | Method | Route | Allowed roles |
|---|---|---|---|
| User | POST | `/api/user/register` | Public (rate limited) |
| User | POST | `/api/user/login` | Public (rate limited + lockout) |
| User | GET / PUT | `/api/user/me` | Customer, Admin (own account) |
| User | PUT | `/api/user/me/password` | Customer, Admin (own account) |
| User | GET | `/api/user` | Admin |
| User | GET | `/api/user/:id` | Admin |
| User | POST | `/api/user` | Admin |
| User | PUT / PATCH | `/api/user/:id` | Admin (any field) or Owner (name and avatar only) |
| User | DELETE | `/api/user/:id` | Admin |
| Product | GET | `/api/product`, `/api/product/:id` | Public |
| Product | POST / PUT / PATCH / DELETE | `/api/product`, `/api/product/:id` | Admin |
| Product | POST | `/api/product/:id/upload-image` | Admin |
| Product | DELETE | `/api/product/:id/image` | Admin |
| Category | GET | `/api/category`, `/api/category/:id` | Public |
| Category | POST / PUT / DELETE | `/api/category`, `/api/category/:id` | Admin |
| Supplier | GET | `/api/supplier`, `/api/supplier/:id` | Public |
| Supplier | POST / PUT / DELETE | `/api/supplier`, `/api/supplier/:id` | Admin |
| Order | GET | `/api/order`, `/api/order/:id` | Customer (own orders), Admin (all) |
| Order | POST | `/api/order` | Customer, Admin |
| Order | PUT / PATCH / DELETE | `/api/order/:id` | Admin |
| Review | GET | `/api/review`, `/api/review/:id` | Public |
| Review | POST | `/api/review` | Customer, Admin |
| Review | PUT / DELETE | `/api/review/:id` | Owner or Admin |
| Cart | GET / PUT / DELETE | `/api/cart/:userId` | Owner or Admin |
| Cart | POST | `/api/cart` | Customer, Admin |
| Log | GET | `/api/log` | Admin |

## Products: query parameters

`GET /api/v1/product?page=1&limit=5&category=Campus%20Apparel&supplier=Bulldog%20Merch%20Co.&search=hoodie&minPrice=100&maxPrice=2000&sort=price&order=asc`

- `category` / `supplier` accept a name or an ObjectId. An unknown value returns no products.
- `sort`: `name`, `title`, `price`, `stock`, `createdAt` (default); `order`: `asc` or `desc` (default).
- All parameters can be combined in one request.

Every product response uses the same structure:

```json
{ "success": true, "message": "Products retrieved successfully.", "count": 8, "pagination": { "page": 1, "limit": 5, "total": 8, "pages": 2 }, "data": [] }
```

Errors use `{ "success": false, "message": "...", "errors": [{ "field": "...", "message": "..." }] }` (the `errors` list only for validation errors).

Product JSON fields: `name`, `title`, `category` (id or name), `supplier` (id or name, optional), `price`, `stock`, `description` (array, or text with one line per item), `imageUrl`. Create and update also accept `multipart/form-data` with an optional `image` file.

## Security

- **Passwords** are hashed with bcrypt; login returns a JWT. Deactivated or deleted accounts lose access immediately.
- **Helmet** security headers, **CORS** limited to the website's origins.
- **Rate limits** (express-rate-limit): all API calls 1000 / 15 min, login 20 / 15 min, registration 10 / hour, orders/reviews/uploads 60 / 15 min.
- **Failed-login lockout** per email + IP: 5 failures → 3 minutes, 8 → 5 minutes, 10 or more → 30 minutes. A successful login resets the counter.
- **Validation** (express-validator) on every body and ID parameter; prices, totals, and stock always come from the database.
- **Image uploads**: JPEG, PNG, or WebP up to 5 MB, and the file's actual content must match one of those formats (a renamed file is rejected). Replacing or removing an image, or deleting a product, also deletes the old image from Cloudinary.
- **Audit log**: every request (method, path, status, user, IP, duration) is saved in the `logs` collection; admins read it at `GET /api/log`.

## Testing with Postman

Import `Bulldogs-Exchange.postman_collection.json`, run **Auth → Login as Admin** and **Auth → Register Customer**, then any request (or the whole collection with the Collection Runner). Tokens and IDs are saved automatically. Running the collection leaves your products unchanged.
