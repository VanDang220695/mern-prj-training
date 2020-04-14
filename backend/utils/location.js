const axios = require('axios');

const HttpError = require('../models/http-error');

const API_KEY =
  'pk.eyJ1IjoiZGFuZ3RwdnQxOTk1IiwiYSI6ImNrOHdiM2kzbzAwbngzbWxmMWNhNDNwMjIifQ.D3EFf79FLuq2esK4J58GVg';

async function getCoordsForAddress(address) {
  const response = await axios.get(
    `https://api.mapbox.com/geocoding/v5/mapbox.places/${encodeURI(
      address,
    )}.json?access_token=${API_KEY}`,
  );
  const data = response.data;

  if (!data || data.message === 'Not Found') {
    throw new HttpError('Could not find location for the specified address.', 404);
  }
  const { coordinates } = data.features[0].geometry;
  return coordinates;
}

module.exports = getCoordsForAddress;
