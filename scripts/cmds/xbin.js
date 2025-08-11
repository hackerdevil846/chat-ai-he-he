const fs = require('fs');
const path = require('path');
const axios = require('axios');

module.exports.config = {
  name: "xbin",
  version: "2.0.0",
  hasPermission: 2,
  credits: "𝑨𝒔𝒊𝒇 𝑴𝒂𝒉𝒎𝒖𝒅",
  description: "Upload command files to pastebin service",
  category: "system",
  usages: "[filename]",
  cooldowns: 5,
  dependencies: { "axios": "" }
};

module.exports.onStart = async function() {
  // Empty initialization function to prevent framework errors
};

module.exports.run = async function({ api, event, args }) {
  try {
    // Validate input
    if (!args[0]) {
      return api.sendMessage(
        "📁 Please specify a filename.\nUsage: bin <filename>",
        event.threadID,
        event.messageID
      );
    }

    const fileName = args[0].replace(/\.js$/i, "");
    const commandsPath = path.join(__dirname, '..', 'commands');
    const possiblePaths = [
      path.join(commandsPath, `${fileName}.js`),
      path.join(commandsPath, fileName)
    ];

    // Find existing file
    let filePath = null;
    for (const p of possiblePaths) {
      if (fs.existsSync(p)) {
        filePath = p;
        break;
      }
    }

    if (!filePath) {
      return api.sendMessage(
        `❌ File "${fileName}" not found in commands folder.`,
        event.threadID,
        event.messageID
      );
    }

    // Read file content
    const fileContent = await fs.promises.readFile(filePath, 'utf8');
    if (!fileContent.trim()) {
      return api.sendMessage(
        `⚠️ File "${path.basename(filePath)}" is empty.`,
        event.threadID,
        event.messageID
      );
    }

    // Send progress message
    const progressMsg = await api.sendMessage(
      "📤 Uploading file to PasteBin, please wait...",
      event.threadID
    );

    // Upload to pastebin
    const pastebinAPI = "https://pastebin-api.vercel.app";
    const response = await axios.post(
      `${pastebinAPI}/paste`,
      { text: fileContent },
      { timeout: 15000 }
    );

    if (!response.data?.id) {
      throw new Error('Invalid PasteBin API response: Missing paste ID');
    }

    const rawUrl = `${pastebinAPI}/raw/${response.data.id}`;
    const successMessage = `✅ File uploaded successfully!\n\n📝 Filename: ${path.basename(filePath)}\n🔗 Raw URL: ${rawUrl}`;

    // Delete progress message
    await api.unsendMessage(progressMsg.messageID);

    // Send success message
    return api.sendMessage(successMessage, event.threadID);

  } catch (error) {
    console.error('Bin Command Error:', error);

    let errorMessage;
    if (error.code === 'ECONNABORTED') {
      errorMessage = '⚠️ Upload timed out. Please try again later.';
    } else if (error.response) {
      errorMessage = '❌ PasteBin API is currently unavailable. Try again later.';
    } else if (error.message.includes('ENOENT')) {
      errorMessage = '❌ File not found. Please check the filename.';
    } else {
      errorMessage = '❌ An error occurred while processing your request.';
    }

    return api.sendMessage(errorMessage, event.threadID, event.messageID);
  }
};
