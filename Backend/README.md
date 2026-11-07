# E-commerce Node.js Express Backend (`Backend1`)

This is a complete Node.js + Express + Sequelize/MySQL implementation of the E-commerce backend, providing 100% feature parity and drop-in compatibility with the original Java Spring Boot `Backend`.

The original `Backend` and `Frontend` directories remain completely untouched.

---

## 🚀 Features & Compatibility

- **Exact Endpoint Parity**: All endpoints match the Java Spring Boot REST controllers under `/api`.
- **Database Compatibility**: Connects to the same MySQL database (`mycompany`) using Sequelize ORM with identical table structures (`product`, `orders`, `order_item`).
- **Binary Image Handling**:
  - Handles multipart/form-data image uploads (`imageFile`) and saves binary buffers into MySQL `LONGBLOB` (`image_data`).
  - Serializes `imageData` to base64 strings in JSON responses (matching Spring Boot / Jackson behavior expected by the React frontend).
  - Provides binary image streaming endpoint `/api/product/:productId/image`.
- **Order Management & Transactions**:
  - Decrements product inventory stock on checkout inside an ACID transaction.
  - Automatically generates order identifiers with format `ORD` + 8 uppercase characters.
  - Formats order item responses with product details and calculated subtotals.
- **Frontend Compatible**: Runs by default on port `8080` (configured in `Frontend/.env`).

---

## 📁 Project Structure

```
Backend1/
├── package.json
├── .env                  # Environment variables (port, db credentials)
├── .env.example
├── .gitignore
├── server.js             # Application entrypoint
├── src/
│   ├── app.js            # Express application setup, CORS & middlewares
│   ├── config/
│   │   └── database.js   # MySQL & Sequelize database configuration
│   ├── models/           # Sequelize ORM models
│   │   ├── Product.js    # Product entity
│   │   ├── Order.js      # Order entity
│   │   ├── OrderItem.js  # OrderItem entity
│   │   └── index.js      # Relationships & model exports
│   ├── controllers/      # Route request/response handlers
│   │   ├── productController.js
│   │   └── orderController.js
│   ├── services/         # Business logic layer
│   │   ├── productService.js
│   │   └── orderService.js
│   ├── routes/           # Express routers
│   │   ├── productRoutes.js
│   │   ├── orderRoutes.js
│   │   └── index.js
│   └── middlewares/
│       └── upload.js     # Multer memory storage for file uploads
```

---

## 🛠️ Getting Started

### 1. Prerequisites
- **Node.js** (v18 or higher recommended)
- **MySQL** running on `localhost:3306`

### 2. Install Dependencies
```bash
cd Backend1
npm install
```

### 3. Configure Environment Variables
Verify or edit `.env` in `Backend1`:
```env
PORT=8080
DB_HOST=localhost
DB_PORT=3306
DB_NAME=mycompany
DB_USER=root
DB_PASSWORD=Charan@2008
DB_DIALECT=mysql
```

> **Note**: If the database `mycompany` does not exist yet, the application will automatically create it on startup (`CREATE DATABASE IF NOT EXISTS mycompany`).

### 4. Run the Server
- **Development mode** (with auto-restart via nodemon):
  ```bash
  npm run dev
  ```
- **Production mode**:
  ```bash
  npm start
  ```

---

## 📡 API Reference

All endpoints are prefixed with `/api`.

| Method | Endpoint | Description |
|---|---|---|
| `GET` | `/api/products` | Retrieve all products (with base64 image data) |
| `GET` | `/api/product/:productId` | Retrieve single product details by ID |
| `GET` | `/api/product/:productId/image` | Retrieve raw binary image of the product |
| `POST` | `/api/product` | Add a new product (multipart: `product` JSON + `imageFile`) |
| `PUT` | `/api/product/:id` | Update product details and optional new image |
| `DELETE` | `/api/product/:productId` | Delete product by ID |
| `GET` | `/api/products/search?keyword=:keyword` | Search products across name, description, brand, category |
| `POST` | `/api/orders/place` | Place an order, decrements stock & creates order items |
| `GET` | `/api/orders` | Retrieve list of all orders with items & total calculation |
