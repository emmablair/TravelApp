/* TOOLTIP for date section */
$(function () {
    $('[data-toggle="tooltip"]').tooltip()
  })

let departDate = document.querySelector('#departDate').value;
let arriveDate = document.querySelector('#arriveDate').value;

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
document.querySelector('#arriveDate').value = currentDate; //.valueAsDate without timezone also works

/* ::: date diffence for weather Forcast ::: */
const dateDifference = (date1, date2) => {
    dt1 = new Date(date1);
    dt2 = new Date(date2);
    return Math.floor((Date.UTC(dt2.getFullYear(), dt2.getMonth(), dt2.getDate()) - Date.UTC(dt1.getFullYear(), dt1.getMonth(), dt1.getDate()) ) /(1000 * 60 * 60 * 24));
}



// ::: form Handler Func :::
const formHandler = async(e) => {
    e.preventDefault();

    const departDate = document.querySelector('#departDate').value;
    const arriveDate = document.querySelector('#arriveDate').value;
    console.log(departDate)
    console.log(arriveDate)
    const dForcast = dateDifference(currentDate, departDate);
    const aForcast = dateDifference(currentDate, arriveDate);
    console.log(dForcast)
    console.log(aForcast)
    const departInput = document.querySelector('#departInput').value;
    const arriveInput = document.querySelector('#arriveInput').value;

    /* :::IF statment to check if form fields are blank::: */
    if(departInput === '' || arriveInput === '' || departDate === '' || arriveDate === '') {
        alert('Please enter valid locations and dates.')
    }else{
        /* if form fields aren't blank than give modal the data-target ID
        so that the model drops down after submit (BUT not if fields are empty) */
        // const modalArea = document.querySelector('#modalArea');
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
                dateA: arriveDate,
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

// const tripUI = (tripInfo) => {
//     const show = document.querySelector('#show');
//     const target = document.querySelector('.data-target');
//     modalArea.style.display = 'inline-block';
//     show.classList.toggle('data-target')


//     let title = document.querySelector('.modal-title');
//     let pic = document.querySelector('#arrivePic');
//     title.innerHTML = `${tripInfo.departure.from} to ${tripInfo.arrival.at}`
//     pic.setAttribute('src', `${tripInfo.arrival.pixabay}`)
//     pic.setAttribute('alt', `Picture of ${tripInfo.arrival.at}.`)
// }

// const modalArea = document.querySelector('.modalArea');
// // const closeModal = document.querySelector('.closeModal');
// const hide = document.querySelector('.hide');
// hide.addEventListener('click', () => {
//     modalArea.style.display = 'none';
//     show.classList.add('data-target')
// })

// const modalArea = document.querySelector('.modalArea');
// // const closeModal = document.querySelector('.closeModal');
// const hide = document.querySelector('.hide');
// hide.addEventListener('click', () => {
//     // hide modal from display
//     modalArea.style.display = 'none';
//     // show.classList.add('data-target')
// })

const tripUI = (tripInfo) => {
    let title = document.querySelector('.modal-title');
    let pic = document.querySelector('#arrivePic');
    title.innerHTML = `${tripInfo.departure.from} <i class="fas fa-plane"></i> ${tripInfo.arrival.at}`
    pic.setAttribute('src', `${tripInfo.arrival.pixabay}`)
    pic.setAttribute('alt', `Picture of ${tripInfo.arrival.at}.`)
}

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
            // addSave(allData);
            store(allData)
            return allData;
        } catch (error) {
            console.log('error', error);
        }
    })  
};
save()

const updateSavedTrip = (divs) => {
    /* UpdateUI of saved trips with local storage data */
    const trips = JSON.parse(localStorage.getItem('tripInfos'));
    trips.forEach( () => {
        for (let i = 0; i < trips.length; i++){
        // divs.innerHTML = `
        // <div class="saveCard">
        //   <img class="saveImg" src="${trips[i].arrival.pixabay}" alt="Picture of ${trips[i].arrival.at}, ${trips[i].arrival.specify}">
        //   <details class="savePlace">
        //     <summary class="saveTitle">${trips[i].arrival.at}, ${trips[i].arrival.specify}</summary>
        //     <p class="saveDate"><strong>Departing:</strong> ${trips[i].departure.day}</p>
        //   </details>
        // </div>`
        divs.innerHTML = `
        <div class="saveCard">
          
          <div class="savePlace">
            <div class="saveTitle">
            <img class="saveImg" src="${trips[i].arrival.pixabay}" alt="Picture of ${trips[i].arrival.at}, ${trips[i].arrival.specify}">
            </div>
          </div>
        </div>`
        } 
    })  
}

const addSave = (tripInfos) => {
    let savedTrip = document.querySelector('#savedTrips');
    let divs = document.createElement('div');
    let buttons = document.createElement('button')
    savedTrip.appendChild(divs)
    divs.classList.add('trip')
    // divs.classList.add('card-deck')
    const saves = document.querySelector('.trip');
    updateSavedTrip(divs);
    /* creates NEW button each save */
    // divs.appendChild(buttons)
    divs.lastChild.appendChild(buttons);
    buttons.classList.add('delete')
    // buttons.classList.add('card-footer')
    buttons.classList.add('btn')
    buttons.id = 'saved'
    buttons.innerHTML = 'Cancel Trip'
    deleteTrip(tripInfos, buttons)
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
            }
        })
    })
}