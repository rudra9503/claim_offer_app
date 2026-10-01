const bcrypt = require('bcryptjs');
const Customer = require('../models/customer');
const AppError = require('../utils/AppError');
const jwt = require('jsonwebtoken');

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

// POST /api/auth/login
const login = async (req, res, next) => {
  try {
    const { email, password } = req.body;

    if (!email || !password || typeof email !== 'string' || typeof password !== 'string') {
      throw new AppError('Email and password are required', 400);
    }

    // password is hidden by default in the model, so we ask for it explicitly
    const customer = await Customer.findOne({
      email: email.toLowerCase().trim(),
    }).select('+password');

    // Same message for "no such email" and "wrong password" (do not reveal which)
    const isMatch = customer && (await bcrypt.compare(password, customer.password));
    if (!isMatch) {
      throw new AppError('Invalid email or password', 401);
    }

    const token = jwt.sign({ id: customer._id }, process.env.JWT_SECRET, {
      expiresIn: process.env.JWT_EXPIRES_IN || '1d',
    });

    res.json({
      message: 'Login successful',
      token,
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

// GET /api/auth/me  (protected)
const getMe = (req, res) => {
  const { _id, name, email, mobile } = req.customer;
  res.json({ customer: { id: _id, name, email, mobile } });
};

module.exports = { register, login, getMe };

