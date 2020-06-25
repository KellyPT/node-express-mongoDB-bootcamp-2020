const Tour = require('../models/tourModel');
const APIFeatures = require('../utils/apifeatures');
const catchAsyncError = require('../utils/catchAsyncError');

// const tours = JSON.parse(
//   fs.readFileSync(
//     `${__dirname}/../dev-data/data/tours-simple.json`
//   )
// );

// 2. ROUTE HANDLERS

// middleware for alias cheapest 5 tours
exports.aliasTopTours = (req, res, next) => {
  req.query.limit = '5';
  req.query.sort = '-ratingsAverage,price';
  req.query.fields =
    'name,price,ratingsAverage,summary,difficulty';
  next();
};

exports.getAllTours = catchAsyncError(
  async (req, res, next) => {
    // Execute Query
    const apiFeatures = new APIFeatures(
      Tour.find(), // get all records in Tour in Mongoose in an object before we do any filtering based on route params
      req.query // query coming from routes in Express
    )
      .filter()
      .sort()
      .limitFields()
      .paginate();
    // chaining methods only work if we return "this" object at the end of each method
    const tours = await apiFeatures.queryForMongoose;

    res.status(200).json({
      status: 'Success',
      results: tours.length, // usually included when we send an array object
      data: {
        tours: tours
      }
    });
  }
);

exports.getOneTour = catchAsyncError(
  async (req, res, next) => {
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
  }
);

exports.createOneTour = catchAsyncError(
  async (req, res, next) => {
    const newTour = await Tour.create(req.body);

    res.status(201).json({
      status: 'success',
      data: {
        tour: newTour
      }
    });
  }
);

exports.updateOneTour = catchAsyncError(
  async (req, res, next) => {
    const updatedTour = await Tour.findByIdAndUpdate(
      req.params.id,
      req.body,
      {
        new: true, // return the new updated document
        runValidators: true // will run validators in model
      }
    );
    res.status(200).json({
      status: 'success',
      data: {
        tour: updatedTour
      }
    });
  }
);

exports.deleteOneTour = catchAsyncError(
  async (req, res, next) => {
    await Tour.findByIdAndDelete(req.params.id);
    res.status(204).json({
      status: 'success'
    });
  }
);

exports.getTourStats = catchAsyncError(
  async (req, res, next) => {
    const stats = await Tour.aggregate([
      {
        $match: { ratingsAverage: { $gte: 4.5 } }
      },
      {
        $group: {
          // _id: null, // this is where we can define the buckets of our stats
          // _id: '$difficulty', // this will show the stats for each difficulty level
          // _id: '$ratingsAverage',
          _id: { $toUpper: '$difficulty' },
          totalTours: { $sum: 1 },
          numRatings: {
            $sum: '$ratingsQuantity'
          },
          avgRating: { $avg: '$ratingsAverage' },
          avgPrice: { $avg: '$price' },
          minPrice: { $min: '$price' },
          maxPrice: { $max: '$price' }
        }
      },
      {
        $sort: { avgPrice: 1 }
      }
      // {
      //   $match: { _id: { $ne: 'EASY' } } // $ne: not equal
      // }
    ]);

    res.status(200).json({
      status: 'success',
      data: {
        stats: stats
      }
    });
  }
);

// example: get number of tours and name of tours in each month of a particular year based on startDates
exports.getMonthlyPlan = catchAsyncError(
  async (req, res, next) => {
    const year = req.params.year * 1;

    const plan = await Tour.aggregate([
      {
        $unwind: '$startDates' // create a new separate document for each of startDate in the startDates array
      },
      {
        $match: {
          // narrow down the date range
          startDates: {
            $gte: new Date(`${year}-01-01`),
            $lte: new Date(`${year}-12-31`)
          }
        } // only select document that match this date range
      },
      {
        $group: {
          _id: { $month: '$startDates' }, // group by months of startDates
          totalTours: { $sum: 1 }, // add 1 to each document, i.e. count number of tours in each month
          tours: { $push: '$name' } // create an array of all tours in each month, adding only tour's name
        }
      },
      {
        $sort: { totalTours: -1 }
      },
      {
        $addFields: { month: '$_id' } // create a new field 'month' that take the value of _id
      },
      {
        $project: {
          _id: 0 // hide this field _id, put a 1 and it will show up
        }
      },
      {
        $limit: 12 // show only 6 outputs
      }
    ]);

    res.status(200).json({
      status: 'success',
      data: {
        plan // es6 syntax if key-value has the same string
      }
    });
  }
);
