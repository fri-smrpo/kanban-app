const mongoose = require('mongoose');
const httpStatus = require('http-status');
const {omitBy, isNil} = require('lodash');
const APIError = require('../utils/APIError');
const ObjectId = mongoose.Schema.Types.ObjectId;

function dateRangeOverlaps(a_start, a_end, b_start, b_end) {
  if (a_start <= b_start && b_start <= a_end) return true; // b starts in a
  if (a_start <= b_end   && b_end   <= a_end) return true; // b ends in a
  if (b_start <  a_start && a_end   <  b_end) return true; // a in b
  return false;
}

/**
 * User Schema
 * @private
 */
const sprintSchema = new mongoose.Schema({
  start: { type: Date, required: true },
  end: { type: Date, required: true },
  speed: { type: Number },
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
    const fields = ['id', 'start', 'end', 'createdAt', 'projectId', 'speed'];

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
         page = 1, perPage = 30, projectId
       }) {
    const options = omitBy({projectId}, isNil);

    return this.find(options)
      .sort({createdAt: -1})
      .skip(perPage * (page - 1))
      .limit(perPage)
      .exec();
  },


  async checkOverlap(model) {
    let items = await this.find({ projectId: model.projectId });
    if (model.start > model.end) {
      throw new APIError({
        message: 'Začetni čas je večji od končnega.',
        status: httpStatus.BAD_REQUEST,
      });
    }
    items = items.filter(x => x.id !== model.id);

    for (const itm of items) {
      if (dateRangeOverlaps(itm.start, itm.end, model.start, model.end)) {
        throw new APIError({ // d.M.yyyy
          message: `Sprint se prekriva z obstoječim ${ itm.start } - ${ itm.end }`,
          status: httpStatus.BAD_REQUEST,
        });
      }
    }

    return false;
  },
};

/**
 * @typedef Sprint
 */
module.exports = mongoose.model('Sprint', sprintSchema);
