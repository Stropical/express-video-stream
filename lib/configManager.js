const fs = require('fs')
const DEFAULT_BITRATE = 1024 * 1024 * 100;
const DEFAULT_CHUNKSIZE = 1024 * 1024;

class ConfigManager {
    constructor(_bitRate, _streamChunkSize) {
        this.bitRate = _bitRate || DEFAULT_BITRATE
        this.streamChunkSize = _streamChunkSize || DEFAULT_CHUNKSIZE
        this.files = [];
    }

    setConfig(config) {
        if(!config)  { throw new Error("No config provided") }
        if(config.files) { this.files = config.files }
        if(config.bitRate) { this.bitRate = config.bitRate }
    }

    addVideo(id, path) {
        if(!id || !path)  { throw new Error("ID or path cannot be empty") }
        if(!fs.existsSync(path)) { throw new Error("No file at the specified path") }
        if (this.files) { // Check if config.files exists
            this.files.push({id: id, path: path})
        } else {
            this.files = []; // If config is empty create empty array and push
            this.files.push({id: id, path: path})
        }
    }

    updateFileSizes() { // Searches for each file path and gets the size and saves it in object
        if(this.files.length == 0) { return; }
        this.files.forEach((file, index) => {
        try { // Just to make sure file not found is caught
                var size = fs.statSync(file.path).size;
                this.files[index].size = size;
            } catch {
                console.error("[STREAM] NO FILE FOUND AT: " + file.path)
            }}
    )}
}

module.exports = {
    ConfigManager
}