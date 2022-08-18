const express = require('express')
const morgan = require('morgan')
const fs = require('fs')
const dotenv = require("dotenv").config()
const cors = require('cors')
const authRoutes = require('./routes/auth')
const locationRoutes = require('./routes/locations')
const {MongoConnection, connectedMongo} = require('./model/mongoUtils')

// Constant variables for server and logger:
const app = express()
const PORT = process.env.PORT || 5000
const logFile = fs.createWriteStream('./log.txt', {flags: 'a'});

// App Middlewares:
app.use(express.json({ limit: "4mb" }));
app.use(express.urlencoded({ extended: true }));
app.use(cors()) // Croos-Origin policy
morgan.token('body', function (req, res) { return JSON.stringify(req.body) })
app.use(morgan('RemoteAddress::remote-addr , Method::method , URL::url , '+
                'Status::status , ResTime::response-time ms , Body::body', { stream: logFile }))

// Route Middlewares:
app.use("/", authRoutes);
app.use("/locations", locationRoutes);

connectedMongo().then(() => {

    app.listen(PORT, ()=> console.log(`Started listening on port ${PORT}...`))

})
