/* 
    Initilizes local database.
    Based on: https://developerhowto.com/2018/12/29/build-a-rest-api-with-node-js-and-express-js/
*/

var sqlite3 = require('sqlite3').verbose()

const DBSOURCE = "db.sqlite"

let db = new sqlite3.Database(DBSOURCE, (err) => {
    if (err) {
      // Cannot open database
      console.error(err.message)
      throw err
    } else {
        console.log('Connected to the SQLite database.')
        db.serialize(() => {
            db.run(`CREATE TABLE class (
                class_id INTEGER PRIMARY KEY AUTOINCREMENT,
                name text, 
                course_number INTEGER,
                req_id INTEGER
                )`,
                (err) => {
                    if (err) {
                        // Table already created
                    } else {
                        // Table just created, creating some rows
                        var insert = 'INSERT INTO class (name, course_number, req_id) VALUES (?, ?, ?)'
                        db.run(insert, ["CS_2110", "12345", 1])
                        db.run(insert, ["ECE_2720", "33333", 1])
                    }
                }
            ).run(`CREATE TABLE req (
                req_id INTEGER PRIMARY_KEY AUTOINCREMENT,
                code text
                )`,
                (err) => {
                    if (err) {
                        // Table already created
                    } else {
                        // Table just created, creating some rows
                        var sql_req = 'INSERT INTO req (code) VALUES (?,)'
                        db.run(sql_req, ["HA-AS"])
                        db.run(sql_req, ["MQR-AS"])
                    }
                })
        });
    }
});


module.exports = db