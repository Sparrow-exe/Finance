// tests/authUtils.test.js
const { hashPassword, comparePassword } = require('../src/utils/authUtils');

describe('Auth Utils', () => {
  test('should hash and compare password correctly', async () => {
    const password = 'SecurePass123!';
    const hash = await hashPassword(password);
    const isMatch = await comparePassword(password, hash);
    expect(isMatch).toBe(true);
  });
});
