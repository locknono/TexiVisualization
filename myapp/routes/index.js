const express = require('express');
const router = express.Router();
const borderLineModel = require('../models/borderLine')
const suspendingDataModel = require('../models/suspendingData')
const hexClickDataModel = require('../models/hexClickDataModel')
const hexClickDataModel0 = require('../models/hexClickDataModel0')
const hexClickDataModel1 = require('../models/hexClickDataModel1')
/* GET home page. */

router.get('/', function (req, res, next) {
  res.render('info')
});

router.get('/(:clusterNumber)?', function (req, res, next) {
  let clusterNumber = req.params.clusterNumber;
  let status = req.query.status;
  if (status === undefined) {
    status = -1
  }
  res.render('index', {
    clusterNumber: clusterNumber,
    status: status
  });
});


router.get('/showBorderLine', function (req, res) {
  borderLineModel.find({}, function (err, data) {
    if (err) console.log(err);
    else {
      res.json(data);
    }
  });
});

router.get('/(:clusterNumber)?/showSuspending', function (req, res) {
  let row = req.query.row;
  let col = req.query.col;
  let clusterNumber = req.query.clusterNumber;
  let status = req.query.status;
  console.log('status: ', status);
  if (status == -1) {
    hexClickDataModel.find({
      row: row,
      col: col,
      n: clusterNumber
    }, function (err, data) {
      if (err) {
        console.log(err);
      } else {
        console.log('data: ', data);
        res.json(data);
      }
    });
  } else if (status == 0) {
    hexClickDataModel0.find({
      row: row,
      col: col,
      n: clusterNumber
    }, function (err, data) {
      if (err) {
        console.log(err);
      } else {
        res.json(data);
      }
    });
  } else if (status == 1) {
    hexClickDataModel1.find({
      row: row,
      col: col,
      n: clusterNumber
    }, function (err, data) {
      if (err) {
        console.log(err);
      } else {
        console.log('data: ', data);
        res.json(data);

      }
    });
  }

});

module.exports = router;