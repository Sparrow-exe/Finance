const request = require('./setup');
const app = require('../src/app');

describe('🔒 Security Middleware Tests', () => {
  it('should include Content Security Policy (CSP) header', async () => {
    const res = await request.get('/');
    expect(res.headers['content-security-policy']).toBeDefined();
    expect(res.headers['content-security-policy']).toContain("default-src 'self'");
  });

  it('should include XSS protection headers', async () => {
    const res = await request.get('/');
    expect(res.headers['x-xss-protection']).toBeDefined();
  });

  it('should include no-sniff header', async () => {
    const res = await request.get('/');
    expect(res.headers['x-content-type-options']).toBe('nosniff');
  });

  it('should sanitize malicious input (mongoSanitize)', async () => {
    const res = await request
      .post('/api/auth/login')
      .send({ email: { "$gt": "" }, password: "fake" });

    expect(res.statusCode).toBe(400); // should not pass validation
  });

  it('should block common XSS patterns (xss-clean)', async () => {
    const res = await request
      .post('/api/auth/login')
      .send({ email: "<script>alert('xss')</script>", password: "test123!" });

    expect(res.statusCode).toBe(400); // should be rejected by validator
  });

  it('should rate-limit repeated login attempts for same IP/user', async () => {
    jest.setTimeout(15000); // 15 seconds for this test
  
    const email = 'ratelimit@test.com';
    const password = 'Test123!';
  
    for (let i = 0; i < 5; i++) {
      await request.post('/api/auth/login').send({
        email,
        password: 'WrongPassword!',
      });
    }
  
    const res = await request.post('/api/auth/login').send({
      email,
      password: 'WrongPassword!',
    });
  
    expect(res.statusCode).toBe(429);
    expect(res.body.message).toMatch(/too many login attempts/i);
  }, 15000); // <- fallback if setTimeout doesn't apply
  
  
});
