const request = require('./setup');
const User = require('../src/models/User');

describe('Enhanced IP Logging', () => {
  const testEmail = 'iplogging@example.com';
  const testPassword = 'IPTest123!';
  const testIP = '123.45.67.89';

  let cookies;

  beforeAll(async () => {
    // Register user
    await request.post('/api/auth/register').send({ email: testEmail, password: testPassword });

    // Login with spoofed IP
    const loginRes = await request
      .post('/api/auth/login')
      .set('X-Forwarded-For', testIP)
      .send({ email: testEmail, password: testPassword });

    cookies = loginRes.headers['set-cookie'];
  });

  it('should log correct IP address in previousRefreshTokens on refresh', async () => {
    // Refresh to trigger token archive
    await request
      .post('/api/refresh')
      .set('X-Forwarded-For', testIP)
      .set('Cookie', cookies);

    const user = await User.findOne({ email: testEmail });

    expect(user).toBeTruthy();
    expect(user.previousRefreshTokens.length).toBeGreaterThan(0);

    const lastToken = user.previousRefreshTokens.at(-1);
    expect(lastToken.ip).toBe(testIP);
  });
});
