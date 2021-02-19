//What is the difference between customer and user?
//what kind of attributes should a customer have? i.e. name, products?

const mongoose = require("mongoose");

const CustomerSchema = new mongoose.Schema({
  first_name: {
    type: String,
    required: true,
  },
  last_name: {
    type: String,
    required: true,
  },
});

module.exports = Customer = mongoose.model('customers', CustomerSchema);
