const mongoose = require('mongoose');
const dotenv = require('dotenv');

// GLOBAL UNCAUGHT EXCEPTION HANNDLER: handle sync errors
process.on('uncaughtException', (err) => {
  console.log('UNCAUGHT EXCEPTION');
  console.log(err.name, err.message);
  server.close(() => {
    console.log('Shutting down...');
    process.exit(1);
  });
});

dotenv.config({ path: './config.env' });
const app = require('./app');

// connecting to hosted database on cloud
const DB = process.env.DATABASE.replace(
  '<PASSWORD>',
  process.env.DATABASE_PASSWORD
);

mongoose
  .connect(DB, {
    useUnifiedTopology: true,
    useNewUrlParser: true,
    useCreateIndex: true,
    useFindAndModify: false
  })
  .then(() => {
    console.log(
      'Hosted DB connection successful!'
    );
  });

// connecting to local database on local machine
// mongoose
//   .connect(process.env.DATABASE_LOCAL, {
//     useNewUrlParser: true,
//     useCreateIndex: true,
//     useFindAndModify: false
//   })
//   .then(() => {
//     console.log(
//       'Local DB connection successful!'
//     );
//   });

// 4. START SERVER
const port = process.env.PORT || 3000;

const server = app.listen(port, () => {
  console.log(`app running on port ${port}...`);
});

// Global rejection handler:
// handle async errors
process.on('unhandledRejection', (err) => {
  console.log('UNHANDLED REJECTION');
  console.log(err.name, err.message);
  server.close(() => {
    console.log('Shutting down...');
    process.exit(1);
  });
});
