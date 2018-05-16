const express = require('express');
const router = express.Router();
const borderLineModel = require('../models/borderLine')
/* GET home page. */
router.get('/', function (req, res, next) {
  res.render('index');
});

router.get('/showBorderLine',function(req,res){
  var query = borderLineModel.find({},function (err, data) {
    if (err) console.log(err);
    else {
      console.log('Router get data: ', data);
      res.setHeader('Access-Control-Allow-Origin', '*');
      res.json(data);
    }
  });
});

module.exports = router;