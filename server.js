// empty object for API endpoint
const projectData = {
    departFrom: '',
    departDay: '',
    departLat: '',
    departLng: '',
    weatherDTemp: '',
    weatherDIcon: '',
    weatherDCloud: '',
    arriveAt: '',
    arriveDay: '',
    arriveLat: '',
    arriveLng: '',
    weatherATemp: '',
    weatherAIcon: '',
    weatherACloud: '',
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

    let res = await fetch(url);
    // console.log(res);
    try {
        let data = await res.json();
        return data;
    } catch (error) {
        console.log(':::ERROR DEPART server side /geoname:::', error);
    }
};

// app.post('/departGeoname', async(req, res) => {
//     let baseURL = `http://api.geonames.org/searchJSON?q=`;
//     let key = process.env.GEO_KEY;
//     let urlSettings = `&maxRows=1&lang=en`;
//     // req user input from client side
//     let departInput = req.body.depart;

//     console.log(`DEPART${departInput}`);


//     let departApiURL = `${baseURL}${departInput}${urlSettings}${key}`;

//     console.log(departApiURL);

//     let data = await fetch(departApiURL)
//     .then((data) => data.json())
//     .then((data) => newEntry = {
//         latD: data.geonames[0].lat,
//         lngD: data.geonames[0].lng,
//     })
//     .then((data) => res.send(data))
//     .catch((error) => console.log(':::ERROR server side /geoname:::', error));
// })

const geoNameArrive = async (baseURL, key, arriveInput) => {
    let urlSettings = `&maxRows=1&lang=en`;
    let url = `${baseURL}${arriveInput}${urlSettings}${key}`;

    let res = await fetch(url);
    // console.log(res);
    try {
        let data = await res.json();
        return data;
    } catch (error) {
        console.log(':::ERROR ARRIVE server side /geoname:::', error);
    }
};

// /* ::: ARRIVE POST ::: */
// app.post('/arriveGeoname', async(req, res) => {
//     let baseURL = `http://api.geonames.org/searchJSON?q=`;
//     let key = process.env.GEO_KEY;
//     let urlSettings = `&maxRows=1&lang=en`;
//     // req user input from client side
//     let arriveInput = req.body.arrive;
//     console.log(`ARRIVE${arriveInput}`);

//     let arriveApiURL = `${baseURL}${arriveInput}${urlSettings}${key}`;

//     console.log(arriveApiURL);
//     let data = await fetch(arriveApiURL)
//     .then((data) => data.json())
//     .then((data) => newEntry = {
//         latA: data.geonames[0].lat,
//         lngA: data.geonames[0].lng,
//         specifyPlace: data.geonames[0].adminName1
//     })
//     .then((data) => res.send(data))
//     .catch((error) => console.log(':::ERROR server side /geoname:::', error));
// })
const weatherURL = `https://api.weatherbit.io/v2.0/forecast/daily?`;
const weatherKey = process.env.WEATHER_KEY;

const weatherDepart = async (baseURL, key) => {
    let urlSettings = `&lang=en&units=I&days=16`;
    let url = `${baseURL}${key}&lat=${projectData.departLat}&lon=${projectData.departLng}${urlSettings}`;
    console.log(url)
    let res = await fetch(url);
    // console.log(res);
    try {
        let data = await res.json();
        return data;
    } catch (error) {
        console.log(':::ERROR ARRIVE server side /geoname:::', error);
    }
};

// /* ::: WEATHER DEPARTURE ::: */
// app.post('/departWeather', async(req, res) => {
//     let baseURL = `https://api.weatherbit.io/v2.0/forecast/daily?`;
//     let key = process.env.WEATHER_KEY;
//     let urlSettings = `&lang=en&units=I&days=16`;
//     // lat & lng from GEONAMES api
//     let latD = req.body.latD;
//     let lngD = req.body.lngD;
//     console.log(latD);
//     console.log(lngD);
    
//     let apiURL =`${baseURL}${key}&lat=${latD}&lon=${lngD}${urlSettings}`;
//     console.log(apiURL);
//     let data = await fetch(apiURL)
//     .then((data) => data.json())
//     .then((data) => res.send(data))
//     .catch((error) => console.log(':::ERROR server side /departWeather:::', error));
// })

const weatherArrive = async (baseURL, key) => {
    let urlSettings = `&lang=en&units=I&days=16`;
    let url = `${baseURL}${key}&lat=${projectData.arriveLat}&lon=${projectData.arriveLng}${urlSettings}`;

    let res = await fetch(url);
    // console.log(res);
    try {
        let data = await res.json();
        return data;
    } catch (error) {
        console.log(':::ERROR ARRIVE server side /geoname:::', error);
    }
};

