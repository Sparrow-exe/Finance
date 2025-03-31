// tests/tokenRotation.test.js
const mongoose = require('mongoose');
const User = require('../src/models/User');
const { archiveRefreshToken } = require('../src/utils/tokenRotation');

describe('Token Rotation Utility', () => {
  let user;
  beforeAll(async () => {
    user = new User({
      email: 'rotation@test.com',
      password: 'dummy',
      previousRefreshTokens: [],
    });
    await user.save();
  });

  afterAll(async () => {
    await User.deleteMany({});
    // Connection close handled by setup.js
  });

  test('should archive refresh token correctly', () => {
    const fakeReq = {
        headers: {
          'x-forwarded-for': '127.0.0.1',
          'user-agent': 'jest-test-agent'
        },
        // Optionally, also include a socket object:
        socket: {
          remoteAddress: '127.0.0.1'
        },
        ip: '127.0.0.1' // this may be bypassed if getClientIp prioritizes x-forwarded-for/socket
      };
      
    archiveRefreshToken(user, 'sample-token', fakeReq);
    expect(user.previousRefreshTokens.length).toBe(1);
    const tokenEntry = user.previousRefreshTokens[0];
    expect(tokenEntry.token).toBe('sample-token');
    expect(tokenEntry.ip).toBe('127.0.0.1');
    expect(tokenEntry.userAgent).toBe('jest-test-agent');
  });
});
