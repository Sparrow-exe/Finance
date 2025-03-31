// src/middleware/errorHandler.js
module.exports = (err, req, res, next) => {
    console.error(err.stack);
    res.status(err.status || 500).json({
      message: err.message || 'Internal Server Error',
      // Optionally include the stack trace in development:
      //...(process.env.NODE_ENV === 'development' && { stack: err.stack })
    });
  };
  