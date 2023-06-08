const mongoose = require('mongoose');
const slugify = require('slugify');
// const validator = require('validator');
// const User = require("./userModel");

const tourSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: [true, 'A Tour must have a name'],
      unique: true,
      trim: true,
      maxLength: [40, 'A tour name must have less or equal to 40 characters'],
      minLength: [10, 'A tour name must have greater or eqal to 10 characters'],
      // validate:[validator.isAlpha,"Tour Name must contain only charccter not numbers"]
    },
    slug: String,
    startLocation: {
      // GeoJSON
      type: {
        type: String,
        default: 'Point',
        enum: ['Point'],
      },
      coordinates: [Number],
      address: String,
      description: String,
    },
    locations: [
      {
        type: {
          type: String,
          default: 'point',
          enum: ['Point'],
        },
        cordinates: [Number],
        address: String,
        description: String,
        day: Number,
      },
    ],
    guides: [
      {
        // child referencing
        type: mongoose.Schema.ObjectId,
        ref: 'User',
      },
    ],

    ratingsAverage: {
      type: Number,
      default: 4.5,
      min: [1, 'ratingsAverage must be greater or equal to 1'],
      max: [5, 'ratingsAverage must be less or equal to 5'],
      set: (val) => Math.round(val * 10) / 10, //for setting one decimal rounding
    },
    ratingsQuantity: {
      type: Number,
      default: 0,
    },
    maxGroupSize: {
      type: Number,
      required: [true, 'A Tour must have Max Limit of Passengers'],
    },
    duration: {
      type: Number,
      required: [true, 'A Tour must have the Duration'],
    },
    difficulty: {
      type: String,
      enum: {
        values: ['easy', 'medium', 'difficult'],
        message: 'Difficulty is either easy, medium, difficult',
      },
    },
    startDates: [Date],
    price: {
      type: Number,
      required: [true, 'A Tour must have a Price'],
    },
    priceDiscount: {
      type: Number,
      validate: {
        validator: function (val) {
          // this only points to the current document on new document creation only
          return val < this.price;
        },
        message: 'price Discount ({VALUE}) should be less than regular price',
      },
    },

    summary: {
      type: String,
      trim: true,
      required: [true, 'A Tour must have the summary'],
    },
    nextStartDate: {
      type: [Date],
    },
    description: {
      type: String,
      trim: true,
    },

    imageCover: {
      type: String,
      required: [true, 'A tour must have a cover image'],
    },

    images: [String],

    tourCreatedAt: {
      type: Date,
      default: Date.now(),
      select: false,
    },
    secretTour: {
      type: Boolean,
      default: false,
    },

    // child referencing of reviews, but we dont use this we use virtual populate
    // reviews:[{
    //   type:mongoose.Schema.Types.ObjectId,
    //   ref:"Review"
    //   }
    // ]
  },
  {
    toJSON: { virtuals: true },
    toObject: { virtuals: true },
  }
);

// tourSchema.index({price:1})
tourSchema.index({ price: 1, ratingsAverage: -1 });
tourSchema.index({ slug: 1 });
tourSchema.index({ startLocation: '2dsphere' });

tourSchema.virtual('durationWeeks').get(function () {
  return this.duration / 7;
});

// virtual populate
tourSchema.virtual('reviews', {
  ref: 'Review',
  foreignField: 'tour',
  localField: '_id',
});

// Document Middlewhere : runs before .save() command and .create() command but not for insertMany() and any other
tourSchema.pre('save', function (next) {
  this.slug = slugify(this.name, { lower: true });
  next();
});

// tourSchema.pre('save', async function (next) {
//   const guidesPromises = this.guides.map(async (id) => await User.findById(id));
//   this.guides = await Promise.all(guidesPromises);
//   next();
// });
// tourSchema.pre('save',function(next){
//   console.log("new Documeent will be saved...");
//   next();
// })

// tourSchema.post('save',function(doc,next){
//   console.log(doc);
//   next();
// })

// Query Middleware
tourSchema.pre(/^find/, function (next) {
  this.find({ secretTour: { $ne: true } });
  this.start = Date.now();
  next();
});

// tourSchema.pre('findOne',function(next){
//   this.find({secretTour:{$ne:true}})
//   next();
// })

tourSchema.pre(/^find/, function (next) {
  // it populate slike embedded inn the queries but not in the database, in database its like referencing only
  this.populate({
    path: 'guides',
    select: '-__v',
  });
  next();
});

tourSchema.post(/^find/, function (docs, next) {
  console.log(`Query Took: ${Date.now() - this.start} milliseconds`);
  // console.log(docs);
  next();
});

// Aggregation Middleware
// tourSchema.pre('aggregate', function (next) {
//   this.pipeline().unshift({ $match: { secretTour: { $ne: true } } });
//   // console.log(this.pipeline());
//   next();
// });

const Tour = mongoose.model('Tour', tourSchema);

module.exports = Tour;
