const crypto = require('crypto');
const jwt = require('jsonwebtoken');
const { promisify } = require('util');
const User = require('./../models/userModel');
const catchAsync = require('./../utils/catchAsync');
const AppError = require('./../utils/appError');
const sendEmail = require('./../utils/email');

const signToken = (id) => {
  return jwt.sign({ id }, process.env.JWT_SECRET, {
    expiresIn: process.env.JWT_EXPIRES_IN,
  });
};

const createSendToken = (user, statusCode, res) => {
  const token = signToken(user._id);
  const cookieOptions = {
    expires: new Date(
      Date.now() + process.env.JWT_COOKIE_EXPIRES_IN * 24 * 60 * 60 * 1000
    ),
    httpOnly: true,
  };

  if (process.env.NODE_ENV === 'production') cookieOptions.secure = true;
  res.cookie('jwt', token, cookieOptions);

  // removing password field so that i wont be shown to user
  user.password = undefined;

  res.status(statusCode).json({
    status: 'Success',
    token,
    data: {
      user,
    },
  });
};

exports.signup = catchAsync(async (req, res, next) => {
  const newUser = await User.create({
    name: req.body.name,
    email: req.body.email,
    password: req.body.password,
    passwordConfirm: req.body.passwordConfirm,
    role: req.body.role,
  });

  createSendToken(newUser, 201, res);
});

exports.login = catchAsync(async (req, res, next) => {
  const { email, password } = req.body;
  // const email = req.body.email;
  // const password = req.body.password;

  // check if email and password exists or not
  if (!email || !password)
    return next(new AppError('Please provide Email and Password', 400));

  // check if user exists in db
  const user = await User.findOne({ email }).select('+password');

  // validating username and password
  if (!user || !(await user.correctPassword(password, user.password))) {
    return next(new AppError('Invalid Username or password', 401));
  }

  // if ok sending token
  createSendToken(user, 200, res);
});

exports.protect = catchAsync(async (req, res, next) => {
  // getting if a token exists
  let token;
  if (
    req.headers.authorization &&
    req.headers.authorization.startsWith('Bearer')
  ) {
    token = req.headers.authorization.split(' ')[1];
  }

  if (!token) {
    return next(
      new AppError('You are not logged in, Please Login to get the access', 401)
    );
  }
  // verification of token

  const decoded = await jwt.verify(token, process.env.JWT_SECRET);

  // user still exists
  const currentUser = await User.findById(decoded.id);
  if (!currentUser) return next(new AppError('User no longer exists...'));

  // making sure password is not modified
  const JWTGeneratedAt = decoded.iat;
  if (currentUser.isPasswordChangedAfter(JWTGeneratedAt)) {
    return next(
      new AppError('User recently changed password, Please login again...', 401)
    );
  }

  // Granting Access to the user
  req.user = currentUser;
  next();
});

exports.restrictTo = (...roles) => {
  return (req, res, next) => {
    if (!roles.includes(req.user.role))
      return next(
        new AppError('You dont have permission to perform this action', 403)
      );
    next();
  };
};

exports.forgotPassword = async (req, res, next) => {
  // get user from the Posted email
  const user = await User.findOne({ email: req.body.email });
  if (!user)
    return next(new AppError('There is no user with email provided...', 404));

  // generating random password reset token
  const resetToken = user.createPasswordResetToken();
  await user.save({ validateBeforeSave: false });

  // sending to the users email
  const resetURL = `${req.protocol}://${req.get(
    'host'
  )}/api/v1/users/resetPassword/${resetToken}}`;
  const message = `Forgot your Password? Submit a patch request with your new passoword and passwordConfirm to ${resetURL}.\nIf you didnt forget your password,please ignore this email...`;

  try {
    await sendEmail({
      email: user.email,
      subject: 'Password Reset (Valid for 10 mins only)',
      message,
    });
  } catch (err) {
    (user.passwordResetToken = undefined),
      (user.passwordResetTokenExpiresAt = undefined),
      await user.save({ validateBeforeSave: false });

    return next(
      new AppError('Error in sending Mail, please try again later', 500)
    );
  }

  res.status(200).json({
    status: 'Success',
    message: 'Password reset mail sent',
  });
};

exports.resetPassword = async (req, res, next) => {
  // get the user using hashed token
  const hashedToken = crypto
    .createHash('sha256')
    .update(req.params.token)
    .digest('hex');
  const user = await User.findOne({
    passwordResetToken: hashedToken,
    passwordResetTokenExpiresAt: { $gt: Date.now() },
  });

  // get the password and confirmPassword if the password reset token is not expires
  if (!user) {
    return next(new AppError('Token is invalid or has expired...'), 400);
  }

  user.password = req.body.password;
  user.passwordConfirm = req.body.passwordConfirm;
  user.passwordResetToken = undefined;
  user.passwordResetTokenExpiresAt = undefined;
  await user.save();

  // update the password changed at property

  // logging the user in and sending the JWT token

  createSendToken(user, 200, res);
};

exports.updateMyPassword = catchAsync(async (req, res, next) => {
  // getting user from
  const user = await User.findById(req.user.id).select('+password');

  // checking current Password is correct or not
  if (
    !user ||
    !(await user.correctPassword(req.body.currentPassword, user.password))
  )
    return next(new AppError('Invalid user credentials...', 400));

  // updating the password
  user.password = req.body.newPassword;
  user.passwordConfirm = req.body.newPasswordConfirm;
  await user.save();
  // user.findByIdAndUpdate will not work as intended as midle ware functions only work upon save not on update, validations wont be performed

  // logging user and sending the jwt token
  createSendToken(user, 200, res);
});
