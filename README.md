# Cornell-AA
A four-year full term academic planner, tailored towards Cornell students.
---
## App Description
This app allows users to plan their entire academic journey at Cornell. 

Upon choosing a school and major, users will be able to easily see the requirements 
they have fulfilled, and still need to fulfill. An easy drag-and-drop interface
allows users to plan out which classes they can take in which semesters to complete
their degree.
---
### Development
This app is composed of two main components:

*Client*:
This is the client-side react app which allows users to interact with the
classes api and plan their semesters. 

*Api*:
This is the server-side express app which exposes an api to our react app, from which the user can view classes. It also maintains the server-stored sqlite database, and updates that database occasionally from the official Cornell Roster api. 

To start development, clone this repository locally using ```git clone https://github.com/mbaduk3/Cornell-AA.git```. Then, inside of each of *api* and *client* folders run ```npm install``` to install dependencies. Finally, run ```npm start``` inside of each folder to launch development server. Client should run on `port: 3000` while the api should run on `port:9000`. 