const Joi = require('joi');
const Project = require('../models/project.model');

module.exports = {

  // GET /v1/projects
  listProjects: {
    query: {
      page: Joi.number().min(1),
      perPage: Joi.number().min(1).max(100),
      name: Joi.string()
    },
  },

  // POST /v1/projects
  createProject: {
    body: {
      name: Joi.string(),
      users: Joi.array().items(
        Joi.object({
          role: Joi.string().valid(Project.roles),
          user: Joi.string(),
        })
      )
    },
  },

  // PUT /v1/projects/:projectId
  replaceProject: {
    body: {
      name: Joi.string(),
      users: Joi.array().items(
        Joi.object({
          role: Joi.string().valid(Project.roles),
          user: Joi.string(),
        })
      )
    },
    params: {
      projectId: Joi.string().regex(/^[a-fA-F0-9]{24}$/).required(),
    },
  },

  // PATCH /v1/projects/:projectId
  updateProject: {
    body: {
      name: Joi.string(),
      users: Joi.array().items(
        Joi.object({
          role: Joi.string().valid(Project.roles),
          user: Joi.string(),
        })
      )
    },
    params: {
      projectId: Joi.string().regex(/^[a-fA-F0-9]{24}$/).required(),
    },
  },
};
