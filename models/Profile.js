const mongoose = require('mongoose');

const ProfileSchema = new mongoose.Schema({
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'user',
  },
  location: {
    type: String,
  },
  bio: {
    type: String,
  },
  store_info: {
    type: String,
  },
  address: {
    type: String,
  },
  specialties: {
    type: [String],
  },
  product: [
    {
      name: {
        type: String,
        required: true,
      },
      price: {
        type: Number,
        required: true,
      },
      quantity: {
        type: Number,
        required: true,
      },
      description: {
        type: String,
      },
    },
  ],
});

module.exports = Profile = mongoose.model('profile', ProfileSchema);
