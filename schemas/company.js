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
    ref: 'Plan'
  },
  address: {
    type: String
  },
  floor: {
    type: String
  },
  code: {
    type: Number
  },
  city: {
    type: String
  },
  province: {
    type: String
  },
  country: {
    type: String
  },
  integration: {
    zendesk: {
      apiKey: {
        type: String
      },
      subDomain: {
        type: String
      }
    },
    freshbooks: {
      apiKey: {
        type: String
      },
      subDomain: {
        type: String
      }
    }
  }
});

module.exports = mongoose.model('Company', company);
