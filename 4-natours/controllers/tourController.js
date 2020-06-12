const Tour = require('../models/tourModel');

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

class APIFeatures {
  // constructor: create an object from Mongoose query for reusability, and queryString getting from Express from the routes
  constructor(query, queryStringFromExpress) {
    this.queryForMongoose = query; // actually our model that we're gonna query
    this.queryStringFromExpress = queryStringFromExpress;
  }

  filter() {
    // we need a hard copy here because don't want to modify the original req.query
    const queryObj = {
      ...this.queryStringFromExpress
    };
    const excludedFields = [
      'page',
      'sort',
      'limit',
      'fields'
    ];
    excludedFields.forEach(
      (field) => delete queryObj[field]
    );

    // Advanced filtering for greater than, lesser than
    let filteredQueryStr = JSON.stringify(
      queryObj
    );
    filteredQueryStr = filteredQueryStr.replace(
      /\b(gte|gt|lte|lt)\b/g,
      (match) => `$${match}`
    );

    this.queryForMongoose = this.queryForMongoose.find(
      JSON.parse(filteredQueryStr)
    );

    return this;
  }

  sort() {
    if (this.queryStringFromExpress.sort) {
      const sortBy = this.queryStringFromExpress.sort
        .split(',')
        .join(' ');
      this.queryForMongoose = this.queryForMongoose.sort(
        sortBy
      ); // to achieve this format query.sort('price ratingsAverage)
    } else {
      this.queryForMongoose = this.queryForMongoose.sort(
        '-createdAt'
      );
    }

    return this; // give access to the modified object
  }

  limitFields() {
    if (this.queryStringFromExpress.fields) {
      const fields = this.queryStringFromExpress.fields
        .split(',')
        .join(' '); // join with a space
      this.queryForMongoose = this.queryForMongoose.select(
        fields
      );
    } else {
      this.queryForMongoose = this.queryForMongoose.select(
        '-__v'
      ); //add minus sign to include everything except the __v
    }

    return this;
  }

  paginate() {
    const page =
      this.queryStringFromExpress.page * 1 || 1;
    const limit =
      this.queryStringFromExpress.limit * 1 ||
      100;
    const skip = (page - 1) * limit;
    this.queryForMongoose = this.queryForMongoose
      .skip(skip)
      .limit(limit);

    return this;
  }
}

exports.getAllTours = async (req, res) => {
  try {
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
