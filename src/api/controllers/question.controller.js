// Import necessary modules or models
const Task = require('../models/task.model');
const { Question } = require('../models/question.model');

const questionController = {
  // Controller function to add a question to a task
  addQuestionToTask: async (req, res) => {
    try {
      const { taskId } = req.params;
      const { userId, name, message } = req.body;

      // Find the task by taskId
      const task = await Task.findById(taskId);
      if (!task) {
        return res.status(404).json({ error: 'Task not found' });
      }

      // Create a new question
      const question = new Question({
        userId,
        name,
        message,
      });

      // Save the question to the database
      await question.save();

      // Add the question to the task's questions array
      task.questions.push(question);
      await task.save();

      res
        .status(201)
        .json({ message: 'Question added to task successfully', question });
    } catch (error) {
      console.error(error);
      res.status(500).json({ error: 'Internal server error' });
    }
  },

  // Controller function to add a reply to a question
  addReplyToQuestion: async (req, res) => {
    try {
      const { taskId, questionId } = req.params;
      const { userId, name, message } = req.body;
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

      // Create a new reply
      const reply = new Question({
        userId,
        name,
        message,
      });

      // Save the reply to the database
      await reply.save();

      // Add the reply to the question's replies array
      question.replies.push(reply);
      await task.save();

      res
        .status(201)
        .json({ message: 'Reply added to question successfully', reply });
    } catch (error) {
      console.error(error);
      res.status(500).json({ error: 'Internal server error' });
    }
  },
};

module.exports = questionController;
