const mongoose = require('mongoose');
//  Define task statuses
const taskStatus = ['open', 'assigned', 'cancelled', 'completed'];
// Define types of location
const locationType = ['remote', 'inperson'];
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
  imageUrls: [String],
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
  LocationType: {
    type: String,
    required: true,
    enum: locationType,
  },
  address: String,
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
