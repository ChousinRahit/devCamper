const {
  getBootcamps,
  getBootcamp,
  createBootcamp,
  updateBootcamp,
  deleteBoocamp,
  getBootcapmsInRadius,
  bootcampPhotoUpload
} = require('../controllers/bootcamps');

const Bootcamp = require('../models/Bootcamp');
const advncedResults = require('../middleware/advancedResults');

// Include other resource routers
const courseRouter = require('./courses');
const reviewRouter = require('./reviews');

const router = require('express').Router();

const { protectRoutes, authorize } = require('../middleware/auth');

router.use('/:bootcampId/reviews', reviewRouter);
router.use('/:bootcampId/courses', courseRouter);

router.route('/:id/photo').put(protectRoutes, bootcampPhotoUpload);

router.route('/radius/:zipcode/:distance').get(getBootcapmsInRadius);

router
  .route('/')
  .get(advncedResults(Bootcamp, 'courses'), getBootcamps)
  .post(protectRoutes, authorize('publisher', 'admin'), createBootcamp);

router
  .route('/:id')
  .get(getBootcamp)
  .put(protectRoutes, authorize('publisher', 'admin'), updateBootcamp)
  .delete(protectRoutes, authorize('publisher', 'admin'), deleteBoocamp);

module.exports = router;
