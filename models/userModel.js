const mongoose = require('mongoose');
const validator = require('validator');
const bcrypt = require('bcryptjs');
const crypto = require('crypto');

const userSchema = mongoose.Schema({
  name: {
    type: String,
    required: [true, 'Name of user is a required Field'],
  },
  email: {
    type: String,
    required: [true, 'Email is required field as it is a User name'],
    unique: true,
    lowercase: true,
    validate: [validator.isEmail, 'Invalid Email'],
  },
  photo: String,
  role: {
    type: String,
    enum: ['admin', 'guide', 'lead-guide', 'user'],
    default: 'user',
  },
  password: {
    type: String,
    required: [true, 'please provide the password'],
    minlength: [8, 'password should be of 8 characters'],
    select: false,
  },
  passwordConfirm: {
    type: String,
    required: [true, 'Please confirm your Password'],
    validate: {
      validator: function (el) {
        return el === this.password;
      },

      message: 'Passwords not matching',
    },
  },
  passwordChangedAt: Date,
  passwordResetToken: String,
  passwordResetTokenExpiresAt: Date,
  active: {
    type: Boolean,
    default: true,
    select: false,
  },
});

userSchema.pre('save', async function (next) {
  // we are executing function only password is modified
  if (!this.isModified('password')) return next();

  // password hashing
  this.password = await bcrypt.hash(this.password, 12);

  // as no longer needed in the data base
  this.passwordConfirm = undefined;
  next();
});

userSchema.pre('save', async function (next) {
  if (!this.isModified('password') || this.isNew) return next();

  this.passwordChangedAt = Date.now() - 1000;
  next();
});

userSchema.pre(/^find/, function (next) {
  this.find({ active: { $ne: false } });
  next();
});

userSchema.methods.correctPassword = async function (
  candidatePassword,
  userPassword
) {
  return await bcrypt.compare(candidatePassword, userPassword);
};

userSchema.methods.isPasswordChangedAfter = function (JWTTimeStamp) {
  // console.log(this.passwordChangedAt);
  if (this.passwordChangedAt) {
    console.log(this.passwordChangedAt);
    const changedTimeStamp = parseInt(
      this.passwordChangedAt.getTime() / 1000,
      10
    );
    return JWTTimeStamp < changedTimeStamp;
  }
  return false;
};

userSchema.methods.createPasswordResetToken = function () {
  const resetToken = crypto.randomBytes(32).toString('hex');
  this.passwordResetToken = crypto
    .createHash('sha256')
    .update(resetToken)
    .digest('hex');
  this.passwordResetTokenExpiresAt = Date.now() + 10 * 60 * 1000;
  console.log({ resetToken }, this.passwordResetToken);
  return resetToken;
};
const User = mongoose.model('User', userSchema);
module.exports = User;
