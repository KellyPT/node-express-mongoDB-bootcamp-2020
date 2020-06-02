const express = require('express');
const {
  getAllUsers,
  createUser,
  getOneUser,
  updateOneUser,
  removeOneUser
} = require('./../controllers/userController');

const router = express.Router();

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
