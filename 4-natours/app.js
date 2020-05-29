const express = require('express');
const fs = require('fs');
const app = express();

// app.get('/', (req, res) => {
//   res
//     .status(200)
//     .json({ message: 'Hello from the server side!', app: 'Natours' });
// });

// app.post('/', (req, res) => {
//   res.status(200).send('you can post data to this endpoint');
// });

const tours = JSON.parse(
  fs.readFileSync(`${__dirname}/dev-data/data/tours-simple.json`)
);

app.get('/api/v1/tours', (req, res) => {
  res.status(200).json({
    status: 'Success',
    results: tours.length, // usually included when we send an array object
    data: {
      tours: tours
    }
  });
});

const port = 3000;

app.listen(port, () => {
  console.log(`app running on port ${port}...`);
});
