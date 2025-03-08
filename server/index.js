const connection = require('./database/db')
const express = require('express')
var cors = require('cors');
const bodyParser = require('body-parser');

connection();

const app = express();

app.use(cors())
app.use(bodyParser.json({extended : true}))
app.use(bodyParser.urlencoded({extended:true}))

const PORT = 8080;

app.listen(PORT,()=> console.log(`server is nunning on ${PORT}`)) 


app.use(cors());


// app.use('/',route)

app.use('/',require('./routes/Routes'))