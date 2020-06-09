const express = require('express');
const {
  getAllTours,
  createOneTour,
  getOneTour,
  updateOneTour,
  deleteOneTour
} = require('../controllers/tourController');

const router = express.Router();

// middleware to validate params in request URL
// router.param('id', checkID);

router
  .route('/')
  .get(getAllTours)
  .post(createOneTour); //route handler for createTour

router
  .route('/:id')
  .get(getOneTour)
  .patch(updateOneTour)
  .delete(deleteOneTour);

module.exports = router;
