// ::: Current date in date input field :::
Date.prototype.toDateInputValue = (function() {
    // allow correct timezone
    var local = new Date(this);
    local.setMinutes(this.getMinutes() - this.getTimezoneOffset());
    return local.toJSON().slice(0,10);
});
// apply current date
const currentDate = new Date().toDateInputValue();
document.querySelector('#departDate').value = currentDate; //.valueAsDate without timezone also works
document.querySelector('#arriveDate').value = currentDate; //.valueAsDate without timezone also works

//::: date diffence for weather Forcast :::
const dateDifference = (date1, date2) => {
    dt1 = new Date(date1);
    dt2 = new Date(date2);
    return Math.floor((Date.UTC(dt2.getFullYear(), dt2.getMonth(), dt2.getDate()) - Date.UTC(dt1.getFullYear(), dt1.getMonth(), dt1.getDate()) ) /(1000 * 60 * 60 * 24));
}


// ::: form Handler Func :::
const formHandler = async(e) => {
    e.preventDefault();
    const departInput = document.querySelector('#departInput').value;
    const arriveInput = document.querySelector('#arriveInput').value;
    console.log('::: FORM SUBMITTED | GEONAMES :::')
    // ::: GEONAMES DEPART :::
    const departGeo = await fetch('/departGeoname',  {
        method: 'POST',
        credentials: 'same-origin',
        mode: 'cors',
        headers: {
            "Content-Type": "application/json",
        },
        body: JSON.stringify({ 
            depart: departInput,
            arrive: arriveInput
         })
    })
    .then(res => {
        const postData = res.json();
        return postData;
    })
    .catch((error) => {
        console.log('GEONAMES promise error', error);
    });
    console.log(departGeo);
    console.log('done')

    // ::: GEONAMES ARRIVE :::
    const arriveGeo = await fetch('/arriveGeoname',  {
        method: 'POST',
        credentials: 'same-origin',
        mode: 'cors',
        headers: {
            "Content-Type": "application/json",
        },
        body: JSON.stringify({ 
            arrive: arriveInput
         })
    })
    .then(res => {
        const postData = res.json();
        return postData;
    })
    .catch((error) => {
        console.log('GEONAMES promise error', error);
    });
    console.log(arriveGeo);
    console.log('done2')
    getWeather(departGeo, arriveGeo)
}

const getWeather = async(departGeo, arriveGeo) => {
    // ::: WEATHERBIT :::
    const departInput = document.querySelector('#departDate').value;
    const arriveInput = document.querySelector('#arriveDate').value;
    console.log(`current date:${currentDate}`);
    console.log(`Depart date:${departInput}`);
    console.log(`Arrival date:${arriveInput}`);
    const departForcast = dateDifference(currentDate, departInput);
    const arriveForcast = dateDifference(currentDate, arriveInput);
    console.log(`depart day difference:${departForcast}`);
    console.log(`arrival day difference:${arriveForcast}`);
    
    // ::: DEPART WEATHER :::
    const departWeather = await fetch('/departWeather',  {
        method: 'POST',
        credentials: 'same-origin',
        mode: 'cors',
        headers: {
            "Content-Type": "application/json",
        },
        body: JSON.stringify({ 
            latD: departGeo.latD,
            lngD: departGeo.lngD
        })
    })
    .then(res => {
        const sendData = res.json();
        return sendData;
    })
    .catch((error) => {
        console.log('WEATHERBIT promise error', error);
    });
    console.log('::: FORM SUBMITTED | DEPART WEATHERBIT :::');
    console.log(departWeather.data);
    console.log(departWeather.data[departForcast]);
    document.querySelector('#departIcon').src = `https://www.weatherbit.io/static/img/icons/${departWeather.data[departForcast].weather.icon}.png`;
    
    // ::: ARRIVE WEATHER :::
    const arriveWeather = await fetch('/arriveWeather',  {
        method: 'POST',
        credentials: 'same-origin',
        mode: 'cors',
        headers: {
            "Content-Type": "application/json",
        },
        body: JSON.stringify({
            latA: arriveGeo.latA,
            lngA: arriveGeo.lngA
        })
    })
    .then(res => {
        const sendData = res.json();
        return sendData;
    })
    .catch((error) => {
        console.log('WEATHERBIT promise error', error);
    });
    console.log('::: FORM SUBMITTED | ARRIVE WEATHERBIT :::');
    console.log(arriveWeather.data);
    console.log(arriveWeather.data[arriveForcast]);
    document.querySelector('#arriveIcon').src = `https://www.weatherbit.io/static/img/icons/${arriveWeather.data[arriveForcast].weather.icon}.png`;
}