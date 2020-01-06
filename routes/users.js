const router = require('express').Router();

const {
  createUser,
  getUsers,
  getUser,
  deleteUser,
  updateUser
} = require('../controllers/users');
const advancedResults = require('../middleware/advancedResults');
const { authorize, protectRoutes } = require('../middleware/auth');
const User = require('../models/User');

router.use(protectRoutes);
router.use(authorize('admin'));

router
  .route('/')
  .get(advancedResults(User), getUsers)
  .post(createUser);

router
  .route('/:id')
  .get(getUser)
  .put(updateUser)
  .delete(deleteUser);

module.exports = router;
