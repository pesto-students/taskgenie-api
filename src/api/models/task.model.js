const mongoose = require('mongoose');
// Define task statuses
const taskStatus = ['open', 'assigned', 'cancelled', 'completed'];

// Define types of location
const locationType = ['remote', 'in-person'];

// Define types of date
const dateType = ['on', 'before', 'flexible'];

/**
 * Task Schema
 */
const taskSchema = new mongoose.Schema({
  title: {
    type: String,
    required: true,
  },
  description: {
    type: String,
    required: true,
    maxlength: 1000,
  },
  status: {
    type: String,
    default: 'open',
    enum: taskStatus,
  },
  budget: {
    type: Number,
    required: true,
  },
  createdOn: {
    type: Date,
    required: true,
  },
  lastEdited: {
    type: Date,
  },
  dateType: {
    type: String,
    enum: dateType,
    required: true,
  },
  date: {
    type: Date,
    required() {
      return ['on', 'before'].includes(this.dateType);
    },
  },
  locationType: {
    type: String,
    enum: locationType,
    required: true,
  },
  location: {
    type: {
      type: String,
    },
    coordinates: {
      type: [Number], // [longitude, latitude]
    },
  },
  locationName: {
    type: String,
  },
  postedBy: {
    type: String,
    required: true,
  },
  images: [
    {
      type: String,
    },
  ],
  questions: [
    {
      userId: {
        type: mongoose.Schema.Types.ObjectId,
        required: true,
      },
      question: {
        type: String,
        required: true,
      },
      askedAt: {
        type: Date,
        default: Date.now,
      },
      answer: {
        text: {
          type: String,
        },
        repliedAt: {
          type: Date,
        },
      },
    },
  ],
  acceptedQuote: {
    type: mongoose.Schema.Types.ObjectId,
  },
});
// Indexing for GeoJSON
taskSchema.index({ location: '2dsphere' });
/**
 * Statics
 */

taskSchema.statics = {};

/**
 * @typedef Task
 */
module.exports = mongoose.model('Task', taskSchema);
