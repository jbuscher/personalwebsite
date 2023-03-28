require('dotenv').config();
const DatabaseClient = require('./DatabaseClient');
const db = new DatabaseClient();
const Nba = require('./nba');
const nba = new Nba(db);
const fs = require('fs');

const filename = __dirname + '/data.csv'
const season = "2022-23"
let id = 0;
writeHeader();


nba.getAllPlayers().then(blah).catch(e => console.log(e)).finally(()=> console.log('hello'))

async function blah(data) {
  for (let i = 0; i < data.length; i++) {
    console.log(i, data.length);
    let pid = data[i].id
    let restData = await nba.getPlayerRestData(pid, season);
    writeDataForPlayer(restData, pid);  
  }
  console.log('CSV file created successfully!');
}


function writeDataForPlayer(playerData ,playerid) {
  let csv = ""
  for (const [key, value] of Object.entries(playerData.DaysRestPlayerDashboard)) {
    if (!value) {
      continue;
    }
    let row = {};
    row.id = id;
    id++;
    row.player_id = playerid
    row.season = season;
    row.restDays = Number.parseInt(value.GROUP_VALUE)
    row.restlabel = value.GROUP_VALUE
    row.gp = value.GP
    row.wpct = value.W_PCT
    row.minutes = value.MIN
    row.fgm = value.FGM
    row.fga = value.FGA
    row.fg_pct = value.FG_PCT
    row.fg3m = value.FG3M
    row.fg3a = value.FG3A
    row.fg3_pct = value.FG3_PCT
    row.ftm = value.FTM
    row.fta = value.FTA
    row.ft_pct = value.FT_PCT
    row.oreb = value.OREB
    row.dreb = value.DREB
    row.reb = value.REB
    row.ast = value.AST
    row.tov = value.TOV
    row.stl = value.STL
    row.blk = value.BLK
    row.blka = value.BLKA
    row.pf = value.PF
    row.pfd = value.PFD
    row.pts = value.PTS
    row.plus_minus = value.PLUS_MINUS
    row.fantasy = value.FANTASY_PTS
    const rowString = Object.values(row).join(',');
    csv += rowString + '\n';
  }
  
  fs.appendFileSync(filename, csv);
}

function writeHeader() {
  const header = 'id,player_id,season,rest_days,rest_label,gp,wpct,minutes,fgm,fga,fg_pct,' + 
                  'fg3m,fg3a,fg3_pct,ftm,fta,ft_pct,oreb,dreb,reb,' +
                  'ast,tov,stl,blk,blka,pf,pfd,pts,plus_minus,fantasy\n'
  fs.writeFileSync(__dirname + '/data.csv', header);
}