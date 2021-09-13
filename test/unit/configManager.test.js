const cfg = require('../../lib/configManager');

//Test constructor
var ConfigManager = new cfg.ConfigManager();

test('Constructor has default bitrate value', () => {
    expect(ConfigManager.bitRate).toBe(10485760)    // Default defined bitrate
})

test('Constructor has default chunk size value', () => {
    expect(ConfigManager.streamChunkSize).toBe(1024 * 1024)    // Default defined bitrate
})

var ConfigManager2 = new cfg.ConfigManager(1234, 100000);

test('Constructor has defined bitrate value', () => {
    expect(ConfigManager2.bitRate).toBe(1234)    // Default defined bitrate
})

test('Constructor has defined chunk size value', () => {
    expect(ConfigManager2.streamChunkSize).toBe(100000)    // Default defined bitrate
})

test('Constructor returns class object', () => {
    expect(typeof ConfigManager2).toBe("object")    // Default defined bitrate
})


//Test add video
test('Add Video with empty params error', () => {
    expect(() => {
        ConfigManager.addVideo();
    }).toThrow("ID or path cannot be empty") 
})

test('Add Video with bad path error', () => {
    expect(() => {
        ConfigManager.addVideo("bruh", "hgfjkdlsa");
    }).toThrow("No file at the specified path") 
})

test('Check if good video was added', () => {
    ConfigManager.addVideo("bruh", "./middleware.js");
    expect(JSON.stringify(ConfigManager.files[0])).toBe(JSON.stringify({id: "bruh", path: "./middleware.js"}))  
})