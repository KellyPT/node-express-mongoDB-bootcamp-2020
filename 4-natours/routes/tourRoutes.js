const express = require('express');
const tourController = require('../controllers/tourController');
const authController = require('../controllers/authController');

const router = express.Router();

// middleware to validate params in request URL
// router.param('id', checkID);

// TIP: http method will take a middleware function if necessary, then controller function

router
  .route('/top-5-cheap')
  .get(
    tourController.aliasTopTours,
    tourController.getAllTours
  );
// then in POSTMAN, we will run GET 127.0.0.1:3000/api/v1/tours/top-5-cheap

router
  .route('/tour-stats')
  .get(tourController.getTourStats);

router
  .route('/monthly-plan/:year')
  .get(tourController.getMonthlyPlan);

router
  .route('/')
  .get(
    authController.protect,
    tourController.getAllTours
  )
  .post(tourController.createOneTour); //route handler for createTour

router
  .route('/:id')
  .get(tourController.getOneTour)
  .patch(tourController.updateOneTour)
  .delete(tourController.deleteOneTour);

module.exports = router;
