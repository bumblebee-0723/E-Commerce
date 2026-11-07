# E-commerce Application

A full-stack e-commerce application with a React/Vite frontend and a Node.js/Express backend using Sequelize and MySQL.

## Repository structure

- `Backend/` — Express API, Sequelize models, and database configuration.
- `Frontend/` — React single-page application built with Vite.

## Requirements

- Node.js and npm
- MySQL server

## Run locally

### 1. Configure and start the backend

```sh
cd Backend
npm install
```

Create `Backend/.env` using `Backend/.env.example` as a template. Set the database host, port, name, username, and password for your local MySQL instance. Then start the API:

```sh
npm run dev
```

The API listens on port `8080` by default and uses the `/api` route prefix. The database must be available before the server starts.

### 2. Start the frontend

In another terminal:

```sh
cd Frontend
npm install
npm run dev
```

Open the local URL printed by Vite. The frontend currently sends API requests to `http://localhost:8080/api`.

## Before publishing

- Keep local `.env` files and credentials out of Git; use `.env.example` files for safe configuration templates.
- Review all staged changes and confirm no credentials, personal data, or generated files are included.
- Add a `LICENSE` only after choosing the license terms for this project; GitHub does not require one to push a repository.
