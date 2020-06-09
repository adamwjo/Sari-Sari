const express = require('express');
const config = require('config');
const router = express.Router();
const auth = require('../middleware/auth');
const { check, validationResult } = require('express-validator');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');

// Import User Model
const User = require('../models/User');

const userLoginValidations = [
  check('email', 'Please submit a valid email').isEmail(),
  check('password', 'Please submit a valid password').exists(),
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
router.post('/login', userLoginValidations, async (req, res) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({ errors: errors.array() });
  }

  const { email, password } = req.body;

  try {
    // -----> Check db for user by email, if no user send json error
    let user = await User.findOne({ email });
    if (!user) {
      res
        .status(400)
        .json({ errors: [{ message: 'Invalid username or password' }] });
    }
    // -----> Validate Password
    const passValidate = await bcrypt.compare(password, user.password);
    if (!passValidate) {
      res
        .status(400)
        .json({ errors: [{ message: 'Invalid username or password' }] });
    }
    // -----> create payload and distribute token
    const payload = {
      user: {
        id: user.id,
      },
    };
    jwt.sign(
      payload,
      config.get('jwtSecret'),
      { expiresIn: 3600000 },
      (error, token) => {
        if (error) {
          res
            .status(401)
            .json({ errors: [{ message: 'Token not authorized' }] });
        }
        res.json({ token });
      }
    );
  } catch (error) {
    console.error(error.message);
    res.status(500);
  }
});

module.exports = router;
