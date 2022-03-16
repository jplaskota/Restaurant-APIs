var express = require('express');
var app = express();
app.get('/add', function (req, res) {
    var param1 = +req.query.param1;
    var param2 = +req.query.param2;
    res.send('witam');
});
app.listen(3000);
