var database = require('./database')


// Insert standard class
const test1 = () => {
    exClass = {
        crseId: 55555,
        titleShort: "Intro to Qigong",
        catalogBreadth: "HA-AS",
        catalogDistr: "MQR-AS"
    }    
    database.inputClass(exClass, []);
}
const test2 = () => {
    exClass = {
        crseId: 12345,
        titleShort: "Intro to Python",
        catalogBreadth: "HA-AS",
        catalogDistr: "MQR-AS"
    }    
    database.inputClass(exClass, []);
}

const executeTests = () => {
    console.log("executing tests");
    test1();
    test2();
}

executeTests();