import axios from 'axios';
import { showAlert } from './alerts';
import catchAsync from '../../utils/catchAsync';

export const createReview = async (review, rating, tour, user) => {
    try {
      const res = await axios({
        method: 'POST',
        url: 'http://localhost:3000/api/v1/reviews',
        data: {
          review,
          rating,
          tour,
          user
        },
      });
  
      if (res.data && res.data.status && res.data.status === 'success') {
        showAlert('success', 'Review Created Successfully');
        window.setTimeout(() => {
          window.location.href = '/my-reviews';
        }, 1500);
      } else {
        showAlert('error', 'Failed to add a review');
      }
    } catch (err) {
      if (err.response && err.response.data && err.response.data.message) {
        showAlert('error', err.response.data.message);
      } else {
        showAlert('error', 'An error occurred during login');
      }
    }
  };


  export const deleteReview= async(reviewId)=>{
    try {
      console.log(reviewId)
      const res = await axios({
        method: 'DELETE',
        url: `http://localhost:3000/api/v1/reviews/${reviewId}`,
        
      });

      if (res.data && res.data.status && res.data.status === 'success') {
        showAlert('success', 'Review Deleted Successfully');
        window.setTimeout(() => {
          window.location.href = '/my-reviews';
        }, 1500);
      } else {
        showAlert('error', 'Failed to delete a review');
      }
    } catch (err) {
      if (err.response && err.response.data && err.response.data.message) {
        showAlert('error', err.response.data.message);
      } else {
        showAlert('error', 'An error occurred during deletion');
      }
    }
  }

  export const editReview = async(reviewId, review,rating)=>{
    try {
      const res = await axios({
        method: 'PATCH',
        url: `http://localhost:3000/api/v1/reviews/${reviewId}`,
        data:{
          review,
          rating
        }
        
      });
  
      if (res.data && res.data.status && res.data.status === 'success') {
        showAlert('success', 'Review Edited Successfully');
        window.setTimeout(() => {
          window.location.href = '/my-reviews';
        }, 1500);
      } else {
        showAlert('error', 'Failed to Edit a review');
      }
    } catch (err) {
      if (err.response && err.response.data && err.response.data.message) {
        showAlert('error', err.response.data.message);
      } else {
        showAlert('error', 'An error occurred during Editing, Please Try Again');
      }
  }
}