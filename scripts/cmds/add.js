const axios = require('axios');
const fs = require('fs');
const path = require('path');

module.exports.config = {
  name: "add",
  version: "7.0",
  hasPermssion: 0,
  credits: "𝑨𝒔𝒊𝒇 𝑴𝒂𝒉𝒎𝒖𝒅",
  description: "Add media to database with content filtering and admin notifications",
  commandCategory: "media",
  usages: "[name]",
  cooldowns: 5,
  dependencies: { "axios": "" }
};

// Configuration
const ADMIN_IDS = ["61571630409265", ""];
const WARNING_FILE = path.join(__dirname, 'cache', 'warnings.json');
const BAD_WORDS = [
  "fuck", "sex", "porn", "nude", "bitch", "cum", "dick", "pussy", "asshole", 
  "boobs", "blowjob", "hentai", "xxx", "rape", "hotgirl", "hotboy", "anal", 
  "oral", "tits", "slut", "whore", "nangi", "naked", "desisex", "desi porn", 
  "indian porn", "child porn", "pedo", "child abuse", "গুদ", "চোদা", "চোদ", 
  "চুদ", "চুদি", "চোদন", "মাগী", "মাগি", "বেশ্যা", "শুয়োর", "মাদারচোদ", 
  "বাপচোদ", "মা চোদ", "বোন চোদ", "ফাক", "সেক্স", "পর্ন", "হেন্তাই"
];

// Initialize warning system
const initWarnings = () => {
  if (!fs.existsSync(path.dirname(WARNING_FILE))) {
    fs.mkdirSync(path.dirname(WARNING_FILE), { recursive: true });
  }
  if (!fs.existsSync(WARNING_FILE)) {
    fs.writeFileSync(WARNING_FILE, '{}');
  }
};

// Warning management
const getWarnings = () => {
  try {
    return JSON.parse(fs.readFileSync(WARNING_FILE));
  } catch {
    return {};
  }
};
const saveWarnings = warnings => fs.writeFileSync(WARNING_FILE, JSON.stringify(warnings, null, 2));

// Content validation
const hasBadWords = text => {
  const regex = new RegExp(
    BAD_WORDS.map(word => 
      word.split('').map(ch => `[${ch}]+`).join('[\\s\\.\\-\\_]*')
    ).join('|'), 
    'i'
  );
  return regex.test(text);
};

// Media upload handlers
const uploadMedia = async (url, duration) => {
  try {
    const apis = await axios.get('https://raw.githubusercontent.com/shaonproject/Shaon/main/api.json');
    const { imgur: imgurAPI } = apis.data;
    
    if (duration > 60) {
      const catRes = await axios.get(`${imgurAPI}/catbox?url=${encodeURIComponent(url)}`);
      return catRes.data.url;
    } else {
      const imgurRes = await axios.get(`${imgurAPI}/imgur?link=${encodeURIComponent(url)}`);
      return imgurRes.data.uploaded?.image || imgurRes.data.link;
    }
  } catch {
    return null;
  }
};

// Admin notification
const notifyAdmins = (api, message) => {
  ADMIN_IDS.forEach(adminID => {
    if (adminID) {
      api.sendMessage(message, adminID, (err) => {
        if (err) console.error('Admin notification failed:', err);
      });
    }
  });
};

module.exports.run = async ({ api, event, args }) => {
  initWarnings();
  const { threadID, messageID, senderID, messageReply } = event;
  
  try {
    const mediaUrl = messageReply?.attachments[0]?.url;
    const mediaName = args.join(' ').trim();
    
    if (!mediaUrl) 
      return api.sendMessage("⚠️ Please reply to a video or image to add it", threadID, messageID);
    
    if (!mediaName) 
      return api.sendMessage("⚠️ Please provide a name for the media", threadID, messageID);
    
    if (hasBadWords(mediaName)) {
      const warnings = getWarnings();
      warnings[senderID] = (warnings[senderID] || 0) + 1;
      saveWarnings(warnings);
      
      const warningCount = warnings[senderID];
      const userWarning = `❌ আপনার দেওয়া নামের মধ্যে নিষিদ্ধ শব্দ আছে!\n⚠️ সতর্কবার্তা: ${warningCount}/3`;
      const adminAlert = `🚨 CONTENT VIOLATION\n• User: ${senderID}\n• Content: ${mediaName}\n• Thread: ${threadID}\n⚠️ Warnings: ${warningCount}/3`;
      
      api.sendMessage(userWarning, threadID, messageID);
      notifyAdmins(api, adminAlert);
      
      if (warningCount >= 3) {
        api.sendMessage(`🚫 User ${senderID} has been blocked for repeated violations!`, threadID);
        await new Promise(resolve => setTimeout(resolve, 1000));
        await api.changeBlockedStatus(senderID, true);
      }
      return;
    }
    
    const attachment = messageReply.attachments[0];
    const duration = attachment.type === "video" ? attachment.duration || 0 : 0;
    
    const finalUrl = await uploadMedia(mediaUrl, duration);
    if (!finalUrl) 
      return api.sendMessage("❌ Failed to upload media to hosting service", threadID, messageID);
    
    const apis = await axios.get('https://raw.githubusercontent.com/shaonproject/Shaon/main/api.json');
    const baseAPI = apis.data.api;
    
    const dbResponse = await axios.get(
      `${baseAPI}/video/random?name=${encodeURIComponent(mediaName)}&url=${encodeURIComponent(finalUrl)}`
    );
    
    api.sendMessage(
      `✅ Added successfully!\n📛 Name: ${dbResponse.data.name}\n🔗 URL: ${dbResponse.data.url}`,
      threadID,
      messageID
    );
    
  } catch (error) {
    console.error('Add command error:', error);
    api.sendMessage("❌ An error occurred while processing your request", threadID, messageID);
  }
};
