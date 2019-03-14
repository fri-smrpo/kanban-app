const Joi = require('joi');
const Story = require('../models/story.model');

module.exports = {

  // GET /v1/storys
  listStorys: {
    query: {
      page: Joi.number().min(1),
      perPage: Joi.number().min(1).max(100),
      start: Joi.date(),
      end: Joi.date()
    },
  },

  // POST /v1/storys
  createStory: {
    body: {
      start: Joi.date(),
      end: Joi.date()
    },
  },

  // PUT /v1/storys/:storyId
  replaceStory: {
    body: {
      start: Joi.date(),
      end: Joi.date()
    },
    params: {
      storyId: Joi.string().regex(/^[a-fA-F0-9]{24}$/).required(),
    },
  },

  // PATCH /v1/storys/:storyId
  updateStory: {
    body: {
      start: Joi.date(),
      end: Joi.date()
    },
    params: {
      storyId: Joi.string().regex(/^[a-fA-F0-9]{24}$/).required(),
    },
  },
};
