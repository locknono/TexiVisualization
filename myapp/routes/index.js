const express = require('express');
const router = express.Router();
const borderLineModel = require('../models/borderLine')
const suspendingDataModel = require('../models/suspendingData')
const hexClickDataModel =require('../models/hexClickDataModel')
/* GET home page. */
router.get('/', function (req, res, next) {
  res.render('index');
});

router.get('/showBorderLine', function (req, res) {
  borderLineModel.find({}, function (err, data) {
    if (err) console.log(err);
    else {
      res.json(data);
    }
  });
});

router.get('/showSuspending', function (req, res) {
  let row=req.query.row;
  let col =req.query.col;
  hexClickDataModel.find({row:row,col:col}, function (err, data) {
    if (err) console.log(err);
    else {
      res.json(data);
    }
  });
});



module.exports = router;