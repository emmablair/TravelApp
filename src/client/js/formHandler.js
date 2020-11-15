/* ::: TOOLTIP for date section ::: */
$(function () {
    $('[data-toggle="tooltip"]').tooltip()
  })

let departDate = document.querySelector('#departDate').value;
let returnDate = document.querySelector('#returnDate').value;

/* ::: Current date in date input field ::: */
Date.prototype.toDateInputValue = (function() {
    // allow correct timezone
    var local = new Date(this);
    local.setMinutes(this.getMinutes() - this.getTimezoneOffset());
    return local.toJSON().slice(0,10);
});
/* ::: apply current date ::: */
const currentDate = new Date().toDateInputValue();
document.querySelector('#departDate').value = currentDate; //.valueAsDate without timezone also works
document.querySelector('#returnDate').value = currentDate; //.valueAsDate without timezone also works

/* ::: date diffence for weather Forcast ::: */
const dateDifference = (date1, date2) => {
    dt1 = new Date(date1);
    dt2 = new Date(date2);
    return Math.floor((Date.UTC(dt2.getFullYear(), dt2.getMonth(), dt2.getDate()) - Date.UTC(dt1.getFullYear(), dt1.getMonth(), dt1.getDate()) ) /(1000 * 60 * 60 * 24));
}



/* ::: form Handler Func ::: */

const formHandler = async(e) => {
    e.preventDefault();

    const departDate = document.querySelector('#departDate').value;
    const returnDate = document.querySelector('#returnDate').value;
    console.log(departDate)
    console.log(returnDate)
    const dForcast = dateDifference(currentDate, departDate);
    const aForcast = dateDifference(currentDate, returnDate);
    console.log(dForcast)
    console.log(aForcast)
    const departInput = document.querySelector('#departInput').value;
    const arriveInput = document.querySelector('#arriveInput').value;

    /* ::: IF statment to check if form fields are blank ::: */
    if(departInput === '' || arriveInput === '' || departDate === '' || returnDate === '') {
        alert('Please enter valid locations and dates.')
    }else{
        /* if form fields aren't blank than give modal the data-target ID
        so that the model drops down after submit (BUT not if fields are empty) */
        const target = document.querySelector('.data-target');
        target.id = 'createTrip';

        console.log('::: FORM SUBMITTED | TRIPINFO :::')

    /* ::: ALL TRIP INFO | DEPART & ARRIVE ::: */
        const tripInfo = await fetch('/trip',  {
            method: 'POST',
            credentials: 'same-origin',
            mode: 'cors',
            headers: {
                "Content-Type": "application/json",
            },
            body: JSON.stringify({ 
                depart: departInput,
                arrive: arriveInput,
                dateD: departDate,
                dateA: returnDate,
                forcastA: aForcast,
                forcastD: dForcast
            })
        })
        .then(res => {
            const postData = res.json();
            return postData;
        })
        .catch((error) => {
            console.log('::: ERROR TRIPNFO | client side :::', error);
        });
        console.log(tripInfo);
        console.log('::: SUCCESSFUL POST | Completed tripInfo :::')
        /* reset modal target ID back to EMPTY so IF 
        statment continues to work on multiple trips 
        at each sumbit click */
        target.id = '';
        tripUI(tripInfo);
    }
}

/* ::: MODAL | UPDATE trip UI ::: */

const tripUI = (tripInfo) => {
    /* Image and Travel Title */
    let title = document.querySelector('.modal-title');
    let pic = document.querySelector('#arrivePic');
    // updated UI
    pic.setAttribute('src', `${tripInfo.arrival.pixabay}`)
    pic.setAttribute('alt', `Picture of ${tripInfo.arrival.at}.`)
    // Trip Information
    let headTo = document.querySelector('#head_to');
    let headFrom = document.querySelector('#head_from');
    let dayD = document.querySelector('#dayD');
    let dayR = document.querySelector('#dayR');
    let weatherD = document.querySelector('#weatherD');
    let weatherR = document.querySelector('#weatherR');
    // updated UI
    headTo.innerHTML = `${tripInfo.arrival.at}, ${tripInfo.arrival.specify}`
    headFrom.innerHTML = `From: ${tripInfo.departure.from}, ${tripInfo.departure.specify}`
    dayD.innerHTML = `<i class="fas fa-plane-departure modal-plane"></i>${tripInfo.departure.day}`
    dayR.innerHTML = `<i class="fas fa-plane-arrival modal-plane"></i>${tripInfo.arrival.return}`
    weatherD.innerHTML = `${tripInfo.departure.temp} ${tripInfo.departure.cloud}`
    weatherR.innerHTML = `${tripInfo.arrival.temp} ${tripInfo.arrival.cloud}`
}

/* ::: LOCALSTORAGE | STORE saved trip info ::: */

const store = (tripInfo) => {
    let tripInfos;
    if(localStorage.getItem('tripInfos') === null) {
        tripInfos = [];
    } else {
        tripInfos = JSON.parse(localStorage.getItem('tripInfos'));
    }
    tripInfos.push(tripInfo);
    localStorage.setItem('tripInfos', JSON.stringify(tripInfos));
    addSave(tripInfos);
    console.log(tripInfo.arrival)
}

