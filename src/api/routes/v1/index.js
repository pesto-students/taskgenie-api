const express = require('express');
const taskRoutes = require('./task.route');
const authRoutes = require('./auth.route');

const router = express.Router();

router.use('/tasks', taskRoutes);
router.use('/auth', authRoutes)
module.exports = router;


