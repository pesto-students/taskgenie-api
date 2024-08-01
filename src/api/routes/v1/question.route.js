const express = require("express");

const router = express.Router();
const verifyJWT = require("../../middlewares/verifyJWT.middleware");
const {
	addQuestionToTask,
	addReplyToQuestion,
	getQuestions,
	closeQuestion,
} = require("../../controllers/question.controller");
router.get("/:taskId/questions", getQuestions);
router.post("/:taskId/questions", verifyJWT, addQuestionToTask);
router.post("/:taskId/questions/:questionId", verifyJWT, addReplyToQuestion);
router.delete("/:taskId/questions/:questionId", verifyJWT, closeQuestion);
module.exports = router;
