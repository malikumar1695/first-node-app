const  elastic = require("@elastic/elasticsearch");

const client = new elastic.Client({
  node: "http://localhost:9200",
});

module.exports = client;
// async function run(){
//     const resp =await client.info();
//     console.log(resp);
// }

// run().catch(err =>{
//     console.log(err);
//     process.exit(1);
// })