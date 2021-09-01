const express = require('express')
const fs = require('fs')
const evs = require('../index') // Express Video Stream

evs.setConfig({  //Initialize stream backend with config
    "files": [
        {
            "id": "test",
            "path": "C:/Users/ethan/Videos/Geometry Dash/Geometry Dash 2021.08.03 - 15.46.53.02.DVR.mp4"
        },
        {
            "id": "test2",
            "path": "C:/Users/ethan/Videos/Geometry Dash/Geometry Dash 2021.07.06 - 13.25.11.02.DVR.mp4"
        },
        {
            "id": "test3",
            "path": "C:/Users/ethan/Videos/Geometry Dash/Geometry Dash 2021.07.05 - 15.54.31.09.DVR.mp4"
        }
    ]
})

evs.updateFileSizes();  // Gets the size of each file once config is set

var app = express();
app.use(evs.middleware) //Use streaming middleware

app.get('/', (req, res) => {
    var page = fs.readFileSync('C:/Users/ethan/Documents/GitHub/express-video-stream/test/index.html') // Load html into buffer
    res.send(page + ' ');
})

app.listen(8080, () => {
    console.log("Test is up and running on localhost:8080")
})
