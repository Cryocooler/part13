const logger = require("./logger");
const jwt = require("jsonwebtoken");
const User = require("../models/user");

const requestLogger = (request, response, next) => {
  logger.info("Method:", request.method);
  logger.info("Path:  ", request.path);
  logger.info("Body:  ", request.body);
  logger.info("---");
  next();
};

const unknownEndpoint = (request, response) => {
  response.status(404).send({ error: "unknown endpoint" });
  logger.error("unknown endpoint", request.path);
};

const errorHandler = (error, request, response, next) => {
  if (error.name === "CastError") {
    return response.status(400).send({ error: "malformatted id" });
  } else if (error.name === "ValidationError") {
    return response.status(400).json({ error: error.message });
  } else if (error.name === "ReferenceError") {
    return response.status(400).json({ error: error.message });
  } else if (error.name === "SequelizeValidationError") {
    logger.error(error.message);
    return response.status(400).json({ error: error.message });
  }
  logger.error(error.message);
  next(error);
};

module.exports = {
  requestLogger,
  errorHandler,
  unknownEndpoint,
};
