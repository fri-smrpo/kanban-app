const express = require('express');
const validate = require('express-validation');
const controller = require('../../controllers/story.controller');
const { authorize, ADMIN, LOGGED_USER } = require('../../middlewares/auth');
const {
  listStorys,
  createStory,
  replaceStory,
  updateStory,
} = require('../../validations/story.validation');

const router = express.Router();

/**
 * Load story when API with storyId route parameter is hit
 */
router.param('storyId', controller.load);


router
  .route('/')
  .get(authorize(LOGGED_USER), validate(listStorys), controller.list)
  .post(authorize(ADMIN), validate(createStory), controller.create);


router
  .route('/:storyId')
  .get(authorize(LOGGED_USER), controller.get)
  .put(authorize(LOGGED_USER), validate(replaceStory), controller.replace)
  .patch(authorize(LOGGED_USER), validate(updateStory), controller.update)
  .delete(authorize(LOGGED_USER), controller.remove);


module.exports = router;
