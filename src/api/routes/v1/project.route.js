const express = require('express');
const validate = require('express-validation');
const controller = require('../../controllers/project.controller');
const { authorize, ADMIN, LOGGED_USER } = require('../../middlewares/auth');
const {
  listProjects,
  createProject,
  replaceProject,
  updateProject,
} = require('../../validations/project.validation');

const router = express.Router();

/**
 * Load project when API with projectId route parameter is hit
 */
router.param('projectId', controller.load);


router
  .route('/')
  .get(authorize(), validate(listProjects), controller.list)
  .post(authorize(), validate(createProject), controller.create);


router
  .route('/:projectId')
  .put(authorize(), validate(replaceProject), controller.replace)
  .patch(authorize(), validate(updateProject), controller.update)
  .delete(authorize(), controller.remove)
  .get(authorize(), controller.get);


module.exports = router;
