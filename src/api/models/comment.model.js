const mongoose = require('mongoose');
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

module.exports = {
  Comment: mongoose.model('Comment', commentSchema),
  commentSchema,
};
