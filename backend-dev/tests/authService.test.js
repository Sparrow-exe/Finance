// tests/authService.test.js
const request = require('supertest');
const mongoose = require('mongoose');
const app = require('../src/app');

describe('Auth Service Integration Tests', () => {
  const testEmail = 'user@test.com';
  const testPassword = 'Test123!';
  const lockEmail = 'lockuser@test.com';

  // Use a separate user for lockout testing
  beforeAll(async () => {
    // Register users for tests
    await request(app).post('/api/auth/register').send({ email: testEmail, password: testPassword });
    await request(app).post('/api/auth/register').send({ email: lockEmail, password: testPassword });
  });

  afterAll(async () => {
    // Let tests/setup.js handle db drop/close if configured,
    // Otherwise, you can uncomment the following:
    // await mongoose.connection.db.dropDatabase();
    // await mongoose.connection.close();
  });

  test('should register a new user', async () => {
    const res = await request(app)
      .post('/api/auth/register')
      .send({ email: 'newuser@test.com', password: 'NewUser123!' });
    expect(res.statusCode).toBe(201);
    expect(res.body.message).toBe('User registered');
  });

  test('should not register duplicate user', async () => {
    const res = await request(app)
      .post('/api/auth/register')
      .send({ email: testEmail, password: testPassword });
    expect(res.statusCode).toBe(400);
  });

  test('should login a user with correct credentials', async () => {
    const res = await request(app)
      .post('/api/auth/login')
      .send({ email: testEmail, password: testPassword });
    expect(res.statusCode).toBe(200);
    expect(res.body.accessToken).toBeDefined();
    expect(res.body.user.email).toBe(testEmail);
  });

  test('should enforce account lockout after 5 failed attempts', async () => {
    // Using a dedicated user for lockout
    for (let i = 0; i < 5; i++) {
      const res = await request(app)
        .post('/api/auth/login')
        .send({ email: lockEmail, password: 'WrongPass123!' });
        
      console.log(res.body)
    }
    const res = await request(app)
      .post('/api/auth/login')
      .send({ email: lockEmail, password: testPassword });
      console.log(res.message)
    expect(res.statusCode).toBe(403);
    expect(res.body.message).toMatch(/temporarily locked/i);
  });
});
