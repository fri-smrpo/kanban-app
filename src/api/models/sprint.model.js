const mongoose = require('mongoose');
const httpStatus = require('http-status');
const {omitBy, isNil} = require('lodash');
const APIError = require('../utils/APIError');
const ObjectId = mongoose.Schema.Types.ObjectId;

/**
 * User Schema
 * @private
 */
const sprintSchema = new mongoose.Schema({
  start: { type: Date, required: true },
  end: { type: Date, required: true },
  projectId: {
    required: true,
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
sprintSchema.pre('save', async function save(next) {
  try {


    return next();
  } catch (error) {
    return next(error);
  }
});

/**
 * Methods
 */
sprintSchema.method({
  transform() {
    const transformed = {};
    const fields = ['id', 'start', 'end', 'createdAt'];

    fields.forEach((field) => {
      transformed[field] = this[field];
    });

    return transformed;
  }
});

/**
 * Statics
 */
sprintSchema.statics = {

  async get(id) {
    try {
      let sprint;

      if (mongoose.Types.ObjectId.isValid(id)) {
        sprint = await this.findById(id).exec();
      }
      if (sprint) {
        return sprint;
      }

      throw new APIError({
        message: 'Sprint does not exist',
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


  checkOverlap(model) {

  },
};

/**
 * @typedef Sprint
 */
module.exports = mongoose.model('Sprint', sprintSchema);
