const express = require('express');
const userRoutes = require('./user.route');
const authRoutes = require('./auth.route');
const projectRoutes = require('./project.route');
const storyRoutes = require('./story.route');
const sprintsRoutes = require('./sprint.route');

const router = express.Router();

/**
 * GET v1/status
 */
router.get('/status', (req, res) => res.send('OK'));


router.use('/users', userRoutes);
router.use('/auth', authRoutes);
router.use('/projects', projectRoutes);
router.use('/stories', storyRoutes);
router.use('/sprints', sprintsRoutes);

module.exports = router;
