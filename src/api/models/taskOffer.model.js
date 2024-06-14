const mongoose = require('mongoose');

/**
 * Task Offer Schema
 */
const taskOfferSchema = mongoose.Schema({
  taskId: {
    type: String,
    required: true,
  },
  userId: {
    type: String,
    required: true,
  },
  message: {
    type: String,
    required: true,
  },
  amount: {
    type: Number,
    default: 0,
  },
});

/**
 * @typedef TaskOffer
 */
module.exports = mongoose.model('TaskOffer', taskOfferSchema);
