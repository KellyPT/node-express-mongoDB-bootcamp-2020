const fs = require('fs');

const tours = JSON.parse(
  fs.readFileSync(
    `${__dirname}/../dev-data/data/tours-simple.json`
  )
);

// 1. MIDDLEWARE
// use param middleware to validate ID before getting into each route, because this logic is reusable
exports.checkID = (req, res, next, val) => {
  console.log(
    'checkID middleware',
    `Tour ID: ${val}`
  );
  if (req.params.id * 1 > tours.length) {
    // return keyword must be here to end the process after sending a response
    return res.status(404).json({
      status: 'failed',
      message: 'Invalid tour ID'
    });
  }
  next(); // always put this at the end of a middleware so that the request-response cycle could continue
};

exports.checkBody = (req, res, next) => {
  if (!req.body.name || !req.body.price) {
    return res.status(400).json({
      status: 'fail',
      message: 'missing name or price'
    });
  }
  next();
};

// 2. ROUTE HANDLERS

exports.getAllTours = (req, res) => {
  console.log(req.requestTime);
  res.status(200).json({
    status: 'Success',
    requestTime: req.requestTime,
    results: tours.length, // usually included when we send an array object
    data: {
      tours: tours
    }
  });
};

exports.getOneTour = (req, res) => {
  const tour = tours.find(
    (tour) => tour.id === req.params.id * 1
  );
  res.status(200).json({
    status: 'success',
    data: {
      tour: tour
    }
  });
};

exports.createOneTour = (req, res) => {
  const newId = tours[tours.length - 1].id + 1;
  const newTour = Object.assign(
    { id: newId },
    req.body
  );
  tours.push(newTour);
  fs.writeFile(
    `${__dirname}/dev-data/data/tours-simple.json`,
    JSON.stringify(tours),
    (err) => {
      res.status(201).json({
        status: 'success',
        data: {
          tour: newTour
        }
      });
    }
  );
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
