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
        console.log('::: ERROR TRIPINFO | client side :::', error);
    });
    console.log(tripInfo);
    console.log(tripInfo.arrival.at);
    console.log('::: SUCCESSFUL POST | Completed tripInfo :::')
    // const saved = document.querySelector('#save').value;
    save(tripInfo);
    
    storage(tripInfo)
    // storage(tripInfo);
    updateUI(tripInfo);
}

const save = (tripInfo) => {
    document.querySelector('#save').addEventListener('click', (tripInfo) => {
        let savedTrips = document.querySelector('#savedTrips');
        let div = document.createElement('div');
        savedTrips.appendChild(div)
        div.innerHTML = `${tripInfo.arrival.at}`
    })
}


const storage = (tripInfo) => {
    let tripInfos;
    if(localStorage.getItem('tripInfos') === null) {
        tripInfos = [];
    } else {
        tripInfos = JSON.parse(localStorage.getItem('tripInfos'));
    }
    tripInfos.push(tripInfo);
    localStorage.setItem('tripInfos', JSON.stringify(tripInfos));
}

// const save = (e, tripInfo) => {
//     e.preventDefault();
//     storage(tripInfo);
    
//     // if(saved.click()) {
//     //     console.log(tripInfos[i])
//     // } else if(deleted.click()) {
//     //     removeItem(tripInfo[i])
//     // }
// }

// save(e, tripInfo);

const tripInfos = JSON.parse(localStorage.getItem('tripInfos'));
console.log(tripInfos[0])




// for(let i=0; i<5; i++) {
//     console.log(tripInfos[i])
//     if([i]>5) {
//         alert('You're only )
//     }
// }

// for(let i=0; i<5; i++)
//     tripInfos.push(tripInfo[i]);

// tripInfos.forEach((tripInfo) => {
//     console.log(tripInfo)
// })


const updateUI = (tripInfo) => {
    console.log(tripInfo.departure.day)
}