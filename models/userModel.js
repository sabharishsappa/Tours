const crypto = require('crypto');
const mongoose = require('mongoose');
const validator = require('validator');
const bcrypt = require('bcryptjs');

const userSchema = new mongoose.Schema({
  name: {
    type: String,
    required: [true, 'Please tell us your name!'],
  },
  email: {
    type: String,
    required: [true, 'Please provide your email'],
    unique: true,
    lowercase: true,
    validate: [validator.isEmail, 'Please provide a valid email'],
  },
  photo: {
    type:String,
    default:'default.jpg'
  },
  role: {
    type: String,
    enum: ['user', 'guide', 'lead-guide', 'admin'],
    default: 'user',
  },
  password: {
    type: String,
    required: [true, 'Please provide a password'],
    minlength: 8,
    select: false,
  },
  passwordConfirm: {
    type: String,
    required: [true, 'Please confirm your password'],
    validate: {
      // This only works on CREATE and SAVE!!!
      validator: function (el) {
        return el === this.password;
      },
      message: 'Passwords are not the same!',
    },
  },
  passwordChangedAt: Date,
  passwordResetToken: String,
  passwordResetExpires: Date,
  active: {
    type: Boolean,
    default: true,
    select: false,
  },
});

userSchema.pre('save', async function (next) {
  // Only run this function if password was actually modified
  if (!this.isModified('password')) return next();

   // Check if the password is already hashed
   const isHashed = /^\$2[ayb]\$.{56}$/.test(this.password);

   if (!isHashed) {
     // Hash the password with cost of 12
     this.password = await bcrypt.hash(this.password, 12);
   }

  // Delete passwordConfirm field
  this.passwordConfirm = undefined;
  next();
});

userSchema.pre('save', function (next) {
  if (!this.isModified('password') || this.isNew) return next();

  this.passwordChangedAt = Date.now() - 1000;
  next();
});

userSchema.pre(/^find/, function (next) {
  // this points to the current query
  this.find({ active: { $ne: false } });
  next();
});

userSchema.methods.correctPassword = async function (
  candidatePassword,
  userPassword
) {
  // async function testBcryptCompare(candidatePassword, userPassword) {
  //   try {
  //     const passwordMatch = await bcrypt.compare(
  //       candidatePassword,
  //       userPassword
  //     );
  //     console.log('Password match:', passwordMatch);
  //   } catch (error) {
  //     console.error('Error comparing passwords:', error);
  //   }
  // }

  // salted password of test1234 $2a$12$1.YdtG2wX9W0aGu.qhSR/uatO5JvdXfVsYT.23O8mM8YLuUQmWMJ6
  // Password = await bcrypt.hash(candidate.password, 12);

  // Usage:
  // const CandidatePassword = 'test1234'; // Replace with the candidate password you want to test
  // const UserPassword =
    '$2a$12$ejbfAhSclwmcuGHJ9DKKOOMjWnsTCmoCghgykQfUkFYY.vYlzhLpW'; // Replace with the hashed password from the database

  // testBcryptCompare(CandidatePassword, UserPassword);


  return await bcrypt.compare(candidatePassword, userPassword);
};

userSchema.methods.changedPasswordAfter = function (JWTTimestamp) {
  if (this.passwordChangedAt) {
    const changedTimestamp = parseInt(
      this.passwordChangedAt.getTime() / 1000,
      10
    );

    return JWTTimestamp < changedTimestamp;
  }

  // False means NOT changed
  return false;
};

userSchema.methods.createPasswordResetToken = function () {
  const resetToken = crypto.randomBytes(32).toString('hex');

  this.passwordResetToken = crypto
    .createHash('sha256')
    .update(resetToken)
    .digest('hex');

  this.passwordResetExpires = Date.now() + 10 * 60 * 1000;

  return resetToken;
};

const User = mongoose.model('User', userSchema);

module.exports = User;
