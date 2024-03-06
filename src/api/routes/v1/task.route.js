const express = require('express');
const taskSchema = require('../../validations/task.validation');
const {
  validateRequest,
} = require('../../middlewares/validateRequest.middleware');
const verifyJWT = require('../../middlewares/verifyJWT.middleware');

const { addTask } = require('../../controllers/task.controller');

const router = express.Router();

router.route('/').post(verifyJWT, validateRequest(taskSchema), addTask);
// router.put('/:taskId/cancel', verifyJWT, cancelMyTask);
// router.get('/my-tasks', verifyJWT, viewAllMyTasks);
// router.put('/:taskId/assign', verifyJWT, assignMyTask);
// router.get('/:taskId/details', verifyJWT, viewTaskDetails);
module.exports = router;
