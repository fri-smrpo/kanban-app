const Joi = require('joi');
const Story = require('../models/story.model');

module.exports = {

  // GET /v1/storys
  listStorys: {
    query: {
      page: Joi.number().min(1),
      perPage: Joi.number().min(1).max(100),


      name: Joi.string().allow('').optional(),
      description: Joi.string().allow('').optional(),
      acceptanceTests: Joi.string().allow('').optional(),
      businessValue: Joi.number(),
      priority: Joi.string().valid(Story.priorities),
      projectId: Joi.string(),
      sprintId: Joi.string(),
      status: Joi.string().allow('').optional(),
    },
  },

  // POST /v1/storys
  createStory: {
    body: {
      name: Joi.string(),
      description: Joi.string().allow('').optional(),
      acceptanceTests: Joi.string().allow('').optional(),
      businessValue: Joi.number(),
      priority: Joi.string().valid(Story.priorities),
      projectId: Joi.string(),
      sprintId: Joi.string(),
      status: Joi.string().allow('').optional(),
    },
  },

  // PUT /v1/storys/:storyId
  replaceStory: {
    body: {
      name: Joi.string(),
      description: Joi.string().allow('').optional(),
      acceptanceTests: Joi.string().allow('').optional(),
      businessValue: Joi.number(),
      priority: Joi.string().valid(Story.priorities),
      projectId: Joi.string(),
      sprintId: Joi.string(),
      status: Joi.string().allow('').optional(),
    },
    params: {
      storyId: Joi.string().regex(/^[a-fA-F0-9]{24}$/).required(),
    },
  },

  // PATCH /v1/storys/:storyId
  updateStory: {
    body: {
      name: Joi.string(),
      description: Joi.string().allow('').optional(),
      acceptanceTests: Joi.string().allow('').optional(),
      businessValue: Joi.number(),
      priority: Joi.string().valid(Story.priorities),
      projectId: Joi.string(),
      sprintId: Joi.string(),
      status: Joi.string().allow('').optional(),
    },
    params: {
      storyId: Joi.string().regex(/^[a-fA-F0-9]{24}$/).required(),
    },
  },
};
