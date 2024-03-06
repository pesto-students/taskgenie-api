const express = require('express');
const { setupProfile } = require('../../controllers/user.controller');
const verifyJWT = require('../../middlewares/verifyJWT.middleware');
const {
  validateRequest,
} = require('../../middlewares/validateRequest.middleware');
const setupProfileSchema = require('../../validations/setupProfileValidation');

const router = express.Router();

router
  .route('/:id')
  .patch(verifyJWT, validateRequest(setupProfileSchema), setupProfile);

module.exports = router;
