const httpStatus = require('http-status');
const { omit } = require('lodash');
const Project = require('../models/project.model');


exports.load = async (req, res, next, id) => {
  try {
    const project = await Project.get(id);
    req.locals = { project };
    return next();
  } catch (error) {
    return next(error);
  }
};

exports.get = (req, res) => res.json(req.locals.project.transform());

exports.create = async (req, res, next) => {
  try {
    const project = new Project(req.body);
    const savedProject = await project.save();
    res.status(httpStatus.CREATED);
    res.json(savedProject.transform());
  } catch (error) {
    next(Project.checkDuplicateName(error));
  }
};

exports.replace = async (req, res, next) => {
  try {
    const { project } = req.locals;
    const newProject = new Project(req.body);
    const newProjectObject = omit(newProject.toObject(), '_id');

    await project.update(newProjectObject, { override: true, upsert: true });
    const savedProject = await Project.findById(project._id);

    res.json(savedProject.transform());
  } catch (error) {
    next(Project.checkDuplicateEmail(error));
  }
};

exports.update = (req, res, next) => {
  const updatedProject = omit(req.body, 'xname');
  const project = Object.assign(req.locals.project, updatedProject);

  project.save()
    .then(savedProject => res.json(savedProject.transform()))
    .catch(e => next(Project.checkDuplicateEmail(e)));
};

exports.list = async (req, res, next) => {
  try {
    const projects = await Project.list(req.query);
    let transformedProjects = projects.map(project => project.transform());

    if (req.user.role !== 'admin') {
      transformedProjects = transformedProjects.filter(x => {
        for (let i = 0; i < x.users.length; i++) {
          if (x.users[i].user.toString() == req.user.id) {
            return true;
          }
        }
        return false;
      });
    }

    res.json(transformedProjects);
  } catch (error) {
    next(error);
  }
};

exports.remove = (req, res, next) => {
  const { project } = req.locals;

  project.remove()
    .then(() => res.status(httpStatus.NO_CONTENT).end())
    .catch(e => next(e));
};
