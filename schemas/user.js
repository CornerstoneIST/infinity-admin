var
  mongoose = require('mongoose'),
  user = new mongoose.Schema({
  first_name: {
    type: String,
    required: true
  },
  last_name: {
    type: String,
    required: true
  },
  sso_id: {
    type: Number,
    default: 1,
    required: true
  },
  avatar: {
    type: String,
  },
  email: {
    type: String,
    required: true
  },
  recovery_email: {
    type: String,
    required: true
  },
  sec_quest_1: {
    type: String,
    required: true
  },
  sec_quest_2: {
    type: String,
    required: true
  },
  sec_answer_1: {
    type: String,
    required: true
  },
  sec_answer_2: {
    type: String,
    required: true
  },
  stripeToken: {
    type: String,
    required: true
  }
});

module.exports = mongoose.model('User', user);
