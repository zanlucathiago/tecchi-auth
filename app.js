const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const bodyParser = require('body-parser');
const morgan = require('morgan');

// routes
const authRoutes = require('./routes/api/auth');
const userRoutes = require('./routes/api/users');

const app = express();

// CORS Middleware
app.use(cors());
// Logger Middleware
app.use(morgan('dev'));
// Bodyparser Middleware
app.use(bodyParser.json());

// DB Config
const URIS =
  process.env.URIS ||
  'mongodb://localhost:27017/?readPreference=primary&appname=MongoDB%20Compass&ssl=false';

mongoose
  .connect(URIS, {
    useNewUrlParser: true,
    useCreateIndex: true,
    useUnifiedTopology: true,
  }) // Adding new mongo url parser
  .then(() => console.log('MongoDB Connected...'))
  .catch((err) => console.log(err));

// Use Routes
app.use('/api/users', userRoutes);
app.use('/api/auth', authRoutes);

module.exports = app;
