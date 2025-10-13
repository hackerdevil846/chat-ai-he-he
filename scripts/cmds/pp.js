module.exports = {
  config: {
    name: "pp",
    aliases: [],
    version: "1.1",
    author: "𝖠𝗌𝗂𝖿 𝖬𝖺𝗁𝗆𝗎𝖽",
    countDown: 5,
    role: 0,
    category: "image",
    shortDescription: {
      en: "𝖦𝖾𝗍 𝗎𝗌𝖾𝗋 𝗉𝗋𝗈𝖿𝗂𝗅𝖾 𝗂𝗆𝖺𝗀𝖾"
    },
    longDescription: {
      en: "𝖦𝖾𝗍 𝖺𝗇𝗒 𝗎𝗌𝖾𝗋'𝗌 𝗉𝗋𝗈𝖿𝗂𝗅𝖾 𝗉𝗂𝖼𝗍𝗎𝗋𝖾 𝖻𝗒 𝗍𝖺𝗀, 𝖨𝖣, 𝗈𝗋 𝖥𝖺𝖼𝖾𝖻𝗈𝗈𝗄 𝖴𝖱𝖫"
    },
    guide: {
      en: "{p}pp @𝗍𝖺𝗀 𝗈𝗋 𝗎𝗌𝖾𝗋𝖨𝖣 𝗈𝗋 𝗋𝖾𝗉𝗅𝗒 𝗍𝗈 𝖺 𝗆𝖾𝗌𝗌𝖺𝗀𝖾 𝗈𝗋 𝗉𝗋𝗈𝗏𝗂𝖽𝖾 𝖺 𝖥𝖺𝖼𝖾𝖻𝗈𝗈𝗄 𝖴𝖱𝖫"
    }
  },

  onStart: async function ({ message, event, args, usersData }) {
    try {
      // Validate usersData dependency
      if (!usersData || typeof usersData.getAvatarUrl !== 'function') {
        return; // Silent fail to avoid spam
      }

      const getAvatarUrl = async (uid) => {
        try {
          return await usersData.getAvatarUrl(uid);
        } catch (error) {
          console.error(`❌ 𝖥𝖺𝗂𝗅𝖾𝖽 𝗍𝗈 𝗀𝖾𝗍 𝖺𝗏𝖺𝗍𝖺𝗋 𝖿𝗈𝗋 𝖴𝖨𝖣 ${uid}:`, error.message);
          throw new Error("𝖥𝖺𝗂𝗅𝖾𝖽 𝗍𝗈 𝗋𝖾𝗍𝗋𝗂𝖾𝗏𝖾 𝗉𝗋𝗈𝖿𝗂𝗅𝖾 𝗂𝗆𝖺𝗀𝖾");
        }
      };

      let targetUID;
      let avatarUrl;

      // Determine target user ID
      if (event.type === "message_reply") {
        // Case 1: Reply to a message
        targetUID = event.messageReply.senderID;
        console.log(`📸 𝖦𝖾𝗍𝗍𝗂𝗇𝗀 𝗉𝗋𝗈𝖿𝗂𝗅𝖾 𝗉𝗂𝖼 𝖿𝗈𝗋 𝗋𝖾𝗉𝗅𝗂𝖾𝖽 𝗎𝗌𝖾𝗋: ${targetUID}`);
      } else if (Object.keys(event.mentions).length > 0) {
        // Case 2: User mentioned/tagged
        targetUID = Object.keys(event.mentions)[0];
        console.log(`📸 𝖦𝖾𝗍𝗍𝗂𝗇𝗀 𝗉𝗋𝗈𝖿𝗂𝗅𝖾 𝗉𝗂𝖼 𝖿𝗈𝗋 𝗆𝖾𝗇𝗍𝗂𝗈𝗇𝖾𝖽 𝗎𝗌𝖾𝗋: ${targetUID}`);
      } else if (args[0]) {
        // Case 3: Facebook URL or User ID provided
        const input = args[0].trim();
        
        if (input.includes("facebook.com")) {
          // Extract user ID from Facebook URL
          const match = input.match(/(?:\?id=|\/)(\d+)/);
          if (match && match[1]) {
            targetUID = match[1];
            console.log(`📸 𝖦𝖾𝗍𝗍𝗂𝗇𝗀 𝗉𝗋𝗈𝖿𝗂𝗅𝖾 𝗉𝗂𝖼 𝖿𝗋𝗈𝗆 𝖥𝖺𝖼𝖾𝖻𝗈𝗈𝗄 𝖴𝖱𝖫: ${targetUID}`);
          } else {
            return message.reply("❌ 𝖨𝗇𝗏𝖺𝗅𝗂𝖽 𝖥𝖺𝖼𝖾𝖻𝗈𝗈𝗄 𝖴𝖱𝖫. 𝖯𝗅𝖾𝖺𝗌𝖾 𝗉𝗋𝗈𝗏𝗂𝖽𝖾 𝖺 𝗏𝖺𝗅𝗂𝖽 𝖥𝖺𝖼𝖾𝖻𝗈𝗈𝗄 𝗉𝗋𝗈𝖿𝗂𝗅𝖾 𝖴𝖱𝖫.");
          }
        } else if (/^\d+$/.test(input)) {
          // Direct user ID provided
          targetUID = input;
          console.log(`📸 𝖦𝖾𝗍𝗍𝗂𝗇𝗀 𝗉𝗋𝗈𝖿𝗂𝗅𝖾 𝗉𝗂𝖼 𝖿𝗈𝗋 𝖴𝖨𝖣: ${targetUID}`);
        } else {
          return message.reply("❌ 𝖨𝗇𝗏𝖺𝗅𝗂𝖽 𝗂𝗇𝗉𝗎𝗍. 𝖯𝗅𝖾𝖺𝗌𝖾 𝗎𝗌𝖾:\n• @𝗍𝖺𝗀 𝖺 𝗎𝗌𝖾𝗋\n• 𝖱𝖾𝗉𝗅𝗒 𝗍𝗈 𝖺 𝗆𝖾𝗌𝗌𝖺𝗀𝖾\n• 𝖯𝗋𝗈𝗏𝗂𝖽𝖾 𝖺 𝗎𝗌𝖾𝗋 𝖨𝖣\n• 𝖯𝗋𝗈𝗏𝗂𝖽𝖾 𝖺 𝖥𝖺𝖼𝖾𝖻𝗈𝗈𝗄 𝗉𝗋𝗈𝖿𝗂𝗅𝖾 𝖴𝖱𝖫");
        }
      } else {
        // Case 4: No input - get sender's profile pic
        targetUID = event.senderID;
        console.log(`📸 𝖦𝖾𝗍𝗍𝗂𝗇𝗀 𝗌𝖾𝗇𝖽𝖾𝗋'𝗌 𝗉𝗋𝗈𝖿𝗂𝗅𝖾 𝗉𝗂𝖼: ${targetUID}`);
      }

      // Validate user ID format
      if (!targetUID || !/^\d+$/.test(targetUID)) {
        return message.reply("❌ 𝖨𝗇𝗏𝖺𝗅𝗂𝖽 𝗎𝗌𝖾𝗋 𝖨𝖣 𝖿𝗈𝗋𝗆𝖺𝗍.");
      }

      // Get avatar URL
      try {
        avatarUrl = await getAvatarUrl(targetUID);
        
        if (!avatarUrl) {
          return message.reply("❌ 𝖥𝖺𝗂𝗅𝖾𝖽 𝗍𝗈 𝗋𝖾𝗍𝗋𝗂𝖾𝗏𝖾 𝗉𝗋𝗈𝖿𝗂𝗅𝖾 𝗂𝗆𝖺𝗀𝖾. 𝖴𝗌𝖾𝗋 𝗆𝖺𝗒 𝗇𝗈𝗍 𝖾𝗑𝗂𝗌𝗍 𝗈𝗋 𝗉𝗋𝗈𝖿𝗂𝗅𝖾 𝗂𝗌 𝗉𝗋𝗂𝗏𝖺𝗍𝖾.");
        }

        // Validate URL format
        if (!avatarUrl.startsWith('http')) {
          return message.reply("❌ 𝖨𝗇𝗏𝖺𝗅𝗂𝖽 𝗉𝗋𝗈𝖿𝗂𝗅𝖾 𝗂𝗆𝖺𝗀𝖾 𝖴𝖱𝖫 𝗋𝖾𝗍𝗎𝗋𝗇𝖾𝖽.");
        }

      } catch (avatarError) {
        console.error("💥 𝖠𝗏𝖺𝗍𝖺𝗋 𝖴𝖱𝖫 𝖾𝗋𝗋𝗈𝗋:", avatarError);
        return message.reply("❌ 𝖥𝖺𝗂𝗅𝖾𝖽 𝗍𝗈 𝖺𝖼𝖼𝖾𝗌𝗌 𝗎𝗌𝖾𝗋'𝗌 𝗉𝗋𝗈𝖿𝗂𝗅𝖾 𝗂𝗆𝖺𝗀𝖾. 𝖯𝗅𝖾𝖺𝗌𝖾 𝗍𝗋𝗒 𝖺𝗀𝖺𝗂𝗇 𝗅𝖺𝗍𝖾𝗋.");
      }

      // Get image stream and send
      try {
        const imageStream = await global.utils.getStreamFromURL(avatarUrl);
        
        if (!imageStream) {
          return message.reply("❌ 𝖥𝖺𝗂𝗅𝖾𝖽 𝗍𝗈 𝗅𝗈𝖺𝖽 𝗉𝗋𝗈𝖿𝗂𝗅𝖾 𝗂𝗆𝖺𝗀𝖾. 𝖯𝗅𝖾𝖺𝗌𝖾 𝗍𝗋𝗒 𝖺𝗀𝖺𝗂𝗇.");
        }

        await message.reply({ 
          body: "📸 𝖯𝗋𝗈𝖿𝗂𝗅𝖾 𝖯𝗂𝖼𝗍𝗎𝗋𝖾:", 
          attachment: imageStream 
        });

        console.log(`✅ 𝖲𝗎𝖼𝖼𝖾𝗌𝗌𝖿𝗎𝗅𝗅𝗒 𝗌𝖾𝗇𝗍 𝗉𝗋𝗈𝖿𝗂𝗅𝖾 𝗉𝗂𝖼 𝖿𝗈𝗋 𝖴𝖨𝖣: ${targetUID}`);

      } catch (streamError) {
        console.error("💥 𝖨𝗆𝖺𝗀𝖾 𝗌𝗍𝗋𝖾𝖺𝗆 𝖾𝗋𝗋𝗈𝗋:", streamError);
        return message.reply("❌ 𝖥𝖺𝗂𝗅𝖾𝖽 𝗍𝗈 𝗉𝗋𝗈𝖼𝖾𝗌𝗌 𝗉𝗋𝗈𝖿𝗂𝗅𝖾 𝗂𝗆𝖺𝗀𝖾. 𝖯𝗅𝖾𝖺𝗌𝖾 𝗍𝗋𝗒 𝖺𝗀𝖺𝗂𝗇 𝗅𝖺𝗍𝖾𝗋.");
      }
      
    } catch (error) {
      console.error("💥 𝖯𝗋𝗈𝖿𝗂𝗅𝖾 𝖯𝗂𝖼 𝖤𝗋𝗋𝗈𝗋:", error);
      
      // Don't send generic error message to avoid spam
      // Specific errors are already handled above
    }
  }
};
