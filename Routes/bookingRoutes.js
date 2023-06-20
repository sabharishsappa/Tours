// const express = require('express');
// const authController = require('./../controllers/authController');
// const bookingController = require('./../controllers/bookingController');

// const router = express.Router();

// router.use(authController.protect);

// router.get('/checkout-session/:tourId', bookingController.getCheckoutSession);


// router.use(authController.restrictTo('admin', 'lead-guides'));
// router
//   .route('/')
//   .get(bookingController.getAllBooking)
//   .post(bookingController.createBooking);

// router
//   .route('/:id')
//   .get(bookingController.getBooking)
//   .patch(bookingController.updateBooking)
//   .delete(bookingController.deleteBooking);

// module.exports = router;

const express = require('express');
const authController = require('./../controllers/authController');
const bookingController = require('./../controllers/bookingController');

const router = express.Router();

router.use(authController.protect);

router.get('/checkout-session/:tourId', bookingController.getCheckoutSession);

// Webhook route for Stripe
router.post('/webhook-checkout', bookingController.webhookCheckout);

router.use(authController.restrictTo('admin', 'lead-guides'));
router
  .route('/')
  .get(bookingController.getAllBooking)
  .post(bookingController.createBooking);

router
  .route('/:id')
  .get(bookingController.getBooking)
  .patch(bookingController.updateBooking)
  .delete(bookingController.deleteBooking);

module.exports = router;
