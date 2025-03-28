const express = require('express');
const cors = require('cors');
const cookieParser = require('cookie-parser');
const helmet = require('helmet');
const mongoSanitize = require('express-mongo-sanitize');
const xss = require('xss-clean');

const middleware = express.Router();

middleware.use(
  cors({
    origin: 'http://localhost:3001',
    credentials: true,
  })
);
middleware.use(express.json());
middleware.use(cookieParser());
middleware.use(helmet());
middleware.use(mongoSanitize());
middleware.use(xss());

module.exports = middleware;
