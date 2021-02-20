const express = require('express');
const router = express.Router();

//Model
const Customer = require('../models/Customer')

router.get('/', (req, res) => {
    res.send('Customers Route');
});

router.post('/', (req, res) => {
  const customer = new Customer({
    first_name: req.body.first_name
  })
})
  
  module.exports = router;
  