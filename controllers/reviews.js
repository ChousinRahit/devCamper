const ErrorResponse = require('../utils/errorResponse');
const asyncHandler = require('../middleware/async');
const Bootcamp = require('../models/Bootcamp');
const Review = require('../models/Review');

// @desc    Get all reviews for bootcamp
// @route   GET /api/v1/bootcamps/:bootcampId/reviews
// @access  Public
exports.getReviews = asyncHandler(async (req, res, next) => {
  console.log(req.params.bootcampId);
  if (req.params.bootcampId) {
    const reviews = await Review.find({ bootcamp: req.params.bootcampId });

    return res.status(200).json({
      success: true,
      count: reviews.length,
      data: reviews
    });
  } else {
    res.status(200).json(res.advancedResults);
  }
});

// @desc    Get a single review
// @route   GET /api/v1/reviews/:id
// @access  Public
exports.getReview = asyncHandler(async (req, res, next) => {
  const review = await Review.findById(req.params.id).populate({
    path: 'bootcamp',
    select: 'name description'
  });

  if (!review) {
    return next(
      new ErrorResponse(`Review with id ${req.params.id} is not found`, 404)
    );
  }
  console.log(review);
  return res.status(200).json({
    success: true,
    data: review
  });
});

// @desc    Add a review
// @route   GET /api/v1/bootcamps/:bootcampId/reviews
// @access  Private
exports.addReview = asyncHandler(async (req, res, next) => {
  req.body.bootcamp = req.params.bootcampId;
  req.body.user = req.user.id;

  const bootcamp = await Bootcamp.findById(req.params.bootcampId);

  if (!bootcamp) {
    return next(
      new ErrorResponse(
        `No bootcamp with the id of ${req.params.bootcampId}`,
        404
      )
    );
  }

  const hasHisSayAlready = await Review.findOne({
    user: req.user.id,
    bootcamp: req.params.bootcampId
  });

  if (hasHisSayAlready) {
    return next(
      new ErrorResponse(`One user can only have one review per bootcamp`)
    );
  }

  const review = await Review.create(req.body);

  return res.status(201).json({
    success: true,
    data: review
  });
});

// @desc    Upadte a review
// @route   PUT /api/v1/reviews/:id
// @access  Private
exports.updateReview = asyncHandler(async (req, res, next) => {
  let review = await Review.findById(req.params.id);

  if (!review) {
    return next(
      new ErrorResponse(`There is no review with id ${req.params.id}`)
    );
  }

  if (review.user.toString() !== req.user.id && req.user.role !== 'admin') {
    return next(
      new ErrorResponse(
        `This ${req.user.role} is not authorized to update the review`
      )
    );
  }

  review = await Review.findByIdAndUpdate(req.params.id, req.body, {
    new: true,
    runValidators: true
  });

  return res.status(200).json({
    success: true,
    data: review
  });
});

// @desc    Delete a review
// @route   DELETE /api/v1/reviews/:id
// @access  Private
exports.deleteReview = asyncHandler(async (req, res, next) => {
  let review = await Review.findById(req.params.id);

  if (!review) {
    return next(
      new ErrorResponse(`There is no review with id ${req.params.id}`)
    );
  }

  if (review.user.toString() !== req.user.id && req.user.role !== 'admin') {
    return next(
      new ErrorResponse(
        `This ${req.user.role} is not authorized to Delete the review`
      )
    );
  }

  review = await Review.findByIdAndDelete(req.params.id);

  return res.status(200).json({
    success: true,
    data: {}
  });
});
