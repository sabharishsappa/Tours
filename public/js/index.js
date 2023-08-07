import '@babel/polyfill';
import { displayMap } from './mapbox';
import { login, logout } from './login';
import { updateSettings } from './updateSettings';
import { bookTour } from './stripe';
import { createReview, deleteReview ,editReview} from './review';
import 'core-js/stable';
import 'regenerator-runtime/runtime';
import { showAlert } from './alerts';



// DOM ELEMENTS
const mapbox = document.getElementById('map');
const loginForm = document.querySelector('.form--login');
const logOutBtn = document.querySelector('.nav__el--logout');
const userDataForm = document.querySelector('.form-user-data');
const userPasswordForm = document.querySelector('.form-user-password');
const bookBtn = document.getElementById('book-tour');
const submitReview = document.querySelector('.form--review');
const deleteReviewBtn = document.getElementById('deleteButton');

// DELEGATION
if (mapbox) {
  const locations = JSON.parse(mapbox.dataset.locations);
  displayMap(locations);
}

if (loginForm) {
  loginForm.addEventListener('submit', (e) => {
    const email = document.getElementById('email').value;
    const password = document.getElementById('password').value;

    e.preventDefault();
    login(email, password);
  });
}

if (logOutBtn) {
  logOutBtn.addEventListener('click', logout);
}


if (submitReview) {
  submitReview.addEventListener('submit', async (e) => {
    e.preventDefault();

    const review = document.getElementById('review').value;
    const rating = document.getElementById('rating').value;
    const userId = submitReview.dataset.userId;
    const tourId = submitReview.dataset.tourId;
    const reviewId = submitReview.dataset.reviewId;

    try {
      if(reviewId!=='')
        await editReview(reviewId,review,rating)

      else
        await createReview(review, rating, tourId, userId);
      
    } catch (error) {
      console.log(error);
    }
  });
}

if(deleteReviewBtn)
{
  deleteReviewBtn.addEventListener('click',e=>{
    const {reviewId} = e.target.dataset;
    console.log(reviewId)
    deleteReview(reviewId);
    console.log("Called delete Review function")
})}

if (userDataForm)
  userDataForm.addEventListener('submit', (e) => {
    e.preventDefault();
    const form = new FormData();
    form.append('name',document.getElementById('name').value)
    form.append('email',document.getElementById('email').value)
    form.append('photo',document.getElementById('photo').files[0])
    updateSettings(form, 'data');
  });

if (userPasswordForm)
  userPasswordForm.addEventListener('submit', async (e) => {
    e.preventDefault();
    document.querySelector('.btn--save-password').textContent = 'Updating...';
    const currentPassword = document.getElementById('password-current').value;
    const newPassword = document.getElementById('password').value;
    const newPasswordConfirm =
      document.getElementById('password-confirm').value;
    await updateSettings(
      { currentPassword, newPassword, newPasswordConfirm },
      'password'
    );

    document.querySelector('.btn--save-password').textContent = 'Save Password';
    document.getElementById('password-current').value = '';
    document.getElementById('password').value = '';
    document.getElementById('password-confirm').value = '';
  });


  if(bookBtn)
    bookBtn.addEventListener('click',e=>{
      e.target.textContent='Processing'
      const {tourId} = e.target.dataset;
      bookTour(tourId);
    })

const alertMessage = document.querySelector('body').dataset.alert;
if(alertMessage) showAlert('success',alertMessage,20)