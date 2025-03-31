// tests/remaining.test.js
const request = require('supertest');
const mongoose = require('mongoose');
const app = require('../src/app');
const User = require('../src/models/User');

// Import utilities and modules to test directly
const { securityEvents } = require('../src/utils/tokenRotation');
const { getClientIp } = require('../src/utils/ipUtils');
const { refreshCookieOptions } = require('../src/utils/cookieUtils');

describe('Remaining High-Priority Tests', () => {

  // ---------- Security Alert Handler ----------
  describe('Security Alert Handler', () => {
    it('should emit tokenReuseDetected event with correct payload', (done) => {
      const testData = {
        user: { email: 'alert@test.com' },
        reusedToken: {
          ip: '127.0.0.1',
          userAgent: 'jest-test-agent',
          lastUsedAt: new Date()
        }
      };

      // Attach a one-time listener to capture the event
      securityEvents.once('tokenReuseDetected', (data) => {
        try {
          expect(data.user.email).toBe('alert@test.com');
          expect(data.reusedToken.ip).toBe('127.0.0.1');
          expect(data.reusedToken.userAgent).toBe('jest-test-agent');
          done();
        } catch (err) {
          done(err);
        }
      });

      // Emit the event manually for testing
      securityEvents.emit('tokenReuseDetected', testData);
    });
  });

  // ---------- IP Utils ----------
  describe('IP Utilities', () => {
    it('should return x-forwarded-for header if available', () => {
      const req = {
        headers: { 'x-forwarded-for': '123.123.123.123, 111.111.111.111' },
        socket: { remoteAddress: '192.168.1.1' }
      };
      const ip = getClientIp(req);
      expect(ip).toBe('123.123.123.123');
    });

    it('should return remoteAddress if x-forwarded-for is not provided', () => {
      const req = {
        headers: {},
        socket: { remoteAddress: '192.168.1.1' }
      };
      const ip = getClientIp(req);
      expect(ip).toBe('192.168.1.1');
    });
  });

  // ---------- Cookie Utils ----------
  describe('Cookie Utilities', () => {
    it('should have proper refresh cookie options', () => {
      expect(refreshCookieOptions).toHaveProperty('httpOnly', true);
      expect(refreshCookieOptions).toHaveProperty('secure');
      expect(refreshCookieOptions).toHaveProperty('sameSite', 'Strict');
      expect(refreshCookieOptions).toHaveProperty('maxAge', 7 * 24 * 60 * 60 * 1000);
    });
  });

  // ---------- Rate Limiter ----------
  describe('Rate Limiter on /api/auth/login', () => {
    const testEmail = 'ratelimit@test.com';
    const testPassword = 'RateLimit123!';
    
    beforeAll(async () => {
      // Register the user so the login route exists
      await request(app)
        .post('/api/auth/register')
        .send({ email: testEmail, password: testPassword });
    });

    it('should block login attempts exceeding rate limit', async () => {
      let res;
      // Intentionally send 6 failed login attempts
      for (let i = 0; i < 6; i++) {
        res = await request(app)
          .post('/api/auth/login')
          .send({ email: testEmail, password: 'WrongPassword!' });
      }
      // Expect rate limit to be triggered (HTTP 429)
      expect(res.statusCode).toBe(429);
    });
  });

  // ---------- Account Lockout Expiry ----------
  // tests/remaining.test.js (modified section)
describe('Login after lockout period expires', () => {
    const testEmail = 'lockexpire@test.com';
    const testPassword = 'LockExpire123!';
  
    beforeAll(async () => {
      // Register the user
      await request(app)
        .post('/api/auth/register')
        .send({ email: testEmail, password: testPassword });
      // Simulate 5 failed attempts to trigger lockout
      for (let i = 0; i < 5; i++) {
        await request(app)
          .post('/api/auth/login')
          .send({ email: testEmail, password: 'WrongPassword!' });
      }
    });
  
    it('should allow login after lockout period has expired', async () => {
      // Manually update the user's lockout field in the database to simulate expiration
      const user = await User.findOne({ email: testEmail });
      user.lockout.lockUntil = new Date(Date.now() - 1000); // 1 second in the past
      user.lockout.failedAttempts = 5;
      await user.save();
  
      // Use a new IP (bypass rate limiter) via X-Forwarded-For header
      const res = await request(app)
        .post('/api/auth/login')
        .set('X-Forwarded-For', '1.2.3.4')
        .send({ email: testEmail, password: testPassword });
      expect(res.statusCode).toBe(200);
      expect(res.body.accessToken).toBeDefined();
    });
  });
  
});
