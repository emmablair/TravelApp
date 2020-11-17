// empty object for API endpoint
const projectData = {
    departure: {
        from: '',
        specify: '',
        day: '',
        lat: '',
        lng: '',
        temp: '',
        icon: '',
        cloud: ''
    },
    arrival: {
        at: '',
        specify: '',
        return: '',
        lat: '',
        lng: '',
        temp: '',
        icon: '',
        cloud: '',
        pixabay: ''
    }
  };

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

app.use(express.static('dist')); //CHANGE to DIST once webpack is added!!

// HerokuApp hosting >>
app.use(function (req, res, next){
    if (req.headers['x-forwarded-proto'] === 'https') {
      res.redirect('http://' + req.hostname + req.url);
    } else {
      next();
    }
});

app.get('/', (req, res) => {
    // CHANGE TO res.sendFile('dist/index.html') when webpack is added
    res.sendFile('dist/index.html')
    // res.sendFile(path.resolve('src/client/views/index.html'))
});

app.listen(8081, () => {
    console.log('Hello! Travel App is listening from port 8081!');
});

app.get('/all', sendData);
function sendData (request, response) {
  response.send(projectData);
};

/* ::: DEPART POST ::: */
const geoURL = `http://api.geonames.org/searchJSON?q=`;
const geoKey = process.env.GEO_KEY;

const geoNameDepart = async (baseURL, key, departInput) => {
    let urlSettings = `&maxRows=1&lang=en`;
    let url = `${baseURL}${departInput}${urlSettings}${key}`;
    console.log(url);
    let res = await fetch(url);

    try {
        let data = await res.json();
        return data;
    } catch (error) {
        console.log(':::ERROR GEO DEPART | server side:::', error);
    }
};

const geoNameArrive = async (baseURL, key, arriveInput) => {
    let urlSettings = `&maxRows=1&lang=en`;
    let url = `${baseURL}${arriveInput}${urlSettings}${key}`;
    console.log(url);
    let res = await fetch(url);
    
    try {
        let data = await res.json();
        return data;
    } catch (error) {
        console.log(':::ERROR GEO ARRIVE | server side:::', error);
    }
};

const weatherURL = `https://api.weatherbit.io/v2.0/forecast/daily?`;
const weatherKey = process.env.WEATHER_KEY;

const weatherDepart = async (baseURL, key) => {
    let urlSettings = `&lang=en&units=I&days=16`;
    let url = `${baseURL}${key}&lat=${projectData.departure.lat}&lon=${projectData.departure.lng}${urlSettings}`;
    console.log(url);
    let res = await fetch(url);

    try {
        let data = await res.json();
        return data;
    } catch (error) {
        console.log(':::ERROR WEATHER DEPART | server side:::', error);
    }
};

const weatherArrive = async (baseURL, key) => {
    let urlSettings = `&lang=en&units=I&days=16`;
    let url = `${baseURL}${key}&lat=${projectData.arrival.lat}&lon=${projectData.arrival.lng}${urlSettings}`;
    console.log(url);
    let res = await fetch(url);

    try {
        let data = await res.json();
        return data;
    } catch (error) {
        console.log(':::ERROR WEATHER ARRIVE | server side:::', error);
    }
};

const pixURL = `https://pixabay.com/api/?`;
const pixKey = process.env.PIXABAY_KEY;

const pixArrive = async (baseURL, key) => {
    let urlSettings = `&lang=en&per_page=3&category=places&image_type=photo`;
    let url = `${baseURL}${key}&q=${projectData.arrival.at}${urlSettings}`;
    console.log(url);
    let res = await fetch(url);

    try {
        let data = await res.json();
        return data;
    } catch (error) {
        console.log(':::ERROR PIXABAY | server side:::', error);
    }
};
    

app.post('/trip', async(req, res) => {

    const departDate = req.body.dateD;
    const returnDate = req.body.dateA;
    

    // // /* ::: Current date in date input field ::: */
    // Date.prototype.toDateInputValue = (function() {
    //     // allow correct timezone
    //     var local = new Date(this);
    //     local.setMinutes(this.getMinutes() - this.getTimezoneOffset());
    //     return local.toJSON().slice(0,10);
    // });
    // /* ::: apply current date ::: */
    // const currentDate = new Date().toDateInputValue();
    // departDate = currentDate; //.valueAsDate without timezone also works
    // returnDate = currentDate; //.valueAsDate without timezone also works

    // /* ::: date diffence for weather Forcast ::: */
    // const dateDifference = (date1, date2) => {
    //     dt1 = new Date(date1);
    //     dt2 = new Date(date2);
    //     return Math.floor((Date.UTC(dt2.getFullYear(), dt2.getMonth(), dt2.getDate()) - Date.UTC(dt1.getFullYear(), dt1.getMonth(), dt1.getDate()) ) /(1000 * 60 * 60 * 24));
    // }


    const departInput = req.body.depart;
    const arriveInput = req.body.arrive;

    const departForcast = req.body.forcastD;
    const arriveForcast = req.body.forcastA;
    
    // projectData.departure.from = departGeo.geonames[0].toponymName;
    // projectData.arrival.at = arriveGeo.geonames[0].toponymName;
    projectData.departure.day = departDate;
    projectData.arrival.return = returnDate;

    let departGeo = await geoNameDepart(geoURL, geoKey, departInput)
    projectData.departure.from = departGeo.geonames[0].toponymName
    projectData.departure.lat = departGeo.geonames[0].lat
    projectData.departure.lng = departGeo.geonames[0].lng
    projectData.departure.specify = departGeo.geonames[0].adminName1

    let arriveGeo = await geoNameArrive(geoURL, geoKey, arriveInput)
    projectData.arrival.at = arriveGeo.geonames[0].toponymName
    projectData.arrival.lat = arriveGeo.geonames[0].lat
    projectData.arrival.lng = arriveGeo.geonames[0].lng
    projectData.arrival.specify = arriveGeo.geonames[0].adminName1

    let weatherD = await weatherDepart(weatherURL, weatherKey)
    if(departForcast < 16) {
        projectData.departure.temp = `${weatherD.data[departForcast].temp}°F`;
        projectData.departure.cloud = weatherD.data[departForcast].weather.description;
    } else {
        projectData.departure.temp = 'Forcast unknown';
        projectData.departure.cloud = '';
    }
    // projectData.departure.icon = weatherD.data[departForcast].weather.icon;
    // projectData.departure.cloud = weatherD.data[departForcast].weather.description;
    let weatherA = await weatherArrive(weatherURL, weatherKey)
    if(arriveForcast < 16) {
        projectData.arrival.temp = `${weatherA.data[arriveForcast].temp}°F`;
        projectData.arrival.cloud = weatherA.data[arriveForcast].weather.description;
    } else {
        projectData.arrival.temp = 'Forcast unknown';
        projectData.arrival.cloud = '';
    }
    // projectData.arrival.icon = weatherA.data[arriveForcast].weather.icon;
    // projectData.arrival.cloud = weatherA.data[arriveForcast].weather.description;

    let pixabayA = await pixArrive(pixURL, pixKey)
    projectData.arrival.pixabay = pixabayA.hits[0].largeImageURL

    console.log(projectData);
    res.send(projectData);
});