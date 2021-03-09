const express = require('express');
const mongoose = require('mongoose');
// const path = require('path');
const cors = require('cors');
const bodyParser = require('body-parser');
const morgan = require('morgan');
// const config = require('./config');

// routes
const authRoutes = require('./routes/api/auth');
const userRoutes = require('./routes/api/users');

// const { URIS } = config;

const app = express();

// CORS Middleware
app.use(cors());
// Logger Middleware
app.use(morgan('dev'));
// Bodyparser Middleware
app.use(bodyParser.json());

// DB Config
// const db = `${MONGO_URI}/${MONGO_DB_NAME}`;

// Connect to Mongo
mongoose
  // .connect(db, {
  .connect(
    process.env.URIS,
    // 'mongodb+srv://thiago:Mkbm@@1401@authenticator.tfkpv.mongodb.net/auth?retryWrites=true&w=majority',
    {
      useNewUrlParser: true,
      useCreateIndex: true,
      useUnifiedTopology: true,
    }
  ) // Adding new mongo url parser
  .then(() => console.log('MongoDB Connected...'))
  .catch((err) => console.log(err));

// Use Routes
app.use('/api/users', userRoutes);
app.use('/api/auth', authRoutes);

module.exports = app;
