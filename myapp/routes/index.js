const express = require('express');
const router = express.Router();
const borderLineModel = require('../models/borderLine')
const suspendingDataModel = require('../models/suspendingData')
const hexClickDataModel = require('../models/hexClickDataModel')
/* GET home page. */
router.get('/(:clusterNumber)?', function (req, res, next) {
  let clusterNumber = req.params.clusterNumber;
  let status = req.query.status;
  console.log('status: ', status);
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
  hexClickDataModel.find({
    row: row,
    col: col
  }, function (err, data) {
    if (err) {
      console.log(err);
    } else {
      res.json(data);
    }
  });

});

module.exports = router;