const reviewController = require('./../controllers/reviewContoller');
const express = require('express');
const router = express.Router({ mergeParams: true });
const authController = require('./../controllers/authController');

// POST /tour/2334hfui/reviews -->create review for that particular tour id
// GET /tour/2334hfui/reviews -->getting reviews for that particular tour id

router.use(authController.protect);

router
  .route('/')
  .get(reviewController.getAllReviews)
  .post(
    authController.restrictTo('user'),
    reviewController.setTourUserIds,
    reviewController.createReview
  );

router
  .route('/:id')
  .get(reviewController.getReview)
  .patch(
    authController.restrictTo('user', 'admin'),
    reviewController.updateReview
  )
  .delete(
    authController.restrictTo('user', 'admin'),
    reviewController.deleteReview
  );

module.exports = router;
