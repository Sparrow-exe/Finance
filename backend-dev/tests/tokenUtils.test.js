// tests/tokenUtils.test.js
const { generateAccessToken, generateRefreshToken, verifyAccessToken, verifyRefreshToken } = require('../src/utils/tokenUtils');

describe('Token Utils', () => {
  const userId = '60d21b4667d0d8992e610c85'; // example ObjectId string
  test('should generate and verify access token', () => {
    const token = generateAccessToken(userId);
    const decoded = verifyAccessToken(token);
    expect(decoded.id).toBe(userId);
  });

  test('should generate and verify refresh token', () => {
    const token = generateRefreshToken(userId);
    const decoded = verifyRefreshToken(token);
    expect(decoded.id).toBe(userId);
  });
});
