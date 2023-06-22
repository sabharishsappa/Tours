<h1 align="center">
  <br>
  <a href="https://natours-api-by-sabharish.onrender.com/"><img src="https://github.com/sabharishsappa/Tours/blob/main/public/img/logo-green%20(1).png" alt="Natours" width="200"></a>
  <br>
  Natours
  <br>
</h1>

<h4 align="center">An awesome tour booking site built on top of <a href="https://nodejs.org/en/" target="_blank">NodeJS</a>.</h4>

 <p align="center">
 <a href="#deployed-version">Demo</a> •
  <a href="#key-features">Key Features</a> •
  <a href="#demonstration">Demonstration</a> •
  <a href="#how-to-use">How To Use</a> •
  <a href="#api-usage">API Usage</a> •
  <a href="#deployment">Deployment</a> •
  <a href="#build-with">Build With</a> •
  <a href="#to-do">To-do</a> •
  <a href="#installation">Installation</a> • 
  <a href="#known-bugs">Known Bugs</a> • 
  <a href="#future-updates">Future Updates</a> • 
  <a href="#acknowledgement">Acknowledgement</a>
</p>

## Deployed Version
Live demo (Feel free to visit) 👉 : https://natours-api-by-sabharish.onrender.com/


## Key Features

* Authentication and Authorization
  - Login and logout
* Tour
  - Manage booking
  - Check tours map
  - Check users' reviews and rating
* Advanced MongoDB
  - Manage booking
  - Check tours map
  - Check users' reviews and rating
* User profile
  - Update username, photo, email, and password
  - User profile photo
* Uploading user photo
  - Image processing
* Credit card Payment with Stripe




## Demonstration
#### Home Page :
![natours-home-page](https://github.com/sabharishsappa/Tours/blob/main/appDemoVideos/allTours-_1_.gif)

#### Tour Details :
![specific-tour-demo](https://github.com/sabharishsappa/Tours/blob/main/appDemoVideos/particularTour-Made-with-Clipchamp.gif)

#### Payment Process :
![payment-process-1-demo](https://github.com/sabharishsappa/Tours/blob/main/appDemoVideos/bookingTour-Made-with-Clipchamp-_1_.gif)


#### Login Process :
![login-demo](https://github.com/sabharishsappa/Tours/blob/main/appDemoVideos/loginPage-Made-with-Clipchamp.gif)

#### Account update Process :
![account-update-demo](https://github.com/sabharishsappa/Tours/blob/main/appDemoVideos/updatingUserData-Made-with-Clipchamp.gif)

#### Booked Tours :
![rsz_bookedtours](https://user-images.githubusercontent.com/58518192/72607747-6a7b0900-394b-11ea-8b9f-5330531ca2eb.png)


#### User Profile :
![rsz_userprofile](https://user-images.githubusercontent.com/58518192/72607635-44edff80-394b-11ea-8943-64c48f6f19aa.png)

#### Admin Profile :
![rsz_adminprofile](https://user-images.githubusercontent.com/58518192/72607648-4d463a80-394b-11ea-972f-a73160cfaa5b.png)


## How To Use

### Book a tour
* Login to the site
* Search for tours that you want to book
* Book a tour
* Proceed to the payment checkout page
* Enter the card details (Test Mood):
  ```
  - Card No. : 4242 4242 4242 4242
  - Expiry date: any featured date
  - CVV: 222
  ```
* Finished!



### Manage your booking

* Check the tour you have booked in "Manage Booking" page in your user settings. You'll be automatically redirected to this
  page after you have completed the booking.

### Update your profile

* You can update your own username, profile photo, email and password.



## API Usage
Before using the API, you need to set the variables in Postman depending on your environment (development or production). Simply add: 
  ```
  - {{URL}} with your hostname as value (Eg. http://127.0.0.1:3000 or http://www.example.com)
  - {{password}} with your user password as value.
  ```

Check [Natours API Documentation](https://documenter.getpostman.com/view/21665031/2s93sabZ7w) for more info.

<b> API Features: </b>

Tours List 👉 https://natours-api-by-sabharish.onrender.com/api/v1/tours

Tours Stats 👉 https://natours-api-by-sabharish.onrender.com/api/v1/tours/tour-stats

Get Top 5 Cheap Tours 👉 https://natours-api-by-sabharish.onrender.com/api/v1/tours/top-5-cheap

Get Tours Within Radius 👉 https://natours-api-by-sabharish.onrender.com/api/v1/tours/tours-within/200/center/34.098453,-118.096327/unit/mi



## Deployment
The website is deployed with git into Render.


## Build With

* [NodeJS](https://nodejs.org/en/) - JS runtime environment
* [Express](http://expressjs.com/) - The web framework used
* [Mongoose](https://mongoosejs.com/) - Object Data Modelling (ODM) library
* [MongoDB Atlas](https://www.mongodb.com/cloud/atlas) - Cloud database service
* [Pug](https://pugjs.org/api/getting-started.html) - High performance template engine
* [JSON Web Token](https://jwt.io/) - Security token
* [ParcelJS](https://parceljs.org/) - Blazing fast, zero configuration web application bundler
* [Stripe](https://stripe.com/) - Online payment API
* [Postman](https://www.getpostman.com/) - API testing
* [Mailtrap](https://mailtrap.io/) & [Sendgrid](https://sendgrid.com/) - Email delivery platform
* [Heroku](https://www.heroku.com/) - Cloud platform



## To-do

* Review and rating
  - Allow user to add a review directly at the website after they have taken a tour
* Booking
  - Prevent duplicate bookings after user has booked that exact tour, implement favourite tours
* Advanced authentication features
  - Signup, confirm user email,welcome email, login with refresh token, two-factor authentication
* And More ! There's always room for improvement!


## Installation
You can fork the app or you can git-clone the app into your local machine. Once done that, please install all the
dependencies by running
```
$ npm i
set your env variables
$ npm run watch:js
$ npm run build:js
$ npm run dev (for development)
$ npm run start:prod (for production)
$ npm run debug (for debug)
$ npm start
Setting up ESLint and Prettier in VS Code 👇
$ npm i eslint prettier eslint-config-prettier eslint-plugin-prettier eslint-config-airbnb eslint-plugin-node
eslint-plugin-import eslint-plugin-jsx-a11y  eslint-plugin-react --save-dev
```


## Known Bugs
Feel free to email me at sabharish.sappa@gmail.com if you run into any issues or have questions, ideas or concerns.


## Future Updates

* Will try to add extra features and options for customized Tour booking.

## Acknowledgement

* This project is part of the online course that I've taken at Udemy. Thanks to Jonas Schmedtmann for creating this awesome course! Link to the course: [Node.js, Express, MongoDB & More: The Complete Bootcamp 2019](https://www.udemy.com/course/nodejs-express-mongodb-bootcamp/)
