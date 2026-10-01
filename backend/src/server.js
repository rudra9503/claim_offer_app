const express = require('express');
const cors = require('cors');
require('dotenv').config();
const connectDB = require('./config/db');
const offerRoutes = require('./routes/offerRoutes');
const { notFound, errorHandler } = require('./middleware/errorHandler');
const authRoutes = require('./routes/authRoutes');


const app = express();

// Middleware
app.use('/api/offers', offerRoutes);   // Use offer routes for /api/offers
app.use(cors());           // allow requests from the React app
app.use(express.json());   // parse JSON request bodies into req.body
app.use('/api/offers', offerRoutes);  // Use offer routes for /api/offers
app.use('/api/auth', authRoutes);

app.use(notFound);  // Handle 404 for unmatched routes
app.use(errorHandler);  // Handle errors and send JSON responses

// Test route
app.get('/api/health', (req, res) => {
  res.json({ status: 'ok', message: 'Server is running' });
});

const PORT = process.env.PORT 

const startServer = async () => {
  await connectDB();
  app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
  });
};

startServer();