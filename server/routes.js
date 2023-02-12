var path = require('path');
var router = require('express').Router();
var isProd = process.env.NODE_ENV === 'production';
var bodyParser = require('body-parser');
router.use(bodyParser.json())
const LocalDb = require('./localDb');
const db = new LocalDb();
const Ml = require('./ml/ml');
const ml = new Ml();
const publicPath = isProd ? path.join(__dirname, 'public'):  path.join(__dirname, '..', 'client', 'dist', 'ang-personal-website');



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

router.get('/api/hello', (req, res) => {
    console.log("hello")
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