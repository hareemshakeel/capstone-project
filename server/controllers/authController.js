const jwt = require('jsonwebtoken');
const { validationResult } = require('express-validator');
const User = require('../models/User');

const signToken = (userId) =>
  jwt.sign({ id: userId }, process.env.JWT_SECRET, {
    expiresIn: process.env.JWT_EXPIRES_IN || '7d',
  });

const register = async (req, res) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({ message: 'Validation failed', errors: errors.array() });
  }

  const { email, password } = req.body;

  try {
    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return res.status(409).json({ message: 'An account with this email already exists' });
    }

    const user = await User.create({ email, password });
    const token = signToken(user._id);

    return res.status(201).json({
      token,
      user: user.toPublicJSON(),
    });
  } catch (error) {
    return res.status(500).json({ message: 'Unable to create account' });
  }
};

const login = async (req, res) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({ message: 'Validation failed', errors: errors.array() });
  }

  const { email, password } = req.body;

  try {
    const user = await User.findOne({ email }).select('+password');
    if (!user || !(await user.matchPassword(password))) {
      return res.status(401).json({ message: 'Invalid email or password' });
    }

    const token = signToken(user._id);

    return res.json({
      token,
      user: user.toPublicJSON(),
    });
  } catch (error) {
    return res.status(500).json({ message: 'Unable to log in' });
  }
};

const getMe = async (req, res) => {
  return res.json({ user: req.user.toPublicJSON() });
};

module.exports = { register, login, getMe };
