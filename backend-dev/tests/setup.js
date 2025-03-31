// tests/setup.js
const mongoose = require('mongoose');
require('dotenv').config({path: '../.env.test'})


beforeAll(async () => {
  // Connect to your test MongoDB database
  await mongoose.connect('mongodb://localhost:27017/test-db', {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  });
});

afterAll(async () => {
  // Clean up: drop the database and close connection
  //await mongoose.connection.db.dropDatabase();
  await mongoose.connection.close();
});
