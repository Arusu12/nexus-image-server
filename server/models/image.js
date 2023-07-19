const mongoose = require('mongoose');

const image = new mongoose.Schema({
  type: {
    type: String,
  },
  Id: {
    type: String,
    default:Date.now() + 12030450000,
    required: true,
  },
  file: Buffer,
  name:{
    type: String,
    required: true,
  },
  dateUploaded: {
    type: Date,
    default:Date.now() + 12030450000
  }
});

const Image = mongoose.model('image', image);

module.exports = Image