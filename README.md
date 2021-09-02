# Express Video Stream
## About
Express video stream is an easy to implement package that allows you to stream videos on the server to an HTML5 video tag

## How to Install
Run this command to install in your project
```
npm install express-video-stream
```

## How to Use
The first step is importing it.
```javascript
const evs = require('express-video-stream') // Express Video Stream
```

Once you have created your express app, this package needs 3 lines to work. The first line sets the config. The config is where you set your video ID and path behind it. This is so you can ask the server for a video without needing the path to the file. The config should contain an array named files with objects that have an id and path.
```javascript
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
```
The next line is simple, it reads the file size for each of the paths and appends it to the config. This is so we don’t over-read or under-read the file.
```javascript
evs.updateFileSizes();  // Gets the size of each file once config is set
```
The last one takes the EVS object you’ve created and sets it as middleware for express.
```javascript
app.use(evs.middleware) //Use streaming middleware
```
Once your backend is set up its time to look at front end. All you need is a video tag with a source tag inside. The source’s src tag should be ‘/vidChunk?id=<put your id here>’. The server will return a 404 if the video’s ID cannot be found.
```html
<video id="videoPlayer" width="600" controls muted="muted" autoplay>
      <source src="/vidChunk?id=test3" type="video/mp4" />
    </video>
```
## Example
Server.js
```javascript
const express = require('express')
const fs = require('fs')
const path = require('path')
const evs = require('express-video-stream') // Express Video Stream
 
var app = express();
 
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
 
app.use(evs.middleware) //Use streaming middleware
 
app.get('/', (req, res) => {
    var page = fs.readFileSync(path.join(__dirname, './index.html')) // Load html into buffer
    res.send(page + ' ');
})
 
app.listen(8080, () => {
    console.log("Test is up and running on localhost:8080")
})
```

index.html
```html
<html lang="en">
  <body>
    <video id="videoPlayer" width="600" controls muted="muted" autoplay>
      <source src="/vidChunk?id=test3" type="video/mp4" />
    </video>
  </body>
</html>
```
## Reference
The express video stream middleware package currently comes with 2 api paths.
| GET /getids  | Returns an array of all ids in config |
|-------|---|
| GET /vidChunk?id=<id here> | Returns a 1 MB chunk of video, requires range header and ID |

