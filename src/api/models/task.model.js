const mongoose = require('mongoose');

// Define task statuses
const taskStatus = ['open', 'assigned', 'cancelled', 'completed'];

// Define types of location
const locationType = ['remote', 'in-person'];

// Define types of date
const dateType = ['on', 'before', 'flexible'];

/**
 * CommentSchema
 */
const commentSchema = mongoose.Schema({
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
  replies: [this],
});

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
      enum: ['Point'],
      required: true,
    },
    coordinates: {
      type: [Number], // [longitude, latitude]
      required: true,
    },
  },
  locationName: {
    type: String,
  },
  imageUrls: [
    {
      type: String,
      validate: {
        validator(v) {
          return /^https?:\/\/.*\.(?:png|jpg|jpeg)$/i.test(v);
        },
        message: (props) => `${props.value} is not a valid image URL!`,
      },
    },
  ],
  postedBy: {
    type: String,
    required: true,
  },
  comments: [commentSchema],
  assignedUser: String,
});

/**
 * Statics
 */

taskSchema.statics = {};

/**
 * @typedef Task
 */
module.exports = mongoose.model('Task', taskSchema);
