const _nba = require('nba-api-client');
const fs = require('fs');
const path = require('path');

const ONE_DAY = 86400000;
class Nba {
    constructor () {
        
    }

    async allPlayerIds(season) {
        if (!season) {
            season = "2022-23"
        }
         return await _nba.allPlayersList({IsOnlyCurrentSeason: "1", Season: season})
    }

    async getPlayerRestData(playerId, season) {
        if (!season) {
            season = "2022-23"
        }
        let filePath = path.join(__dirname, "nbaDataCache", "restData", season, playerId + ".json")
        let cache = null;
        try {
            cache = JSON.parse(fs.readFileSync(filePath, 'utf-8'))
        } catch(e) {
            console.log('cache miss', e)
            // no file is fine
        }

        let data;
        if (cache != null) {
            data = cache.data
            if (Date.now() - cache.updateTimestamp > ONE_DAY) {
                console.log("expired data")
            }
        }
        if (cache == null || Date.now() - cache.updateTimestamp > ONE_DAY) {
            console.log('updating cache')
            data = await _nba.playerSplits({PlayerID: playerId, Season: season})

            fs.writeFileSync(filePath, JSON.stringify({updateTimestamp: Date.now(), data: data}))
        }
        return data
    }
}

module.exports = Nba;