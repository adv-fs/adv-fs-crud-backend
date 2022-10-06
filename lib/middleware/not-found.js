module.exports = (req, res, next) => {
  const err = new Error('Not found middleware');
  err.status = 404;
  next(err);
};
