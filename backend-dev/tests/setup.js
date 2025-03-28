// tests/setup.js
const mongoose = require('mongoose');
const app = require('../src/app');
const request = require('supertest');

require('dotenv').config({ path: '.env.test' });

let mongoServer;

beforeAll(async () => {
  await mongoose.connect(process.env.MONGO_URI);
});

afterAll(async () => {
  await mongoose.connection.close();
});

module.exports = request(app);