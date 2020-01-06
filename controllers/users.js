const ErrorResponse = require('../utils/errorResponse');
const asyncHandler = require('../middleware/async');
const User = require('../models/User');

// @desc    Get all user
// @route   GET /api/v1/users
// @access  Private/Amdin
exports.getUsers = asyncHandler(async (req, res, next) => {
  res.status(200).json(res.advancedResults);
});

// @desc    Get Single user
// @route   GET /api/v1/users/:id
// @access  Private/Amdin
exports.getUser = asyncHandler(async (req, res, next) => {
  const user = await User.findById(req.params.id);

  res.status(200).json({ success: true, data: user });
});

// @desc    Create user
// @route   POST /api/v1/users
// @access  Private/Amdin
exports.createUser = asyncHandler(async (req, res, next) => {
  let user = await User.create(req.body);
  user = { ...user._doc, password: undefined };
  res.status(201).json({ success: true, data: user });
});

// @desc    Update user
// @route   PUT /api/v1/users/:id
// @access  Private/Amdin
exports.updateUser = asyncHandler(async (req, res, next) => {
  const user = await User.findByIdAndUpdate(req.params.id, req.body, {
    new: true,
    runValidators: true
  });

  if (!user) {
    return next(
      new ErrorResponse(`No User foud with id ${req.params.id}`, 404)
    );
  }
  res.status(201).json({ success: true, data: user });
});

// @desc    Delete user
// @route   DELETE /api/v1/users/:id
// @access  Private/Amdin
exports.deleteUser = asyncHandler(async (req, res, next) => {
  await User.findByIdAndDelete(req.params.id);

  res.status(201).json({ success: true, data: {} });
});
