const express = require('express');
const taskRoutes = require('./task.route');
const authRoutes = require('./auth.route');

const router = express.Router();

router.use('/auth', authRoutes);
router.use('/tasks', taskRoutes);
module.exports = router;
