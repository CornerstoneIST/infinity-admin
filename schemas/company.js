var
  mongoose = require('mongoose'),
  company = new mongoose.Schema({
  name: {
    type: String,
    required: true
  },
  owner: {
    type: mongoose.Schema.ObjectId,
    ref: 'User',
    required: true
  },
  plan: {
    type: mongoose.Schema.ObjectId,
    ref: 'Plan',
    required: true
  },
  address: {
    type: String,
    required: true
  },
  floor: {
    type: String,
    required: true
  },
  code: {
    type: Number,
    required: true
  },
  city: {
    type: String,
    required: true
  },
  province: {
    type: String
  },
  
  country: {
    type: String,
    required: true
  }
});

module.exports = mongoose.model('Company', company);
