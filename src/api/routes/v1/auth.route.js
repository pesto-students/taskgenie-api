const express = require('express');

const router = express.Router();
const passport = require('passport');
const { authSchema } = require('../../validations/auth.validation');
const controller = require('../../controllers/auth.controller');
const { validateRequest } = require('../../middlewares/validateRequest');

router.route('/getStatus').get((req, res) => {
  res.send('meow');
});
router
  // signup route
  .route('/signup')
  .post(controller.signUp);

router
  // signin route
.route('/signin').post(validateRequest(authSchema), controller.signIn);

// router.route('/refresh-token').post(controller.refreshToken);

// router.get(
//   '/google',
//   passport.authenticate('google', {
//     scope: ['profile'],
//   })
// );

// // callback route for google to redirect to

// router.get('/google/callback', passport.authenticate('google'), (req, res) => {
//   // Todo
// });

module.exports = router;
