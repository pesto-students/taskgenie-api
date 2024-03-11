const express = require('express');
const taskSchema = require('../../validations/task.validation');
const {
  validateRequest,
} = require('../../middlewares/validateRequest.middleware');

const {
  addTask,
  getAllTasksByUser,
  deleteTask,
  getTaskById,
} = require('../../controllers/task.controller');

const router = express.Router();
router.route('/').get(getAllTasksByUser);
router.route('/').post(validateRequest(taskSchema), addTask);
router.route('/:taskId').get(getTaskById);
router.route('/:taskId').delete(deleteTask);
module.exports = router;
