const express = require('express');

const getAllUsers = (req, res) => {
  res.status(500).json({
    status: 'error',
    message:
      'this route is not yet defined!'
  });
};

const createUser = (req, res) => {
  res.status(500).json({
    status: 'error',
    message:
      'this route is not yet defined!'
  });
};

const getOneUser = (req, res) => {
  res.status(500).json({
    status: 'error',
    message:
      'this route is not yet defined!'
  });
};

const updateOneUser = (req, res) => {
  res.status(500).json({
    status: 'error',
    message:
      'this route is not yet defined!'
  });
};

const removeOneUser = (req, res) => {
  res.status(500).json({
    status: 'error',
    message:
      'this route is not yet defined!'
  });
};

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
