const uuid = require('uuid/v4');
const { validationResult } = require('express-validator');

const HttpError = require('../models/http-error');
const User = require('../models/user');

const getUsers = async (req, res, next) => {
  let users;
  try {
    users = await User.find({}, '-password');
  } catch (error) {
    return next(new HttpError('Fetch users failed, please try again.', 500));
  }
  if (users.length === 0) {
    return next(new HttpError('No users fetched, please try again.', 404));
  }
  res.json({ users: users.map((user) => user.toObject({ getters: true })) });
};

const signup = async (req, res, next) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return next(new HttpError('Invalids inputs passed, please check your data.', 400));
  }
  const { name, email, password } = req.body;

  let existingUser;
  try {
    existingUser = await User.findOne({ email });
  } catch (error) {
    return next(new HttpError('Signing up failed, please try again.', 500));
  }

  if (existingUser) {
    return next(new HttpError('User exists already, please login instead', 422));
  }

  const createdUser = new User({
    id: uuid(),
    name,
    email,
    password,
    image: 'https://image.tmdb.org/t/p/original/yd1s0OJOICSpnVs9O1YsMl71iXy.jpg',
    places: [],
  });
  try {
    await createdUser.save();
  } catch (error) {
    return next(new HttpError('Signing up failed, please try again', 500));
  }
  res.status(201).json({ user: createdUser.toObject({ getters: true }) });
};

const login = async (req, res, next) => {
  const { email, password } = req.body;
  let existingUser;
  try {
    existingUser = await User.findOne({ email });
  } catch (error) {
    return next(new HttpError('Logging in failed, please try again.', 500));
  }

  if (!existingUser || (existingUser && existingUser.password !== password)) {
    return next(new HttpError('Invalid credential, could not log you in.', 401));
  }

  res.json({ message: 'Login success', user: existingUser.toObject({ getters: true }) });
};

module.exports = {
  getUsers,
  signup,
  login,
};
