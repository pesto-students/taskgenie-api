const express = require('express');
const { getTasks, getTaskById } = require('../../controllers/task.controller');

const router = express.Router();

router.route('/').get(getTasks);
router.route('/:taskId').get(getTaskById);
module.exports = router;
