// Import necessary modules or models
const httpStatus = require("http-status/lib");
const Task = require("../models/task.model");
const User = require("../models/user.model");
const { Question } = require("../models/question.model");
const { default: mongoose } = require("mongoose");

const questionController = {
	// Controller function to add a question to a task
	addQuestionToTask: async (req, res, next) => {
		try {
			const { taskId } = req.params;
			const userId = req.user;
			const { question } = req.body;
			const user = await User.findById(userId);
			if (!user) {
				throw new Error("User not found");
			}
			const { firstName, lastName } = user;
			// Find the task by taskId
			const task = await Task.findById(taskId);
			if (!task) {
				return res.status(404).json({ error: "Task not found" });
			}
			console.log("log", task.postedBy.toString(), userId.toString());
			if (task.postedBy.toString() === userId.toString()) {
				throw new Error("You cannot ask a question on your own task");
			}

			// Create a new question
			const newQuestion = new Question({
				userId,
				name: `${firstName} ${lastName}`,
				message: question,
			});

			// Save the question to the database
			const savedQuestion = await newQuestion.save();
			console.log("ravi", savedQuestion._id);
			// Add the question to the task's questions array
			await task.questions.push(savedQuestion._id);
			await task.save();

			res
				.status(201)
				.json({ message: "Question added to task successfully", newQuestion });
		} catch (error) {
			next(error);
		}
	},

	// Controller function to add a reply to a question
	addReplyToQuestion: async (req, res, next) => {
		try {
			const { taskId, questionId } = req.params;
			const { message } = req.body;
			// Find the task by taskId
			const task = await Task.findById(taskId);
			if (!task) {
				return res.status(404).json({ error: "Task not found" });
			}
			// Find the question by questionId within the task
			const question = task.questions.id(questionId);
			if (!question) {
				return res.status(404).json({ error: "Question not found" });
			}

			if (question.reply) {
				return res
					.status(httpStatus.BAD_REQUEST)
					.json({ message: "You have already replied" });
			}
			// Add the reply to the question's replies array
			question.reply = {
				userId: req.user,
				message,
			};
			await task.save();

			res.status(201).json({ message: "Reply added to question successfully" });
		} catch (error) {
			next(error);
		}
	},
	getQuestions: async (req, res, next) => {
		try {
			const { taskId } = req.params;
			// Validate if taskId is a valid mongodb id
			if (!mongoose.Types.ObjectId.isValid(taskId)) {
				throw new Error("invalid TaskId");
			}
			const task = await Task.findById(taskId);
			if (!task) {
				throw new Error("Task not found");
			}
			const questions = await Question.find({
				_id: { $in: task.questions },
				status: { $ne: "closed" },
			});

			res.status(200).json(questions);
		} catch (error) {
			next(error);
		}
	},
	closeQuestion: async (req, res, next) => {
		try {
			const { taskId, questionId } = req.params;
			const task = await Task.findById(taskId);
			if (!task) {
				throw new Error("Task not found");
			}
			const question = await Question.findById(questionId);
			if (!question) {
				throw new Error("Question not found");
			}
			// Only owner of question can delete it
			const userId = req.user;
			if (!userId) {
				throw new Error("Invalid request");
			}
			if (question.userId.toString() === userId.toString()) {
				question.status = "closed";
			}
			const updatedQuestion = await question.save();
			res.status(200).json({
				message: "Question closed successfully",
				updatedQuestion,
			});
		} catch (error) {
			next(error);
		}
	},
};

module.exports = questionController;
