var
  mongoose = require('mongoose'),
  plan = new mongoose.Schema({
  name: {
    type: String,
    enum: [ 'starter', 'professional', 'advanced' ],
    required: true
  }
});

module.exports = mongoose.model('Plan', plan);
