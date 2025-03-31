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

    const res = await request.post('/api/refresh').set('Cookie', cookies);
    expect(res.statusCode).toBe(200);
    expect(res.body.accessToken).toBeDefined();
  });

  it('should fail with missing refresh token', async () => {
    const res = await request.post('/api/refresh');
    expect(res.statusCode).toBe(401);
  });

  it('should detect refresh token reuse and trigger alert', async () => {
   // Login
    const loginRes = await request.post('/api/auth/login').send({ email, password });
    const originalCookies = loginRes.headers['set-cookie'];

    // Refresh with original token - valid
    const firstRefreshRes = await request.post('/api/refresh').set('Cookie', originalCookies);
    expect(firstRefreshRes.statusCode).toBe(200);

    // Attempt reuse of original token (should fail)
    const reuseRes = await request.post('/api/refresh').set('Cookie', originalCookies);
    expect(reuseRes.statusCode).toBe(403);
    expect(reuseRes.body.message).toMatch(/reuse detected/i);

  });
  
  
});