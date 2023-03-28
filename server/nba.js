const _nba = require('nba-api-client');
const fs = require('fs');
const path = require('path');
const { allPlayersList } = require('nba-api-client');
const DatabaseClient = require('./DatabaseClient');

class Nba {
    constructor () {
    }

    async getAllPlayers() {
        const db2 = new DatabaseClient();
        let results;
        try {
            await db2.connect();
            results = await db2.query('SELECT * FROM nbaplayers');
        } catch (error) {
            throw error;
        } finally {
            db2.disconnect();
        }
        return results

    }

    // async function that takes a player id, and returns the rest data for that player
    // fetching it from the database. If no player id is given, then return all data from
    // the database
    async getPlayerRestData(season, playerId) {
        if (!season) {
            season = "2022-23"
        }
        let results;
        const db2 = new DatabaseClient();
        try {
            await db2.connect();
            let query = "";
            
            if (!playerId) {
                query = 'SELECT * FROM restdaystats WHERE season = $1';
                results = await db2.query(query, [season]);
            } else {
                query = 'SELECT * FROM restdaystats WHERE player_id = $1 AND season = $2';
                results = await db2.query(query, [playerId, season]);
            }
        } catch (error) {
            throw error;
        } finally {
            db2.disconnect();
        }
        return results;
    }

    async NBA_SERVICE_allPlayerIds(season) {
        if (!season) {
            season = "2022-23"
        }
        let players = []
        let d =  await _nba.allPlayersList({IsOnlyCurrentSeason: "1", Season: season})
        for (const [key, value] of Object.entries(d.CommonAllPlayers)) {
            players.push(value)
        }
        return {players: players}
    }

    async NBA_SERVICE_getPlayerRestData(playerId, season) {
        if (!season) {
            season = "2022-23"
        }
        let data;
        
        console.log('fetching playerid' + playerId )
        try {
            data = await _nba.playerSplits({PlayerID: playerId, Season: season})
        } catch(e) {
         console.log('error fetching playerid' + playerId)
        }
        return data
    }
}

module.exports = Nba;