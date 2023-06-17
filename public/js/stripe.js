import axios from 'axios';
import { showAlert } from './alerts';

export const bookTour = async (tourId) => {
  try {
    const stripe = Stripe(
      'pk_test_51NJuDdSIHYx4g6Fl7LHioFUBVTsdWZkBjDq3HH5QTKkkHYyBwOsA5U4rhv6MgVSCzUcHzLiDzFnon9krFh560iYv00ZQZD0NS1'
    );
    // 1) Get the Session from the api
    const session = await axios(
      `/api/v1/bookings/checkout-session/${tourId}`
    );

    // 2) Create checkout form + charge credit card
    await stripe.redirectToCheckout({
      sessionId: session.data.session.id,
    });
  } catch (err) {
    console.log(err);
    showAlert('error', err);
  }
};
