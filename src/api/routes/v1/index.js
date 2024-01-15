const express = require('express');
const taskRoutes = require('./task.route');

// const userRoutes = require('./user.route');
// const authRoutes = require('./auth.route');

const router = express.Router();
/**
 * Get
 */
router.get('/status', (req, res) => {
  res.send('Ravi');
});
router.use('/tasks', taskRoutes);

module.exports = router;
