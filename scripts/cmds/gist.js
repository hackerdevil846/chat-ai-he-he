const fs = require('fs');
const axios = require('axios');
const path = require('path');

module.exports.config = {
  name: "gist",
  version: "7.0.0",
  hasPermission: 2,
  credits: "Asif",
  description: "Convert code into GitHub gist link",
  category: "developer",
  usages: "[filename] (reply to code message)",
  cooldowns: 5,
  dependencies: { "axios": "" }
};

module.exports.run = async function ({ api, event, args }) {
  const { threadID, messageID, messageReply } = event;
  
  try {
    // Validate input
    if (!args[0]) {
      return api.sendMessage(
        "📝 Please specify a filename.\nUsage: gist <filename> (reply to code message)\nExample: gist help",
        threadID,
        messageID
      );
    }

    const fileName = args[0].replace(/\.js$/i, '');
    let codeContent = '';

    // Handle code from message reply
    if (messageReply) {
      codeContent = messageReply.body || '';
      
      if (!codeContent.trim()) {
        return api.sendMessage(
          "❌ Replied message doesn't contain text content.",
          threadID,
          messageID
        );
      }
    } 
    // Handle code from file
    else {
      const commandsDir = path.join(__dirname, '..', 'commands');
      const filePath = path.join(commandsDir, `${fileName}.js`);
      
      if (!fs.existsSync(filePath)) {
        return api.sendMessage(
          `❌ File "${fileName}.js" not found in commands folder.`,
          threadID,
          messageID
        );
      }
      
      codeContent = await fs.promises.readFile(filePath, 'utf-8');
      
      if (!codeContent.trim()) {
        return api.sendMessage(
          `⚠️ File "${fileName}.js" is empty. Nothing to upload.`,
          threadID,
          messageID
        );
      }
    }

    // Create gist
    const gistAPI = "https://noobs-api-sable.vercel.app/gist";
    const response = await axios.get(gistAPI, {
      params: {
        filename: `${fileName}.js`,
        code: codeContent,
        description: 'Uploaded via Goat Bot',
        isPublic: true
      },
      timeout: 20000
    });

    if (!response.data?.success || !response.data?.raw_url) {
      throw new Error('Invalid API response');
    }

    const rawUrl = response.data.raw_url;
    const gistUrl = rawUrl.replace('/raw/', '/');
    const sourceType = messageReply ? "Message Reply" : "Command File";
    
    const successMessage = `
✅ Gist created successfully!
━━━━━━━━━━━━━━━
📝 Filename: ${fileName}.js
📂 Source: ${sourceType}
🔗 Gist URL: ${gistUrl}
🔗 Raw URL: ${rawUrl}
━━━━━━━━━━━━━━━
💡 Tip: Use the raw URL for direct code access.
    `.trim();

    return api.sendMessage(successMessage, threadID, messageID);

  } catch (error) {
    console.error('[Gist Command] Error:', error);
    
    let errorMessage = '❌ An error occurred while processing your request.';
    
    if (error.code === 'ECONNABORTED') {
      errorMessage = '⚠️ Request timed out. Please try again later.';
    } 
    else if (error.response) {
      if (error.response.status === 404) {
        errorMessage = '❌ Gist API endpoint not found.';
      } else {
        errorMessage = '❌ Gist API is currently unavailable. Try again later.';
      }
    }
    else if (error.message.includes('ENOENT')) {
      errorMessage = '❌ File not found. Please check the filename.';
    }
    else if (error.message.includes('Invalid API response')) {
      errorMessage = '⚠️ Received invalid response from Gist API.';
    }
    
    return api.sendMessage(errorMessage, threadID, messageID);
  }
};
