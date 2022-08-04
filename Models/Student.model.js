const dynamoose = require("dynamoose");

const studentSchema = new dynamoose.Schema({
    "id": Number,
    "name": String,
    "phno": String
});
const Student = dynamoose.model("Student",studentSchema);

module.exports = Student;