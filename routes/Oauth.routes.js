const router = require('express').Router();
const passport = require('passport');
const jwt = require('jsonwebtoken');

const { SECRET, CLIENT_ORIGIN } = process.env;


function createJWT(user) {
  return jwt.sign({ user }, SECRET, { expiresIn: '24h' });
}

// add routes here


module.exports = router;