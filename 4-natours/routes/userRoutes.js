const express = require('express');
const {
  getAllUsers,
  createUser,
  getOneUser,
  updateOneUser,
  removeOneUser
} = require('../controllers/userController');
const {
  signUp,
  logIn
} = require('../controllers/authController');

const router = express.Router();

router.post('/signup', signUp);
router.post('/login', logIn);

router
  .route('/')
  .get(getAllUsers)
  .post(createUser);

router
  .route('/:id')
  .get(getOneUser)
  .patch(updateOneUser)
  .delete(removeOneUser);

module.exports = router;
