const http = require('http');
const routes = require('./routes');
const express = require('express');
const dynamoose = require('dynamoose');
var bodyParser = require('body-parser');

dynamoose.aws.sdk.config.update({
    region: 'us-west-2',
  });
dynamoose.aws.ddb.local();

const app = express();
app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());


app.use(routes);

app.use((req,res,next)=>{
    res.status(404).send('<p>Page not found</p>')
})

const server = http.createServer(app);  

server.listen(3001);