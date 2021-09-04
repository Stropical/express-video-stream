const fs = require('fs')
const path = require('path')

var config = {}

function setConfig(_config) {
    config = _config;
}

function setBitRate(bitRate) {
    config.bitRate = bitRate;
}

function updateFileSizes() { // Searches for each file path and gets the size and saves it in object
    config.files.forEach((file, index) => {
        try { // Just to make sure file not found is caught
                var size = fs.statSync(file.path).size;
                config.files[index].size = size;
            } catch {
                console.error("[STREAM] NO FILE FOUND AT: " + file.path)
            }}
    )
}

function addVideo(id, path) {
    if(config.files) {  //Check if config.files exists
        config.files.push({id: id, path: path})
    } else {    
        config.files = [];  //If config is empty create empty array and push
        config.files.push({id: id, path: path})
    }
}

function middleware(req, res, next) {
    if (req.path == "/getIDs") { // Return array of all the video IDs
        var result = [];
        config.files.forEach((obj) => result.push(obj.id))
        res.status(200).send(result);
        next();
    } else if (req.path == "/vidChunk") {
        const range = req.headers.range;    // Get range of data needed
        if (!req.query.id && range) {
            res.status(400).send("No video ID specified or no range headers")
            next();
        } else {    // Make sure ID is specified
            var found = false;
            config.files.forEach((entry) => {
                if (entry.id == req.query.id && entry.size) { // ID has been found and size is defined
                    found = true;
                    updateFileSizes();

                    const CHUNK_SIZE = 10 ** 6; // Parse Range
                    const start = Number(range.replace(/\D/g, ""));
                    const end = Math.min(start + CHUNK_SIZE, entry.size - 1);

                    const contentLength = end - start + 1;  //Create headers
                    const headers = {
                        "Content-Range": `bytes ${start}-${end}/${entry.size}`,
                        "Accept-Ranges": "bytes",
                        "Content-Length": contentLength,
                        "Content-Type": "video/mp4"
                    };

                    res.writeHead(206, headers);    //Write headers then pipe video data to response
                    var vs = fs.createReadStream(path.resolve(entry.path), {start, end})
                    vs.pipe(res);

                    
                    next();
                }
            })

            if (!found) {
                res.status(404).send("No video found")
                next();
            }
            updateFileSizes();
            next();
        }
    } else {
        updateFileSizes();
        next();
    }
}


module.exports = {
    middleware,
    setConfig,
    addVideo,
    setBitRate
}