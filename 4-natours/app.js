const express = require('express');
const fs = require('fs');
const app = express();

app.use(express.json()); // middleware: function that can modify incoming request data

// in Express, order is very important.
app.use((req, res, next) => {
  console.log('Hello from the middleware');
  next();
});

app.use((req, res, next) => {
  req.requestTime = new Date().toISOString();
  next();
});

const tours = JSON.parse(
  fs.readFileSync(
    `${__dirname}/dev-data/data/tours-simple.json`
  )
);

const getAllTours = (req, res) => {
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

const getOneTour = (req, res) => {
  const id = req.params.id * 1; // convert string id to number id
  console.log(id);
  console.log(tours.length);
  if (id >= tours.length) {
    return res.status(404).json({
      status: 'failed',
      message: 'Invalid tour ID'
    });
  }
  const tour = tours.find((tour) => tour.id === id);
  console.log(tour);
  res.status(200).json({
    status: 'success',
    data: {
      tour: tour
    }
  });
};

const createOneTour = (req, res) => {
  const newId = tours[tours.length - 1].id + 1;
  const newTour = Object.assign({ id: newId }, req.body);
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

const updateOneTour = (req, res) => {
  if (req.params.id * 1 > tours.length) {
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

const deleteOneTour = (req, res) => {
  if (req.params.id * 1 > tours.length) {
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

// List of routes using callbacks
// app.get('/api/v1/tours', getAllTours);
// app.get('/api/v1/tours/:id', getOneTour);
// app.post('/api/v1/tours', createOneTour);
// app.patch('/api/v1/tours/:id', updateOneTour);
// app.delete('/api/v1/tours/:id', deleteOneTour);

// if we want to update version or resources' names, this is way easier:
app
  .route('/api/v1/tours')
  .get(getAllTours)
  .post(createOneTour);

app
  .route('/api/v1/tours/:id')
  .get(getOneTour)
  .patch(updateOneTour)
  .delete(deleteOneTour);

const port = 3000;
app.listen(port, () => {
  console.log(`app running on port ${port}...`);
});
