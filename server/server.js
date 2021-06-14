const cors = require('cors');
const express = require('express');
const path = require('path');
const bodyParser = require('body-parser');
const session = require('express-session');
const app = express();

app.use(cors());
// Allow client to access cross domain or ip-address206.189.152.244
app.use(function (req, res, next) {
    res.setHeader('Access-Control-Allow-Origin', '*');
    //res.setHeader('Access-Control-Allow-Origin', 'http://localhost:4200');
    //res.setHeader('Access-Control-Allow-Origin', 'http://localhost:8080');
    res.setHeader('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE');
    res.setHeader('Access-Control-Allow-Headers', 'Origin, X-Requested-With, Content-Type, Accept');
    // res.setHeader('Access-Control-Allow-Headers', '*');
    res.setHeader('Access-Control-Allow-Credentials', true);
    next();
  });

app.use(express.static(path.join(__dirname, './uploaded')));
// app.use(express.static(path.join(__dirname, './../dist')));

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({extended: false}));
app.use('/api/v1', require('./api.js'));

// app.get('/libs', require('lib/jquery.Thailand.db'));
// app.use(express.static(path.join(__dirname, 'lib/jquery.Thailand.db.json')));


app.get('*', function(req, res){
    //
});
// app.get('/libs', function(req, res){
//     //
//     console.log('55555');
// });

const server = app.listen(8888, function(){
    const host = server.address().address;
    const port = server.address().port;

    // console.log('Running ... http://localhost%s', host, port);
    console.log('Running ... http://localhost%s', host, port);
});
