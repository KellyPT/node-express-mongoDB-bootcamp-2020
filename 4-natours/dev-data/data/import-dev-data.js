const fs = require('fs');
const mongoose = require('mongoose');
const dotenv = require('dotenv');
const Tour = require('../../models/tourModel');

dotenv.config({ path: './config.env' });

// connecting to hosted database on cloud
const DB = process.env.DATABASE.replace(
  '<PASSWORD>',
  process.env.DATABASE_PASSWORD
);

mongoose
  .connect(DB, {
    useNewUrlParser: true,
    useCreateIndex: true,
    useFindAndModify: false
  })
  .then(() => {
    console.log(
      'Hosted DB connection successful!'
    );
  });

// READ JSON FILE
const tours = JSON.parse(
  fs.readFileSync(
    `${__dirname}/tours-simple.json`,
    'utf-8'
  )
); // return an array of JS objects

// IMPORT DATA INTO DB
const importData = async () => {
  try {
    await Tour.create(tours); // this function accepts an object or an array of objects
    console.log(
      'Data from raw files successful loaded!'
    );
  } catch (err) {
    console.log(err);
  }
  process.exit();
};

// DELETE ALL DATA FROM COLLECTION
const deleteData = async () => {
  try {
    await Tour.deleteMany();
    console.log(
      'Successfully deleted all records'
    );
  } catch (err) {
    console.log(err);
  }
  process.exit();
};

if (process.argv[2] === '--import') {
  // in terminal, run $node dev-data/data/import-dev-data.js  --import
  importData();
} else if (process.argv[2] === '--delete') {
  deleteData();
  // in terminal, run $node dev-data/data/import-dev-data.js  --delete
}
