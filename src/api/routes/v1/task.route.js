const express = require('express');
const taskSchema = require('../../validations/task.validation');
const { validateRequest } = require('../../middlewares/validateRequest');
const verifyJWT = require('../../middlewares/verifyJWT');

// const controller = require('../../controllers/task.controller');
const router = express.Router();

router.route('/').post(verifyJWT, validateRequest(taskSchema), (req, res) => {
  console.log(req);
});

module.exports = router;
