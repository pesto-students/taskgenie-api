const express = require('express');
const multer = require('multer');
require('../../validations/task.validation');
const {
  addTask,
  getAllTasksByUser,
  deleteTask,
  getTaskById,
} = require('../../controllers/task.controller');

const router = express.Router();

// Define multer storage configuration
const storage = multer.diskStorage({
  destination(req, file, cb) {
    cb(null, 'uploads/'); // Define the destination folder where files will be stored
  },
  filename(req, file, cb) {
    cb(null, file.originalname); // Use the original filename
  },
});

// Initialize multer middleware
const upload = multer({ storage });
router.route('/').get(getAllTasksByUser);
router.route('/').post(upload.array('images', 5), addTask);
router.route('/:taskId').get(getTaskById);
router.route('/:taskId').delete(deleteTask);
module.exports = router;
