#### Usage
Import the module
```javascript
const evs = require('express-video-stream') // Express Video Stream
```
Set the config. The config needs to have a files object thats an array. The array should contain objects with an id and a path. ID can be string or number, and path should be a string.
```javascript
evs.setConfig({  //Initialize stream backend with config
    "files": [
        {
            "id": "test",
            "path": "5.46.53.02.DVR.mp4"
        }
    ]
})
```

Once that is set you need to call the updateFileSize function. This reads all the paths and presets the sizes in the config variable.
```javascript
evs.updateFileSizes();  // Gets the size of each file once config is set
```
You can then use the middleware provided to finish integration.
```javascript
app.use(evs.middleware) //Use streaming middleware
```

In your webpage's html file, theres one last step. To conect the api use a video and source tag like shown. Test3 here can be replaced with whatever ID you want to use
```html
<video id="videoPlayer" width="600" controls muted="muted" autoplay>
      <source src="/vidChunk?id=test3" type="video/mp4" />
    </video>
```
#### Reference
Express video stream has two api paths
* GET /getids || Returns an array of all the ids provided in config
* GET /vidChunk?id=<ID> || Returns a video chunk from range specified in header (should only be used from a <video> tag)