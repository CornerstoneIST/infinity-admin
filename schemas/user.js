var
  mongoose = require('mongoose'),
  user = new mongoose.Schema({
  name: {
    type: String
  },
  company: {
    type: mongoose.Schema.ObjectId,
    ref: 'Company'
  },
  state: {
    type: String
  },
  phone: {
    type: String
  },
  website: {
    type: String
  },
  street: {
    type: String
  },
  city: {
    type: String
  },
  postal: {
    type: String
  },
  notes: {
    type: String,
  },
  password: {
    type: String,
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
    type: String
  },
  sec_quest_1: {
    type: String
  },
  sec_quest_2: {
    type: String
  },
  sec_answer_1: {
    type: String
  },
  sec_answer_2: {
    type: String
  },
  stripeToken: {
    type: String
  },
  type: {
    type: String,
    enum: [ 'owner', 'user' ]
  },
  activated: {
    type: Boolean,
    default: false
  }
});

module.exports = mongoose.model('User', user);
