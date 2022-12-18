const express = require("express");
require("express-async-errors");
const blogsRouter = require("./controllers/blogs");
const app = express();
const middleware = require("./util/middleware");
const logger = require("./util/logger");

app.use(express.json());
app.use(middleware.requestLogger);
app.use("/api/blogs", blogsRouter);

app.use(middleware.unknownEndpoint);
app.use(middleware.errorHandler);

module.exports = app;
