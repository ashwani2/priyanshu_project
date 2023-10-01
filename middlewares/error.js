const ErrorResponse = require("../utils/errorResponse");

const errorHandler = (err, req, res, next) => {
  let error = { ...err };
  error.message = err.message;
  //log console for the dev
  console.log(err.stack.red);
  console.log("Error Message", error);

  // Mongoose Bad Object ID
  if (err.name === "CastError") {
    const message = `Resource not Found with the id ${err.value}`;
    error = new ErrorResponse(message, 200);
  }

  // Mongoose Duplicate key
  if (err.code === 11000 || err.name === "MongoError") {
    const message = `Duplicate field Value entered`;
    error = new ErrorResponse(message, 200);
  }

  // Mongoose validation error
  if (err.name === "ValidationError") {
    const message = Object.values(err.errors).map((val) => val.message);
    error = new ErrorResponse(message, 200);
  }
  res.status(error.statusCode || 500).json({
    error: true,
    statusCode: 400,
    message: error.message || "Server error",
  });
};

module.exports = errorHandler;
