const app = require('./app');

// 4. START SERVER
const port = 3000;
app.listen(port, () => {
  console.log(
    `app running on port ${port}...`
  );
});
