var
  mongoose = require('mongoose'),
  client = new mongoose.Schema({
  name: {
    type: String,
    required: true
  },
  company: {
    type: mongoose.Schema.ObjectId,
    ref: 'Company',
    required: true
  }
});

module.exports = mongoose.model('Client', client);
