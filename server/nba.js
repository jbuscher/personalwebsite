const _nba = require('nba-api-client');
const fs = require('fs');
const path = require('path');
const { allPlayersList } = require('nba-api-client');

const ONE_DAY = 86400000;
class Nba {
    constructor () {
        
    }

    async updateAllCache() {
        
        let d = await this.allPlayerIds(null);
        let players = d.players
        for (let i = 0; i < players.length; i++) {
            try {
                await this.getPlayerRestData(players[i].id + '', null)
            } catch (e) {
                console.log("error for", i)
            }
        }
    }

    async allPlayerIds(season) {
        if (!season) {
            season = "2022-23"
        }
        let players = []
        let d =  await _nba.allPlayersList({IsOnlyCurrentSeason: "1", Season: season})
        for (const [key, value] of Object.entries(d.CommonAllPlayers)) {
            players.push({name:value.DISPLAY_FIRST_LAST, id: ''+value.PERSON_ID})
        }
        return {players: players}
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
            try {
                data = await _nba.playerSplits({PlayerID: playerId, Season: season})
            } catch(e) {
                console.log('error fetching playerid' + playerId)
            }

            fs.writeFileSync(filePath, JSON.stringify({updateTimestamp: Date.now(), data: data}))
        }
        return data
    }

    getAllRestDataFromCache(season) {
        if (!season) {
            season = "2022-23"
        }
        let data = []
        let dirPath = path.join(__dirname, "nbaDataCache", "restData", season)
        let filenames = fs.readdirSync(dirPath)
        filenames.forEach(f => {
            if (f.endsWith('json')) {
            
                let d = JSON.parse(fs.readFileSync(path.join(dirPath, f), 'utf-8')).data
                if (d){
                let player = {}
                player.id = f.split('.')[0]
                player.ptsSeason = d.OverallPlayerDashboard.PTS
                player.ptsRest = [0,0,0,0]
                player.gpRest = [0,0,0,0]
                player.ptsRest[0] = d.DaysRestPlayerDashboard["0"] ? d.DaysRestPlayerDashboard["0"].PTS : 0
                player.ptsRest[1] = d.DaysRestPlayerDashboard["1"] ? d.DaysRestPlayerDashboard["1"].PTS : 0
                player.ptsRest[2] = d.DaysRestPlayerDashboard["2"] ? d.DaysRestPlayerDashboard["2"].PTS : 0
                player.gpRest[0] = d.DaysRestPlayerDashboard["0"] ? d.DaysRestPlayerDashboard["0"].GP : 0
                player.gpRest[1] = d.DaysRestPlayerDashboard["1"] ? d.DaysRestPlayerDashboard["1"].GP : 0
                player.gpRest[2] = d.DaysRestPlayerDashboard["2"] ? d.DaysRestPlayerDashboard["2"].GP : 0
        
                let ptsTotal = 0;
                let gameTotal = 0;
                for (const [key, value] of Object.entries(d.DaysRestPlayerDashboard)) {
                if (key == "0" || key == "1" || key == "2") {
                    continue;
                }
                ptsTotal += value.PTS * value.GP
                gameTotal += value.GP
                }
                player.ptsRest[3] = gameTotal > 0 ? ptsTotal / gameTotal : 0
                player.gpRest[3] = gameTotal
                data.push(player)
            }
            }
        });
        return {restData: data}
    }
}

module.exports = Nba;