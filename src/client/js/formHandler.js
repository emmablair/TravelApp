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
            addSave(allData);
            // deleteTrip()
            return allData;
        } catch (error) {
            console.log('error', error);
        }
    })
    
};
save()

const addSave = (allData) => {
    let savedTrip = document.querySelector('#savedTrips');
    let divs = document.createElement('div');
    // let button = document.createElement('button')
    savedTrip.appendChild(divs)
    divs.classList.add('trip')
    const saves = document.querySelectorAll('.trip');
    // const save = document.querySelector('.trip');

    // divs.appendChild(button)

    divs.innerHTML = `
    <div class='picBox_Save'><img class='pic_Save' src='${allData.arrival.pixabay}' alt='Picture of ${allData.arrival.at}, ${allData.arrival.specifyPlace}'></div>
    <div class='arrival_Save'>${allData.arrival.at}, ${allData.arrival.specifyPlace}</div>
    <button class='delete'>Delete</button>
    ` 
    let buttons = document.querySelectorAll('.delete')
    saves.forEach( () =>{ 
    // UNIQUE ID FOR EACH SAVES TRIP
        for (let i = 0; i < saves.length; i++) {
            saves[i].classList.add(`saved_deleted${i + 1}`);
            // button[i].classList.add(`deleted${i + 1}`)
            // saves[i].appendChild(button).innerHTML = 'Delete'
        }
    }) 
    deleteTrip()
};

const deleteTrip = () => {
    const saves = document.querySelectorAll('.trip');
    saves.forEach( () => {
        for (let i = 0; i < saves.length; i++) {
            // buttons[i].id = (`saved_deleted${i + 1}`);
            document.querySelector(`.saved_deleted${i + 1}`).addEventListener('click', (e) => {
                console.log(`Delete saved_deleted${i + 1}`)
                const deleteMe = document.querySelector(`.saved_deleted${i + 1}`)
                console.log(deleteMe)
                deleteMe.remove();
            })
        }
    })
}


// const deleted = () => {
//     document.querySelector('#delete').addEventListener('click', () => {

//     })
// }