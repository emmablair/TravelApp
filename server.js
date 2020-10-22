// empty object for API endpoint
const projectData = {
    departure: {
        from: '',
        specifyPlace: '',
        day: '',
        lat: '',
        lng: '',
        temp: '',
        icon: '',
        cloud: ''
    },
    arrival: {
        at: '',
        specifyPlace: '',
        day: '',
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

app.use(express.static('src/client')); //CHANGE to DIST once webpack is added!!

app.get('/', (req, res) => {
    // CHANGE TO res.sendFile('dist/index.html') when webpack is added
    res.sendFile(path.resolve('src/client/views/index.html'))
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
    // console.log(res);
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
    let urlSettings = `&lang=en&per_page=3&category=travel&image_type=photo`;
    let url = `${baseURL}${key}&q=${projectData.arrival.at}+${projectData.arrival.specifyPlace}${urlSettings}`;
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

    let departDate = req.body.dateD;
    let arriveDate = req.body.dateA;

    // /* ::: Current date in date input field ::: */
    Date.prototype.toDateInputValue = (function() {
        // allow correct timezone
        var local = new Date(this);
        local.setMinutes(this.getMinutes() - this.getTimezoneOffset());
        return local.toJSON().slice(0,10);
    });
    /* ::: apply current date ::: */
    const currentDate = new Date().toDateInputValue();
    departDate = currentDate; //.valueAsDate without timezone also works
    arriveDate = currentDate; //.valueAsDate without timezone also works

    /* ::: date diffence for weather Forcast ::: */
    const dateDifference = (date1, date2) => {
        dt1 = new Date(date1);
        dt2 = new Date(date2);
        return Math.floor((Date.UTC(dt2.getFullYear(), dt2.getMonth(), dt2.getDate()) - Date.UTC(dt1.getFullYear(), dt1.getMonth(), dt1.getDate()) ) /(1000 * 60 * 60 * 24));
    }


    const departInput = req.body.depart;
    const arriveInput = req.body.arrive;

    const departForcast = dateDifference(currentDate, departDate);
    const arriveForcast = dateDifference(currentDate, arriveDate);
    
    // projectData.departure.from = departGeo.geonames[0].toponymName;
    // projectData.arrival.at = arriveGeo.geonames[0].toponymName;
    projectData.departure.day = departDate;
    projectData.arrival.day = arriveDate;

    let departGeo = await geoNameDepart(geoURL, geoKey, departInput)
    projectData.departure.from = departGeo.geonames[0].toponymName;
    projectData.departure.lat = departGeo.geonames[0].lat;
    projectData.departure.lng = departGeo.geonames[0].lng;
    projectData.departure.specifyPlace = departGeo.geonames[0].adminName1;

    let arriveGeo = await geoNameArrive(geoURL, geoKey, arriveInput)
    projectData.arrival.at = arriveGeo.geonames[0].toponymName;
    projectData.arrival.lat = arriveGeo.geonames[0].lat;
    projectData.arrival.lng = arriveGeo.geonames[0].lng;
    projectData.arrival.specifyPlace = arriveGeo.geonames[0].adminName1;

    let weatherD = await weatherDepart(weatherURL, weatherKey)
    projectData.departure.temp = weatherD.data[departForcast].temp;
    projectData.departure.icon = weatherD.data[departForcast].weather.icon;
    projectData.departure.cloud = weatherD.data[departForcast].weather.description;
    let weatherA = await weatherArrive(weatherURL, weatherKey)
    projectData.arrival.temp = weatherA.data[arriveForcast].temp;
    projectData.arrival.icon = weatherA.data[arriveForcast].weather.icon;
    projectData.arrival.cloud = weatherD.data[arriveForcast].weather.description;

    let pixabayA = await pixArrive(pixURL, pixKey);
    projectData.arrival.pixabay = pixabayA.hits[0].largeImageURL;
    console.log(projectData);
    res.send(projectData);
});