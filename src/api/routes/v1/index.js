const express = require('express');
const authRoute = require('./auth.route');
const myTasksRoute = require('./myTasks.route');
const tasksRoute = require('./tasks.route');
const userRoute = require('./user.route');
const questionsRoute = require('./question.route');
const verifyJWT = require('../../middlewares/verifyJWT.middleware');

const router = express.Router();

router.use('/auth', authRoute);
router.use('/my-tasks', verifyJWT, myTasksRoute);
router.use('/tasks', tasksRoute);
router.use('/user', userRoute);
router.use('/task', questionsRoute);

module.exports = router;
