/* 
    Initializes local database.
    Based on: https://developerhowto.com/2018/12/29/build-a-rest-api-with-node-js-and-express-js/
*/

const sqlite3 = require('sqlite3').verbose()
const https = require('https')
const cornell_api = require('./cornell_roster.json')

const DBSOURCE = "../api/db/db.sqlite"
const rosterHost = "https://classes.cornell.edu"

/*
    Opens a connection to the database. Creates the db file if one does not
    already exist, and generates empty tables. 
    Resolve this promise to use the db connection.  
*/
const openDb = new Promise((resolve, reject) => {
    let conn = new sqlite3.Database(DBSOURCE, (err) => {
        if (err) { // Cannot open database
            console.error(err.message)
            throw err
        } else {
            conn.get("PRAGMA foreign_keys = ON")
            console.log('Connected to the SQLite database.')
            conn.serialize(() => {
                // Initialize tables
                conn.parallelize(() => {
                    conn.run(createTableClassSQL, err => err ? console.log(err) : null /*console.log('class table created')*/)
                        .run(createTableReqSQL, err => err ? console.log(err) : null /*console.log('req table created')*/)
                        .run(createTableClassReqSQL, err => err ? console.log(err) : null /*console.log('class_req table created')*/)
                });
                conn.run("", () => resolve(conn));
            });
        }
    });
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
const populateDb = async () => {
    conn = await openDb;
    return new Promise((res, rej) => {
        // Populate req with Cornell API reqs. 
        let placeholders = cornell_api.reqs.map(_ => '(?)').join(',');
        let populateReqSQL = 'INSERT INTO req(code) VALUES ' + placeholders;
        conn.run(populateReqSQL, cornell_api.reqs, err => {
            if (err) throw err;
            console.log("db populated")
            res(conn);
        });
    })
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
const inputClass = async (cls, reqs) => {
    var conn = await openDb; // Wait till db initialized.  
    let insertClassSQL = `INSERT INTO class (course_id, name) VALUES (?, ?)`
    let insertClassVals = [cls.crseId, cls.titleShort]
    conn.run(insertClassSQL, insertClassVals, function (err) {
        if (err) { throw err }
        console.log(`inserted class ${cls.titleShort}, id=${this.lastID}`);
        insertReqs(this.lastID);
    })
    let reqLst = [
        cls.catalogBreadth,
        cls.catalogDistr,
        ...reqs
    ]
    const insertReqs = (courseId) => {
        reqLst.forEach(req => {
            let reqSQL = `SELECT (req_id) FROM req WHERE code = (?)`
            conn.get(reqSQL, [req], (err, row) => {
                if (err) { throw err }
                if (row) {
                    let insertClassReqSQL = `INSERT INTO class_req (course_id, req_id) VALUES (?, ?)`
                    conn.serialize(() => {
                        conn.run(insertClassReqSQL, [courseId, row.req_id], (err) => {
                            if (err) { throw err }
                        })
                    });
                } else console.log("error: no such req with code: " + req);
            });
        })
    }
}

module.exports = {
    refetch: refetch,
    populateDb: populateDb,
    inputClass: inputClass,
}