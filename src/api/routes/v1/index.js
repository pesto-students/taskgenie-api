const express = require('express');
const authRoute = require('./auth.route');
const myTasksRoute = require('./myTasks.route');
const tasksRoute = require('./tasks.route');

const router = express.Router();

router.use('/auth', authRoute);
router.use('/my-tasks', myTasksRoute);
router.use('/tasks', tasksRoute);

module.exports = router;
