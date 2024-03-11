const mongoose = require('mongoose');
/**
 * Question Schema
 */
const questionSchema = mongoose.Schema({
  userId: {
    type: String,
    required: true,
  },
  name: String,
  createdOn: Date,
  message: {
    type: String,
    required: true,
  },
  reply: {
    type: String,
  },
});

module.exports = {
  Question: mongoose.model('Question', questionSchema),
  questionSchema,
};
