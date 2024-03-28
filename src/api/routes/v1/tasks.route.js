const express = require('express');
const {
  getTasks,
  getTaskById,
  addQuote,
  acceptQuote,
  completeTaskByGenie,
} = require('../../controllers/task.controller');
const verifyJWT = require('../../middlewares/verifyJWT.middleware');

const router = express.Router();

// Get Tasks
router.route('/').get(getTasks);
// Get Task by Id
router.route('/:taskId').get(getTaskById);
//  Complete Task by Genie
router.route('/:taskId/completeTask').patch(completeTaskByGenie);
// Quote on a task
router.route('/:taskId/quotes').post(verifyJWT, addQuote);
// Accept a quote
router.route('/:taskId/quotes/:quoteId/accept').post(verifyJWT, acceptQuote);
module.exports = router;
