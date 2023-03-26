var isProd = process.env.NODE_ENV === 'production';
if (!isProd) {
    console.log("loading .env")
    require('dotenv').config();
} else {
    console.log("PRODUCTION MODE")
}

const express = require('express'),
      path = require('path'),
      cors = require('cors'),
      routes = require('./routes');


const publicPath = isProd ? path.join(__dirname, 'public'):  path.join(__dirname, '..', 'client', 'dist', 'ang-personal-website');

var app = express();
app.use(cors());
app.use(express.static(publicPath));

app.use(routes)

var server = app.listen( process.env.PORT || 8080, function(){
    console.log('Listening on port ' + server.address().port);
});

