
const uuid = require('uuid').v4;

const { validationResult } = require('express-validator');
const HttpError = require('../models/http-error');
const User = require('../models/user');

const DUMMY_USERS = [
  {
    id: "u1",
    name: "Alish Dahal",
    email: "jhapalialish@gmail.com",
    password: 'test'
  },

];

const getUsers = (req, res, next) => {
  res.json({ users: DUMMY_USERS });

}

const signup = async (req, res, next) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return next(
      HttpError('Invalid inputs passed, please check your data.', 422)
    )
  }
  const { name, email, password, places } = req.body;

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
    id: uuid(),
    name, //name: name
    email,
    password,
    image: 'https://lh3.googleusercontent.com/BVuHly8lYMre8Bzjq0E4z6yOa2n1NB8emMl-Us0tIRjXKCpo0CA_AXIJj5e47r-to8VFXMdCCCGSXoDxQFTchXNUvPZMvVRLeFVxuMhOnW7ZCTP43mwHyIC10hryPKKiDh2F6jVrr7ycJv2mXl7cmiGXm1rGJpspMyfzDFhtAxgoZ2V7qmjzfCxFzpN5agtgeYHm1XmMcd_RwBQ8OSR4Mjfxvlhvql4FK6usD6neaUCqokH4c9P1Kp6idaNO8iCn03MxWrnbl49tI2WdVuK7FeoZrAUFosmDuZIILEWt2-WTxKVO0e3A5jM5jK_afY4rND1_HepEFsdh5GvVlpLlvcMsI3cbZh4lQV__Pwhl_afQEvOpZv9MoOaOV6sFMxLM-DT201-SPQy-qZauhz6iA5F8oJMLV1DRTqXHr-Bk4FawriR4XcOjrXEXYMibal6EEHzaEQ7STDtRsA8VLGZ3y0Q4WqlFsWC6OZSeZ8OjJfZ3fsYN5DBjp53e1SK5_HyHV4EUHMsBVRvwzAJDzx21LxDe19yOu6k2PhJ-CxzFnuqPXgPasrDX1u4JZ74TsQ0VqSyKUaYwAxRk5fe7LDJd8mk1f1Z1A-jns_bFgYcaR_GeFZjxAjJBaUvUQtOLsy2jfguPCOj1Cf1ccrMpkqNiDE9yZj8tmHKjVe-sckTgPH-z0IfwkZN0ISJHe6V-7EQl2yvmNfftAT-Mz179kATZYCUwT6qD3_3pKbEbHNLVg7cMekN-twrJGketSsH1rPyZ73oUnKEAcmZoghEgglegDOACotbOCfpL77ESsT_QaxhWeb-HmnRvzPfxkEZL4nFRTcio67vDh_Y0uspUCpE_Xy_J5Ts90ErG206QSwcpt5zB2xNnW-TBi4dmtPfBzLjmGbjSLoTMVCcUFsAwk7DZnb3B-xmal5wl0qcV2pax5URxF67ujqAPJ3KMGMSOO2H2srusqRgQe71adJH1Ig=w632-h948-s-no?authuser=0',
    places

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

const login = (req, res, next) => {
  const { email, password } = req.body;

  const identifiedUser = DUMMY_USERS.find(u => u.email === email);
  if (!identifiedUser || identifiedUser.password !== password) {
    throw new HttpError('Either email or password is invalid', 401)
  }
  res.json({ message: "Logged In." });


}

exports.getUsers = getUsers;
exports.signup = signup;
exports.login = login;