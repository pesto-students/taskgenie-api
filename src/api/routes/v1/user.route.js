const express = require('express');
const {
  setupProfile,
  getProfileStatus, getReviewsByType, getProfile,
  getUserById,
  getUserNameById,
} = require('../../controllers/user.controller');
const verifyJWT = require('../../middlewares/verifyJWT.middleware');
const {
  validateRequest,
} = require('../../middlewares/validateRequest.middleware');
const setupProfileSchema = require('../../validations/setupProfileValidation');

const router = express.Router();

router
  .route('/:id')
  .patch(verifyJWT, validateRequest(setupProfileSchema), setupProfile);

router.route('/:id/profileStatus').get(verifyJWT, getProfileStatus);
router.route('/:userId/').get(verifyJWT, getUserById);
router.route('/:userId/name').get(getUserNameById);
router
  .route('/profile/:id')
  .get(verifyJWT, getProfile);

router
  .route('/profile/:id/reviews')
  .get(verifyJWT, getReviewsByType);

// router
//   .route('/:id/profileStatus')
//   .patch(verifyJWT, updateProfileStatus);

module.exports = router;
