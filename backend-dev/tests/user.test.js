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

  it('should reset settings', async () => {
    const res = await request.delete('/api/user/settings')
      .set('Authorization', `Bearer ${accessToken}`);
    expect(res.statusCode).toBe(200);
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

  it('should reset widgets', async () => {
    const res = await request.delete('/api/user/widgets')
      .set('Authorization', `Bearer ${accessToken}`);
    expect(res.statusCode).toBe(200);
  });
});

describe('User Routes - Finances', () => {
  it('should update income', async () => {
    const res = await request.post('/api/user/income')
      .set('Authorization', `Bearer ${accessToken}`)
      .send([{ name: 'Job A', type: 'salary', salaryPay: 50000 }]);
    expect(res.statusCode).toBe(200);
  });

  it('should reset income', async () => {
    const res = await request.delete('/api/user/income')
      .set('Authorization', `Bearer ${accessToken}`);
    expect(res.statusCode).toBe(200);
  });

  it('should update savings', async () => {
    const res = await request.post('/api/user/savings')
      .set('Authorization', `Bearer ${accessToken}`)
      .send([{ name: 'Emergency Fund', amount: 1000 }]);
    expect(res.statusCode).toBe(200);
  });

  it('should reset savings', async () => {
    const res = await request.delete('/api/user/savings')
      .set('Authorization', `Bearer ${accessToken}`);
    expect(res.statusCode).toBe(200);
  });

  it('should update debt', async () => {
    const res = await request.post('/api/user/debt')
      .set('Authorization', `Bearer ${accessToken}`)
      .send([{ name: 'Credit Card', currentBalance: 2000 }]);
    expect(res.statusCode).toBe(200);
  });

  it('should reset debt', async () => {
    const res = await request.delete('/api/user/debt')
      .set('Authorization', `Bearer ${accessToken}`);
    expect(res.statusCode).toBe(200);
  });

  it('should update expenses', async () => {
    const res = await request.post('/api/user/expenses')
      .set('Authorization', `Bearer ${accessToken}`)
      .send([{ name: 'Groceries', estimatedAmount: 300 }]);
    expect(res.statusCode).toBe(200);
  });

  it('should reset expenses', async () => {
    const res = await request.delete('/api/user/expenses')
      .set('Authorization', `Bearer ${accessToken}`);
    expect(res.statusCode).toBe(200);
  });
});