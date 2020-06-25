const express = require('express');
const morgan = require('morgan');

const AppError = require('./utils/appError');
const tourRouter = require('./routes/tourRoutes');
const userRouter = require('./routes/userRoutes');

const app = express();

// 1. MIDDLEWARE
console.log(
  'Inside app.js:',
  process.env.NODE_ENV
);

if (process.env.NODE_ENV === 'development') {
  app.use(morgan('dev'));
}

app.use(express.json()); // middleware: function that can modify incoming request data

app.use(express.static(`${__dirname}/public`));

// in Express, order is very important.
// app.use((req, res, next) => {
//   console.log('Hello from the middleware');
//   next();
// });

app.use((req, res, next) => {
  req.requestTime = new Date().toISOString();
  next();
});

// 2. ROUTE HANDLERS : check controllers and routes folders

// 3. ROUTES
// List of routes using callbacks
// app.get('/api/v1/tours', getAllTours);
// app.get('/api/v1/tours/:id', getOneTour);
// app.post('/api/v1/tours', createOneTour);
// app.patch('/api/v1/tours/:id', updateOneTour);
// app.delete('/api/v1/tours/:id', deleteOneTour);

// if we want to update version or resources' names, this is way easier:
app.use('/api/v1/tours', tourRouter);
app.use('/api/v1/users', userRouter);

app.all('*', (req, res, next) => {
  next(
    new AppError(
      `Can't find ${req.originalUrl} on this server!`,
      404
    )
  );
});

app.use((err, req, res, next) => {
  console.log(err.stack); // show use where the error happened
  err.statusCode = err.statusCode || 500; // handle errors intentionally created by developers and errors coming from other parts of Node system
  err.status = err.status || 'error';
  res.status(err.statusCode).json({
    status: err.status,
    message: err.message
  });
});

module.exports = app;
