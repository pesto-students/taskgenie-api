const express = require('express');
const taskSchema = require('../../validations/task.validation');
const {
  validateRequest,
} = require('../../middlewares/validateRequest.middleware');
const verifyJWT = require('../../middlewares/verifyJWT.middleware');

const {
  addTask,
  getAllTasksByUser,
  deleteTask,
} = require('../../controllers/task.controller');

const router = express.Router();
router.route('/').get(verifyJWT, getAllTasksByUser);
router.route('/').post(verifyJWT, validateRequest(taskSchema), addTask);
router.route('/:taskId').delete(verifyJWT, deleteTask);
module.exports = router;
