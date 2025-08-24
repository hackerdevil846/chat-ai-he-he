const fs = require("fs-extra");
const request = require("request");

module.exports.config = {
  name: "alert",
  version: "1.0.1",
  hasPermssion: 0,
  credits: "𝑨𝒔𝒊𝒇 𝑴𝒂𝒉𝒎𝒖𝒅",
  description: "Generate alert images with custom text",
  category: "image",
  usages: "[text]",
  cooldowns: 0,
  dependencies: {
    "fs-extra": "",
    "request": ""
  }
};

// Add empty onStart to prevent the error
module.exports.onStart = async function() {
  return;
};

module.exports.run = async function({ api, event, args }) {
  const { threadID, messageID } = event;
  
  // Combine arguments and replace commas with double spaces
  let text = args.join(" ").replace(/,/g, "  ");
  
  if (!text) {
    return api.sendMessage("Please add text for the alert (e.g., 'alert Hello World')", threadID, messageID);
  }

  const path = __dirname + `/cache/alert_${event.senderID}.png`;
  const encodedText = encodeURIComponent(text);
  const url = `https://api.popcat.xyz/alert?text=${encodedText}`;

  try {
    // Download and process the image
    request(url)
      .pipe(fs.createWriteStream(path))
      .on('close', () => {
        // Send the generated image
        api.sendMessage({
          body: "Here's your alert image:",
          attachment: fs.createReadStream(path)
        }, threadID, () => {
          // Clean up temporary file
          fs.unlinkSync(path);
        }, messageID);
      });
  } catch (error) {
    console.error("Error generating alert image:", error);
    api.sendMessage("An error occurred while generating the alert image.", threadID, messageID);
  }
};
