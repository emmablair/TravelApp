// empty object for API endpoint
const projectData = {}

// .env file to hide API keys
const dotenv = require('dotenv');
dotenv.config();

const express = require('express');
const cors = require('cors');
const bodyParser = require('body-parser')
const path = require('path');
const fetch = require('node-fetch');

const app = express();

// use json
app.use(bodyParser.json());
// use urlencoded values
app.use(bodyParser.ureEncoded({
    extended: true
}));
app.use(cors());

app.use(express.static('src/client')); //CHANGE to DIST once webpack is added!!

app.get('/', (req, res) => {
    // CHANGE TO res.sendFile('dist/index.html') when webpack is added
    res.sendFile(path.resolve('src/client/views/index.html'))
});

app.listen(8081, () => {
    console.log('Hello! Travel App is listening from port 8081!');
});