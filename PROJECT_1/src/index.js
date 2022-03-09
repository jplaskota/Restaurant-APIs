var express = require('express');
var app = express();
app.get('/', function (req, res) {
    var param1 = +req.query.param1;
    res.send('Hello World');
});
app.listen(3000);
