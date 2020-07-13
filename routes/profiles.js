const express = require('express');
const router = express.Router();
const auth = require('../middleware/auth');

//MODELS
const profile = require('../models/Profile');
const user = require('../models/User');
const Profile = require('../models/Profile');

// GET - TEST
router.get('/', (req, res) => {
  res.send('Profiles Route');
});

// GET - GET USERS PROFILE
router.get('/me', auth, async (req, res) => {
  try {
    const userProfile = await await Profile.findOne({
      user: req.user.id,
    }).populate('user', ['first_name', 'last_name']);
    if (!userProfile) {
      return res
        .status(400)
        .json({ message: 'A profile cannot be fount for this user' });
    }
    res.json(profile);
  } catch (error) {
    console.error(error.message);
    res.status(500).send('Server Error');
  }
});

module.exports = router;
