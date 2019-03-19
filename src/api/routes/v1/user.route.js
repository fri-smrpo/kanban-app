const express = require('express');
const validate = require('express-validation');
const controller = require('../../controllers/user.controller');
const { authorize, ADMIN, LOGGED_USER } = require('../../middlewares/auth');
const {
  listUsers,
  createUser,
  replaceUser,
  updateUser,
} = require('../../validations/user.validation');

const router = express.Router();

/**
 * Load user when API with userId route parameter is hit
 */
router.param('userId', controller.load);


router
  .route('/')
  .get(authorize(), validate(listUsers), controller.list)
  .post(authorize(ADMIN), validate(createUser), controller.create);


router
  .route('/profile')
  .get(authorize(), controller.loggedIn);


router
  .route('/:userId')
  .get(authorize(), controller.get)
  .put(authorize(), validate(replaceUser), controller.replace)
  .patch(authorize(), validate(updateUser), controller.update)
  .delete(authorize(), controller.remove);


module.exports = router;
