const mongoose = require('mongoose');

const quoteSchema = new mongoose.Schema({
  taskId: {
    required: true,
    type: mongoose.Schema.Types.ObjectId,
  },
  userId: {
    required: true,
    type: mongoose.Schema.Types.ObjectId,
  },
  price: {
    type: Number,
    required: true,
  },
  message: {
    type: String,
    required: true,
  },
  status: {
    // can be only 'applied' or 'assigned' or 'completed' or 'cancelled by owner' or 'cancelled by genie'
    type: String,
    enum: ['applied', 'assigned', 'completed', 'cancelled'],
    default: 'applied',
    required: true,
  },
});

module.exports = mongoose.model('Quote', quoteSchema);