/* ::: SAVE TRIP ::: */

const save = async() => {
    document.querySelector('#save').addEventListener('click', async() => {
        console.log('CLICK')
        // hide modal from display
        // modalArea.style.display = 'none';
        const trip = await fetch('/all',  {
            method: 'GET',
            credentials: 'same-origin',
            mode: 'cors',
            headers: {
                "Content-Type": "application/json",
            },
        })
        try{
            const allData = await trip.json();
            console.log(allData)
            store(allData)
            return allData;
        } catch (error) {
            console.log('error', error);
        }
    })  
};
save()

/* ::: UPDATE CARD UI ::: */

const updateSavedTrip = (divs) => {
    // UpdateUI of saved trips with local storage data
    // const saveCard = document.createElement('div');
    // saveCard.classList.add('saveCard');
    // divs.appendChild(saveCard);
    const saveImgBox = document.createElement('div');
    saveImgBox.classList.add('saveImgBox');
    divs.appendChild(saveImgBox);
    const trips = JSON.parse(localStorage.getItem('tripInfos'));
    // basic CARD with image and button (NO INFO)
    trips.forEach( () => {
        for (let i = 0; i < trips.length; i++){
        const daysToTrip = dateDifference(currentDate, trips[i].departure.day)
        saveImgBox.innerHTML = `
            <img class="saveImg" src="${trips[i].arrival.pixabay}" alt="Picture of ${trips[i].arrival.at}, ${trips[i].arrival.specify}">
        `
        } 
    }) 
    clickSavedInfo(saveImgBox);
}

/* ::: CLICK CARD to view INFO ::: */

const clickSavedInfo = (saveImgBox) => {
    const trips = JSON.parse(localStorage.getItem('tripInfos'));
    const saveInfo = document.createElement('div');
    saveInfo.classList.add('saveInfo');
    saveImgBox.appendChild(saveInfo);
    saveImgBox.addEventListener('click', (e) => {
        // if clicked THEN show all trip info on card
        if(saveInfo.innerHTML != '') {
            saveInfo.innerHTML = ''
            saveInfo.style.padding = '0';
        }else{
            saveInfo.style.padding = '1em';
            trips.forEach( () => {
                for (let i = 0; i < trips.length; i++){
                const daysToTrip = dateDifference(currentDate, trips[i].departure.day)
                saveInfo.innerHTML =
                `<div class='tripTo'>${trips[i].arrival.at}, ${trips[i].arrival.specify}</div>
                    <div class='tripFrom'>From: ${trips[i].departure.from}, ${trips[i].departure.specify}</div>
                    <div class='s_Info'><strong>Depart:</strong> ${trips[i].departure.day}</div>
                    <div class='s_Info'>${trips[i].departure.temp} ${trips[i].departure.cloud}</div>
                    <div class='s_Info'><strong>Return:</strong> ${trips[i].arrival.return}</div>
                    <div class='s_Info'>${trips[i].arrival.temp} ${trips[i].arrival.cloud}</div>
                    <div class='s_Info'>${daysToTrip} Days Away!</div>`
                } 
            })
        }
        
    }) 
}

/* ::: DYMANICALLY create SAVE CARD ::: */

const addSave = (tripInfos) => {
    // Dynamically create save card DIVs
    let savedTrip = document.querySelector('#savedTrips');
    let divs = document.createElement('div');
    let buttons = document.createElement('button')
    savedTrip.appendChild(divs)
    divs.classList.add('saveCard')
    const saves = document.querySelector('.trip');
    // Update the Save Cards with INFO
    updateSavedTrip(divs);
    // creates NEW button each save
    divs.appendChild(buttons);
    buttons.classList.add('delete')
    buttons.classList.add('btn')
    buttons.id = 'saved'
    buttons.innerHTML = 'Cancel Trip'
    // Delete trip from view and storage
    deleteTrip(tripInfos, buttons)
    // remove 'no trips yet' message if there are trips
    noTripMessage()
};

/* ::: Delete Trip | Display and LocalStorage ::: */

const deleteTrip = (tripInfos, buttons) => {
    buttons.addEventListener('click', (e) => {
        console.log('Deleting...')
        let tripInfos = JSON.parse(localStorage.getItem('tripInfos'));
        tripInfos.forEach((trip) => {
            if(e.target.id === 'saved') {
                console.log(`Deleted`)
                e.target.id = 'deleted';
                e.target.parentElement.remove();
                tripInfos.splice(tripInfos.indexOf(e.target), 1);
                localStorage.tripInfos = JSON.stringify(tripInfos);
                // REPLACE NO TRIP MSG IF ZERO TRIPS LEFT OVER
                noTripMessage()
            }
        })
    })
}

/* ::: remove "adventure awaits" msg ::: */

const noTripMessage = () => {
    // IF trips saved THEN remove "adventure awaits" msg
    let beforeTrip = document.querySelector('#beforeTrip');
    let trip = document.querySelector('.saveCard');
    if(trip != null) {
        beforeTrip.style.display = 'none';
    }else{
        beforeTrip.style.display = ''
    }
}