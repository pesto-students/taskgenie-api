const mongoose = require("mongoose");
/**
 * Question Schema
 */
const questionSchema = new mongoose.Schema({
	userId: {
		type: String,
		required: true,
	},
	name: String,
	createdOn: Date,
	message: {
		type: String,
		required: true,
	},
	reply: {
		message: {
			type: String,
		},
		date: {
			type: Date,
			default: Date.now,
		},
	},
	status: {
		type: String,
		enum: ["open", "closed"],
		default: "open",
	},
	date: {
		type: Date,
		default: Date.now,
	},
});

module.exports = {
	Question: mongoose.model("Question", questionSchema),
	questionSchema,
};
