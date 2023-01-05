var path = require('path');
var router = require('express').Router();
var isProd = process.env.NODE_ENV === 'production';
const LocalDb = require('./localDb');
const db = new LocalDb();
const publicPath = isProd ? path.join(__dirname, 'public'):  path.join(__dirname, '..', 'client', 'dist', 'ang-personal-website');


router.get('/', (req, res) => {
    res.sendFile(path.join(publicPath,'index.html'));
})

router.get('/api/hello', (req, res) => {
    res.type('text');
    res.status(200);
    res.send({text:'Jello World!'});
})

router.get('/api/lasttwo', async (req, res) => {
    res.type('json');
    res.status(200);
    let data = await db.find({})
    res.send(data);
})

router.get('/api/teams', async (req, res) => {
    let fields = req.query.fields;
    let query = {};
    let project = {};
    if (fields != null) {
        fields.split(",").forEach(field => {
            project[field] = 1;
        });
    }
    let data = await db.getTeams(query, project);
    res.type('json');
    res.status(200);
    res.send(data);
})

router.get('/api/players', async (req, res) => {
    res.type('json');
    res.status(200);
    let data = await db.find({"nbaData.game.Home_team": "Celtics"})
    res.send(data);
})

module.exports = router;