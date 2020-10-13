const formHandler = async(e) => {
    e.preventDefault();
    const userInput = document.querySelector('#userInput').value;
    console.log('::: FORM SUBMITTED | GEONAMES :::')
    // API call
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
        console.log('HANDLE SUBMIT promise error', error);
    });
    console.log(geoname.lat);
    console.log('done')
}