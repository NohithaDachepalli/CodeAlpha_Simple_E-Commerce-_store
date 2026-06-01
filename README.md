# ShopEase - Modern E-Commerce Store

ShopEase is a full-stack e-commerce application built with React, Vite, Tailwind CSS, Express, MongoDB Atlas, Mongoose, JWT authentication, bcrypt password hashing, shopping cart persistence, order processing, reviews, wishlist, and an admin dashboard.

## Features

- Modern responsive storefront with hero, featured products, categories, promotional banners, dark/light mode, skeleton loading, toast notifications, search suggestions, recently viewed products, newsletter, FAQ, and contact page.
- JWT authentication with registration, login, logout, protected profile route, password hashing, input validation, and secure middleware.
- Product catalog with search, category filter, price filter, sorting, pagination, reviews, ratings, and product details.
- Persistent cart using local storage plus backend cart endpoints.
- Checkout with shipping form, payment method selection, order creation, confirmation, and order history.
- Admin dashboard for statistics, products, users, orders, order status updates, deletes, and sales analytics cards.
- MongoDB models for users, products, carts, orders, and newsletter subscribers.

## Setup

1. Install dependencies:

```bash
npm install
```

2. Create `.env` in the project root:

```env
PORT=5000
MONGODB_URI=your_mongodb_atlas_connection
JWT_SECRET=your_secret_key
CLIENT_URL=http://localhost:5173
```

3. Seed realistic sample products and an admin user:

```bash
npm run seed
```

4. Run the full stack app:

```bash
npm run dev
```

Frontend: `http://localhost:5173`

Backend: `http://localhost:5000`

## Demo Admin

After seeding:

- Email: `admin@shopease.dev`
- Password: `Admin123!`

## API Endpoints

Authentication:

- `POST /api/auth/register`
- `POST /api/auth/login`
- `GET /api/auth/profile`

Products:

- `GET /api/products`
- `GET /api/products/:id`
- `POST /api/products`
- `PUT /api/products/:id`
- `DELETE /api/products/:id`

Cart:

- `POST /api/cart`
- `GET /api/cart`

Orders:

- `POST /api/orders`
- `GET /api/orders`
- `GET /api/orders/all`
- `PUT /api/orders/:id`
- `DELETE /api/orders/:id`

Users:

- `GET /api/users`
- `DELETE /api/users/:id`

Utility:

- `POST /api/newsletter`
- `POST /api/contact`

## Project Structure

```text
src/
  components/
  pages/
  layouts/
  context/
  services/
  hooks/
  assets/
  App.jsx
  main.jsx

server/
  controllers/
  models/
  routes/
  middleware/
  config/
  utils/
  data/
  server.js
```
