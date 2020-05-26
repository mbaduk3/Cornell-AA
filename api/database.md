# The Database Structure
*Note*: This document will evolve as the project grows. 

The database instance is a single Sqlite3 file, labeled `db.sqlite`. 

As a simple POC, we can have two tables:
`class` and `req`. 

`class`: <br>
This table stores every single class instance. Columns are:
- `class_id : int, primary_key` - the unique identifier for a record in the `class` table.
- `name : string, not_null` - the full name of the course, such as "Introduction to Python".
- `courseNumber : int, not_null` - the Cornell-issued course number for this course. 
- `reqId : int, foreign_key` - the foreign key linking to the entry in the `req` table. 

`req`: <br>
This table stores every requirement (as defined by us, not by Cornell). Columns are: 
- `req_id : int, primary_key` - the unique identifier for a record in the `req` table. 
- `code : string, not_null` - the code that Cornell gives this requirement (such as "HA-AS"), or our own custom one (if not a Cornell-defined requirement).

This defines `req` to `class` as a one-to-many relationship. We will have to change this in the future, since a single class can fulfill multiple requirements. However, to keep it simple for this POC I'm starting with this simple abstraction. 