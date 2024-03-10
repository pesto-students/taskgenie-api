const express = require('express');

const router = express.Router();
const verifyJWT = require('../../middlewares/verifyJWT.middleware');
const questionController = require('../../controllers/question.controller');

router.post(
  '/:taskId/questions',
  verifyJWT,
  questionController.addQuestionToTask,
);

router.post(
  '/:taskId/questions/:questionId/replies',
  questionController.addReplyToQuestion,
);

module.exports = router;
