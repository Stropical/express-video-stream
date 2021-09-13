const path = require('path');
const fs = require('fs');

module.exports = function(config, req, res, next, allow) {
    const range = req.headers.range; // Get range of data needed\
        if (! req.query.id || ! range) {
            res.status(400).send("No video ID specified or no range headers")
            next();
        } else { // Make sure ID is specified
            if(!allow) {
                res.set('Retry-After', '1')
                res.status(429).end();
                next();
            } else {
                var found = false;
                config.files.forEach((entry) => {
                    if (entry.id == req.query.id && entry.size) { // ID has been found and size is defined
                        found = true;

                        const start = Number(range.replace(/\D/g, ""));
                        const end = Math.min(start + config.streamChunkSize, entry.size - 1);

                        const contentLength = end - start + 1; // Create headers
                        const headers = {
                            "Content-Range": `bytes ${start}-${end}/${
                                entry.size
                            }`,
                            "Accept-Ranges": "bytes",
                            "Content-Length": contentLength,
                            "Content-Type": "video/mp4"
                        };

                        res.writeHead(206, headers); // Write headers then pipe video data to response
                        var vs = fs.createReadStream(path.resolve(entry.path), {start, end})
                        vs.pipe(res);

                        next();
                    }
                })

                if(!found) {
                    res.status(404).send("No video found")
                    next();
                } 
            }
            next();
        }
}