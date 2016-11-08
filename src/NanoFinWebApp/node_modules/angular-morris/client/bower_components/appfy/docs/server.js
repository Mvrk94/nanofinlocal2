var express = require('express');
var compression = require('compression');
var bodyParser = require('body-parser');
var app = express();
var port = process.env.PORT || 9001;

app.use(express.static(__dirname + '/client'));
app.use(compression());
app.use(bodyParser.urlencoded({
    extended: true
}));
app.use(bodyParser.json());


//handle all gets
app.get('/*', function (req, res) {
    res.sendFile(__dirname + '/client/index.html');
});

app.listen(port);
console.log('Listening on:', port);
function handleError(res, err) {
    return res.status(500).send(err);
}