const express = require('express');
const validate = require('express-validation');
const controller = require('../../controllers/task.controller');
const router = express.Router();

router.route('/').get(controller.list);

module.exports = router;
