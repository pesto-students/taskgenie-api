const express = require('express');
const controller = require('../../controllers/user.controller');

const router = express.Router();

router
  // setup-profile route

  .route('/setup-profile')
  .post(controller.setupProfile);

module.exports = router;