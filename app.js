const express = require("express");
const bodyParser = require("body-parser");
const cors = require("cors");
const corsOprions = require("./config/cors.config");
const userRoutes = require("./routes/user.route");
const braveRoute = require("./routes/currency.route");
const coinRoute = require("./routes/coin.route");

const app = express();

// CABECERAS
app.use(cors(corsOprions));

//  solo tomara en cuenta los objetos de tipo json
app.use(bodyParser.json());
//  no permitira objetos anidados
app.use(bodyParser.urlencoded({ extended: true }));

// RUTAS
app.use('/api/user',userRoutes);

app.use('/api/brave',braveRoute);

app.use('/api/coin', coinRoute);


app.use((error, req, res, next) => {
    const status = error.statusCode || 500;
    const message = error.message;
    const data = error.data;
    res.status(status).json({ message: message, data: data });
});


module.exports = app;
