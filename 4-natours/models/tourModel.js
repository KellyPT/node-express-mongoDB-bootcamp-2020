const mongoose = require('mongoose');

const tourSchema = new mongoose.Schema({
  name: {
    type: String,
    required: [true, 'A tour must have a name'], // error string, also called as validator
    unique: true
  },
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
});

const Tour = mongoose.model('Tour', tourSchema);

module.exports = Tour;
