// ::: form Handler Func :::
const formHandler = async(e) => {
    e.preventDefault();
    const departDate = document.querySelector('#departDate').value;
    const arriveDate = document.querySelector('#arriveDate').value
    const departInput = document.querySelector('#departInput').value;
    const arriveInput = document.querySelector('#arriveInput').value;

    console.log('::: FORM SUBMITTED | GEONAMES :::')
    // ::: GEONAMES DEPART :::
    const departGeo = await fetch('/trip',  {
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
        console.log('GEONAMES promise error', error);
    });
    console.log(departGeo);
    console.log('done')
}