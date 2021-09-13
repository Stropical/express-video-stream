const br = require('../../lib/bitRate');
const cfg = require('../../lib/configManager');
var ConfigManager = new cfg.ConfigManager(100, 10000);
var BitRateManager = new br.BitRateManager(ConfigManager);

//
test('Constructor has config bitrate value', () => {
    expect(BitRateManager.config.bitRate).toBe(100)    // Default defined bitrate
})

test('Constructor has config chunk size value', () => {
    expect(BitRateManager.config.streamChunkSize).toBe(10000)    // Default defined bitrate
})

test('Constructor has default tracking frames value', () => {
    expect(BitRateManager.trackingFrames).toBe(100)    // Default defined bitrate
})

test('Constructor returns class object', () => {
    expect(typeof BitRateManager).toBe("object")    // Default defined bitrate
})

//Test Specific tracking frames
var BitRateManager2 = new br.BitRateManager(ConfigManager, 10);

test('Constructor has specified tracking frames value', () => {
    expect(BitRateManager2.trackingFrames).toBe(10)    // Default defined bitrate
})

//Create Client Function
test('Create client instance and test client ID return', () => {
    var cid = BitRateManager.createClient("127.0.0.1");
    expect(typeof cid).toBe("number")
    expect(JSON.stringify(BitRateManager.clients[cid])).toBe(JSON.stringify({
        ip: "127.0.0.1",
        tracking: []
    }))    // Default defined bitrate
})

test('Create client instance with bad params', () => {
    expect(() => {
        BitRateManager.createClient();
    }).toThrow("IP cannot be empty")    // Default defined bitrate
})

//Client Track Frame Function
test('Test tracking frame exists and is a number', () => {
    BitRateManager.clients = []
    BitRateManager.createClient("127.0.0.1");
    BitRateManager.clientTrackFrame(0);
    expect(typeof BitRateManager.clients[0].tracking[0].time).toBe("number")
})

test('Test tracking frame stays at limit', () => {
    BitRateManager.clients = []
    BitRateManager.createClient("127.0.0.1");
    BitRateManager2.createClient("127.0.0.1");

    for(var i = 0; i < 12; i++) { BitRateManager.clientTrackFrame(0); }
    for(var j = 0; j < 12; j++) { BitRateManager2.clientTrackFrame(0); }

    expect(BitRateManager.clients[0].tracking.length).toBe(12)
    expect(BitRateManager2.clients[0].tracking.length).toBe(10)
})

test('Test tracking frames shift properly', () => {
    BitRateManager2.clients = []
    BitRateManager2.createClient("127.0.0.1");
    for(var i = 0; i < 10; i++) { BitRateManager2.clients[0].tracking.push({time: i}) }

    BitRateManager2.clientTrackFrame(0);
    BitRateManager2.clientTrackFrame(0);
    BitRateManager2.clientTrackFrame(0);

    expect(BitRateManager2.clients[0].tracking[0].time).toBe(3)
})

test('Test frame creation with bad params', () => {
    expect(() => {
        BitRateManager.clientTrackFrame();
    }).toThrow("Client ID cannot be empty")    // Default defined bitrate
})

//Find Client Data Function
test('Test find client is acutally found', () => {
    BitRateManager.clients = []
    BitRateManager.createClient("127.0.0.1");
    BitRateManager.createClient("127.0.0.2");
    BitRateManager.createClient("127.0.0.3");
    expect(BitRateManager.findClientData("127.0.0.1")).toBe(0)
    expect(BitRateManager.findClientData("127.0.0.2")).toBe(1)
    expect(BitRateManager.findClientData("127.0.0.3")).toBe(2)
})

test('Test if client isnt found', () => {
    BitRateManager.clients = []
    expect(BitRateManager.findClientData("127.0.0.1")).toBe(false)
});

test('Test find client with bad params', () => {
    expect(() => {
        BitRateManager.clientTrackFrame();
    }).toThrow("Client ID cannot be empty")    // Default defined bitrate
})

//Get bitrate function
test('Test if no tracking frames', () => {
    BitRateManager.clients = []
    BitRateManager.createClient("127.0.0.1");

    expect(BitRateManager.getBitRate(0)).toBe(0)
})

test('Test if 1 tracking frame', () => {
    BitRateManager.clients = []
    BitRateManager.createClient("127.0.0.1");
    BitRateManager.clientTrackFrame(0);

    expect(BitRateManager.getBitRate(0)).toBe(0)
})

test('Test get bitrate function with bad / empty params', () => {
    expect(() => {
        BitRateManager.getBitRate();
    }).toThrow("Client ID cannot be empty")    // Default defined bitrate

    expect(() => {
        BitRateManager.getBitRate(35246);
    }).toThrow("Client ID cannot be found")    // Default defined bitrate
})

test('Test bitrate math (ex 1)', () => {
    BitRateManager.config.streamChunkSize = 500;
    BitRateManager.clients = []
    BitRateManager.createClient("127.0.0.1");

    // 1 Second time difference, 2 frames, bitrate should be 1000 bytes per second
    BitRateManager.clients[0].tracking[0] = {time: 0}
    BitRateManager.clients[0].tracking[1] = {time: 1000}
    expect(BitRateManager.getBitRate(0)).toBe(1000)
})

test('Test bitrate math (ex 2)', () => {
    BitRateManager.config.streamChunkSize = 500;
    BitRateManager.clients = []
    BitRateManager.createClient("127.0.0.1");

    // 1 Second time difference, 5 frames, bitrate should be 2500 bytes per second
    BitRateManager.clients[0].tracking[0] = {time: 0}
    BitRateManager.clients[0].tracking[1] = {time: 256}
    BitRateManager.clients[0].tracking[2] = {time: 367}
    BitRateManager.clients[0].tracking[3] = {time: 745}
    BitRateManager.clients[0].tracking[4] = {time: 1000}
    expect(BitRateManager.getBitRate(0)).toBe(2500)
})

test('Test bitrate divide by 0 err', () => {
    BitRateManager.config.streamChunkSize = 500;
    BitRateManager.clients = []
    BitRateManager.createClient("127.0.0.1");

    // Should return a massive number, cannot divide by 0 so defaults to 1
    BitRateManager.clients[0].tracking[0] = {time: 500}
    BitRateManager.clients[0].tracking[1] = {time: 500}
    expect(BitRateManager.getBitRate(0)).toBe(1000000)
})