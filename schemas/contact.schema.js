const { Schema, model } = require('mongoose');

const contactSchema = Schema({
  name: {
    type: String,
    trim: true,
    required: [true, 'Set name for contact'],
  },
  phone: {
    type: String,
    trim: true,
    required: true,
  },
  email: {
    type: String,
    trim: true,
    required: true,
  },
  favorite: {
    type: Boolean,
    default: false,
  },
});

module.exports = model('contacts', contactSchema);
