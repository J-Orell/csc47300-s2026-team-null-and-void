const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
require('dotenv').config();

const app = express();

// CORS: allow common Vite dev URLs (localhost vs 127.0.0.1 must match the browser address bar).
const defaultDevOrigins = [
  'http://localhost:5173',
  'http://localhost:5174',
  'http://127.0.0.1:5173',
  'http://127.0.0.1:5174',
];
const extraOrigins = (process.env.CORS_ORIGINS || '')
  .split(',')
  .map((o) => o.trim())
  .filter(Boolean);
const allowedOrigins = [...new Set([...defaultDevOrigins, ...extraOrigins])];

// Normalize Origin (Express / Node may surface duplicate headers as an array; trim whitespace).
app.use((req, _res, next) => {
  let origin = req.headers.origin;
  if (Array.isArray(origin)) {
    origin = origin[0];
  }
  if (typeof origin === 'string') {
    req.headers.origin = origin.trim();
  }
  next();
});

const corsOptions = {
  origin: allowedOrigins,
  credentials: true,
  methods: ['GET', 'HEAD', 'PUT', 'PATCH', 'POST', 'DELETE', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization'],
};

// CORS (use static origin list so preflight always gets headers when Origin matches).
app.use(cors(corsOptions));

// Middleware
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// MongoDB Connection (default DB is "test" if no database name is in MONGO_URI)
const mongoDbName = process.env.MONGO_DB_NAME || 'budgetbuddy';
mongoose
  .connect(process.env.MONGO_URI, { dbName: mongoDbName })
  .then(() =>
    console.log(`✅ MongoDB connected (database: ${mongoose.connection.db.databaseName})`)
  )
  .catch((err) => console.error('❌ MongoDB connection error:', err));

// Routes
app.use('/api/users', require('./routes/userRoutes'));
app.use('/api/budgets', require('./routes/budgetRoutes'));
app.use('/api/transactions', require('./routes/transactionRoutes'));
app.use('/api/savings-goals', require('./routes/savingsGoalRoutes'));
app.use('/api/settings', require('./routes/settingsRoutes'));

// Health check endpoint
app.get('/api/health', (req, res) => {
  res.json({
    status: 'API server running',
    database:
      mongoose.connection.readyState === 1
        ? mongoose.connection.db.databaseName
        : 'disconnected',
  });
});

// Error handling middleware
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).json({
    message: 'Internal server error',
    error: process.env.NODE_ENV === 'production' ? {} : err,
  });
});

// Default 5050: macOS AirPlay Receiver often binds :5000 and returns 403 to HTTP (breaks CORS preflight).
const PORT = process.env.PORT || 5050;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});

module.exports = app;
