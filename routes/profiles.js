const express = require('express');
const router = express.Router();
const auth = require('../middleware/auth');
const { check, validationResult } = require('express-validator');

//MODELS
const User = require('../models/User');
const Profile = require('../models/Profile');

const profileValidations = [
  check('location', 'Please enter a location').not().isEmpty(),
  check('bio', 'Please tell us a few words about your shop.').not().isEmpty(),
];

const productValidations = [
  check('name', 'Please enter a location').not().isEmpty(),
  check('price', 'Please enter a price').not().isEmpty(),
  check('quantity', 'Please enter a quantity').not().isEmpty(),
];

/////////////////////////// CREATE AND UPDATE PROFILE ///////////////////////////////////////////////
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

///////////////////// GET ALL PROFILES /////////////////////////////////////////
router.get('/', async (req, res) => {
  try {
    const allProfiles = await Profile.find().populate('user', [
      'first_name',
      'last_name',
    ]);
    res.json(allProfiles);
  } catch (error) {
    console.error(error.message);
    res.status(500).send('Server Error');
  }
});

///////////////////// DELETE USER PROFILE AND POSTS /////////////////////////////////////////
router.delete('/', auth, async (req, res) => {
  try {
    //Find profile based on user id and remove
    await Profile.findOneAndRemove({ user: req.user.id });
    //Find user and remove
    await User.findOneAndRemove({ _id: req.user.id });

    res.json({ message: 'User and associated data successfuly deleted' });
  } catch (error) {
    console.error(error.message);
    res.status(500).send('Server Error');
  }
});

///////////////////////// GET PROFILE BY USER ID ///////////////////////////////////////
router.get('/user/:user_id', async (req, res) => {
  try {
    const userProfile = await Profile.findOne({
      user: req.params.user_id,
    }).populate('user', ['first_name', 'last_name']);
    if (!userProfile) {
      return res.status(400).json({ message: 'Profile not found' });
    }
    res.json(userProfile);
  } catch (error) {
    console.error(error.message);

    //check the error to distinguish between a user not found and server error
    if (error.kind == 'ObjectId') {
      return res.status(400).json({ message: 'Profile not found' });
    }
    res.status(500).send('Server Error');
  }
});

///////////////////////// GET USERS PROFILE ///////////////////////////////////////
router.get('/me', auth, async (req, res) => {
  try {
    // Find profile based on the user id and populate user info
    const userProfile = await Profile.findOne({
      user: req.user.id,
    }).populate('user', ['first_name', 'last_name']);

    // Return 400 if no profile can be found for the user
    if (!userProfile) {
      return res
        .status(400)
        .json({ message: 'A profile cannot be fount for this user' });
    }

    // If no errors present return the profile
    res.json(userProfile);
  } catch (error) {
    console.error(error.message);
    res.status(500).send('Server Error');
  }
});

//@TODO UPDATE PROFILE PRODUCT /////////////////////////////////////////
///////////////////////// ADD PROFILE PRODUCT ///////////////////////////////////////
router.put('/product', [auth, productValidations], async (req, res) => {
  // check validations for erros and return them if any are present
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({ errors: errors.array() });
  }
  // Destructure data from request object
  const { name, price, quantity, description } = req.body;
  // Create new product object
  const newProduct = {
    name,
    price,
    quantity,
    description,
  };
  try {
    //find the profile for the logged in user and update
    const profile = await Profile.findOne({ user: req.user.id });
    profile.product.unshift(newProduct);
    await profile.save();
    res.json(profile);
  } catch (error) {
    console.error(error.message);
    res.status(500).sendStatus('Server Error');
  }
});

///////////////////// DELETE PROFILE PRODUC /////////////////////////////////////////
router.delete('/product/:prod_id', auth, async (req, res) => {
  try {
    //Find profile based on user id
    profile = await Profile.findOne({ user: req.user.id });

    //Find the index of the product you wish to remove
    const productIndex = profile.product
      .map((product) => product.id)
      .indexOf(req.params.prod_id);

    //Remove the product and return the new profile
    profile.experience.splice(productIndex, 1);
    await profile.save();
    res.json(profile);
  } catch (error) {
    console.error(error.message);
    res.status(500).send('Server Error');
  }
});

module.exports = router;
