const Tour = require('../models/tourModel');

// const tours = JSON.parse(
//   fs.readFileSync(
//     `${__dirname}/../dev-data/data/tours-simple.json`
//   )
// );

// 2. ROUTE HANDLERS

exports.getAllTours = (req, res) => {
  console.log(req.requestTime);
  res.status(200).json({
    status: 'Success',
    requestTime: req.requestTime,
    // results: tours.length, // usually included when we send an array object
    data: {
      // tours: tours
    }
  });
};

exports.getOneTour = (req, res) => {
  // const tour = tours.find(
  //   (tour) => tour.id === req.params.id * 1
  // );
  // res.status(200).json({
  //   status: 'success',
  //   data: {
  //     tour: tour
  //   }
  // });
};

exports.createOneTour = async (req, res) => {
  try {
    // equivalent code:
    // const newTour = new Tour({});
    // newTour.save();
    const newTour = await Tour.create(req.body);

    res.status(201).json({
      status: 'success',
      data: {
        tour: newTour
      }
    });
  } catch (err) {
    res.status(400).json({
      status: 'failed',
      message: 'Error saving data'
    });
  }
};

exports.updateOneTour = (req, res) => {
  res.status(200).json({
    status: 'success',
    data: {
      tour: `Tour ${req.params.id} updated`
    }
  });
};

exports.deleteOneTour = (req, res) => {
  res.status(204).json({
    status: 'success',
    data: null
  });
};
