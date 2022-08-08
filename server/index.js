const express = require('express')
const morgan = require('morgan')
const fs = require('fs')
const dotenv = require("dotenv").config()
const cors = require('cors')
const authRoutes = require('./routes/auth')
const locationRoutes = require('./routes/locations')
const MongoConnection = require('./model/mongoUtils')

const app = express()

const PORT = 3000
const logFile = fs.createWriteStream('./log.txt', {flags: 'a'});

// middlewares
app.use(express.json({ limit: "4mb" }));
app.use(express.urlencoded({ extended: true }));
app.use(cors())
morgan.token('body', function (req, res) { return JSON.stringify(req.body) })
app.use(morgan('RemoteAddress::remote-addr , Method::method , URL::url , '+
                'Status::status , ResTime::response-time ms , Body::body', { stream: logFile }))

// route middlewares
app.use("/", authRoutes);
app.use("/locations", locationRoutes);
app.get('/r', (req,res)=>{
    console.log('Got request')
    res.setHeader('Access-Control-Allow-Origin', '*')
    res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept");
    res.json({
        places: [
            {
                id: 1,
                name: 'abc',
                address: 'abs 23',
                lnglat: [35.01291827647526,31.88937427045248],
                numOfReviews: 10
            },
            {
                id:2,
                name: 'def',
                address: 'hhhh 334',
                lnglat: [35.01055793254196, 31.891997777528616],
                numOfReviews: 123
            },
            {
                id:3,
                name: 'pizza',
                address: 'abs 2hhh44',
                lnglat: [35.00635222880712, 31.890084810998772],
                numOfReviews: 334
            },
            {
                id:4,
                name: 'burger',
                address: 'abs 23',
                lnglat: [35.006155492136685, 31.90585946670268],
                numOfReviews: 78
            }
        ]
    })
})

// app.post('/signup', function (req, res) {
//     const uname = req.body.uname
//     const dob = req.body.dob
//     const email = req.body.email
//     const password = req.body.password

//     res.json(model.signUp(uname, dob, email, password))
// })

// app.post('/signin', function (req, res) {
//     // console.log(`${req.body.email}, ${req.body.pass}`);
//     // res.json({result: 'OK'})
//     const email = req.body.email
//     const password = req.body.password

//     app.json(model.signIn(email, password))
// })

// app.post('/get-location-reviews', function (req, res) {
//     const lname = req.body.lname
//     const location = req.body.location
//     const indexRange = req.body.indexRange

//     res.json(model.getlocationreviews(lname, location, indexRange))
// })

// app.post('/add-review', function (req, res) {
//     const email = req.body.email
//     const textReview = req.body.textReview
//     const soundLevel = req.body.soundLevel
//     const soundOpinion = req.body.soundOpinion
//     const labels = req.body.labels
//     const location = req.body.location
//     const lname = req.body.lname

//     res.json(model.insertReview(email, textReview, soundLevel, soundOpinion,
//         labels, location, lname))
// })

// app.post('/get-locations-by-radius', function (req, res) {
//     const location = req.body.location
//     const radius = req.body.radius

//     res.json(model.getLocationsByRadius(location, radius))
// })


app.listen(PORT, ()=> console.log(`Started listening on port ${PORT}...`))
