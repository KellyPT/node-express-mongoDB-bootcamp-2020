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
      message: err
    });
  }
};

exports.updateOneTour = async (req, res) => {
  try {
    const updatedTour = await Tour.findByIdAndUpdate(
      req.params.id,
      req.body,
      {
        new: true, // return the new updated document
        runValidators: true
      }
    );
    res.status(200).json({
      status: 'success',
      data: {
        tour: updatedTour
      }
    });
  } catch (err) {
    res.status(404).json({
      status: 'failed',
      message: err
    });
  }
};

exports.deleteOneTour = async (req, res) => {
  try {
    await Tour.findByIdAndDelete(req.params.id);
    res.status(204).json({
      status: 'success'
    });
  } catch (err) {
    res.status(404).json({
      status: 'success',
      message: 'Cannot delete this tour'
    });
  }
};
