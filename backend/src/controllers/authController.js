const bcrypt = require('bcryptjs');
const Customer = require('../models/customer');
const AppError = require('../utils/AppError');

// POST /api/auth/register
const register = async (req, res, next) => {
  try {
    const { name, email, mobile, password } = req.body;

    // 1. Required fields
    if (!name || !email || !mobile || !password) {
      throw new AppError('Name, email, mobile and password are required', 400);
    }

    // 2. Basic format checks
    if (!/^\S+@\S+\.\S+$/.test(email)) {
      throw new AppError('Please enter a valid email address', 400);
    }
    if (typeof password !== 'string' || password.length < 6) {
      throw new AppError('Password must be at least 6 characters', 400);
    }

    // 3. Email must not be registered already
    const normalizedEmail = email.toLowerCase().trim();
    const existing = await Customer.findOne({ email: normalizedEmail });
    if (existing) {
      throw new AppError('Email is already registered', 409);
    }

    // 4. Hash the password, then save
    const hashedPassword = await bcrypt.hash(password, 10);
    const customer = await Customer.create({
      name,
      email: normalizedEmail,
      mobile,
      password: hashedPassword,
    });

    // 5. Respond WITHOUT the password
    res.status(201).json({
      message: 'Registration successful',
      customer: {
        id: customer._id,
        name: customer.name,
        email: customer.email,
        mobile: customer.mobile,
      },
    });
  } catch (error) {
    next(error);
  }
};

module.exports = { register };