const express = require('express')
const fs = require('fs')
const path = require('path')
const evs = require('../middleware.js') // Express Video Stream

var app = express();

evs.setConfig(JSON.parse(fs.readFileSync('./sample/config.json'))); //Load config from file
evs.addVideo("Demo3", "./test/vids/test3.mp4")  //Add video to config

app.use(evs.middleware) //Use streaming middleware

app.get('/', (req, res) => {
    var page = fs.readFileSync(path.join(__dirname, './index.html')) // Load html into buffer
    res.send(page + ' ');
})

app.listen(8080, () => {
    console.log("Test is up and running on localhost:8080")
})

module.exports = app;