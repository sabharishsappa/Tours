const express = require('express');
const fs = require('fs');
const morgan = require('morgan');
const app = express();
const rateLimit = require('express-rate-limit');
const helmet = require('helmet');
const mongoSanitize = require('express-mongo-sanitize');
const xss = require('xss-clean');
const hpp = require('hpp');

const AppError = require('./utils/appError');
const globalErrorHandler = require('./controllers/errorController');
const tourRouter = require('./Routes/tourRoutes');
const userRouter = require('./Routes/userRoutes');
const reviewRouter = require("./Routes/reviewRoutes")


//Global MiddleWare

// setting secure HTTP headers
app.use(helmet());

// logging developement mode
if (process.env.NODE_ENV == 'development') {
  app.use(morgan('dev'));
}

// limiting uncoming requests from same API
const limiter = rateLimit({
  max: 100,
  window: 60 * 60 * 1000,
  message: 'Too many requests from this IP, please try again after an hour...',
});
app.use('/api', limiter);

// body parser, reading data from body
app.use(express.json({ limit: '10kb' }));

// santize incoming data for NoSQL queriy injection
app.use(mongoSanitize());

// santize data for XSS cross side scripting
app.use(xss());

// preventing parameter pollution
app.use(
  hpp({
    whitelist: [
      'duration',
      'ratingsAverage',
      'price',
      'ratingsQuantity',
      'maxGroupSize',
      'difficulty',
    ],
  })
);

// serving static files
app.use(express.static(`${__dirname}/public`));

// test middleware
app.use((req, res, next) => {
  req.requestTime = new Date().toISOString();
  next();
});

// Routes

app.use('/api/v1/tours', tourRouter);
app.use('/api/v1/users', userRouter);
app.use("/api/v1/reviews",reviewRouter);

// routeHandler

app.all('*', (req, res, next) => {
  // res.status(404).json({
  //   status: 'Failed',
  //   message: `Can't find this ${req.originalUrl} on this server`,
  // });

  // const err = new Error(`Can't find this ${req.originalUrl} on this server`)
  // err.statusCode = 404
  // err.status = "Failed"

  next(new AppError(`Can't find this ${req.originalUrl} on this server`, 404));
});

// Global Error Handler using express middleWare
app.use(globalErrorHandler);

module.exports = app;
