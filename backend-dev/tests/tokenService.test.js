// tests/tokenService.test.js
const request = require('supertest');
const app = require('../src/app');

describe('Token Service Integration Tests', () => {
  const testEmail = 'refresh@test.com';
  const testPassword = 'Refresh123!';
  let refreshCookie;

  beforeAll(async () => {
    await request(app).post('/api/auth/register').send({ email: testEmail, password: testPassword });
    const loginRes = await request(app).post('/api/auth/login').send({ email: testEmail, password: testPassword });
    refreshCookie = loginRes.headers['set-cookie'];
  });

  test('should refresh access token with valid refresh token', async () => {
    const res = await request(app)
      .post('/api/refresh')
      .set('Cookie', refreshCookie);
    expect(res.statusCode).toBe(200);
    expect(res.body.accessToken).toBeDefined();
  });

  test('should fail refresh if refresh token is missing', async () => {
    const res = await request(app).post('/api/refresh');
    expect(res.statusCode).toBe(401);
  });
});
