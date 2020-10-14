// empty object for API endpoint
const projectData = {}

// .env file to hide API keys
const dotenv = require('dotenv');
dotenv.config();

const express = require('express');
const cors = require('cors');
const bodyParser = require('body-parser')
const path = require('path');
const fetch = require('node-fetch');

const app = express();

// use json
app.use(bodyParser.json());
// use urlencoded values
app.use(bodyParser.urlencoded({
    extended: true
}));
app.use(cors());

app.use(express.static('src/client')); //CHANGE to DIST once webpack is added!!

app.get('/', (req, res) => {
    // CHANGE TO res.sendFile('dist/index.html') when webpack is added
    res.sendFile(path.resolve('src/client/views/index.html'))
});

app.listen(8081, () => {
    console.log('Hello! Travel App is listening from port 8081!');
});

app.post('/geoname', async(req, res) => {
    let baseURL = `http://api.geonames.org/searchJSON?q=`;
    let key = process.env.GEO_KEY;
    let urlSettings = `&maxRows=1&lang=en`;
    // req user input from client side
    let userInput = req.body.input;
    console.log(userInput);

    let apiURL = `${baseURL}${userInput}${urlSettings}${key}`;
    console.log(apiURL);
    let data = await fetch(apiURL)
    .then((data) => data.json())
    .then((data) => newEntry = {
        lat: data.geonames[0].lat,
        lng: data.geonames[0].lng,
    })
    .then((data) => res.send(data))
    .catch((error) => console.log(':::ERROR server side /geoname:::', error));
})

app.post('/weatherbit', async(req, res) => {
    let baseURL = `https://api.weatherbit.io/v2.0/forecast/daily?`;
    let key = process.env.WEATHER_KEY;
    let urlSettings = `&lang=en&units=I&days=16`;
    // lat & lng from GEONAMES api
    let lat = req.body.lat;
    let lng = req.body.lng;
    console.log(lat);
    console.log(lng);
    
    let apiURL =`${baseURL}${key}&lat=${lat}&lon=${lng}${urlSettings}`;
    console.log(apiURL);
    let data = await fetch(apiURL)
    .then((data) => data.json())
    .then((data) => res.send(data))
    .catch((error) => console.log(':::ERROR server side /geoname:::', error));
})

