const express = require('express');
const cors = require('cors');
require('dotenv').config();

const connectDB = require('./config/db');
const offerRoutes = require('./routes/offerRoutes');
const { notFound, errorHandler } = require('./middleware/errorHandler');
const authRoutes = require('./routes/authRoutes');
const claimRoutes = require('./routes/claimRoutes');

const app = express();

// Middleware
app.use(cors());
app.use(express.json());

// Routes
app.use('/api/offers', offerRoutes);
app.use('/api/auth', authRoutes);
app.use('/api', claimRoutes);

app.use(notFound);
app.use(errorHandler);

// Test route
app.get('/api/health', (req, res) => {
  res.json({ status: 'ok', message: 'Server is running' });
});

const PORT = process.env.PORT;

const startServer = async () => {
  await connectDB();

  app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
  });
};

startServer();