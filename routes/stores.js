const express = require("express");
const Store = require("../models/Store");
const router = express.Router();

///////////////////// GET ALL STORES /////////////////////////////////////////

router.get("/", async (req, res) => {
  try {
    const allStores = await Store.find({});
    res.send(allStores);
  } catch (error) {
    console.error(error.message);
    res.status(500).send("Server Error");
  }
});

module.exports = router;
