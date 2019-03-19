const httpStatus = require('http-status');
const { omit } = require('lodash');
const Sprint = require('../models/sprint.model');


exports.load = async (req, res, next, id) => {
  try {
    const sprint = await Sprint.get(id);
    req.locals = { sprint };
    return next();
  } catch (error) {
    return next(error);
  }
};

exports.get = (req, res) => res.json(req.locals.sprint.transform());

exports.create = async (req, res, next) => {
  try {
    const sprint = new Sprint(req.body);

    await Sprint.checkOverlap(sprint);

    const savedSprint = await sprint.save();
    res.status(httpStatus.CREATED);
    res.json(savedSprint.transform());
  } catch (error) {
    next(error);
  }
};

exports.replace = async (req, res, next) => {
  try {
    const { sprint } = req.locals;
    const newSprint = new Sprint(req.body);
    const newSprintObject = omit(newSprint.toObject(), '_id');

    await Sprint.checkOverlap(newSprint);

    await sprint.update(newSprintObject, { override: true, upsert: true });
    const savedSprint = await Sprint.findById(sprint._id);

    res.json(savedSprint.transform());
  } catch (error) {
    next(Sprint.checkDuplicateEmail(error));
  }
};

exports.update = async (req, res, next) => {
  try {
    const updatedSprint = req.body; // omit(req.body, 'key');
    const sprint = Object.assign(req.locals.sprint, updatedSprint);

    await Sprint.checkOverlap(newSprint);

    sprint.save()
      .then(savedSprint => res.json(savedSprint.transform()))
      .catch(error => next(error));
  } catch (error) {
    next(error);
  }
};

exports.list = async (req, res, next) => {
  try {
    const sprints = await Sprint.list(req.query);
    const transformedSprints = sprints.map(sprint => sprint.transform());
    res.json(transformedSprints);
  } catch (error) {
    next(error);
  }
};

exports.remove = (req, res, next) => {
  const { sprint } = req.locals;

  sprint.remove()
    .then(() => res.status(httpStatus.NO_CONTENT).end())
    .catch(e => next(e));
};
