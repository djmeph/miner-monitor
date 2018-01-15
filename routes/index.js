'use strict';

const express = require('express');
const router = express.Router();
const getData = require('../libs/get-data');

/* Event page */
router.get('/', getData, function (req, res) {
  res.render('index', req.data);
});

module.exports = router;
