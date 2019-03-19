const mongoose = require('mongoose');
const httpStatus = require('http-status');
const {omitBy, isNil} = require('lodash');
const APIError = require('../utils/APIError');

const priorities = ['must have', 'could have', 'should have', 'won\'t have this time'];
const ObjectId = mongoose.Schema.Types.ObjectId;

/**
 * Story Schema
 * @private
 */
const storySchema = new mongoose.Schema({
  name: {
    type: String,
    unique: true,
    required: true
  },
  status: {
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
    required: true,
    type: ObjectId,
    ref: 'Project'
  },
  sprintId: {
    type: ObjectId,
    ref: 'Sprint'
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
    const fields = ['id', 'name', 'description', 'acceptanceTests', 'businessValue', 'priority', 'projectId', 'sprintId', 'status'];

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
  priorities,

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
         page = 1, perPage = 99999, projectId, sprintId
       }) {
    const options = omitBy({projectId, sprintId}, isNil);

    return this.find(options)
      .sort({createdAt: -1})
      .skip(perPage * (page - 1))
      .limit(perPage)
      .exec();
  },

  checkDuplicateName(error) {
    if (error.name === 'MongoError' && error.code === 11000) {
      return new APIError({
        message: 'Validation Error',
        errors: {
          field: 'name',
          location: 'body',
          messages: ['Ime je že v uporabi.'],
        },
        status: httpStatus.CONFLICT,
        isPublic: true,
        stack: error.stack,
      });
    }
    return error;
  },
};

/**
 * @typedef Story
 */
module.exports = mongoose.model('Story', storySchema);
