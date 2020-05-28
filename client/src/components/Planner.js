import React from 'react';

class Course {
  constructor(subject, number, id) {
    this.subject = subject;
    this.number = number;
    this.id = id;
    this.req = null;
  }
}

class Requirements {
  constructor(major_id) {
    this.name = major_id;
    // Get major json object into major_obj. Need filtering from database
    major_obj = null;
    this.college_reqs = major_obj.collegereqs;
    this.major_reqs = major_obj.majorreqs;
    this.sat_reqs = major_obj.satreqs;
  }
}

class Academics {
  courses = [];
  requirements = null;

  constructor(name) {
    this.name = name;
    this.major_id = null;
  }

  get courses() {
    return this.courses;
  }

  setMajor(major_id) {
    this.major_id = major_id;
    this.requirements = Requirements(major_id);
  }
}

const Planner = () => {
  return
}

export default Planner

