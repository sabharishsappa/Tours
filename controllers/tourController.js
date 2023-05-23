const Tour = require('../models/tourModel');
const APIfeatures = require('../utils/apiFeatures');
const AppError = require('../utils/appError');
const catchAsync = require("./../utils/catchAsync")

exports.aliasTopTours = (req, res, next) => {
  req.query.limit = '5';
  req.query.sort = '-avgRating,price';
  // req.query.fileds = 'name,price,avgRating,summary';
  next();
};


exports.createTour = catchAsync(async (req, res,next) => {
    const newTour = await Tour.create(req.body);
    res.status(201).json({
      status: 'Success',
      data: {
        tour: newTour,
      },
    })});

// exports.createTour = async (req, res) => {
//   try {
//     const newTour = await Tour.create(req.body);
//     res.status(201).json({
//       status: 'Success',
//       data: {
//         tour: newTour,
//       },
//     });
//   } catch (err) {
//     res.status(400).json({
//       status: 'Failed',
//       message: err,
//     });
//   }
// };

exports.getAllTours = catchAsync(async (req, res,next) => {
    // execute query
    const features = new APIfeatures(Tour.find(), req.query)
      .filter()
      .sort()
      .paginate();
    const tours = await features.query;

    // const count = await Tour.countDocuments();
    res.status(200).json({
      status: 'Success',
      results: tours.length,
      data: {
        tours,
      },
    });
});

exports.getTour = catchAsync(async (req, res,next) => {
    const tour = await Tour.findById(req.params.id);
    // similar to Tour.findOne(_id:req.params.id)
    if(!tour)
    {
      return next(new AppError("No Tour Found with that ID",404));
    }
    res.status(200).json({
      status: 'Success',
      data: tour,
    });
  
});

exports.updateTour = catchAsync(async (req, res,next) => {
    const tour = await Tour.findByIdAndUpdate(req.params.id, req.body, {
      new: true,
      runValidators: true,
    });
    if(!tour)
    {
      return next(new AppError("No Tour Found with that ID",404));
    }

    res.status(200).json({
      status: 'Success',
      data: tour,
    });
});

exports.deleteTour = catchAsync(async (req, res,next) => {
    const tour = await Tour.findByIdAndDelete(req.params.id);
    if(!tour)
    {
      return next(new AppError("No Tour Found with that ID",404));
    }
    res.status(200).json({
      status: 'Sucess',
      data: {
        tourDeleted: tour,
      },
    });
});

exports.getTourStats = catchAsync(async (req, res,next) => {
    const stats = await Tour.aggregate([
      { $match: { ratingsAverage: { $gte: 4.5 } } },
      {
        $group: {
          _id: '$difficulty',
          numTours: { $sum: 1 },
          numRatings: { $sum: '$ratingsQuantity' },
          avgRating: { $avg: '$ratingsAverage' },
          avgPrice: { $avg: '$price' },
          minPrice: { $min: '$price' },
          maxPrice: { $max: '$price' },
        },
      },
      { $sort: { avgPrice: 1 } },
      // { $match:{_id:{$ne:"easy"}}}
    ]);
    res.status(200).json({
      status: 'Success',
      data: { stats },
    });
});

exports.getMonthlyPlan = catchAsync(async (req, res,next) => {
    const year = req.params.year * 1;
    const plan = await Tour.aggregate([
      {
        $unwind: '$startDates',
      },
      {
        $match: {
          startDates: {
            $gte: new Date(`${year}-01-01`),
            $lte: new Date(`${year}-12-31`),
          },
        },
      },
      {$group :{
        _id:{$month:'$startDates'},
        numTourStats:{$sum:1},
        tours:{$push:'$name'}
      }},
      {
        $addFields:{
          month:'$_id'
        }
      },
      {$project:{
        _id:0
      }},
      {
        $sort:{numTourStats:-1}
      },
      {
        $limit:12
      }
    ]);

    res.status(200).json({
      status: 'Success',
      data: { plan },
    });
});
