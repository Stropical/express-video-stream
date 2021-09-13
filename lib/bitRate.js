const TRACKING_FRAMES = 100;

class BitRateManager {
    constructor(config, trackFrames) {
        this.config = config;
        this.clients = [];
        this.trackingFrames = trackFrames || TRACKING_FRAMES;
    }

    createClient(ip) {
        if(!ip)  { throw new Error("IP cannot be empty") }
        this.clients.push({
            ip: ip,
            tracking: []
        })

        return this.clients.length - 1;
        //TODO: return client id
    }

    //CID is also known as Client ID
    clientTrackFrame(cid) {
        if(!cid && cid != 0)  { throw new Error("Client ID cannot be empty") }
        if(!this.clients[cid])  { throw new Error("Client ID cannot be found") }

        if( this.clients[cid].tracking.length >= this.trackingFrames) {   //There are already 10 tracking frames, add the new one and take off the last one
            this.clients[cid].tracking.push({"time": Date.now()})
            this.clients[cid].tracking.shift()
        } else if (this.clients[cid].tracking.length > 0) { // There are some frames but not 10
            this.clients[cid].tracking.push({"time": Date.now()})
        } else {
            this.clients[cid].tracking.push({"time": Date.now()}) // There are no frames
        }   
    }

    findClientData(ip) {
        if(!ip)  { throw new Error("IP cannot be empty") }
        var found = false,
            cid;

        if (this.clients.length > 0) {
            this.clients.forEach((element, index) => {
                if (element.ip == ip) {
                    found = true;
                    cid = index;
                }
            })
        } //TODO: Write case for empty client array

        if (! found) {
            return false
        } else {
            return cid;
        }
    }


    getBitRate(cid) {
        if(!cid && cid != 0)  { throw new Error("Client ID cannot be empty") }
        if(!this.clients[cid])  { throw new Error("Client ID cannot be found")  }

        //Get total frames
        var trackingPoints = this.clients[cid].tracking;

        if(trackingPoints.length < 2) {
            return 0;
        }

        var totalFrames = trackingPoints.length;

        //TODO: Check if frames = 0 or 1 and apply math accordingly

        //Get total time over 10 tracking points
        var start = this.clients[cid].tracking[0].time;
        var end = this.clients[cid].tracking[trackingPoints.length - 1].time;
        var totalTime = end - start;
        if(totalTime < 1) { totalTime = 1; }

        //Average them
        var currentBitRate = (totalFrames * this.config.streamChunkSize) / (totalTime / 1000) //TODO: divide by 0 error
        //TODO: Make sure currentbitRate is a number
        console.log("Bitrate: " + currentBitRate.toFixed(2) + " bytes per second") 
        return currentBitRate;
    }

    allowClient(cid) {
        if(this.getBitRate(cid) > this.config.bitRate) {
            return false;
        } else {
            return true;
        }
    }

}

module.exports = {
    BitRateManager
}