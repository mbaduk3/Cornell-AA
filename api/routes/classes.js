var express = require('express');
var router = express.Router();
var db = require('../database').db

/* GET classes listing. */
router.get('/', function(req, res, next) {
  var sql = 'select * from class'
  var params = []
  db.all(sql, params, (err, rows) => {
    if (err) {
      res.status(400).json({"error":err.message});
      return;
    }
    res.json({
      "message": "success",
      "data": rows
    })
  });
});

module.exports = router;
