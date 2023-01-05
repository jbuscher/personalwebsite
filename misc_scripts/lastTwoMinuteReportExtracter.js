const axios = require('axios');
var HTMLParser = require('node-html-parser');
const fs = require('fs');
var path = require('path');




const data2021 = JSON.parse(fs.readFileSync(path.join(__dirname, 'assets', '2021-22.json')));

console.log(data2021.length)

fetchAndPopulateNbaData(0)

function done() {
    fs.writeFile(path.join(__dirname, 'output', 'blah.json'), JSON.stringify(data2021), err =>{});
}


function fetchAndPopulateNbaData(i) {
    if (i == data2021.length) {
        done();
        return;
    }
    let d = data2021[i];
    if (d.gameId) {
        axios
        .get(`https://official.nba.com/l2m/json/${d.gameId}.json`)
        .then(res => {
            if (res.data.game) {
                d.nbaData = res.data;
            } else {
                console.log('error' + d.gameId)
            }

        })
        .catch(error => {
            console.error(error);
        }).then(()=> {
            fetchAndPopulateNbaData(i+1)
        });
    }
}



// used to generate 2021-22.json from the 2021-22ltm.html file.
function htmlParser(htmlContent) {
    let output = [];
    const root = HTMLParser.parse(htmlContent);
    relevantTags = root.querySelector(".entry-content");
    let seasonYear = "";
    let seasonType = ""
    relevantTags.childNodes.forEach((tag, i) => {
        if (tag.rawTagName === "h2") {
            let split = tag.childNodes[0].childNodes[0]._rawText.split(' ');
            seasonYear = split[0];
            seasonType = split.slice(1).join(' ');
        }

        if (tag.rawTagName === "p") {
            tag.childNodes.forEach((maybeA) => {
                if(maybeA.rawTagName === 'a') {
                    let attr = maybeA.rawAttrs;
                    if (attr.endsWith("%0d\"")) {
                        attr = attr.substring(0, attr.length - 4)
                        attr += "\""
                    }
                    let gameId = attr.substring(attr.length - 11, attr.length-1)
                    if (attr.includes('gameId'))
                        output.push({ gameId:gameId, seasonYear:seasonYear, seasonType:seasonType });
                }
            });
        }
    });
    return output;
}