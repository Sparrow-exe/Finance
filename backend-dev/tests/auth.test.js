const request = require('supertest');
const app = require('../src/app'); // Your Express app
const mongoose = require('mongoose');
const User = require('../src/models/User');
require('dotenv').config({ path: '.env.test' });

beforeAll(async () => {
  await mongoose.connect(process.env.MONGO_URI);
});

afterAll(async () => {
  await mongoose.connection.close();
});

describe('Auth Routes', () => {
  const testEmail = 'test@example.com';
  const testPassword = 'Test123!';

  it('should register a new user', async () => {
    const res = await request(app).post('/api/auth/register').send({
      email: testEmail,
      password: testPassword,
    });

    expect(res.statusCode).toBe(201);
    expect(res.body.message).toBe('User registered');
  });

  it('should not register duplicate email', async () => {
    const res = await request(app).post('/api/auth/register').send({
      email: testEmail,
      password: testPassword,
    });

    expect(res.statusCode).toBe(400);
  });

  it('should login with correct credentials', async () => {
    const res = await request(app).post('/api/auth/login').send({
      email: testEmail,
      password: testPassword,
    });

    expect(res.statusCode).toBe(200);
    expect(res.body.accessToken).toBeDefined();
    expect(res.body.user.email).toBe(testEmail);
  });

  it('should reject invalid login', async () => {
    const res = await request(app).post('/api/auth/login').send({
      email: testEmail,
      password: 'wrongpassword',
    });

    expect(res.statusCode).toBe(400);
    expect(res.body.message).toMatch(/Invalid/);
  });
});
