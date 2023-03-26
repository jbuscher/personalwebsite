var path = require('path');
var router = require('express').Router();
var isProd = process.env.NODE_ENV === 'production';
var bodyParser = require('body-parser');
router.use(bodyParser.json())

const Ml = require('./ml/ml');
const ml = new Ml();
const publicPath = isProd ? path.join(__dirname, 'public'):  path.join(__dirname, '..', 'client', 'dist', 'ang-personal-website');

const DatabaseClient = require('./DatabaseClient');
const db = new DatabaseClient();
const Nba = require('./nba');
const nba = new Nba(db);

router.get('/', (req, res) => {
    res.sendFile(path.join(publicPath,'index.html'));
})
router.get('/about', (req, res) => {
    res.sendFile(path.join(publicPath,'index.html'));
})
router.get('/posts', (req, res) => {
    res.sendFile(path.join(publicPath,'index.html'));
})
router.get('/posts/*', (req, res) => {
    res.sendFile(path.join(publicPath,'index.html'));
})
router.get('/projects', (req, res) => {
    res.sendFile(path.join(publicPath,'index.html'));
})
router.get('/planets', (req, res) => {
    res.sendFile(path.join(publicPath,'index.html'));
})
router.get('/chaos', (req, res) => {
    res.sendFile(path.join(publicPath,'index.html'));
})
router.get('/ml', (req, res) => {
    res.sendFile(path.join(publicPath,'index.html'));
})

router.get('/api/hello', (req, res) => {
    console.log("hello")
    res.type('text');
    res.status(200);
    res.send({text:'Jello World!'});
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
    let season = req.query.season
    let data = await nba.allPlayerIds(season);
    res.send(data);
})
router.get('/api/test', async (req, res) => {
    res.type('json');
    let data = null;
    try {
        data = await nba.getAllPlayers();
    } catch (e) {
        console.error(e);
        res.sendStatus(500);
        return;
    }
    res.status(200);
    res.send(data);
})
router.get('/api/restData', async (req, res) => {
    res.type('json');
    res.status(200);
    let season = req.query.season
    let playerId = req.query.playerId
    let data = await nba.getPlayerRestData(playerId, season);
    res.send(data);
})

router.get('/api/allRestData', async (req, res) => {
    res.type('json');
    res.status(200);
    let season = req.query.season
    let data = nba.getAllRestDataFromCache(season);
    res.send(data);
})

router.get('/api/ml', async (req, res) => {
    res.type('blob');
    res.status(200);
    let index = Number.parseInt(req.query.index);
    index = index ? index: 0;
    let digit = Number.parseInt(req.query.digit);
    digit = digit ? digit: 0;
    data = ml.getBlobBuffer(digit, index);
    res.send(data);
})

router.post('/api/postarr', async (req, res) => {
    let a = ml.testNumber(req.body.content)
    console.log(a)
    res.type='json'
    res.send({ans:a})
})

module.exports = router;