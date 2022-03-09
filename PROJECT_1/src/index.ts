const express = require('express')
const app = express() 
app.get('/', function (req, res) { 
    const param1 = +req.query.param1
    res.send('Hello World') 
})
app.listen(3000)