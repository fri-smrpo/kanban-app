const httpStatus = require('http-status');
const { omit } = require('lodash');
const Story = require('../models/story.model');


exports.load = async (req, res, next, id) => {
  try {
    const story = await Story.get(id);
    req.locals = { story };
    return next();
  } catch (error) {
    return next(error);
  }
};

exports.get = (req, res) => res.json(req.locals.story.transform());

exports.create = async (req, res, next) => {
  try {
    const story = new Story(req.body);
    const savedStory = await story.save();
    res.status(httpStatus.CREATED);
    res.json(savedStory.transform());
  } catch (error) {
    next(Story.checkDuplicateName(error));
  }
};

exports.replace = async (req, res, next) => {
  try {
    const { story } = req.locals;
    const newStory = new Story(req.body);
    const newStoryObject = omit(newStory.toObject(), '_id');

    await story.update(newStoryObject, { override: true, upsert: true });
    const savedStory = await Story.findById(story._id);

    res.json(savedStory.transform());
  } catch (error) {
    next(Story.checkDuplicateEmail(error));
  }
};

exports.update = (req, res, next) => {
  const updatedStory = req.body; // omit(req.body, 'key');
  const story = Object.assign(req.locals.story, updatedStory);

  Story.checkOverlap(story)
    .then(() => {
      story.save()
        .then(savedStory => res.json(savedStory.transform()));
    })
    .catch(error => next(error));
};

exports.list = async (req, res, next) => {
  try {
    const storys = await Story.list(req.query);
    const transformedStorys = storys.map(story => story.transform());
    res.json(transformedStorys);
  } catch (error) {
    next(error);
  }
};

exports.remove = (req, res, next) => {
  const { story } = req.locals;

  story.remove()
    .then(() => res.status(httpStatus.NO_CONTENT).end())
    .catch(e => next(e));
};