// /* ::: WEATHER ARRIVAL ::: */
// app.post('/arriveWeather', async(req, res) => {
//     let baseURL = `https://api.weatherbit.io/v2.0/forecast/daily?`;
//     let key = process.env.WEATHER_KEY;
//     let urlSettings = `&lang=en&units=I&days=16`;
//     // lat & lng from GEONAMES api
//     let latA = req.body.latA;
//     let lngA = req.body.lngA;
//     console.log(latA);
//     console.log(lngA);
    
//     let apiURL =`${baseURL}${key}&lat=${latA}&lon=${lngA}${urlSettings}`;
//     console.log(apiURL);
//     let data = await fetch(apiURL)
//     .then((data) => data.json())
//     .then((data) => res.send(data))
//     .catch((error) => console.log(':::ERROR server side /arriveWeather:::', error));
// })

// /* ::: PIXABAY ARRIVAL PIC ::: */
// app.post('/pixabay', async(req, res) => {
//     let baseURL = `https://pixabay.com/api/?`;
//     let key = process.env.PIXABAY_KEY;
//     let urlSettings = `&lang=en&per_page=3&image_type=photo`;
//     // lat & lng from GEONAMES api
//     let arriveInput = req.body.arrive;
//     let placeDefine = req.body.place;
//     console.log(`PICTURE OF: ${arriveInput}`);
//     console.log(`DEFINE PLACE: ${placeDefine}`);
    
//     let apiURL =`${baseURL}${key}&q=${arriveInput}+${placeDefine}${urlSettings}`;
//     console.log(apiURL);
//     let data = await fetch(apiURL)
//     .then((data) => data.json())
//     .then((data) => res.send(data))
//     .catch((error) => console.log(':::ERROR server side /pixabay:::', error));
// })
    // ::: Current date in date input field :::
    
    

app.post('/trip', async(req, res) => {

    let departDate = req.body.dateD;
    let arriveDate = req.body.dateA;

    Date.prototype.toDateInputValue = (function() {
        // allow correct timezone
        var local = new Date(this);
        local.setMinutes(this.getMinutes() - this.getTimezoneOffset());
        return local.toJSON().slice(0,10);
    });
    // apply current date
    const currentDate = new Date().toDateInputValue();
    departDate = currentDate; //.valueAsDate without timezone also works
    arriveDate = currentDate; //.valueAsDate without timezone also works

    //::: date diffence for weather Forcast :::
    const dateDifference = (date1, date2) => {
        dt1 = new Date(date1);
        dt2 = new Date(date2);
        return Math.floor((Date.UTC(dt2.getFullYear(), dt2.getMonth(), dt2.getDate()) - Date.UTC(dt1.getFullYear(), dt1.getMonth(), dt1.getDate()) ) /(1000 * 60 * 60 * 24));
    }


    const departInput = req.body.depart;
    const arriveInput = req.body.arrive;
    
    projectData.departFrom = departInput;
    projectData.arriveAt = arriveInput;
    projectData.departDay = departDate;
    projectData.arriveDay = arriveDate;

    let departGeo = await geoNameDepart(geoURL, geoKey, departInput)
    projectData.departLat = departGeo.geonames[0].lat
    projectData.departLng = departGeo.geonames[0].lng

    let arriveGeo = await geoNameArrive(geoURL, geoKey, arriveInput)
    projectData.arriveLat = arriveGeo.geonames[0].lat
    projectData.arriveLng = arriveGeo.geonames[0].lng


    const departForcast = dateDifference(currentDate, departDate);
    const arriveForcast = dateDifference(currentDate, arriveDate);
    let weatherD = await weatherDepart(weatherURL, weatherKey)
    projectData.weatherDTemp = weatherD.data[departForcast].temp;
    projectData.weatherDIcon = weatherD.data[departForcast].weather.icon;
    projectData.weatherDCloud = weatherD.data[departForcast].weather.description;
    let weatherA = await weatherArrive(weatherURL, weatherKey)
    projectData.weatherATemp = weatherA.data[arriveForcast].temp;
    projectData.weatherAIcon = weatherA.data[arriveForcast].weather.icon;
    projectData.weatherACloud = weatherD.data[arriveForcast].weather.description;
    console.log(projectData)
})
// latD: data.geonames[0].lat,
//         lngD: data.geonames[0].lng,