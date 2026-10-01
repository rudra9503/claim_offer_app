const jwt = require('jsonwebtoken');
const Customer = require('../models/customer');
const AppError = require('../utils/AppError');

const protect = async (req, res, next) => {
  try {
    // 1. Read the header: "Authorization: Bearer <token>"
    const authHeader = req.headers.authorization;
    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      throw new AppError('Not authenticated. Please log in.', 401);
    }
    const token = authHeader.split(' ')[1];

    // 2. Verify the signature and expiry (throws if invalid or expired)
    const decoded = jwt.verify(token, process.env.JWT_SECRET);

    // 3. Make sure the customer still exists
    const customer = await Customer.findById(decoded.id);
    if (!customer) {
      throw new AppError('Customer no longer exists. Please log in again.', 401);
    }

    // 4. Make the logged-in customer available to the next handler
    req.customer = customer;
    next();
  } catch (error) {
    next(error);
  }
};

module.exports = { protect };