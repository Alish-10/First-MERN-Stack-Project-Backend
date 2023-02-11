
const { validationResult } = require('express-validator');
const HttpError = require('../models/http-error');
const User = require('../models/user');
const Place = require('../models/place');
const mongoose = require('mongoose');


const getUsers = async (req, res, next) => {
  let users
  try {
    users = await User.find({}, '-password').populate('places');
  } catch (err) {
    const error = new HttpError('Fetching user failed, please try again later', 500)
    return next(error);

  }
  res.json({ users: users.map(user => user.toObject({ getters: true, virtuals: true })) });

}
const getUserById = async (req, res, next) => {
  const userId = req.params.uid; // { pid: 'p1' }

  let user;
  try {
    user = await User.findById(userId).populate('places');

  } catch (err) {
    const error = new HttpError(
      'Something went wrong,could not find a user.', 500
    );
    return next(error);
  }

  if (!user) {
    const error = new HttpError('Could not find a user for the provided id.', 404);
    return next(error);
  }

  res.json({ user: user.toObject({ getters: true, virtuals: true }) }); // => { user } => { user: user }
};

const signup = async (req, res, next) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return next(
      HttpError('Invalid inputs passed, please check your data.', 422)
    )
  }
  const { name, email, password } = req.body;

  let hasUser;
  try {
    hasUser = await User.findOne({ email: email });
  } catch (err) {
    const error = new HttpError('Signing up failed,please try again later.', 500);
    return next(error);
  }
  if (hasUser) {
    const error = new HttpError('Email is already registered', 422);
    return next(error);
  }


  const createdUser = new User({
    name, //name: name
    email,
    password,
    image: 'https://lh3.googleusercontent.com/BVuHly8lYMre8Bzjq0E4z6yOa2n1NB8emMl-Us0tIRjXKCpo0CA_AXIJj5e47r-to8VFXMdCCCGSXoDxQFTchXNUvPZMvVRLeFVxuMhOnW7ZCTP43mwHyIC10hryPKKiDh2F6jVrr7ycJv2mXl7cmiGXm1rGJpspMyfzDFhtAxgoZ2V7qmjzfCxFzpN5agtgeYHm1XmMcd_RwBQ8OSR4Mjfxvlhvql4FK6usD6neaUCqokH4c9P1Kp6idaNO8iCn03MxWrnbl49tI2WdVuK7FeoZrAUFosmDuZIILEWt2-WTxKVO0e3A5jM5jK_afY4rND1_HepEFsdh5GvVlpLlvcMsI3cbZh4lQV__Pwhl_afQEvOpZv9MoOaOV6sFMxLM-DT201-SPQy-qZauhz6iA5F8oJMLV1DRTqXHr-Bk4FawriR4XcOjrXEXYMibal6EEHzaEQ7STDtRsA8VLGZ3y0Q4WqlFsWC6OZSeZ8OjJfZ3fsYN5DBjp53e1SK5_HyHV4EUHMsBVRvwzAJDzx21LxDe19yOu6k2PhJ-CxzFnuqPXgPasrDX1u4JZ74TsQ0VqSyKUaYwAxRk5fe7LDJd8mk1f1Z1A-jns_bFgYcaR_GeFZjxAjJBaUvUQtOLsy2jfguPCOj1Cf1ccrMpkqNiDE9yZj8tmHKjVe-sckTgPH-z0IfwkZN0ISJHe6V-7EQl2yvmNfftAT-Mz179kATZYCUwT6qD3_3pKbEbHNLVg7cMekN-twrJGketSsH1rPyZ73oUnKEAcmZoghEgglegDOACotbOCfpL77ESsT_QaxhWeb-HmnRvzPfxkEZL4nFRTcio67vDh_Y0uspUCpE_Xy_J5Ts90ErG206QSwcpt5zB2xNnW-TBi4dmtPfBzLjmGbjSLoTMVCcUFsAwk7DZnb3B-xmal5wl0qcV2pax5URxF67ujqAPJ3KMGMSOO2H2srusqRgQe71adJH1Ig=w632-h948-s-no?authuser=0',
    places: []

  })
  try {
    await createdUser.save();
  } catch (err) {
    const error = new HttpError(
      'Signing up failed, please try again.',
      500
    );
    return next(error);
  }

  res.status(201).json({ user: createdUser.toObject({ getters: true }) });
};

const login = async (req, res, next) => {
  const { email, password } = req.body;

  let hasUser;
  try {
    hasUser = await User.findOne({ email: email });
  } catch (err) {
    const error = new HttpError('Logging in failed,please try again later.', 500);
    return next(error);
  }
  if (!hasUser || hasUser.password !== password) {
    const error = new HttpError('Invalid credentials, could not log you in.', 401);
    return next(error);
  }
  res.json({ message: "Logged in Successfully." });


}
const deleteUser = async (req, res, next) => {
  const userId = req.params.uid;
  let user;
  try {
    user = await User.findById(userId);
  } catch (err) {
    const error = new HttpError(
      'Something went wrong, could not delete a user.',
      500
    );
    return next(error);
  }

  if (!user) {
    const error = new HttpError(
      'Could not find user for the given Id.',
      404
    );
    return next(error);
  }

  try {
    const sess = await mongoose.startSession();
    sess.startTransaction();
    await Place.deleteMany({ creator: user }, { session: sess });
    await user.remove({ session: sess });
    await sess.commitTransaction();
  } catch (err) {
    console.log(err, "error");
    const error = new HttpError(
      'Something went wrong, could not delete the user.',
      500
    );
    return next(error);
  }
  res.status(200).json({ message: 'Deleted user.' });
};




exports.getUsers = getUsers;
exports.signup = signup;
exports.login = login;
exports.getUserById = getUserById;
exports.deleteUser = deleteUser;