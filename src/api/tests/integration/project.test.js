/* eslint-disable arrow-body-style */
/* eslint-disable no-unused-expressions */
const request = require('supertest');
const httpStatus = require('http-status');
const {expect} = require('chai');
const bcrypt = require('bcryptjs');
const app = require('../../../index');
const Project = require('../../models/project.model');
const User = require('../../models/user.model');


describe('Projects API', async () => {
  let dbUsers;
  let adminAccessToken;
  let userAccessToken;

  let dbProjects;
  let project;

  beforeEach(async () => {
    dbUsers = {
      admin: {
        email: 'admin@gmail.com',
        password: await bcrypt.hash('123', 1),
        username: 'admin',
        name: 'admin',
        surname: 'admin',
        role: 'admin',
      },
      user: {
        email: 'user@gmail.com',
        password: await bcrypt.hash('123', 1),
        username: 'user',
        name: 'user',
        surname: 'user',
      },
      user2: {
        email: 'user2@gmail.com',
        password: await bcrypt.hash('123', 1),
        username: 'user2',
        name: 'user2',
        surname: 'user2',
      },
    };
    await User.remove({});
    await User.insertMany([dbUsers.admin, dbUsers.user, dbUsers.user2]);
    dbUsers.admin.password = '123';
    dbUsers.user.password = '123';
    dbUsers.user2.password = '123';
    adminAccessToken = (await User.findAndGenerateToken(dbUsers.admin)).accessToken;
    userAccessToken = (await User.findAndGenerateToken(dbUsers.user)).accessToken;

    // .....

    dbProjects = {
      spo: {
        name: 'spo',
        users: [],
      },
    };

    project = {
      name: 'nov',
      users: [],
    };

    await Project.remove({});
    await Project.insertMany([dbProjects.spo]);
  });

  // # Preveri dodajanje novega projekta in morebitno podvajanje imen projektov.

  describe('POST /v1/projects', () => {
    it('should create a new project when request is ok', () => {
      return request(app)
        .post('/v1/projects')
        .set('Authorization', `Bearer ${adminAccessToken}`)
        .send(project)
        .expect(httpStatus.CREATED)
        .then((res) => {
          expect(res.body.name).to.be.equal('nov');
        });
    });

    it('should not create a new project not admin user', () => {
      return request(app)
        .post('/v1/projects')
        .set('Authorization', `Bearer ${userAccessToken}`)
        .send(project)
        .expect(httpStatus.FORBIDDEN)
        .then((res) => {
          expect(res.body.code).to.be.equal(403);
        });
    });

    it('should report error when project name already exists', () => {
      return request(app)
        .post('/v1/projects')
        .set('Authorization', `Bearer ${adminAccessToken}`)
        .send({
          ...project, name: 'spo'
        })
        .expect(httpStatus.CONFLICT)
        .then((res) => {
          const {field} = res.body.errors[0];
          const {location} = res.body.errors[0];
          const {messages} = res.body.errors[0];
          expect(field).to.be.equal('name');
          expect(location).to.be.equal('body');
          expect(messages).to.include('Project name already exists');
        });
    });

    // # Preveri izbiro uporabnikov za delo na projektu.
    // # Preveri določitev projektnih vlog.

  });
});
