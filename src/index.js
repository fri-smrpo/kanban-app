// make bluebird default Promise
Promise = require('bluebird'); // eslint-disable-line no-global-assign
const {port, env} = require('./config/vars');
const logger = require('./config/logger');
const app = require('./config/express');
const mongoose = require('./config/mongoose');
const User = require('./api/models/user.model');
const bcrypt = require('bcryptjs');

// open mongoose connection
mongoose.connect();

// listen to requests
app.listen(port, () => logger.info(`server started on port ${port} (${env})`));


async function createAdmin() {
  const dbUsers = {
    admin: {
      email: 'admin@admin.com',
      password: 'admin123',
      username: 'admin',
      name: 'admin',
      surname: 'admin',
      role: 'admin',
    },
    user: {
      email: 'user@user.com',
      password: 'user123',
      username: 'user',
      name: 'user',
      surname: 'user',
    },
    test: {
      email: 'test@test.com',
      password: 'test123',
      username: 'test',
      name: 'test',
      surname: 'test',
    },
  };

  if (!(await User.findOne({email: dbUsers.admin.email}))) {
    const user = new User(dbUsers.admin);
    await user.save();
  }

  if (!(await User.findOne({email: dbUsers.user.email}))) {
    const user = new User(dbUsers.user);
    await user.save();
  }

  if (!(await User.findOne({email: dbUsers.test.email}))) {
    const user = new User(dbUsers.test);
    await user.save();
  }
}


/**
 * Exports express
 * @public
 */
module.exports = app;


createAdmin().catch(console.error);
