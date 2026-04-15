# Finance Manager

A beginner-friendly full-stack finance manager built with React (Vite), Node.js, Express, MongoDB, Mongoose, and JWT authentication.

## Features

- Register and log in with JWT auth
- Add and delete income or expense transactions
- View dashboard totals and recent transactions
- Set monthly budgets and track category spending
- Create and read notifications
- Add recurring bills with due-date tracking
- Manage multiple accounts and transfer funds
- Update user profile and preferred currency

## Project Structure

```text
finance-manager/
  client/
  server/
```

## Environment Setup

Create environment files from the examples:

```powershell
Copy-Item server/.env.example server/.env
Copy-Item client/.env.example client/.env
```

Update `server/.env` if your MongoDB URI, JWT secret, or frontend URL are different.

## Run Step by Step

1. Make sure MongoDB is running locally.
2. Install backend dependencies:

```powershell
cd server
npm install
```

3. Install frontend dependencies in a second terminal:

```powershell
cd client
npm install
```

4. Start the backend:

```powershell
cd server
npm run dev
```

5. Start the frontend:

```powershell
cd client
npm run dev
```

6. Open the Vite URL shown in the terminal, usually `http://localhost:5173`.

## Optional Root Scripts

From the `finance-manager` folder you can also use:

```powershell
npm run install:all
npm run dev:server
npm run dev:client
```

## Backend API Base URL

The frontend expects the backend at:

```text
http://localhost:5000/api
```

## Notes

- A default `Main Cash` account is created automatically when a user registers.
- Budget tracking is based on expense transactions for the selected month.
- Account transfers create a `transfer` transaction in the backend.
