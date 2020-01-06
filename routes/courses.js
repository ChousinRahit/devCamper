const express = require('express');
const Course = require('../models/Course');
const advncedResults = require('../middleware/advancedResults');

const {
  getCourses,
  getCourse,
  addCourse,
  updateCourse,
  deleteCourse
} = require('../controllers/courses');

const router = express.Router({ mergeParams: true });
const { protectRoutes, authorize } = require('../middleware/auth');

router
  .route('/')
  .get(
    advncedResults(Course, {
      path: 'bootcamp',
      select: 'name description'
    }),
    getCourses
  )
  .post(protectRoutes, authorize('publisher', 'admin'), addCourse);

router
  .route('/:id')
  .get(getCourse)
  .put(protectRoutes, authorize('publisher', 'admin'), updateCourse)
  .delete(protectRoutes, authorize('publisher', 'admin'), deleteCourse);

module.exports = router;
