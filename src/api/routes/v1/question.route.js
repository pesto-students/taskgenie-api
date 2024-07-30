const express = require("express");

const router = express.Router();
const verifyJWT = require("../../middlewares/verifyJWT.middleware");
const {
	addQuestionToTask,
	addReplyToQuestion,
	getQuestions,
} = require("../../controllers/question.controller");

router.get("/:taskId/questions", getQuestions);

router.post("/:taskId/questions", verifyJWT, addQuestionToTask);

router.post("/:taskId/questions/:questionId", verifyJWT, addReplyToQuestion);

module.exports = router;
