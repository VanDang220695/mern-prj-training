const uuid = require('uuid/v4');
const { validationResult } = require('express-validator');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');

const HttpError = require('../models/http-error');
const User = require('../models/user');

const getUsers = async (req, res, next) => {
  let users;
  try {
    users = await User.find({}, '-password');
  } catch (error) {
    return next(new HttpError('Fetch users failed, please try again.', 500));
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
    if (existingUser) {
      return next(new HttpError('User exists already, please login instead', 401));
    }
    let hashPassword;
    hashPassword = await bcrypt.hash(password, 12);

    const createdUser = new User({
      id: uuid(),
      name,
      email,
      password: hashPassword,
      image: req.file.path,
      places: [],
    });
    await createdUser.save();
    const token = jwt.sign(
      { userId: createdUser.id, email: createdUser.email },
      process.env.JWT_KEY,
      {
        expiresIn: '1h',
      },
    );
    res.status(201).json({ userId: createdUser.id, email, token });
  } catch (error) {
    return next(new HttpError('Signing up failed, please try again.', 500));
  }
};

const login = async (req, res, next) => {
  const { email, password } = req.body;
  let existingUser;
  try {
    existingUser = await User.findOne({ email });
    const isValidPassword = await bcrypt.compare(password, existingUser.password);
    if (!existingUser || !isValidPassword) {
      return next(new HttpError('Invalid credential, could not log you in.', 403));
    }
    const token = jwt.sign({ userId: existingUser.id, email }, process.env.JWT_KEY, {
      expiresIn: '1h',
    });
    res.json({ userId: existingUser._id, email, token });
  } catch (error) {
    return next(new HttpError('Logging in failed, please try again.', 500));
  }
};

module.exports = {
  getUsers,
  signup,
  login,
};
