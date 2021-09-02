const express = require('express')
const fs = require('fs')
const path = require('path')
const evs = require('../../index.js') // Express Video Stream

var app = express();

evs.setConfig({  //Initialize stream backend with config
    "files": [
        {
            "id": "test1",
            "path": "./test/rsc/vids/test1.mp4"
        },
        {
            "id": "test2",
            "path": "./test/rsc/vids/test2.mp4"
        },
        {
            "id": "test3",
            "path": "./test/rsc/vids/test3.mp4"
        }
    ]
})

evs.updateFileSizes();  // Gets the size of each file once config is set

app.use(evs.middleware) //Use streaming middleware

app.get('/', (req, res) => {
    var page = fs.readFileSync(path.join(__dirname, './index.html')) // Load html into buffer
    res.send(page + ' ');
})

app.listen(8080, () => {
    console.log("Test is up and running on localhost:8080")
})