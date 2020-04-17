const axios = require('axios');

const HttpError = require('../models/http-error');

async function getCoordsForAddress(address) {
  const response = await axios.get(
    `https://api.mapbox.com/geocoding/v5/mapbox.places/${encodeURI(address)}.json?access_token=${
      process.env.MAP_BOX_KEY
    }`,
  );
  const data = response.data;
  if (!data || data.message === 'Not Found') {
    throw new HttpError('Could not find location for the specified address.', 404);
  }
  const [lng, lat] = data.features[0].center;
  return {
    lat,
    lng,
  };
}

module.exports = getCoordsForAddress;
