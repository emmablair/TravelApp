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

    const dateInput = document.querySelector('#dateInput').value;
    console.log(dateInput);
    // ::: WEATHERBIT :::
    const weatherbit = await fetch('/weatherbit',  {
        method: 'POST',
        credentials: 'same-origin',
        mode: 'cors',
        headers: {
            "Content-Type": "application/json",
        },
        body: JSON.stringify({ 
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
    console.log('::: FORM SUBMITTED | WEATHERBIT :::')
}

// Current date in date input field
Date.prototype.toDateInputValue = (function() {
    // allow correct timezone
    var local = new Date(this);
    local.setMinutes(this.getMinutes() - this.getTimezoneOffset());
    return local.toJSON().slice(0,10);
});
// apply current date
document.querySelector('#dateInput').value = new Date().toDateInputValue(); //.valueAsDate without timezone also works