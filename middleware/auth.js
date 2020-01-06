const jwt = require('jsonwebtoken');
const asyncHandler = require('./async');
const ErrorResponse = require('../utils/errorResponse');
const User = require('../models/User');

// Protect Routes
exports.protectRoutes = asyncHandler(async (req, res, next) => {
  let token;
  let authHead = req.headers.authorization;
  if (authHead && authHead.startsWith('Bearer')) {
    token = authHead.split(' ')[1];
  }
  //    else if (req.cookies.token) {
  //     token = req.cookies.token;
  //   }

  if (!token) {
    return next(
      new ErrorResponse("Not Authorized, you'r not allowed this route", 401)
    );
  }

  try {
    // Verify the token
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    req.user = await User.findById(decoded.id);
    next();
  } catch (err) {
    return next(
      new ErrorResponse("Not Authorized, you'r not allowed this route", 401)
    );
  }
});

// role protextion
exports.authorize = (...role) => {
  return (req, res, next) => {
    let currentUserRole = req.user.role;
    if (!role.includes(currentUserRole)) {
      next(
        new ErrorResponse(
          `User type ${currentUserRole} is not allowed for this operation`
        )
      );
    }
    next();
  };
};
