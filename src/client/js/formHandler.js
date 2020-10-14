// ::: Current date in date input field :::
Date.prototype.toDateInputValue = (function() {
    // allow correct timezone
    var local = new Date(this);
    local.setMinutes(this.getMinutes() - this.getTimezoneOffset());
    return local.toJSON().slice(0,10);
});
// apply current date
const currentDate = new Date().toDateInputValue();
document.querySelector('#dateInput').value = currentDate; //.valueAsDate without timezone also works

//::: date diffence for weather Forcast :::
const dateDifference = (date1, date2) => {
    dt1 = new Date(date1);
    dt2 = new Date(date2);
    return Math.floor((Date.UTC(dt2.getFullYear(), dt2.getMonth(), dt2.getDate()) - Date.UTC(dt1.getFullYear(), dt1.getMonth(), dt1.getDate()) ) /(1000 * 60 * 60 * 24));
}


// ::: form Handler Func :::
const formHandler = async(e) => {
    e.preventDefault();
    const userInput = document.querySelector('#userInput').value;
    console.log('::: FORM SUBMITTED | GEONAMES :::')
    // ::: GEONAMES :::
    const geoname = await fetch('/geoname',  {
        method: 'POST',
        credentials: 'same-origin',
        mode: 'cors',
        headers: {
            "Content-Type": "application/json",
        },
        body: JSON.stringify({ input: userInput })
    })
    .then(res => {
        const postData = res.json();
        return postData;
    })
    .catch((error) => {
        console.log('GEONAMES promise error', error);
    });
    console.log(geoname);
    console.log('done')
    getWeather(geoname)
}

const getWeather = async(geoname) => {
    // ::: WEATHERBIT :::
    const dateInput = document.querySelector('#dateInput').value;
    console.log(`current date:${currentDate}`);
    console.log(`destination date:${dateInput}`);
    const forcastDay = dateDifference(currentDate, dateInput);
    console.log(`destination day difference:${forcastDay}`);
    
    const weatherbit = await fetch('/weatherbit',  {
        method: 'POST',
        credentials: 'same-origin',
        mode: 'cors',
        headers: {
            "Content-Type": "application/json",
        },
        body: JSON.stringify({
            day: forcastDay, 
            lat: geoname.lat,
            lng: geoname.lng 
        })
    })
    .then(res => {
        const sendData = res.json();
        return sendData;
    })
    .catch((error) => {
        console.log('WEATHERBIT promise error', error);
    });
    console.log('::: FORM SUBMITTED | WEATHERBIT :::');
    console.log(weatherbit.data);
    console.log(weatherbit.data[forcastDay]);
    document.querySelector('#weatherIcon').src = `https://www.weatherbit.io/static/img/icons/${weatherbit.data[forcastDay].weather.icon}.png`;
}