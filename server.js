require('dotenv').config();
const express = require('express');
const cors = require('cors');
// const path = require('path');
const session = require('express-session');
const passport = require('passport');
require('./config/passport');

const app = express();

app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(session({
  secret: 'Hello there!',
  resave: false,
  saveUninitialized: true
}));


app.use(passport.initialize());
app.use(passport.session());

// app.use(express.static(path.join(__dirname, 'public')));

const port = 3001;
app.listen(port);