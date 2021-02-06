const mongoose = require("mongoose");

const StoreSchema = new mongoose.Schema({});

module.exports = Store = mongoose.model("store", StoreSchema);
