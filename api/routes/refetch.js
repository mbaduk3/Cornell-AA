var express = require('express');
var router = express.Router();
var refetch = require('../db/database').refetch;

router.get('/', function(req, res, next) {
    refetch();
    res.send("DB updated. Check console.");
});

module.exports = router