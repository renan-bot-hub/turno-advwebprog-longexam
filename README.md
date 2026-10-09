# CTWEBPGL Web Programming - Long Exam 1

This repository contains a React frontend built with Vite, React Router, and Tailwind CSS, plus an Express.js and MongoDB REST API.

The current project is **BulldogEx Shop**, a low-fidelity e-commerce wireframe for campus products. It includes a full-width hero banner, product catalog cards, product detail pages, store information pages, shared layouts, and authentication screens.

## Tech Stack

- React 19
- Vite
- React Router DOM
- Tailwind CSS 4
- ESLint
- Express.js
- MongoDB with Mongoose

## Main Features

- Full-width e-commerce hero section with background image overlay
- Product listing page with reusable product cards
- Product detail page with price, category, stock, description, and action buttons
- Store-focused home, about, footer, and not found pages
- Authentication pages for sign in and sign up
- Shared layout, navbar, footer, and button components

## Fork and Clone Instructions

Fork the original repository first on GitHub. This creates your own copy of the repository under your GitHub account.

After the repository is forked, clone your forked repository to your local device:

1. Go to the root folder where you want to save the project.
2. Open that folder in **VS Code**.
3. Open the **VS Code Terminal**.
4. Run `git clone` using the URL of your forked repository:

```bash
git clone <forked-repository-url>
```

Example:

```bash
git clone https://github.com/your-username/surname-long-exam.git
```

After cloning the forked repository, go inside the cloned project folder:

```bash
cd surname-long-exam
```

## Project Setup

Install and run the API:

```bash
cd turno-server
npm install
copy .env.example .env
npm run seed
npm run dev
```

Edit `.env` first and set `JWT_SECRET` (required) and your `MONGODB_URI`. The API will not start without them.

`npm run seed` never deletes or changes your products. It adds sample products only if the database has none, creates a category for every product category in use, and creates the admin account (`admin@bulldogex.com` / `admin1234` by default; change it with `ADMIN_EMAIL` and `ADMIN_PASSWORD` in `.env`).

If you don't have MongoDB running, set `USE_MEMORY_DB=true` in `.env`. The API then starts a temporary in-memory database with the sample data. Everything in it is lost when the server stops.

See [turno-server/README.md](turno-server/README.md) for the REST endpoint reference and query parameters.

Install dependencies inside the client app:

```bash
cd turno-client
npm install
copy .env.example .env
```

`VITE_API_URL` in `turno-client/.env` sets the API address (default `http://localhost:5000/api`).

Start the development server:

```bash
npm run dev
```

Create a production build:

```bash
npm run build
```

Run linting:

```bash
npm run lint
```

## Push to GitHub Using Git Bash

Open **Git Bash** or **VS Code Terminal**, then go to the project root folder:

Example
```bash
cd /c/Users/ACER/Desktop/cy.dev/cy.dev.reactjs/course-material/webprog/long-exam1
```

Check the files before committing:

```bash
git status
```

If this folder is not yet a Git repository, initialize it:

```bash
git init
```

Stage, commit, and push the project:

```bash
git add .
git commit -m "initial long-exam1"
git push origin main
```

For future updates after editing files:

```bash
git status
git add .
git commit -m "enhanced long-exam1"
git push
```

## Current Routes

- `/` - Home page
- `/about` - About page
- `/products` - Product list page
- `/products/:id` - Single product page (MongoDB product `_id`)
- `/auth/signin` - Sign in page
- `/auth/signup` - Sign up page
- `/cart`, `/orders`, `/profile` - Customer pages (login required)
- `/admin/products`, `/admin/orders`, `/admin/reviews`, `/admin/users` - Admin pages (Admin role required)

The product list reads its filters from the URL, e.g. `/products?search=hoodie&category=Campus+Apparel&sort=price-asc&page=2`. Sort values: `newest`, `price-asc`, `price-desc`, `name-asc`.

## Key Files

- `turno-client/src/api/` - Axios client and one module per API resource
- `turno-client/src/api/session.js` - stores the login session (localStorage with "Remember Me", sessionStorage without)
- `turno-client/src/context/AuthContext.jsx` - current user, login, register, and logout
- `turno-client/src/pages/LandingPages/ProductListPage.jsx` - product catalog with search, filters, sorting, and pagination
- `turno-client/src/pages/LandingPages/ProductPage.jsx` - single product detail page with reviews
- `turno-client/src/pages/LandingPages/HomePage.jsx` - landing page with full-width hero banner
- `turno-server/src/app.js` - Express app, CORS, security headers, and error handling
- `turno-server/src/seedData.js` - sample categories, products, and the admin account

## Current File Structure

```text
turno-webprog-longexam/
├── README.md
├── turno-client/
│   ├── .env.example
│   ├── index.html
│   ├── package.json
│   ├── vite.config.js
│   └── src/
│       ├── App.jsx
│       ├── main.jsx
│       ├── api/          (api.js, session.js, auth.js, products.js, orders.js, reviews.js, users.js)
│       ├── assets/       (img/, styles/index.css)
│       ├── components/   (AdminRoute, Button, Footer, NavBar, ProtectedRoute)
│       ├── context/      (AuthContext.jsx)
│       ├── layouts/      (AuthLayout.jsx, Layout.jsx)
│       └── pages/
│           ├── NotFoundPage.jsx
│           ├── AdminPages/     (Orders, Products, Reviews, Users)
│           ├── AuthPages/      (SignIn, SignUp)
│           ├── CustomerPages/  (Cart, Orders, Profile)
│           └── LandingPages/   (About, Home, ProductList, Product)
└── turno-server/
    ├── .env.example
    ├── package.json
    └── src/
        ├── server.js     (connects to MongoDB and starts the API)
        ├── app.js
        ├── seed.js       (npm run seed)
        ├── seedData.js
        ├── config/       (cloudinary.js, constants.js)
        ├── controllers/  (user, product, category, supplier, cart, order, review, log)
        ├── middleware/   (authentication, authorization, validation, rate limiter, upload, audit logger, error handler)
        ├── models/       (productModel, categoryModel, supplierModel, cartModel, orderModel, reviewModel, userModel, logModel)
        ├── routes/       (userRoutes, authRoutes, productRoutes, categoryRoutes, supplierRoutes, cartRoutes, orderRoutes, reviewRoutes, logRoutes)
        └── utils/        (migrateLegacyData.js)
```

See [turno-server/README.md](turno-server/README.md) for the data model, every route with its allowed roles, and the security setup.

## Notes

- `node_modules/` and `dist/` are not included in the structure above because they are generated folders.
- The application uses `Layout.jsx` for public pages and `AuthLayout.jsx` for authentication pages.
- Order prices and totals are always calculated by the server from the database. Placing an order reserves stock, and cancelling it puts the stock back.

## Enhancement Instructions
- Enhancement 1: Develop an original product catalog with appropriate product names, descriptions, prices, categories, and images.
- Enhancement 2: Create a customized footer and notfoundpage that aligns with the website theme and ensure that all links function correctly.
- Enhancement 3: Provide accessible navigation links for both Sign In and Sign Up pages.
- Enhancement 4: Improve the overall visual design through consistent colors, typography, spacing, and imagery without changing the existing component order or page structure.
- Enhancement 5: Research and apply a custom font to the web application using an appropriate implementation method.
