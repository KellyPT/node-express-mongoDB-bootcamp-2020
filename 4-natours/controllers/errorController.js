module.exports = (err, req, res, next) => {
  // console.log(err.stack); // show use where the error happened
  err.statusCode = err.statusCode || 500; // handle errors intentionally created by developers and errors coming from other parts of Node system
  err.status = err.status || 'error';
  res.status(err.statusCode).json({
    status: err.status,
    message: err.message
  });
};
