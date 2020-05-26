/* 
    Initilizes local database.
    Based on: https://developerhowto.com/2018/12/29/build-a-rest-api-with-node-js-and-express-js/
*/

var sqlite3 = require('sqlite3').verbose()
const https = require('https')

const DBSOURCE = "db.sqlite"
const rosterHost = "https://classes.cornell.edu"

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

/* Example of populating all FA14 Math classes to our db. */
const refetch = () => {
    https.get(rosterHost + "/api/2.0/search/classes.json?roster=FA14&subject=MATH", (res) => {
        let data = '';
        var resJson = null;
        res.on('data', (chunk) => {
            data += chunk;
        })
        res.on('end', () => {
            resJson = JSON.parse(data);
            //console.log(resJson.data.classes[0]);
            for (var i = 0; i < 3; i++) { // Only input 3 classes as example
                inputClass(resJson.data.classes[i]);
            }
        })
        
    }).on("error", (err) => console.error(err));
}

const inputClass = (cls) => {
    var sql = `INSERT INTO class (
                name, course_number, req_id
               ) VALUES (
                   ?, ?, 1
               )`
    db.run(sql, [cls.titleShort, cls.crseId], function(err) {
        if (err) { return console.log(err)}
        console.log(`Row added with rowId: ${this.lastId}`)
    });
}


module.exports = {refetch: refetch, db: db}