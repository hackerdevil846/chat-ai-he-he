const axios = require("axios");
const fs = require("fs-extra");
const path = require("path");

module.exports.config = {
  name: "programmer",
  version: "2.3.0",
  hasPermission: 0,
  credits: "Asif",
  description: "Auto-reply with hilarious programmer memes and videos",
  category: "fun",
  usages: "programmer [on/off]",
  cooldowns: 5,
  dependencies: {
    "axios": "",
    "fs-extra": ""
  }
};

// Updated collection of programmer meme videos
const videoLinks = [
  "https://i.imgur.com/ymvcyfg.mp4",  // Classic programmer humor
];

// Programmer-themed responses
const responses = [
  "🤡 Programmer life be like 🤣",
  "💻 Coding 24/7 🥵😎",
  "🚀 When your code finally works!",
  "😴 Me debugging at 3 AM",
  "🤯 When you find that missing semicolon",
  "👨‍💻 Me: 'It works on my machine'",
  "🔥 Fix one bug, create two new ones",
  "💾 Compiling... (5 hours later)",
  "🤖 My code vs. what the client wanted",
  "🧠 Brain: Please write the code\nMe: *copies from Stack Overflow*",
  "🧪 Testing in production again?",
  "📉 My motivation after seeing a new framework",
  "💥 Me: *changes one line*\nThe whole application:"
];

// Cache directory setup
const cacheDir = path.join(__dirname, 'cache', 'programmer');
if (!fs.existsSync(cacheDir)) {
  fs.mkdirSync(cacheDir, { recursive: true });
}

// Clean up old cache files (runs automatically)
function cleanCache() {
  try {
    const files = fs.readdirSync(cacheDir);
    const now = Date.now();
    
    files.forEach(file => {
      const filePath = path.join(cacheDir, file);
      const stats = fs.statSync(filePath);
      const fileAge = now - stats.mtimeMs;
      
      if (fileAge > 3600000) { // Delete files older than 1 hour
        fs.unlinkSync(filePath);
      }
    });
  } catch (error) {
    console.error("Cache cleanup error:", error);
  }
}

// Added required onStart function
module.exports.onStart = function() {
  console.log("🤖 Programmer module initialized");
};

// Main event handler
module.exports.handleEvent = async ({ api, event, Threads }) => {
  try {
    const { threadID, body, senderID } = event;
    const content = body ? body.toLowerCase() : '';

    // Ignore if bot sent the message
    if (senderID === api.getCurrentUserID()) return;

    // Get thread data
    const threadData = await Threads.getData(threadID);
    const isEnabled = threadData.data?.programmer ?? true;

    // Check if trigger word is used
    if (content.startsWith("programmer") && isEnabled) {
      cleanCache(); // Clean cache before processing
      
      // Select random video and response
      const randomVideo = videoLinks[Math.floor(Math.random() * videoLinks.length)];
      const randomResponse = responses[Math.floor(Math.random() * responses.length)];
      
      // Create unique filename
      const videoPath = path.join(cacheDir, `programmer_${threadID}_${Date.now()}.mp4`);
      
      try {
        // Download video
        const response = await axios.get(randomVideo, {
          responseType: 'arraybuffer',
          timeout: 30000,
          headers: {
            'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/91.0.4472.124 Safari/537.36'
          }
        });
        
        // Save video
        fs.writeFileSync(videoPath, Buffer.from(response.data));
        
        // Send reply
        api.sendMessage({
          body: randomResponse,
          attachment: fs.createReadStream(videoPath)
        }, threadID, (error) => {
          if (error) console.error("Send error:", error);
          
          // Clean up after sending
          if (fs.existsSync(videoPath)) {
            fs.unlinkSync(videoPath);
          }
        });
      } catch (error) {
        console.error("Video download error:", error);
        // Fallback to text response
        api.sendMessage(randomResponse, threadID);
      }
    }
  } catch (error) {
    console.error("Programmer Command Error:", error);
  }
};

// Toggle command
module.exports.run = async ({ api, event, Threads }) => {
  try {
    const { threadID, messageID, args } = event;
    const threadData = await Threads.getData(threadID);
    let currentState = threadData.data?.programmer ?? true;
    const action = args[0] ? args[0].toLowerCase() : '';
    
    // Determine new state
    if (action === "on") {
      currentState = true;
    } else if (action === "off") {
      currentState = false;
    } else {
      // Toggle if no arguments
      currentState = !currentState;
    }
    
    // Update state
    threadData.data = { ...threadData.data, programmer: currentState };
    await Threads.setData(threadID, threadData);
    
    // Send confirmation
    const status = currentState ? "ON ✅" : "OFF ❌";
    const statusMessage = `🧠 Programmer auto-reply is now ${status}\n\n` +
      `• Use "programmer on" to enable\n` +
      `• Use "programmer off" to disable\n` +
      `• Just say "programmer" to trigger`;
    
    api.sendMessage(statusMessage, threadID, messageID);
    
  } catch (error) {
    console.error("Toggle Error:", error);
    api.sendMessage(
      "⚠️ Failed to toggle programmer feature. Please try again later.",
      event.threadID,
      event.messageID
    );
  }
};
