const express = require('express');
const router = express.Router();

router.get('/', (req, res) => {
    res.send('Customers Route');
});
  
  module.exports = router;
  