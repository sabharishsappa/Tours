const Tour = require('../models/tourModel');
const APIfeatures = require('../utils/apiFeatures');

exports.aliasTopTours = (req, res, next) => {
  req.query.limit = '5';
  req.query.sort = '-avgRating,price';
  // req.query.fileds = 'name,price,avgRating,summary';
  next();
};

exports.createTour = async (req, res) => {
  try {
    const newTour = await Tour.create(req.body);
    res.status(201).json({
      status: 'Success',
      data: {
        tour: newTour,
      },
    });
  } catch (err) {
    res.status(400).json({
      status: 'Failed',
      message: err,
    });
  }
};

exports.getAllTours = async (req, res) => {
  try {
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
  } catch (err) {
    res.status(404).json({
      status: 'Failed',
      message: err,
    });
  }
};

exports.getTour = async (req, res) => {
  try {
    const tour = await Tour.findById(req.params.id);
    // similar to Tour.findOne(_id:req.params.id)

    res.status(200).json({
      status: 'Success',
      data: tour,
    });
  } catch (err) {
    res.status(404).json({
      status: 'Failed',
      message: err,
    });
  }
};

exports.updateTour = async (req, res) => {
  try {
    const tour = await Tour.findByIdAndUpdate(req.params.id, req.body, {
      new: true,
      runValidators: true,
    });
    res.status(200).json({
      status: 'Success',
      data: tour,
    });
  } catch (err) {
    res.status(404).json({
      status: 'Failed',
      message: err,
    });
  }
};

exports.deleteTour = async (req, res) => {
  try {
    const tourDeleted = await Tour.findByIdAndDelete(req.params.id);
    res.status(200).json({
      status: 'Sucess',
      data: {
        tourDeleted: tourDeleted,
      },
    });
  } catch (err) {
    res.status(204).json({
      status: 'failure',
      message: err,
    });
  }
};

exports.getTourStats = async (req, res) => {
  try {
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
  } catch (err) {
    res.status(204).json({
      status: 'failure',
      message: err,
    });
  }
};

exports.getMonthlyPlan = async (req, res) => {
  try {
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
  } catch (err) {
    res.status(204).json({
      status: 'failure',
      message: err,
    });
  }
};
