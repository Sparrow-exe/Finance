// tests/user.test.js
const request = require('./setup');

let accessToken;

beforeAll(async () => {
  const email = 'user@test.com';
  const password = 'User123!';
  await request.post('/api/auth/register').send({ email, password });
  const res = await request.post('/api/auth/login').send({ email, password });
  accessToken = res.body.accessToken;
});

describe('User Routes - Settings', () => {
  it('should get default settings', async () => {
    const res = await request.get('/api/user/settings').set('Authorization', `Bearer ${accessToken}`);
    expect(res.statusCode).toBe(200);
  });

  it('should update settings', async () => {
    const res = await request.put('/api/user/settings')
      .set('Authorization', `Bearer ${accessToken}`)
      .send({ theme: 'dark' });
    expect(res.statusCode).toBe(200);
    expect(res.body.theme).toBe('dark');
  });
});

describe('User Routes - Widgets', () => {
  it('should update widgets', async () => {
    const res = await request.post('/api/user/widgets')
      .set('Authorization', `Bearer ${accessToken}`)
      .send([{ name: 'netWorth', type: 'summary' }]);
    expect(res.statusCode).toBe(200);
    expect(res.body[0].name).toBe('netWorth');
  });
});
