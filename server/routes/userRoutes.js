const { body } = require('express-validator');
const express = require('express');
const { updateProfile, changePassword } = require('../controllers/userController');
const { protect } = require('../middleware/authMiddleware');

const router = express.Router();

router.put(
  '/profile',
  protect,
  [
    body('email').optional().isEmail().withMessage('A valid email is required'),
    body('phone')
      .optional({ values: 'null' })
      .trim()
      .isLength({ max: 20 })
      .withMessage('Phone number is too long'),
    body('dateOfBirth')
      .optional({ values: 'null' })
      .isISO8601()
      .withMessage('Date of birth must be a valid date'),
    body('address.street').optional().trim().isLength({ max: 120 }),
    body('address.city').optional().trim().isLength({ max: 80 }),
    body('address.state').optional().trim().isLength({ max: 80 }),
    body('address.zip').optional().trim().isLength({ max: 20 }),
    body('address.country').optional().trim().isLength({ max: 80 }),
  ],
  updateProfile
);

router.put(
  '/password',
  protect,
  [
    body('currentPassword').notEmpty().withMessage('Current password is required'),
    body('newPassword')
      .isLength({ min: 6 })
      .withMessage('New password must be at least 6 characters'),
  ],
  changePassword
);

module.exports = router;
