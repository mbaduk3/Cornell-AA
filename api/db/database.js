/* 
    Initilizes local database.
    Based on: https://developerhowto.com/2018/12/29/build-a-rest-api-with-node-js-and-express-js/
*/

var sqlite3 = require('sqlite3').verbose()
const https = require('https')
const cornell_api = require('./cornell_roster.json')

const DBSOURCE = "../api/db/db.sqlite"
const rosterHost = "https://classes.cornell.edu"


/*
    Opens the connection to our database. Creates the db file if one does not
    already exist, and generates empty tables. 
*/
let db = new sqlite3.Database(DBSOURCE, (err) => {
    if (err) { // Cannot open database
      console.error(err.message)
      throw err
    } else {
        db.get("PRAGMA foreign_keys = ON")
        console.log('Connected to the SQLite database.')
        db.serialize(() => {
            db.run(createTableClassSQL, err => err ? console.log(err) : null)
              .run(createTableReqSQL, err => err ? console.log(err) : null)
              .run(createTableClassReqSQL, err => err ? console.log(err) : null)
        });
       populateDb();
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
        req_id INTEGER PRIMARY KEY AUTOINCREMENT NOT NULL, 
        code TEXT NOT NULL
    )` 

// SQL: Creates a `class_req` table.
const createTableClassReqSQL = 
    `CREATE TABLE IF NOT EXISTS class_req (
        course_id INTEGER NOT NULL, 
        req_id INTEGER NOT NULL, 
        PRIMARY KEY (course_id, req_id),
        FOREIGN KEY (course_id) REFERENCES class(course_id)
            ON UPDATE CASCADE ON DELETE CASCADE,
        FOREIGN KEY (req_id) REFERENCES req(req_id)
            ON UPDATE CASCADE ON DELETE CASCADE
    )` 

/*
    Populates the db with values which we know beforehand (such as reqs). 
*/
let populateDb = () => {
    // Populate req with Cornell API reqs. 
    let placeholders = cornell_api.reqs.map( _ => '(?)').join(',');
    let populateReqSQL = 'INSERT INTO req(code) VALUES ' + placeholders;
    db.run(populateReqSQL, cornell_api.reqs, err => err ? console.log(err) : null);
}

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

/*
    Given a class object returned by Cornell Roster API, input the class into 
    our database. 
    [db] - the database connection object.
    [cls] - the class object returned by Cornell Roster API. 
    [reqs] - a list of additional requirements that this class satisfies (this 
        is for the requirements we defined, not Cornell).
    Requires: all requirements are already defined in `req` table. 
    Throws an error if the class with given [crseId] already exists in db. 
*/
const inputClass = (db, cls, reqs) => {
    let insertClassSQL = `INSERT INTO class (course_id, name) VALUES (?, ?)`
    let insertClassVals = [cls.crseId, cls.titleShort]
    let courseId = db.run(insertClassSQL, insertClassVals, function(err) {
        if (err) { throw err }
        return this.lastID;
    })
    let reqLst = [
        cls.catalogBreadth, 
        cls.catalogDistr,
        ...reqs
    ]
    reqLst.forEach(req => {
        let reqSQL = `SELECT (req_id) FROM req WHERE code = ?`
        let reqId = db.get(reqSQL, [req], (err, row) => {
            if (err) { return console.log(err) }
            return row ? row.req_id : console.log("error: no such req with code: " + req);
        })
        let insertClassReqSQL = `INSERT INTO class_req (course_id, req_id) VALUES (?, ?)`
        db.run(insertClassReqSQL, [courseId, reqId], (err) => {
            if (err) { throw err }
        })
    })
}


module.exports = {
    refetch: refetch,
    db: db,
    inputClass: inputClass,
}