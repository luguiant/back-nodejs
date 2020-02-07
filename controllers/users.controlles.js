const { validationResult } = require('express-validator');

const User = require('../models/users');

exports.signup = (req, res, next)=>{
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      const error = new Error('Validation failed.');
      error.statusCode = 422;
      error.data = errors.array();
      throw error;
    }
};
