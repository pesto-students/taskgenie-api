const express = require('express');
const taskSchema = require('../../validations/task.validation');
const {
  validateRequest,
} = require('../../middlewares/validateRequest.middleware');
const verifyJWT = require('../../middlewares/verifyJWT.middleware');

// const controller = require('../../controllers/task.controller');
const router = express.Router();

router.route('/').post(verifyJWT, validateRequest(taskSchema), (req, res) => {
  res.json({ message: ' You are authenticated' });
});
// router.put('/:taskId/cancel', verifyJWT, cancelMyTask);
// router.get('/my-tasks', verifyJWT, viewAllMyTasks);
// router.put('/:taskId/assign', verifyJWT, assignMyTask);
// router.get('/:taskId/details', verifyJWT, viewTaskDetails);
module.exports = router;
