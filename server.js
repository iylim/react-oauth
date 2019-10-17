require('dotenv').config();
const express = require('express');
const cors = require('cors');
const path = require('path');
const session = require('express-session');
const passport = require('passport');
require('./config/passport');

const app = express();

// middleware
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(session({
  secret: 'Hello there!',
  resave: false,
  saveUninitialized: true
}));
// add passport here to mount

// routes
app.use(express.static(path.join(__dirname, 'public')));

app.use('/', require('./routes/Oauth.routes'));

const port = 3001;
app.listen(port);