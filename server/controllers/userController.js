const { validationResult } = require('express-validator');
const User = require('../models/User');

const updateProfile = async (req, res) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({ message: 'Validation failed', errors: errors.array() });
  }

  const { email, phone, dateOfBirth, address } = req.body;

  try {
    if (email && email !== req.user.email) {
      const existingUser = await User.findOne({ email });
      if (existingUser) {
        return res.status(409).json({ message: 'Email is already in use' });
      }
      req.user.email = email;
    }

    if (phone !== undefined) {
      req.user.phone = phone;
    }

    if (dateOfBirth !== undefined) {
      req.user.dateOfBirth = dateOfBirth ? new Date(dateOfBirth) : null;
    }

    if (address) {
      req.user.address = {
        street: address.street ?? req.user.address?.street ?? '',
        city: address.city ?? req.user.address?.city ?? '',
        state: address.state ?? req.user.address?.state ?? '',
        zip: address.zip ?? req.user.address?.zip ?? '',
        country: address.country ?? req.user.address?.country ?? '',
      };
    }

    await req.user.save();

    return res.json({
      message: 'Profile updated successfully',
      user: req.user.toPublicJSON(),
    });
  } catch (error) {
    return res.status(500).json({ message: 'Unable to update profile' });
  }
};

const changePassword = async (req, res) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({ message: 'Validation failed', errors: errors.array() });
  }

  const { currentPassword, newPassword } = req.body;

  try {
    const user = await User.findById(req.user._id).select('+password');
    const isMatch = await user.matchPassword(currentPassword);

    if (!isMatch) {
      return res.status(401).json({ message: 'Current password is incorrect' });
    }

    user.password = newPassword;
    await user.save();

    return res.json({ message: 'Password updated successfully' });
  } catch (error) {
    return res.status(500).json({ message: 'Unable to update password' });
  }
};

module.exports = { updateProfile, changePassword };
