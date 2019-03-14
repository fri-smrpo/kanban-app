const mongoose = require('mongoose');
const httpStatus = require('http-status');
const {omitBy, isNil} = require('lodash');
const APIError = require('../utils/APIError');

// Za vsako zgodbo lahko določita njeno ime, besedilo, sprejemne teste, prioriteto () in poslovno vrednost.
const priorities = ['must have', 'could have', 'should have', 'won\'t have this time'];

/**
 * Story Schema
 * @private
 */
const storySchema = new mongoose.Schema({
  name: {
    type: String
  },
  description: {
    type: String
  },
  acceptanceTests: {
    type: String
  },
  businessValue: {
    type: Number
  },
  priority: {
    type: String,
    enum: priorities,
    default: 'must have',
  },
  projectId: {
    type: ObjectId,
    ref: 'Project'
  },
}, {
  timestamps: true,
});

/**
 * Add your
 * - pre-save hooks
 * - validations
 * - virtuals
 */
storySchema.pre('save', async function save(next) {
  try {


    return next();
  } catch (error) {
    return next(error);
  }
});

/**
 * Methods
 */
storySchema.method({
  transform() {
    const transformed = {};
    const fields = ['id', 'name', 'description', 'acceptanceTests', 'businessValue', 'priority', 'projectId'];

    fields.forEach((field) => {
      transformed[field] = this[field];
    });

    return transformed;
  }
});

/**
 * Statics
 */
storySchema.statics = {

  async get(id) {
    try {
      let story;

      if (mongoose.Types.ObjectId.isValid(id)) {
        story = await this.findById(id).exec();
      }
      if (story) {
        return story;
      }

      throw new APIError({
        message: 'Story does not exist',
        status: httpStatus.NOT_FOUND,
      });
    } catch (error) {
      throw error;
    }
  },

  list({
         page = 1, perPage = 30, name
       }) {
    const options = omitBy({name}, isNil);

    return this.find(options)
      .sort({createdAt: -1})
      .skip(perPage * (page - 1))
      .limit(perPage)
      .exec();
  },
};

/**
 * @typedef Story
 */
module.exports = mongoose.model('Story', storySchema);
