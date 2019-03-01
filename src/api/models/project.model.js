const mongoose = require('mongoose');
const httpStatus = require('http-status');
const {omitBy, isNil} = require('lodash');
const APIError = require('../utils/APIError');

/**
 * User Roles
 */
const roles = ['product-owner', 'scrum-master', 'developer'];

const ObjectId = mongoose.Schema.Types.ObjectId;

/**
 * User Schema
 * @private
 */
const projectSchema = new mongoose.Schema({
  name: {
    type: String,
    maxlength: 128,
    required: true,
    unique: true,
    trim: true,
    lowercase: true,
  },
  users: [
    {
      role: {
        type: String,
        enum: roles,
        default: 'user',
      },
    },
    {
      user: {
        type: ObjectId,
        ref: 'User'
      },
    },
  ],
}, {
  timestamps: true,
});

/**
 * Add your
 * - pre-save hooks
 * - validations
 * - virtuals
 */
projectSchema.pre('save', async function save(next) {
  try {


    return next();
  } catch (error) {
    return next(error);
  }
});

/**
 * Methods
 */
projectSchema.method({
  transform() {
    const transformed = {};
    const fields = ['id', 'name', 'users', 'createdAt'];

    fields.forEach((field) => {
      transformed[field] = this[field];
    });

    return transformed;
  }
});

/**
 * Statics
 */
projectSchema.statics = {

  roles,

  async get(id) {
    try {
      let project;

      if (mongoose.Types.ObjectId.isValid(id)) {
        project = await this.findById(id).exec();
      }
      if (project) {
        return project;
      }

      throw new APIError({
        message: 'Project does not exist',
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


  checkDuplicateName(error) {
    if (error.name === 'MongoError' && error.code === 11000) {
      return new APIError({
        message: 'Validation Error',
        errors: [{
          field: 'name',
          location: 'body',
          messages: ['Project name already exists'],
        }],
        status: httpStatus.CONFLICT,
        isPublic: true,
        stack: error.stack,
      });
    }
    return error;
  },
};

/**
 * @typedef User
 */
module.exports = mongoose.model('Project', projectSchema);
