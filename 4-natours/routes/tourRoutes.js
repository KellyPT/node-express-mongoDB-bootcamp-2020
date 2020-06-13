const express = require('express');
const {
  getAllTours,
  createOneTour,
  getOneTour,
  updateOneTour,
  deleteOneTour,
  aliasTopTours,
  getTourStats
} = require('../controllers/tourController');

const router = express.Router();

// middleware to validate params in request URL
// router.param('id', checkID);

// TIP: http method will take a middleware function if necessary, then controller function

router
  .route('/top-5-cheap')
  .get(aliasTopTours, getAllTours);
// then in POSTMAN, we will run GET 127.0.0.1:3000/api/v1/tours/top-5-cheap

router.route('/tour-stats').get(getTourStats);

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
