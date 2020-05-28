var express = require('express');
var router = express.Router();
var db = require('../db/database')

/* GET classes listing. */
router.get('/', async function(req, res, next) {
  var conn = await db.gConn;
  var sql = 'select * from class'
  var params = []
  conn.all(sql, params, (err, rows) => {
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
