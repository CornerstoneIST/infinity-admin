var
  mongoose = require('mongoose'),
  client = new mongoose.Schema({
  name: {
    type: String,
    required: true
  }
});

module.exports = mongoose.model('Client', client);
