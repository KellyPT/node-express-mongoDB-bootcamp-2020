const fs = require('fs');

const tours = JSON.parse(
  fs.readFileSync(
    `${__dirname}/../dev-data/data/tours-simple.json`
  )
);

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
  const id = req.params.id * 1; // convert string id to number id
  console.log(id);
  console.log(tours.length);
  if (id >= tours.length) {
    return res.status(404).json({
      status: 'failed',
      message: 'Invalid tour ID'
    });
  }
  const tour = tours.find(
    (tour) => tour.id === id
  );
  console.log(tour);
  res.status(200).json({
    status: 'success',
    data: {
      tour: tour
    }
  });
};

exports.createOneTour = (req, res) => {
  const newId =
    tours[tours.length - 1].id + 1;
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
  if (
    req.params.id * 1 >
    tours.length
  ) {
    return res.status(404).json({
      status: 'failed',
      message: 'Invalid tour ID'
    });
  }
  res.status(200).json({
    status: 'success',
    data: {
      tour: `Tour ${req.params.id} updated`
    }
  });
};

exports.deleteOneTour = (req, res) => {
  if (
    req.params.id * 1 >
    tours.length
  ) {
    return res.status(404).json({
      status: 'failed',
      message: 'Invalid tour ID'
    });
  }
  res.status(204).json({
    status: 'success',
    data: null
  });
};
