const APIfeatures = require('./../utils/apiFeatures');
const catchAsync = require('./../utils/catchAsync');
const User = require('./../models/userModel');
const AppError = require('../utils/appError');
const { options } = require('../app');

const filterObj = (obj, ...allowedFields) => {
  const newObj = {};
  Object.keys(obj).forEach((el) => {
    if (allowedFields.includes(el)) newObj[el] = obj[el];
  });
  return newObj;
};

exports.getAllUsers = catchAsync(async (req, res, next) => {
  // execute query
  const features = new APIfeatures(User.find(), req.query)
    .filter()
    .sort()
    .paginate();
  const users = await features.query;

  // const count = await Tour.countDocuments();
  res.status(200).json({
    status: 'Success',
    results: users.length,
    data: {
      users,
    },
  });
});

exports.updateMe = catchAsync(async (req, res, next) => {
  // if password updates generate error
  if (req.body.password || req.body.passwordConfirm)
    return next(
      new AppError(
        'This route is not for password updates, please use /updatePassword'
      )
    );

  // updating user document
  const filteredBody = filterObj(req.body, 'email', 'name');
  const updatedUser = await User.findByIdAndUpdate(req.user.id, filteredBody, {
    new: true,
    runValidators: true,
  });

  res.status(200).json({
    status: 'Sucess',
    data: updatedUser,
  });
});

exports.deleteMe = catchAsync(async (req, res, next) => {
  await User.findByIdAndUpdate(req.user.id, {
    active: false,
  });

  res.status(204).json({
    status: 'success',
    data: null,
  });
});

exports.getUser = (req, res) => {
  res.status(500).json({
    status: 'Success',
    message: 'This Route is not yet defined',
  });
};

exports.createUser = (req, res) => {
  res.status(500).json({
    status: 'Success',
    message: 'This Route is not yet defined',
  });
};

exports.updateUser = (req, res) => {
  res.status(500).json({
    status: 'Success',
    message: 'This Route is not yet defined',
  });
};

exports.deleteUser = (req, res) => {
  res.status(500).json({
    status: 'Success',
    message: 'This Route is not yet defined',
  });
};
