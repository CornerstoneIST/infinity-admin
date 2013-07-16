var
  mongoose = require('mongoose'),
  ticket = new mongoose.Schema({
  number: {
    type: Number,
    required: true
  },
  date: {
    type: Date,
    'default': Date.now,
    required: true
  },
  member: {
    type: mongoose.Schema.ObjectId,
    ref: 'Member',
    required: true
  },
  status: {
    type: String,
    required: true,
    'default': 'uncompleted',
    enum: [ 'completed', 'uncompleted' ]
  },
  hours: {
    type: Number,
    'default': 0,
    required: true
  },
  client: {
    type: mongoose.Schema.ObjectId,
    ref: 'Client',
    required: true
  }
});

module.exports = mongoose.model('Ticket', ticket);
