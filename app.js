const express = require('express');
const fs = require('fs');
const morgan = require('morgan');
const app = express();


const AppError = require("./utils/appError");
const globalErrorHandler = require("./controllers/errorController")
const tourRouter = require('./Routes/tourRoutes');
const userRouter = require('./Routes/userRoutes');

// MiddleWare
if (process.env.NODE_ENV == 'development') {
  app.use(morgan('dev'));
}

app.use(express.json());

app.use(express.static(`${__dirname}/public`));

app.use((req, res, next) => {
  req.requestTime = new Date().toISOString();
  next();
});

// Routes

app.use('/api/v1/tours', tourRouter);
app.use('/api/v1/users', userRouter);

// routeHandler

app.all('*', (req, res, next) => {
  // res.status(404).json({
  //   status: 'Failed',
  //   message: `Can't find this ${req.originalUrl} on this server`,
  // });

  // const err = new Error(`Can't find this ${req.originalUrl} on this server`)
  // err.statusCode = 404
  // err.status = "Failed"

  next(new AppError(`Can't find this ${req.originalUrl} on this server`,404));

});

// Global Error Handler using express middleWare
app.use(globalErrorHandler)

module.exports = app;
