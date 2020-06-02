const express = require('express');
const {
  getAllTours,
  createOneTour,
  getOneTour,
  updateOneTour,
  deleteOneTour
} = require('./../controllers/tourController');

const router = express.Router();

router
  .route('/')
  .get(getAllTours)
  .post(createOneTour);

router
  .route('/:id')
  .get(getOneTour)
  .patch(updateOneTour)
  .delete(deleteOneTour);

module.exports = router;
