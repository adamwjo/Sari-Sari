const express = require('express');
const config = require('config');
const router = express.Router();
const auth = require('../middleware/auth');
const { check, validationResult } = require('express-validator');
const jwt = require('jsonwebtoken');
// Import User Model
const User = require('../models/User');

const userLoginValidations = [
  check('email', 'Please submit a valid email').isEmail(),
  check('password', 'Your password must be at least 6 characters').isLength({
    min: 6,
  }),
];

// USER AUTH ROUTE
router.get('/', auth, async (req, res) => {
  try {
    const user = await User.findById(req.user.id).select('-password');
    res.json(user);
  } catch (error) {
    console.error(error);
    res.status(500).send('server error');
  }
});

// USER LOGIN ROUTE
router.post('/', userLoginValidations, (req, res) => {});

module.exports = router;
