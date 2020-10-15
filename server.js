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

// ::: DEPART POST :::
app.post('/departGeoname', async(req, res) => {
    let baseURL = `http://api.geonames.org/searchJSON?q=`;
    let key = process.env.GEO_KEY;
    let urlSettings = `&maxRows=1&lang=en`;
    // req user input from client side
    let departInput = req.body.depart;

    console.log(`DEPART${departInput}`);


    let departApiURL = `${baseURL}${departInput}${urlSettings}${key}`;

    console.log(departApiURL);

    let data = await fetch(departApiURL)
    .then((data) => data.json())
    .then((data) => newEntry = {
        latD: data.geonames[0].lat,
        lngD: data.geonames[0].lng,
    })
    .then((data) => res.send(data))
    .catch((error) => console.log(':::ERROR server side /geoname:::', error));
})

// ::: ARRIVE POST :::
app.post('/arriveGeoname', async(req, res) => {
    let baseURL = `http://api.geonames.org/searchJSON?q=`;
    let key = process.env.GEO_KEY;
    let urlSettings = `&maxRows=1&lang=en`;
    // req user input from client side
    let arriveInput = req.body.arrive;
    console.log(`ARRIVE${arriveInput}`);

    let arriveApiURL = `${baseURL}${arriveInput}${urlSettings}${key}`;

    console.log(arriveApiURL);
    let data = await fetch(arriveApiURL)
    .then((data) => data.json())
    .then((data) => newEntry = {
        latA: data.geonames[0].lat,
        lngA: data.geonames[0].lng,
    })
    .then((data) => res.send(data))
    .catch((error) => console.log(':::ERROR server side /geoname:::', error));
})


app.post('/departWeather', async(req, res) => {
    let baseURL = `https://api.weatherbit.io/v2.0/forecast/daily?`;
    let key = process.env.WEATHER_KEY;
    let urlSettings = `&lang=en&units=I&days=16`;
    // lat & lng from GEONAMES api
    let latD = req.body.latD;
    let lngD = req.body.lngD;
    console.log(latD);
    console.log(lngD);
    
    let apiURL =`${baseURL}${key}&lat=${latD}&lon=${lngD}${urlSettings}`;
    console.log(apiURL);
    let data = await fetch(apiURL)
    .then((data) => data.json())
    .then((data) => res.send(data))
    .catch((error) => console.log(':::ERROR server side /departWeather:::', error));
})

app.post('/arriveWeather', async(req, res) => {
    let baseURL = `https://api.weatherbit.io/v2.0/forecast/daily?`;
    let key = process.env.WEATHER_KEY;
    let urlSettings = `&lang=en&units=I&days=16`;
    // lat & lng from GEONAMES api
    let latA = req.body.latA;
    let lngA = req.body.lngA;
    console.log(latA);
    console.log(lngA);
    
    let apiURL =`${baseURL}${key}&lat=${latA}&lon=${lngA}${urlSettings}`;
    console.log(apiURL);
    let data = await fetch(apiURL)
    .then((data) => data.json())
    .then((data) => res.send(data))
    .catch((error) => console.log(':::ERROR server side /arriveWeather:::', error));
})

