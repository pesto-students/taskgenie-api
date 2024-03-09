// Import necessary modules or models
const Task = require('../models/task.model');
const { Comment } = require('../models/comment.model');

const commentController = {
  // Controller function to add a comment to a task
  addCommentToTask: async (req, res) => {
    try {
      const { taskId } = req.params;
      const { userId, name, message } = req.body;

      // Find the task by taskId
      const task = await Task.findById(taskId);
      if (!task) {
        return res.status(404).json({ error: 'Task not found' });
      }

      // Create a new comment
      const comment = new Comment({
        userId,
        name,
        message,
      });

      // Save the comment to the database
      await comment.save();

      // Add the comment to the task's comments array
      task.comments.push(comment);
      await task.save();

      res
        .status(201)
        .json({ message: 'Comment added to task successfully', comment });
    } catch (error) {
      console.error(error);
      res.status(500).json({ error: 'Internal server error' });
    }
  },

  // Controller function to add a reply to a comment
  addReplyToComment: async (req, res) => {
    try {
      const { taskId, commentId } = req.params;
      const { userId, name, message } = req.body;
      // Find the task by taskId
      const task = await Task.findById(taskId);
      if (!task) {
        return res.status(404).json({ error: 'Task not found' });
      }
      // Find the comment by commentId within the task
      const comment = task.comments.id(commentId);
      if (!comment) {
        return res.status(404).json({ error: 'Comment not found' });
      }

      // Create a new reply
      const reply = new Comment({
        userId,
        name,
        message,
      });

      // Save the reply to the database
      await reply.save();

      // Add the reply to the comment's replies array
      comment.replies.push(reply);
      await task.save();

      res
        .status(201)
        .json({ message: 'Reply added to comment successfully', reply });
    } catch (error) {
      console.error(error);
      res.status(500).json({ error: 'Internal server error' });
    }
  },
};

module.exports = commentController;
