const mongoose = require('mongoose');
const slugify = require('slugify');

const tourSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: [true, 'A tour must have a name'], // error string, also called as validator
      unique: true,
      trim: true,
      maxlength: [
        40,
        'A tour name must have less or equal than 40 characters'
      ],
      minlength: [
        10,
        'A tour name must have more or equal than 10 characters'
      ]
    },
    slug: String,
    duration: {
      type: Number,
      required: [
        true,
        'A tour must have a duration'
      ]
    },
    maxGroupSize: {
      type: Number,
      required: [
        true,
        'A tour must have a group size'
      ]
    },
    difficulty: {
      type: String,
      required: [
        true,
        'A tour must have difficulty level'
      ],
      enum: {
        values: ['easy', 'medium', 'difficult'],
        message:
          'Accepted difficulty levels: easy, medium, difficult'
      }
    },
    price: {
      type: Number,
      required: [true, 'A tour must have a price']
    },
    ratingsAverage: {
      type: Number,
      default: 3, // this is not something user will enter themselves,
      min: [1, 'Rating must be above 1.0'],
      max: [
        5,
        'Rating must be below or equal to 5.0'
      ]
    },
    ratingsQuantity: {
      type: Number,
      default: 0 // this is not something user will enter themselves
    },
    priceDiscount: Number,
    summary: {
      type: String,
      trim: true,
      required: [
        true,
        'A tour must have a description'
      ]
    },
    description: {
      type: String,
      trim: true
    },
    imageCover: {
      type: String,
      required: [
        true,
        'A tour must have a cover image'
      ]
    },
    images: [String],
    createdAt: {
      type: Date,
      default: Date.now(),
      select: false // preventing this field from showing in API response
    },
    startDates: [Date],
    secretTour: {
      type: Boolean,
      default: false
    }
  },
  {
    toJSON: { virtuals: true }, // when data output as JSON
    toObject: { virtuals: true } // when data output as Object
  }
);

// virtual properties - wont be persisted in database. will only be available when we query the data
// we can't use this virtual property in grouping
tourSchema
  .virtual('durationWeeks')
  .get(function () {
    return this.duration / 7; // this is pointing to the current document
  });

// DOCUMENT MIDDLEWARE: runs before .save() and .create() commands but not on .insertMany()
tourSchema.pre('save', function (next) {
  this.slug = slugify(this.name, { lower: true }); // this refers to the currently processed documents
  next();
});

tourSchema.pre('save', function (next) {
  console.log('Will save document...');
  next();
});

tourSchema.post('save', function (doc, next) {
  console.log(doc);
  next();
});

// QUERY MIDDLEWARE:
// tourSchema.pre('find', function (next) {
tourSchema.pre(/^find/, function (next) {
  // regular expression /^find/: all the routes that executes Mongoose query starting with "find", e.g. find, findOne
  // e.g. we want to hide certain tours reserved for internal stakeholders
  this.find({ secretTour: { $ne: true } }); // 'this' keyword refers to current query
  this.start = Date.now(); // start our clock counter
  console.log(
    `Start of our Find query: ${this.start}`
  );
  next();
});

tourSchema.post(/^find/, function (docs, next) {
  console.log(
    `Find query took: ${
      Date.now() - this.start
    } milliseconds`
  );
  // console.log(docs);
  next();
});

// AGGREGATION MIDDLEWARE
// example: filter out secret tours from mongoose aggregation
tourSchema.pre('aggregate', function (next) {
  // remember Tour.aggregate() take an array of grouping/matching elements
  this.pipeline().unshift({
    $match: { secretTour: { $ne: true } }
  });
  console.log(
    'this refers to Aggregate',
    this.pipeline()
  ); // this point to the aggregation object
  next();
});

const Tour = mongoose.model('Tour', tourSchema);

module.exports = Tour;
