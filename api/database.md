# The Database Structure
*Note*: This document will evolve as the project grows.
#
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

#


The database instance is a single Sqlite3 file, labeled `db.sqlite`. 

To accomodate our requirements at this stage, we can have 3 tables:
`class`, `req`, and a junction table `class_req`. 

`class`: <br>
This table stores every single class instance. Columns are:
- `course_id : int, primary_key` - the unique identifier for a record in the `class` table. *Note*: this identifier is given to us by Cornell API as `crseId`. 
- `name : string, not_null` - the full name of the course, such as "Introduction to Python". This is derived from `shortTitle` in the API response. 

`req`: <br>
This is a lookup table which stores every requirement (as defined by us, not by Cornell). Columns are: 
- `req_id : int, primary_key` - the unique identifier for a record in the `req` table. 
- `code : string, not_null` - the code that Cornell gives this requirement (such as "HA-AS"), or our own custom one (if not a Cornell-defined requirement).

`class_req`: <br>
This is a junction table, forming the many-to-many relationship between classes and requirements. A class can satisfy multiple requirements, while a requirement can be satisfied by multiple classes. The primary key is a compound key composed of `course_id` and `req_id`. Columns are:
- `course_id : int, not_null` - the foreign key linking to a specific entry in `class` table. 
- `req_id : int, not_null` - the foreign key linking to specific entry in the `req` table. 

This defines `req` to `class` as a many-to-many relationship. 