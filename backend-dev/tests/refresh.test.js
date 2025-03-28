// tests/refresh.test.js
const request = require('./setup');

describe('Refresh Token', () => {
  const email = 'refresh@example.com';
  const password = 'Refresh123!';

  beforeAll(async () => {
    await request.post('/api/auth/register').send({ email, password });
  });

  it('should issue a new access token with valid refresh token', async () => {
    const loginRes = await request.post('/api/auth/login').send({ email, password });
    const cookies = loginRes.headers['set-cookie'];

    const res = await request.post('/refresh').set('Cookie', cookies);
    expect(res.statusCode).toBe(200);
    expect(res.body.accessToken).toBeDefined();
  });

  it('should fail with missing refresh token', async () => {
    const res = await request.post('/refresh');
    expect(res.statusCode).toBe(401);
  });
});