const axios = require('axios');
const fs = require('fs');
const path = require('path');

module.exports.config = {
  name: "add",
  version: "7.0",
  hasPermssion: 0,
  credits: "𝑨𝒔𝒊𝒇 𝑴𝒂𝒉𝒎𝒖𝒅",
  description: "Add media to database with content filtering and admin notifications",
  category: "media",
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
      return api.sendMessage("⚠️ 𝑷𝒍𝒆𝒂𝒔𝒆 𝒓𝒆𝒑𝒍𝒚 𝒕𝒐 𝒂 𝒗𝒊𝒅𝒆𝒐 𝒐𝒓 𝒊𝒎𝒂𝒈𝒆 𝒕𝒐 𝒂𝒅𝒅 𝒊𝒕", threadID, messageID);
    
    if (!mediaName) 
      return api.sendMessage("⚠️ 𝑷𝒍𝒆𝒂𝒔𝒆 𝒑𝒓𝒐𝒗𝒊𝒅𝒆 𝒂 𝒏𝒂𝒎𝒆 𝒇𝒐𝒓 𝒕𝒉𝒆 𝒎𝒆𝒅𝒊𝒂", threadID, messageID);
    
    if (hasBadWords(mediaName)) {
      const warnings = getWarnings();
      warnings[senderID] = (warnings[senderID] || 0) + 1;
      saveWarnings(warnings);
      
      const warningCount = warnings[senderID];
      const userWarning = `❌ 𝒚𝒐𝒖𝒓 𝒑𝒓𝒐𝒗𝒊𝒅𝒆𝒅 𝒏𝒂𝒎𝒆 𝒉𝒂𝒔 𝒊𝒏𝒂𝒑𝒑𝒓𝒐𝒑𝒓𝒊𝒂𝒕𝒆 𝒘𝒐𝒓𝒅𝒔!\n⚠️ 𝑾𝒂𝒓𝒏𝒊𝒏𝒈: ${warningCount}/3`;
      const adminAlert = `🚨 𝑪𝑶𝑵𝑻𝑬𝑵𝑻 𝑽𝑰𝑶𝑳𝑨𝑻𝑰𝑶𝑵\n• 𝑼𝒔𝒆𝒓: ${senderID}\n• 𝑪𝒐𝒏𝒕𝒆𝒏𝒕: ${mediaName}\n• 𝑻𝒉𝒓𝒆𝒂𝒅: ${threadID}\n⚠️ 𝑾𝒂𝒓𝒏𝒊𝒏𝒈𝒔: ${warningCount}/3`;
      
      api.sendMessage(userWarning, threadID, messageID);
      notifyAdmins(api, adminAlert);
      
      if (warningCount >= 3) {
        api.sendMessage(`🚫 𝑼𝒔𝒆𝒓 ${senderID} 𝒉𝒂𝒔 𝒃𝒆𝒆𝒏 𝒃𝒍𝒐𝒄𝒌𝒆𝒅 𝒇𝒐𝒓 𝒓𝒆𝒑𝒆𝒂𝒕𝒆𝒅 𝒗𝒊𝒐𝒍𝒂𝒕𝒊𝒐𝒏𝒔!`, threadID);
        await new Promise(resolve => setTimeout(resolve, 1000));
        await api.changeBlockedStatus(senderID, true);
      }
      return;
    }
    
    const attachment = messageReply.attachments[0];
    const duration = attachment.type === "video" ? attachment.duration || 0 : 0;
    
    const finalUrl = await uploadMedia(mediaUrl, duration);
    if (!finalUrl) 
      return api.sendMessage("❌ 𝑭𝒂𝒊𝒍𝒆𝒅 𝒕𝒐 𝒖𝒑𝒍𝒐𝒂𝒅 𝒎𝒆𝒅𝒊𝒂 𝒕𝒐 𝒉𝒐𝒔𝒕𝒊𝒏𝒈 𝒔𝒆𝒓𝒗𝒊𝒄𝒆", threadID, messageID);
    
    const apis = await axios.get('https://raw.githubusercontent.com/shaonproject/Shaon/main/api.json');
    const baseAPI = apis.data.api;
    
    const dbResponse = await axios.get(
      `${baseAPI}/video/random?name=${encodeURIComponent(mediaName)}&url=${encodeURIComponent(finalUrl)}`
    );
    
    api.sendMessage(
      `✅ 𝑨𝒅𝒅𝒆𝒅 𝒔𝒖𝒄𝒄𝒆𝒔𝒔𝒇𝒖𝒍𝒍𝒚!\n📛 𝑵𝒂𝒎𝒆: ${dbResponse.data.name}\n🔗 𝑼𝑹𝑳: ${dbResponse.data.url}`,
      threadID,
      messageID
    );
    
  } catch (error) {
    console.error('Add command error:', error);
    api.sendMessage("❌ 𝑨𝒏 𝒆𝒓𝒓𝒐𝒓 𝒐𝒄𝒄𝒖𝒓𝒓𝒆𝒅 𝒘𝒉𝒊𝒍𝒆 𝒑𝒓𝒐𝒄𝒆𝒔𝒔𝒊𝒏𝒈 𝒚𝒐𝒖𝒓 𝒓𝒆𝒒𝒖𝒆𝒔𝒕", threadID, messageID);
  }
};
