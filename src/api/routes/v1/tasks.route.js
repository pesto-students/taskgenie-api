const express = require('express');
const {
  getTasks,
  getTaskById,
  addQuote,
} = require('../../controllers/task.controller');
const verifyJWT = require('../../middlewares/verifyJWT.middleware');

const router = express.Router();

// Get Tasks
router.route('/').get(getTasks);
// Get Task by Id
router.route('/:taskId').get(getTaskById);
// Quote on a task
router.route('/:taskId/quotes').post(verifyJWT, addQuote);

module.exports = router;
