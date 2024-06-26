const express = require('express');

const router = express.Router();
const { authSchema } = require('../../validations/auth.validation');
const controller = require('../../controllers/auth.controller');
const { validateRequest } = require('../../middlewares/validateRequest.middleware');

router.route('/getStatus').get((req, res) => {
  res.send('meow');
});
router
  // signup route
  .route('/signup')
  .post(validateRequest(authSchema), controller.signUp);

router
  // signin route
  .route('/signin')
  .post(validateRequest(authSchema), controller.signIn);

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
