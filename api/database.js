/* 
    Initilizes local database.
    Based on: https://developerhowto.com/2018/12/29/build-a-rest-api-with-node-js-and-express-js/
*/

var sqlite3 = require('sqlite3').verbose()
const https = require('https')

const DBSOURCE = "db.sqlite"
const rosterHost = "https://classes.cornell.edu"


/*
    Opens the connection to our database. Creates the db file if one does not
    already exist, and generates empty tables. 
*/
let db = new sqlite3.Database(DBSOURCE, (err) => {
    if (err) {
      // Cannot open database
      console.error(err.message)
      throw err
    } else {
        console.log('Connected to the SQLite database.')
        db.serialize(() => {
            db.run(createTableClassSQL, err => err ? console.log(err) : null)
              .run(createTableReqSQL, err => err ? console.log(err) : null)
              .run(createTableClassReqSQL, err => err ? console.log(err) : null)
        });
    }
});

// SQL: Creates a `class` table. 
const createTableClassSQL = 
    `CREATE TABLE IF NOT EXISTS class (
        course_id INTEGER PRIMARY KEY NOT NULL, 
        name TEXT NOT NULL
    )` 

// SQL: Creates a `req` table.
const createTableReqSQL = 
    `CREATE TABLE IF NOT EXISTS req (
        req_id INTEGER PRIMARY KEY NOT NULL, 
        code TEXT NOT NULL
    )` 

// SQL: Creates a `class_req` table.
const createTableClassReqSQL = 
    `CREATE TABLE IF NOT EXISTS class_req (
        course_id INTEGER NOT NULL, 
        req_id INTEGER NOT NULL, 
        PRIMARY KEY (course_id, req_id)
    )` 


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
                inputClass(resJson.data.classes[i], []);
            }
        })
        
    }).on("error", (err) => console.error(err));
}

const inputClass = (cls, reqs) => {
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