const express = require('express');
const taskRoutes = require('./myTasks.route');
const authRoutes = require('./auth.route');

const router = express.Router();

router.use('/auth', authRoutes);
router.use('/my-tasks', taskRoutes);
module.exports = router;
