const express = require('express');
const router = express.Router();
const borderLineModel = require('../models/borderLine')
const suspendingDataModel = require('../models/suspendingData')

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

router.get('/showSuspending:classId', function (req, res) {
  let classId=req.params.classId;
  suspendingDataModel.find({class:classId}, function (err, data) {
    if (err) console.log(err);
    else {
      console.log('Router get data: ', data);
      res.json(data);
    }
  });
});



module.exports = router;