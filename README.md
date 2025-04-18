# Personal Finance Visualizer

A web application for tracking personal finances, visualizing expenses, and managing budgets.

## Features

- Transaction tracking
- Expense visualization
- Budget management

## Technologies Used

- React
- Express
- MongoDB
- Recharts for data visualization
- Tailwind CSS for styling

## Setup Instructions

### Prerequisites

- Node.js and npm installed
- MongoDB (local or cloud instance) - **Required**

### Installation

1. Clone the repository
2. Install dependencies:
   ```
   npm run install-all
   ```

3. Set up MongoDB (required):
   - Create a `.env` file in the server directory
   - Add your MongoDB connection string:
     ```
     MONGO_URL=mongodb://localhost:27017/finance-visualizer
     PORT=5000
     ```
   - For MongoDB Atlas (cloud), use a connection string like:
     ```
     MONGO_URL=mongodb+srv://username:password@cluster.mongodb.net/finance-visualizer?retryWrites=true&w=majority
     ```
   - Note: The application requires a working MongoDB connection to start

4. Seed the database (optional):
   ```
   cd server
   npm run seed
   ```

5. Start the application:
   ```
   npm start
   ```

## Project Structure

- `/client` - React frontend
- `/server` - Express backend
- `/server/models` - MongoDB models
- `/server/data.js` - Sample data for seeding the database

## API Endpoints

- `GET /api/transactions` - Get all transactions
- `POST /api/transactions` - Add a new transaction
- `PUT /api/transactions/:id` - Update a transaction
- `DELETE /api/transactions/:id` - Delete a transaction
