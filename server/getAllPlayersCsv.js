const Nba = require('./nba');
const nba = new Nba();
const fs = require('fs');


nba.allPlayerIds("2022-23").then(blah)

function blah(data) {

    const header = [
        'id', 'playernamelastcommafirst', 'playername', 'rosterstatus',
        'fromyear', 'toyear', 'playercode', 'playerslug', 'teamid',
        'teamcity', 'teamname', 'gamesplayedflag', 'otherleague'
      ]
    
      
    const rows = data.players.map(item => [item.PERSON_ID, '"' + item.DISPLAY_LAST_COMMA_FIRST.replace('\'', "") + '"', 
                    item.DISPLAY_FIRST_LAST.replace('\'', ""),
                    !!item.ROSTERSTATUS, item.FROM_YEAR, item.TO_YEAR, item.PLAYERCODE,
                    item.PLAYER_SLUG, item.TEAM_ID, item.TEAM_CITY, item.TEAM_NAME,
                    item.GAMES_PLAYED_FLAG,item.OTHERLEAGUE_EXPERIENCE_CH]);
    
    const csv = `${header.join(',')}\n${rows.map(row => row.join(',')).join('\n')}`;
    
    fs.writeFileSync(__dirname + '/data.csv', csv);
    
    console.log('CSV file created successfully!');
}

