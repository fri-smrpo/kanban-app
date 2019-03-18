const Joi = require('joi');
const Sprint = require('../models/sprint.model');

module.exports = {

  // GET /v1/sprints
  listSprints: {
    query: {
      page: Joi.number().min(1),
      perPage: Joi.number().min(1).max(100),
      speed: Joi.number(),
      start: Joi.date(),
      end: Joi.date()
    },
  },

  // POST /v1/sprints
  createSprint: {
    body: {
      start: Joi.date(),
      end: Joi.date(),
      speed: Joi.number(),
    },
  },

  // PUT /v1/sprints/:sprintId
  replaceSprint: {
    body: {
      start: Joi.date(),
      end: Joi.date(),
      speed: Joi.number(),
    },
    params: {
      sprintId: Joi.string().regex(/^[a-fA-F0-9]{24}$/).required(),
    },
  },

  // PATCH /v1/sprints/:sprintId
  updateSprint: {
    body: {
      start: Joi.date(),
      end: Joi.date(),
      speed: Joi.number(),
    },
    params: {
      sprintId: Joi.string().regex(/^[a-fA-F0-9]{24}$/).required(),
    },
  },
};
