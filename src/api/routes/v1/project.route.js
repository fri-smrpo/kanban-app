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
  .post(authorize(ADMIN), validate(createProject), controller.create)
  .put(authorize(ADMIN), validate(replaceProject), controller.replace)
  .patch(authorize(ADMIN), validate(updateProject), controller.update)
  .delete(authorize(ADMIN), controller.remove);


router
  .route('/:projectId')
  .get(authorize(LOGGED_USER), validate(listProjects), controller.list)
  .get(authorize(LOGGED_USER), controller.get);


module.exports = router;
