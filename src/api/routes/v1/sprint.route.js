const express = require('express');
const validate = require('express-validation');
const controller = require('../../controllers/sprint.controller');
const { authorize, ADMIN, LOGGED_USER } = require('../../middlewares/auth');
const {
  listSprints,
  createSprint,
  replaceSprint,
  updateSprint,
} = require('../../validations/sprint.validation');

const router = express.Router();

/**
 * Load sprint when API with sprintId route parameter is hit
 */
router.param('sprintId', controller.load);


router
  .route('/')
  .get(authorize(LOGGED_USER), validate(listSprints), controller.list)
  .post(authorize(ADMIN), validate(createSprint), controller.create);


router
  .route('/:sprintId')
  .get(authorize(LOGGED_USER), controller.get)
  .put(authorize(ADMIN), validate(replaceSprint), controller.replace)
  .patch(authorize(ADMIN), validate(updateSprint), controller.update)
  .delete(authorize(ADMIN), controller.remove);


module.exports = router;
