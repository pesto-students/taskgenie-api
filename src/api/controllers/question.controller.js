// Import necessary modules or models
const Task = require('../models/task.model');
const User = require('../models/user.model');
const { Question } = require('../models/question.model');
const httpStatus = require('http-status/lib');

const questionController = {
  // Controller function to add a question to a task
  addQuestionToTask: async (req, res, next) => {
    try {
      const { taskId } = req.params;
      const userId = req.user;
      const { question } = req.body;
      const { name } = await User.findById(userId);
      // Find the task by taskId
      const task = await Task.findById(taskId);
      if (!task) {
        return res.status(404).json({ error: 'Task not found' });
      }

      // Create a new question
      const newQuestion = new Question({
        userId,
        name,
        message: question,
      });

      // Save the question to the database
      await newQuestion.save();

      // Add the question to the task's questions array
      task.questions.push(newQuestion);
      await task.save();

      res
        .status(201)
        .json({ message: 'Question added to task successfully', newQuestion });
    } catch (error) {
      next(error);
      res.status(500).json({ error: 'Internal server error' });
    }
  },

  // Controller function to add a reply to a question
  addReplyToQuestion: async (req, res, next) => {
    try {
      const { taskId, questionId } = req.params;
      const { message } = req.body;
      // Find the task by taskId
      const task = await Task.findById(taskId);
      if (!task) {
        return res.status(404).json({ error: 'Task not found' });
      }
      // Find the question by questionId within the task
      const question = task.questions.id(questionId);
      if (!question) {
        return res.status(404).json({ error: 'Question not found' });
      }

      if (question.reply) {
        return res
          .status(httpStatus.BAD_REQUEST)
          .json({ message: 'You have already replied' });
      }
      // Add the reply to the question's replies array
      question.reply = {
        userId: req.user,
        message,
      };
      await task.save();

      res.status(201).json({ message: 'Reply added to question successfully' });
    } catch (error) {
      next(error);
      res.status(500).json({ error: 'Internal server error' });
    }
  },
};

module.exports = questionController;
