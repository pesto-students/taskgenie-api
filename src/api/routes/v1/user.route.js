const express = require("express");
const {
	setupProfile,
	getProfileStatus,
	getUserById,
	getUserNameById,
} = require("../../controllers/user.controller");
const verifyJWT = require("../../middlewares/verifyJWT.middleware");
const {
	validateRequest,
} = require("../../middlewares/validateRequest.middleware");
const setupProfileSchema = require("../../validations/setupProfileValidation");

const router = express.Router();

router
	.route("/")
	.patch(verifyJWT, setupProfile);
router.route("/profileStatus").get(verifyJWT, getProfileStatus);
router.route("/:userId/").get(verifyJWT, getUserById);
router.route("/:userId/name").get(getUserNameById);

module.exports = router;
