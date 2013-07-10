var
  mongoose = require('mongoose'),
  member = new mongoose.Schema({
  name: {
    type: String,
    required: true
  },
  sso_id: {
    type: Number,
    default: 1,
    required: true
  },
  email: {
    type: String,
    required: true
  },
  company: {
    type: String,
    required: true
  },
  state: {
    type: String,
    required: true
  },
  phone: {
    type: String,
    required: true
  },
  website: {
    type: String,
    required: true
  },
  street: {
    type: String,
    required: true
  },
  city: {
    type: String,
    required: true
  },
  postal: {
    type: String,
    required: true
  },
  avatar: {
    type: String,
  },
  notes: {
    type: String,
  }
});

module.exports = mongoose.model('Member', member);
