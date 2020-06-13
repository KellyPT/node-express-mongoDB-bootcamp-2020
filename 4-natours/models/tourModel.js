const mongoose = require('mongoose');
const slugify = require('slugify');

const tourSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: [true, 'A tour must have a name'], // error string, also called as validator
      unique: true
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
      ]
    },
    price: {
      type: Number,
      required: [true, 'A tour must have a price']
    },
    ratingsAverage: {
      type: Number,
      default: 0 // this is not something user will enter themselves
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
    startDates: [Date]
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

const Tour = mongoose.model('Tour', tourSchema);

module.exports = Tour;
