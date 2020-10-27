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
}


// const storage = () => {
//     let tripInfos;
//     if(localStorage.getItem('tripInfos') === null) {
//         tripInfos = [];
//     } else {
//         tripInfos = JSON.parse(localStorage.getItem('tripInfos'));
//     }
//     // tripInfos.push(tripInfo);
//     localStorage.setItem('tripInfos', JSON.stringify(tripInfos));
//     // console.log(tripInfo.arrival)
//     const divs = document.querySelectorAll('.trip');
//     divs.innerHTML = `
//     <div class='picBox_Save'><img class='pic_Save' src='${tripInfos[0].arrival.pixabay}' alt='Picture of ${tripInfos[0].arrival.at}, ${tripInfos[0].arrival.specifyPlace}'></div>
//     <div class='arrival_Save'>${tripInfos[0].arrival.at}, ${tripInfos[0].arrival.specifyPlace}</div>
//     <button class='delete'>Delete</button>
//     `
// }
// storage();

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


// const tripInfos = JSON.parse(localStorage.getItem('tripInfos'));
// console.log(tripInfos[0])


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
    const trips = JSON.parse(localStorage.getItem('tripInfos'));
    // const saves = document.querySelectorAll('.trip');
    trips.forEach( () => {
        for (let i = 0; i < trips.length; i++){
        divs.innerHTML = `
        <div class='picBox_Save'><img class='pic_Save' src='${trips[i].arrival.pixabay}' alt='Picture of ${trips[i].arrival.at}, ${trips[i].arrival.specifyPlace}'></div>
        <div class='arrival_Save'>${trips[i].arrival.at}, ${trips[i].arrival.specifyPlace}</div>
        `} 
    }) 
    // saves.forEach( () => { 
    //     // UNIQUE ID FOR EACH SAVES TRIP
    //     for (let i = 0; i < saves.length; i++) {
    //         saves[i].classList.add(`saved_deleted${i + 1}`);
    //     }
    // })  
}

const addSave = (tripInfos) => {
    let savedTrip = document.querySelector('#savedTrips');
    let divs = document.createElement('div');
    let buttons = document.createElement('button')
    savedTrip.appendChild(divs)
    divs.classList.add('trip')
    // const saves = document.querySelector('.trip');
    // saves.classList.add('saved_deleted')
    updateSavedTrip(divs);
    /* creates NEW button each save */
    divs.appendChild(buttons)
    buttons.classList.add('delete')
    buttons.innerHTML = 'Delete'
    deleteTrip(tripInfos, buttons)
};


const deleteTrip = (tripInfos, buttons) => {
    buttons.addEventListener('click', () => {
        console.log('Deleting...')
        console.log(buttons.parentElement)
        buttons.parentElement.remove()
        // const trips = JSON.parse(localStorage.getItem('tripInfos'));
        // trips.forEach((buttons) => {
        //     console.log(tripInfos.indexOf(buttons))
        //     trips.splice(tripInfos.indexOf(buttons), 1);
        //     localStorage.tripInfos = JSON.stringify(tripInfos);
        //     // localStorage.setItem('tripInfos', JSON.stringify(tripInfos));
        // });
        
    })
}


// const deleteTrip = (tripInfos) => {
//     const saves = document.querySelectorAll('.trip');
//     saves.forEach( () => {
//         for (let i = 0; i < saves.length; 0) {
//             document.querySelector(`.delete${i + 1}`).addEventListener('click', (e) => {
//                 console.log(`Delete .delete${i + 1}`)
//                 const deleteMe = document.querySelector(`.delete${i + 1}`)
//                 console.log(deleteMe)
//                 deleteMe.parentElement.remove();
//                 tripInfos.splice([i], 1);
//                 // deletes value & resets localstoage
//                 localStorage.tripInfos = JSON.stringify(tripInfos);
//             })
//         }
//     })
// }


// const deleted = () => {
//     document.querySelector('#delete').addEventListener('click', () => {

//     })
// }