const express = require('express');

const router = express.Router();
const verifyJWT = require('../../middlewares/verifyJWT.middleware');
const commentController = require('../../controllers/comment.controller');

router.post('/:taskId/comments', commentController.addCommentToTask);

router.post(
  '/:taskId/comments/:commentId/replies',
  commentController.addReplyToComment,
);

module.exports = router;
