const mongoose = require("mongoose");

const userSchema = new mongoose.Schema({
  uid: { type: String, required: true, unique: true },
  email: String,
  name: String,
  picture: String,
});

module.exports = mongoose.model("User", userSchema);
