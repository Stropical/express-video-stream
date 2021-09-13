const getIds = require('./lib/getIDs.js')

const videoChunk = require('./lib/videoChunk.js')
const br = require('./lib/bitRate.js')
const cfg = require('./lib/configManager.js')

var config = new cfg.ConfigManager()
var BitRateManager = new br.BitRateManager(config);

//Wrapper for export
function setConfig(_config) { config.setConfig(_config) }
function addVideo(id, path) { config.addVideo(id, path) }
function getConfig() { return config }


function middleware(req, res, next) { // Check if client exists in client array
    var ip = req.headers['x-forwarded-for'] || req.socket.remoteAddress
    var cid = BitRateManager.findClientData(ip);
    var allow = true;

    if (cid == false) { // Create new client
        BitRateManager.createClient(ip);
    } else { // Found Client
        BitRateManager.clientTrackFrame(cid);
        allow = BitRateManager.allowClient(cid);
    }

    //TODO: Breakout req.path into switch and code under each into functions
    config.updateFileSizes();
    if (req.path == "/getIDs") { // Return array of all the video IDs
        getIds(config, req, res, next);
    } else if (req.path == "/vidChunk") {
        videoChunk(config, req, res, next, allow)
    } else {
        next();
    }
}


module.exports = {
    middleware,
    setConfig,
    addVideo,
    getConfig
}