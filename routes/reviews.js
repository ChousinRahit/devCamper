const router = require('express').Router({ mergeParams: true });

const advancedResults = require('../middleware/advancedResults');

const { authorize, protectRoutes } = require('../middleware/auth');
const {
  getReviews,
  getReview,
  addReview,
  updateReview,
  deleteReview
} = require('../controllers/reviews');

const Review = require('../models/Review');

router
  .route('/')
  .get(
    advancedResults(Review, { path: 'bootcamp', select: 'name description' }),
    getReviews
  )
  .post(protectRoutes, authorize('user', 'admin'), addReview);

router
  .route('/:id')
  .get(getReview)
  .put(protectRoutes, authorize('user', 'admin'), updateReview)
  .delete(protectRoutes, authorize('user', 'admin'), deleteReview);

module.exports = router;
