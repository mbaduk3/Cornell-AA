# The Database Structure
*Note*: This document will evolve as the project grows.
---
### Cornell API

Before be begin discussing the structure of the database, it is important to understand
how the data which Cornell's Roster API provides us looks like.

Each "class" object returned by the API has certain attributes which are of interest to us:
- `strm`: seems to enocde the roster year and term (ie. SP19). 
- `crseId`: the unique identifier for the course. This identifier is common across crosslisted courses (ie. CS 1710 and 
COGST 1101 are the same course, and have the same `crseId`).
- `subject`: the subject category to which this class belongs (ie. CS, PHIL, or MATH). 
A single class may be crosslisted under multiple `subject`s.  
- `catalogNbr`: the usually 4-digit catalog number which comes after the `subject` in the name (ie. CS **2110**, or ECE **2720**).
A single class may be crosslisted under multiple `subject`s, and the corresponding `catalogNbr` for each subject's listing
will not necessarily be the same (ie. CS **1710** and COGST **1101** are the same class). 
- `titleShort`: a short title for the class. 
- `catalogBreadth`: any breadth requirements the class fulfills (ie. HA-AS).
- `catalogDistr`: any distribution requirements the class fulfills (ie. MQR-AS). 
- `catalogLang`: ???
- `catalogWhenOffered`: the semsters when the course is offered (ie. spring, fall). 
- `catalogPrereqCoreq`: a string explaination of the class' pre/co-requisistes. Individual courses must be parsed out manually. 
- `catalogSatisfiesReq`: ???
- `acadCareer`: whether the course is for undergraduates, graduates, etc. 
- `acadGroup`: divides courses among the different schools (Arts, Engineering). A single course may 
fall under multiple academic groups. 



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