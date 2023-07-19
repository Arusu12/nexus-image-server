const mongoose = require('mongoose');

const token = new mongoose.Schema({
  owner: String,
  uses: Number,
  maxUses: Number,
  token: String
});

const Token = mongoose.model('token', token);

module.exports = Token