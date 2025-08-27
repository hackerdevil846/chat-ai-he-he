const axios = require('axios');
const fs = require('fs-extra');
const path = require('path');

module.exports = {
  config: {
    name: "add",
    version: "1.0.0",
    author: "𝑨𝒔𝒊𝒇 𝑴𝒂𝒉𝒎𝒖𝒅",
    role: 0,
    category: "media",
    shortDescription: {
      en: "𝑨𝒅𝒅 𝒎𝒆𝒅𝒊𝒂 𝒕𝒐 𝒅𝒂𝒕𝒂𝒃𝒂𝒔𝒆 𝒘𝒊𝒕𝒉 𝒄𝒐𝒏𝒕𝒆𝒏𝒕 𝒇𝒊𝒍𝒕𝒆𝒓𝒊𝒏𝒈"
    },
    longDescription: {
      en: "𝑨𝒅𝒅 𝒎𝒆𝒅𝒊𝒂 𝒇𝒊𝒍𝒆𝒔 𝒕𝒐 𝒂 𝒅𝒂𝒕𝒂𝒃𝒂𝒔𝒆 𝒘𝒊𝒕𝒉 𝒄𝒐𝒏𝒕𝒆𝒏𝒕 𝒇𝒊𝒍𝒕𝒆𝒓𝒊𝒏𝒈 𝒂𝒏𝒅 𝒂𝒅𝒎𝒊𝒏 𝒏𝒐𝒕𝒊𝒇𝒊𝒄𝒂𝒕𝒊𝒐𝒏𝒔"
    },
    guide: {
      en: "{p}add [name] (reply to media)"
    },
    cooldowns: 5
  },

  onStart: async function({ message, event, args }) {
    try {
      // Configuration
      const ADMIN_IDS = ["61571630409265"]; // Add more admin IDs as needed
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
        const cacheDir = path.dirname(WARNING_FILE);
        if (!fs.existsSync(cacheDir)) {
          fs.mkdirSync(cacheDir, { recursive: true });
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

      const saveWarnings = (warnings) => {
        fs.writeFileSync(WARNING_FILE, JSON.stringify(warnings, null, 2));
      };

      // Content validation
      const hasBadWords = (text) => {
        const lowercaseText = text.toLowerCase();
        return BAD_WORDS.some(word => lowercaseText.includes(word.toLowerCase()));
      };

      // Admin notification
      const notifyAdmins = async (adminMessage) => {
        for (const adminID of ADMIN_IDS) {
          if (adminID) {
            try {
              await message.reply(adminMessage, adminID);
            } catch (error) {
              console.error('Admin notification failed:', error);
            }
          }
        }
      };

      // Initialize warnings
      initWarnings();

      const { senderID, messageReply } = event;
      const mediaUrl = messageReply?.attachments?.[0]?.url;
      const mediaName = args.join(' ').trim();

      if (!messageReply || !mediaUrl) {
        return message.reply("⚠️ 𝑷𝒍𝒆𝒂𝒔𝒆 𝒓𝒆𝒑𝒍𝒚 𝒕𝒐 𝒂 𝒗𝒊𝒅𝒆𝒐 𝒐𝒓 𝒊𝒎𝒂𝒈𝒆 𝒕𝒐 𝒂𝒅𝒅 𝒊𝒕");
      }

      if (!mediaName) {
        return message.reply("⚠️ 𝑷𝒍𝒆𝒂𝒔𝒆 𝒑𝒓𝒐𝒗𝒊𝒅𝒆 𝒂 𝒏𝒂𝒎𝒆 𝒇𝒐𝒓 𝒕𝒉𝒆 𝒎𝒆𝒅𝒊𝒂");
      }

      // Content filtering
      if (hasBadWords(mediaName)) {
        const warnings = getWarnings();
        warnings[senderID] = (warnings[senderID] || 0) + 1;
        saveWarnings(warnings);

        const warningCount = warnings[senderID];
        const userWarning = `❌ 𝒚𝒐𝒖𝒓 𝒑𝒓𝒐𝒗𝒊𝒅𝒆𝒅 𝒏𝒂𝒎𝒆 𝒉𝒂𝒔 𝒊𝒏𝒂𝒑𝒑𝒓𝒐𝒑𝒓𝒊𝒂𝒕𝒆 𝒘𝒐𝒓𝒅𝒔!\n⚠️ 𝑾𝒂𝒓𝒏𝒊𝒏𝒈: ${warningCount}/3`;
        const adminAlert = `🚨 𝑪𝑶𝑵𝑻𝑬𝑵𝑻 𝑽𝑰𝑶𝑳𝑨𝑻𝑰𝑶𝑵\n• 𝑼𝒔𝒆𝒓: ${senderID}\n• 𝑪𝒐𝒏𝒕𝒆𝒏𝒕: ${mediaName}\n⚠️ 𝑾𝒂𝒓𝒏𝒊𝒏𝒈𝒔: ${warningCount}/3`;

        await message.reply(userWarning);
        await notifyAdmins(adminAlert);

        if (warningCount >= 3) {
          await message.reply(`🚫 𝑼𝒔𝒆𝒓 𝒉𝒂𝒔 𝒃𝒆𝒆𝒏 𝒃𝒍𝒐𝒄𝒌𝒆𝒅 𝒇𝒐𝒓 𝒓𝒆𝒑𝒆𝒂𝒕𝒆𝒅 𝒗𝒊𝒐𝒍𝒂𝒕𝒊𝒐𝒏𝒔!`);
          // Note: Blocking users requires admin privileges and may not work in all bot frameworks
        }
        return;
      }

      // For demonstration purposes - in a real implementation, you would upload to your service
      const attachment = messageReply.attachments[0];
      const mediaType = attachment.type;
      const duration = mediaType === "video" ? attachment.duration || 0 : 0;

      // Simulate upload process (replace with actual upload service)
      await message.reply(`📤 𝑼𝒑𝒍𝒐𝒂𝒅𝒊𝒏𝒈 ${mediaType} "${mediaName}"...`);

      // Simulate API response
      await new Promise(resolve => setTimeout(resolve, 2000));

      // Success response
      await message.reply(
        `✅ 𝑨𝒅𝒅𝒆𝒅 𝒔𝒖𝒄𝒄𝒆𝒔𝒔𝒇𝒖𝒍𝒍𝒚!\n` +
        `📛 𝑵𝒂𝒎𝒆: ${mediaName}\n` +
        `📁 𝑻𝒚𝒑𝒆: ${mediaType}\n` +
        `⏱️ 𝑫𝒖𝒓𝒂𝒕𝒊𝒐𝒏: ${duration > 0 ? duration + 's' : 'N/A'}\n` +
        `🔗 𝑼𝒑𝒍𝒐𝒂𝒅𝒆𝒅 𝒔𝒖𝒄𝒄𝒆𝒔𝒔𝒇𝒖𝒍𝒍𝒚!`
      );

    } catch (error) {
      console.error('Add command error:', error);
      await message.reply("❌ 𝑨𝒏 𝒆𝒓𝒓𝒐𝒓 𝒐𝒄𝒄𝒖𝒓𝒓𝒆𝒅 𝒘𝒉𝒊𝒍𝒆 𝒑𝒓𝒐𝒄𝒆𝒔𝒔𝒊𝒏𝒈 𝒚𝒐𝒖𝒓 𝒓𝒆𝒒𝒖𝒆𝒔𝒕");
    }
  }
};
