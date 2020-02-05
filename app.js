const express = require("express");
const bodyParser = require("body-parser");
const cors = require("cors");
const corsOprions = require("./config/cors.config");

const app = express();

// CABECERAS
app.use(cors(corsOprions));

//  solo tomara en cuenta los objetos de tipo json
app.use(bodyParser.json());
//  no permitira objetos anidados
app.use(bodyParser.urlencoded({ extended: true }));

// RUTAS
app.get('*',(req,res)=>{
    res.status(200).send('start');
});


module.exports = app;
