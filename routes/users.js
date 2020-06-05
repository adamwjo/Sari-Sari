const express = require('express');
const router = express.Router();
const { check, validationResult } = require('express-validator');
const User = require('../models/User');

const newUserValidations = [
  check('first_name', 'Please submit a first name').not().isEmpty(),
  check('email', 'Please submit a valid email').isEmail(),
  check('password', 'Your password must be at least 6 characters').isLength({
    min: 6,
  }),
];

//Test route
router.get('/', (req, res) => {
  res.send('Users Route');
});

//POST route (Create new User)
router.post('/', newUserValidations, async (req, res) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({ errors: errors.array() });
  }

  const { first_name, last_name, username, email, password } = req.body;

  try {
    let user = await User.findOne({ email });
    if (user) {
      res
        .status(400)
        .json({ errors: [{ message: 'User already exits in database' }] });
    }

    res.send('Creating New User');
  } catch (error) {
    console.error(error.message);
    res.status(500);
  }

  res.send('Creating New User');
});

module.exports = router;
