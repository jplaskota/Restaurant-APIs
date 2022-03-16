const express = require('express')
const app = express() 
app.get('/add', function (req, res) { 
    const param1 = +req.query.param1
    const param2 = +req.query.param2
    res.send('witam')
})
app.listen(3000)