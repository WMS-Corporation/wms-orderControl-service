const express = require('express');
const cors = require('cors');
const {connectDB} = require("./src/config/dbConnection");
const dotenv = require('dotenv');
const router = require('./src/routes/route')
/*
* Allow access from any subroute of http://localhost:3000
* */
const orderControlServicePort = process.env.PORT || 4004;
let corsOptions = {
    origin: new RegExp(`http:\/\/wms-order:${orderControlServicePort}\/.*`),
};
dotenv.config();
const app = express();
app.disable("x-powered-by");
app.use(express.json());
app.use(cors(corsOptions));
app.use(router);
app.listen(orderControlServicePort, () => console.info(`WMS-orderControl-service is running`));

connectDB(process.env.DB_NAME);

module.exports = { app };