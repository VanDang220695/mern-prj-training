const { validationResult } = require('express-validator');
const uuid = require('uuid/v4');
const mongoose = require('mongoose');

const HttpError = require('../models/http-error');
const getCoordsForAddress = require('../utils/location');
const Place = require('../models/place');
const User = require('../models/user');

const getPlaceById = async (req, res, next) => {
  const placeId = req.params.pid;
  let place;
  try {
    place = await Place.findById(placeId);
  } catch (error) {
    return next(new HttpError('Something went wrong, could not find a place', 500));
  }

  if (!place) {
    return next(new HttpError('Could not found a place for the provided id', 404));
  }
  res.json({ place: place.toObject({ getters: true }) });
};

const getPlacesByUserID = async (req, res, next) => {
  const userId = req.params.uid;
  let userWithPlaces;
  try {
    userWithPlaces = await User.findById(userId).populate('places');
    console.log('userWithPlaces', userWithPlaces);
  } catch (error) {
    return next(new HttpError('Something went wrong, could not find a place by userId', 500));
  }
  if (!userWithPlaces || userWithPlaces.places.length === 0) {
    return next(new HttpError('Could not found a place for the provided user id', 404));
  }
  res.json({ places: userWithPlaces.places.map((place) => place.toObject({ getters: true })) });
};

const createPlace = async (req, res, next) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return next(new HttpError('Invalids inputs passed, please check your data.', 400));
  }
  const { title, description, address, creator } = req.body;

  let coordinates;
  try {
    coordinates = await getCoordsForAddress(address);
  } catch (error) {
    next(errors);
  }

  const createdPlace = new Place({
    id: uuid(),
    title,
    description,
    location: coordinates,
    address,
    creator,
    image:
      'https://cdn.24h.com.vn/upload/2-2018/images/2018-04-17/1523940026-901-img_9927_vlyo-1523778128-width660height495.jpg',
  });

  try {
    const user = await User.findById(creator);

    if (!user) {
      return next(new HttpError('Could not find user for provided id', 404));
    }

    const sess = await mongoose.startSession();
    sess.startTransaction(); // Create transaction
    await createdPlace.save({ session: sess }); // Create save transaction
    user.places.push(createdPlace); // push places to user
    await user.save({ session: sess }); // save transaction
    await sess.commitTransaction();
  } catch (error) {
    return next(new HttpError('Creating place failed, please try again', 500));
  }

  res.status(201).json({ place: createdPlace.toObject({ getters: true }) });
};

const updatePlace = async (req, res, next) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    throw new HttpError('Invalids inputs passed, please check your data.', 400);
  }
  const { title, description } = req.body;
  const placeId = req.params.pid;

  let place;
  try {
    place = await Place.findById(placeId);
    place.title = title;
    place.description = description;
    await place.save();
  } catch (error) {
    return next(new HttpError('Something went wrong, could not update place.', 500));
  }
  res.status(200).json({ place: place.toObject({ getters: true }) });
};

const deletePlace = async (req, res, next) => {
  const placeId = req.params.pid;
  let place;
  try {
    place = await Place.findById(placeId).populate('creator');
    if (!place) {
      return next(new HttpError('Could not find place for this id.', 404));
    }
    const sess = await mongoose.startSession();
    sess.startTransaction(); // Create transaction
    await place.remove({ session: sess }); // create transaction remove
    place.creator.places.pull(place); // remove user have place id
    await place.creator.save({ session: sess }); // save transaction
    await sess.commitTransaction(); // finish transaction
  } catch (error) {
    return next(new HttpError('Something went wrong, could not delete place.', 500));
  }
  res.status(200).json({ message: 'Deleted place' });
};

module.exports = {
  getPlaceById,
  getPlacesByUserID,
  createPlace,
  updatePlace,
  deletePlace,
};
