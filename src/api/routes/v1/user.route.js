const express = require('express');
const { setupProfile, getProfileStatus, updateProfileStatus } = require('../../controllers/user.controller');
const verifyJWT = require('../../middlewares/verifyJWT.middleware');
const {
  validateRequest,
} = require('../../middlewares/validateRequest.middleware');
const setupProfileSchema = require('../../validations/setupProfileValidation');

const router = express.Router();

router
  .route('/:id')
  .patch(verifyJWT, validateRequest(setupProfileSchema), setupProfile);

router
  .route('/user/:id/profileStatus')
  .get(verifyJWT, getProfileStatus);

router
  .route('user/:id/profileStatus')
  .patch(verifyJWT, updateProfileStatus);

module.exports = router;
