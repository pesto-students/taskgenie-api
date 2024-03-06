const httpStatus = require('http-status');
const CreateHttpError = require('http-errors');
const Task = require('../models/task.model');

// Controller method to add a new task
exports.addTask = async (req, res, next) => {
  try {
    const userId = req.user;
    const {
      title,
      locationType,
      description,
      location,
      dateType,
      date,
      budget,
      imageURLs,
    } = req.body;
    const taskData = {
      title,
      description,
      status: 'open',
      budget,
      createdOn: new Date(),
      lastEdited: null,
      dateType,
      date,
      locationType,
      location,
      imageURLs,
      postedBy: userId,
      comments: [],
      assignedUser: null,
    };
    const newTask = await Task.create(taskData);
    res.status(httpStatus.CREATED).json(newTask);
  } catch (error) {
    next(error);
  }
};

// Controller method to edit an existing task
exports.editTask = async (req, res, next) => {
  try {
    const { taskId } = req.params;
    const taskData = req.body;
    const updatedTask = await Task.findByIdAndUpdate(taskId, taskData, {
      new: true,
    });
    if (!updatedTask) {
      throw new CreateHttpError.NotFound('Task not found');
    }
    res.json(updatedTask);
  } catch (error) {
    next(error);
  }
};

// Controller method to delete a task
exports.deleteTask = async (req, res, next) => {
  try {
    const { taskId } = req.params;
    const deletedTask = await Task.findByIdAndDelete(taskId);
    if (!deletedTask) {
      throw new CreateHttpError.NotFound('Task not found');
    }
    res.status(httpStatus.NO_CONTENT).send();
  } catch (error) {
    next(error);
  }
};
