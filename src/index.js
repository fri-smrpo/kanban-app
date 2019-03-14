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
      password: await bcrypt.hash('admin123', 1),
      username: 'admin',
      name: 'admin',
      surname: 'admin',
      role: 'admin',
    },
    user: {
      email: 'user@user.com',
      password: await bcrypt.hash('user123', 1),
      username: 'user',
      name: 'user',
      surname: 'user',
    },
  };

  if (!await User.find({email: dbUsers.admin.email})) {
    User.insert(dbUsers.admin);
  }

  if (!await User.find({email: dbUsers.user.email})) {
    User.insert(dbUsers.user);
  }
}


/**
 * Exports express
 * @public
 */
module.exports = app;


createAdmin();
