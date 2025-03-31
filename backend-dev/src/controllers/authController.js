const { registerUser, loginUser, logoutUser } = require('../services/authService');
const { refreshCookieOptions } = require('../utils/cookieUtils');

exports.register = async (req, res, next) => {
  try {
    const result = await registerUser(req.body.email, req.body.password);
    res.status(201).json(result);
  } catch (err) {
    next(err);
  }
};

exports.login = async (req, res, next) => {
  try {
    const { email, password } = req.body;
    const result = await loginUser(email, password, req);
    res.cookie('refreshToken', result.refreshToken, refreshCookieOptions);
    res.json({ accessToken: result.accessToken, user: result.user });
  } catch (err) {
    next(err);
  }
};

exports.logout = async (req, res, next) => {
  try {
    const refreshToken = req.cookies.refreshToken;
    const authHeader = req.headers.authorization;
    const accessToken = authHeader?.split(' ')[1];

    const result = await logoutUser(accessToken, refreshToken, req);
    res.clearCookie('refreshToken', refreshCookieOptions);
    res.status(200).json(result);
  } catch (err) {
    next(err);
  }
};
