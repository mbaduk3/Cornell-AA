var express = require('express');
var router = express.Router();
var db = require('../db/database').db;

/* GET requirements listing. */
router.get('/', function(req, res, next) {
  var sql = 'select * from req'
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
