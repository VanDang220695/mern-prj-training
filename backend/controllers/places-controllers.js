const { validationResult } = require('express-validator');
const uuid = require('uuid/v4');
const mongoose = require('mongoose');
const fs = require('fs');

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
  } catch (error) {
    return next(new HttpError('Something went wrong, could not find a place by userId', 500));
  }
  res.json({ places: userWithPlaces.places.map((place) => place.toObject({ getters: true })) });
};

const createPlace = async (req, res, next) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return next(new HttpError('Invalids inputs passed, please check your data.', 400));
  }
  const { title, description, address } = req.body;

  try {
    const coordinates = await getCoordsForAddress(address);
    const createdPlace = new Place({
      id: uuid(),
      title,
      description,
      location: coordinates,
      address,
      creator: req.userData.userId,
      image: req.file.path,
    });
    const user = await User.findById(req.userData.userId);

    if (!user) {
      return next(new HttpError('Could not find user for provided id', 404));
    }

    if (user._id.toString() !== req.userData.userId) {
      return next(new HttpError('You are not allowed to edit this place.', 401));
    }

    const sess = await mongoose.startSession();
    sess.startTransaction(); // Create transaction
    await createdPlace.save({ session: sess }); // Create save transaction
    user.places.push(createdPlace); // push places to user
    await user.save({ session: sess }); // save transaction
    await sess.commitTransaction();
    res.status(201).json({ place: createdPlace.toObject({ getters: true }) });
  } catch (error) {
    return next(new HttpError('Creating place failed, please try again', 500));
  }
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

    if (!place) {
      throw new Error();
    }

    if (place.creator.toString() !== req.userData.userId) {
      return next(new HttpError('You are not allowed to edit this place.', 401));
    }

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

    if (place.creator.id !== req.userData.userId) {
      return next(new HttpError('You are not allowed to edit this place.', 401));
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
  const imagePath = place.image;
  fs.unlink(imagePath, (err) => {
    if (err) {
      console.log('Error when remove image places link', err);
      return next(new HttpError('Something went wrong, could not delete place.', 500));
    }
    res.status(200).json({ message: 'Deleted place successful' });
  });
};

module.exports = {
  getPlaceById,
  getPlacesByUserID,
  createPlace,
  updatePlace,
  deletePlace,
};
