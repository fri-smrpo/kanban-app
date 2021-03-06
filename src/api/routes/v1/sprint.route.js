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
  .get(authorize(), validate(listSprints), controller.list)
  .post(authorize(), validate(createSprint), controller.create);


router
  .route('/:sprintId')
  .get(authorize(), controller.get)
  .put(authorize(), validate(replaceSprint), controller.replace)
  .patch(authorize(), validate(updateSprint), controller.update)
  .delete(authorize(), controller.remove);


module.exports = router;
