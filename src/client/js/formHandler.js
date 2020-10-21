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


// ::: form Handler Func :::
const formHandler = async(e) => {
    e.preventDefault();
    const departDate = document.querySelector('#departDate').value;
    const arriveDate = document.querySelector('#arriveDate').value;
    const departInput = document.querySelector('#departInput').value;
    const arriveInput = document.querySelector('#arriveInput').value;

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
            dateA: arriveDate
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
    // save(e, tripInfo);
    // storage(tripInfo);
    // updateUI(tripInfo);
}

const storage = (trip) => {
    let trips;
    if(localStorage.getItem('trips') === null) {
        trips = [];
    // } else if (save()) {
    //     trips.push(trip);
    } else {
        trips = JSON.parse(localStorage.getItem('trips'));
        
    }
    // trips.push(trip);
    localStorage.setItem('trips', JSON.stringify(trips));
    
    // addSave(trip);
    // console.log(trip.arrival)
};

storage()


// GO BACK AND GET FOREACH LOCAL STORAGE!!!!!!!!!!!!!!!!!!!!!!!!!!!!!
// TO MAKE SURE ALL OLD INFO IS SHOWN AFTER LOAD AND REFRESH @ WINDOW OPENING

// const tripInfos = JSON.parse(localStorage.getItem('tripInfos'));
// console.log(tripInfos[0])


// const updateUI = (tripInfo) => {
//     console.log(tripInfo.departure.day)
// }

const save = async() => {
    document.querySelector('#save').addEventListener('click', async() => {
        console.log('CLICK')
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
            // storage(allData);
            // addSave(allData);
        } catch (error) {
            console.log('error', error);
        }
        // storage(trip);
    })
    
}
save()

const addSave = (allData) => {
    let savedTrips = document.querySelector('#savedTrips');
    let div = document.createElement('div');
    savedTrips.appendChild(div)
    div.innerHTML = `${allData.arrival.at}`  
}


// const tripInfos = JSON.parse(localStorage.getItem('tripInfos'));
// console.log(tripInfos[0])

// tripInfos.forEach((tripInfo) => {
//     console.log(tripInfo)
// })