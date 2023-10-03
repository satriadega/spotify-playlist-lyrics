const errorHandler = (err, req, res, next) => {
  let status = 500;
  let message = "Internal Server Error";
  console.log(err.code);
  console.log(err);
  // console.log(err);
  switch (err.message) {
    case "User validation failed":
      status = 400;
      message = err._message;
      break;
    case "Id already registered":
      status = 400;
      message = "Id already registered";
      break;
    default:
      break;
  }

  res.status(status).json({ message: message });
};

module.exports = errorHandler;
