const express = require('express');
const router = express.Router();
const auth = require('../middleware/auth');
const { check, validationResult } = require('express-validator');

//MODELS
const user = require('../models/User');
const Profile = require('../models/Profile');

const profileValidations = [
  check('location', 'Please enter a location').not().isEmpty(),
  check('bio', 'Please tell us a few words about your shop.').not().isEmpty(),
];

// GET - TEST //////////////////////////////////////////////////////////////////////
router.get('/', (req, res) => {
  res.send('Profiles Route');
});

// POST - CREATE AND UPDATE PROFILE ///////////////////////////////////////////////
router.post('/', [auth, profileValidations], async (req, res) => {
  // Check the request for any errors.
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({ errors: errors.array() });
  }

  //Destructure req for profile data
  const { location, bio, store_info, address, specialties } = req.body;

  //Build profile object
  const profileData = {};
  profileData.user = req.user.id;
  if (location) profileData.location = location;
  if (bio) profileData.bio = bio;
  if (store_info) profileData.store_info = store_info;
  if (address) profileData.address = address;
  if (specialties) {
    profileData.specialties = specialties
      .split(',')
      .map((specialty) => specialty.trim());
  }

  try {
    //check to see if profile exists
    let profile = await Profile.findOne({ user: req.user.id });
    // If profile exists update/re-set fields
    if (profile) {
      profile = await Profile.findOneAndUpdate(
        { user: req.user.id },
        { $set: profileData },
        { new: true }
      );
      return res.json(profile);
    }

    // if no profile exits create a new one
    profile = new Profile(profileData);
    await profile.save();
    return res.json(profile);
  } catch (error) {
    console.error(error.message);
    res.status(500).send('Server Error');
  }
});

// GET - GET USERS PROFILE //////////////////////////////////////////////////////
router.get('/me', auth, async (req, res) => {
  try {
    // Find profile based on the user id and populate user info
    const userProfile = await await Profile.findOne({
      user: req.user.id,
    }).populate('user', ['first_name', 'last_name']);

    // Return 400 if no profile can be found for the user
    if (!userProfile) {
      return res
        .status(400)
        .json({ message: 'A profile cannot be fount for this user' });
    }

    // If no errors present return the profile
    res.json(profile);
  } catch (error) {
    console.error(error.message);
    res.status(500).send('Server Error');
  }
});

module.exports = router;
