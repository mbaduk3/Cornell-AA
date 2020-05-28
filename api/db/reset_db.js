var fs = require('fs');
var database = require('./database');

fs.unlink('./db/db.sqlite', (err) => {
    if (err) console.log("db already deleted");
    database.populateDb()
        .then(console.log("db has been reset"));
});