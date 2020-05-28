var fs = require('fs');
var database = require('./database');

fs.unlink('./db/db.sqlite', (err) => {
    if (err) console.log("db already deleted");
    else console.log('db deleted');
    database.gConn.then(() => console.log("db has been reset"));
});