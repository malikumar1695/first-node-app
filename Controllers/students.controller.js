const Student = require("../Models/Student.model");
const client = require("../elasticconfig");

//// save to dynamodb
exports.saveStudent = async (req, res) => {
  console.log("saveStudent........");
  const body = req.body;

  console.log(body);
  try {
    const myUser = await Student.create(body);
    console.log(myUser);
    return res.status(200).send(body);
  } catch (error) {
    console.error(error);
    return res.status(400).send(error);
  }
};
//save to elastic search
exports.saveStudentES = async (req, res) => {
  console.log("save student to elastic search started....");
  const data = req.body;
  console.log(data);
  try {
    const record = await searchByIdES(data.id);
    if (!record?.length)
      await client.index({
        index: "students",
        id: data?.id,
        body: data,
      });
    else throw new Error("record with same id already exists");

    await client.indices.refresh({ index: "students" });
    return res.status(200).send(data);
  } catch (error) {
    return res.status(400).send(error);
  }
};
///// get from dynamodb
exports.getStudent = async (req, res) => {
  console.log("getStudent........");
  console.log(req.params);
  const id = Number(req.params.id);
  try {
    const student = await Student.get(id);
    return res.status(200).send(student);
  } catch (error) {
    console.error(error);
    return res.status(400).send(error);
  }
};
///// get from elastic search
exports.getStudentES = async (req, res) => {
  console.log("get student from elastic search..");
  console.log(req.params.id);

  try {
    const record = await searchByIdES(req.params.id);

    if (record?.length) console.log(`data in es:  ${JSON.stringify(record)}`);
    return res.status(200).send(record);
  } catch (error) {
    console.error(error);
    return res.status(400).send(error);
  }
};
////update in dynamodb
exports.updateStudent = async (req, res) => {
  console.log("updateStudent........");

  const body = req.body;

  console.log(body);
  try {
    await Student.update(body);
    return res.status(200).send(body);
  } catch (error) {
    console.error(error);
    return res.status(400).send(error);
  }
};
//// update in elastic search
exports.updateStudentES = async (req, res) => {
  console.log("update student in elastic search");
  const body = req.body;

  try {
    const record = await searchByIdES(body.id);

    if (!record?.length)
      throw new Error(`record not found against id: ${body.id}`);

    await client.update({
      index: "students",
      id: body?.id,
      body: { doc: body },
    });
    return res.status(200).send(body);
  } catch (error) {
    console.log(error);
    return res.status(400).send(error);
  }
};
//// delete from dynamodb
exports.removeStudentById = async (req, res) => {
  console.log("deleteStudentById........");
  try {
    let id = Number(req.params.id);
    if (await Student.get(id)) await Student.delete(id);
    else throw new Error(`Student with id: ${id} is not exist`);
    return res.status(200).send("student is deleted");
  } catch (error) {
    console.log(error);
    return res.status(400).send(error.toString());
  }
};

//// delete from elastic search
exports.removeStudentByIdES = async (req, res) => {
  console.log("deleteStudentByIdES........");
  try {
    let id = Number(req.params.id);
    const data = await searchByIdES(id);
    if (data?.length)
      await client.delete({
        index: "students",
        id: id,
      });
    else throw new Error(`Student with id: ${id} is not exist`);
    return res.status(200).send("student is deleted from elastic search");
  } catch (error) {
    console.log(`console error: ${error}`);
    return res.status(400).send(error.toString());
  }
};

const searchByIdES = async (id) => {
  const { body } = await client.search({
    index: "students",
    body: {
      query: {
        match: {
          id: id,
        },
      },
    },
  });
  return body?.hits?.hits;
};
