const express = require('express');
const bodyParser = require('body-parser');
const mongoose = require('mongoose');

const placesRoute = require('./routes/places-routes');
const usersRoute = require('./routes/users-routes');

const app = express();

app.use(bodyParser.json());

app.use('/api/places', placesRoute);
app.use('/api/users', usersRoute);

app.use((req, res, next) => {
  throw new Error('Could not find this route', 404);
});

app.use((error, req, res, next) => {
  if (res.headerSent) {
    return next(error);
  }
  res
    .status(error.code || 500)
    .json({ message: error.message || 'Something were wrong with server' });
});

mongoose
  .connect(
    'mongodb+srv://manager:manager@project-1-ok5pa.mongodb.net/places?retryWrites=true&w=majority',
    {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    },
  )
  .then(() => {
    app.listen(5000, () => {
      console.log('Server is running on Port 5000');
    });
  })
  .catch((error) => console.log(error));
