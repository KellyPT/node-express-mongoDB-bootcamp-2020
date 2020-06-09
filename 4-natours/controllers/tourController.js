const Tour = require('../models/tourModel');

// const tours = JSON.parse(
//   fs.readFileSync(
//     `${__dirname}/../dev-data/data/tours-simple.json`
//   )
// );

// 2. ROUTE HANDLERS

exports.getAllTours = async (req, res) => {
  try {
    const tours = await Tour.find(); // if we don't give any param, it will return all records
    res.status(200).json({
      status: 'Success',
      results: tours.length, // usually included when we send an array object
      data: {
        tours: tours
      }
    });
  } catch (err) {
    res.status(500).json({
      status: 'failed',
      message: 'Cannot connect to DB'
    });
  }
};

exports.getOneTour = async (req, res) => {
  try {
    const tour = await Tour.findById(
      req.params.id
    );

    // another way:
    // Tour.findOne({_id: req.params.id});

    res.status(200).json({
      status: 'success',
      data: {
        tour: tour
      }
    });
  } catch (err) {
    res.status(404).json({
      status: 'failed',
      message: 'Cannot find tour'
    });
  }
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
