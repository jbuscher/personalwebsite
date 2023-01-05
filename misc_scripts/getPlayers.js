const axios = require('axios');
const fs = require('fs');
var path = require('path');

outputData = [];
let page = 1;
fetchPage();

function fetchPage() {
    axios.get(`https://www.balldontlie.io/api/v1/teams?page=${page}`)
    .then(processData)
    .catch(error => {
        console.error('error on page:' + page, error)
    });
}

function processData(response) {
    outputData = outputData.concat(response.data.data);
    if (response.data.meta.next_page == null) {
        writeData();
    } else {
        page = response.data.meta.next_page;
        setTimeout(fetchPage, 2000)
    }
}

function writeData() {
    fs.writeFileSync(path.join(__dirname, 'output', 'teams.json'),
            JSON.stringify(outputData),
            err => console.error('error writing data:', err))
}