const mongoose = require('mongoose');
// Define task statuses
const taskStatus = ['open', 'assigned', 'cancelled', 'completed'];
// Define types of location
const locationType = ['remote', 'in-person'];
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
  taskId: {
    type: String,
    required: true,
    unique: true,
    index: true,
  },
  status: {
    type: String,
    default: 'open',
    enum: taskStatus,
  },
  description: {
    type: String,
    required: true,
    maxlength: 1000,
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
  budget: {
    type: Number,
    required: true,
  },
  createdOn: {
    type: Date,
    required: true,
  },
  dueDate: {
    type: Date,
    required: true,
  },
  locationType: {
    type: String,
    required: true,
    enum: locationType,
  },
  location: {
    type: {
      name: String,
      geometry: {
        lat: Number,
        lng: Number,
      },
    },
    required() {
      return this.locationType === 'in-person';
    },
  },
  postedBy: {
    type: String,
    required: true,
  },
  comments: [commentSchema],
  assignedUser: String,
  views: {
    type: Number,
    default: 0,
  },
});

/**
 * Statics
 */

taskSchema.statics = {};
/**
 * @typedef Task
 */
module.exports = mongoose.model('Task', taskSchema);
