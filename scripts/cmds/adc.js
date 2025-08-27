const fs = require("fs-extra");
const axios = require("axios");
const path = require("path");

module.exports = {
  config: {
    name: "adc",
    version: "1.0.0",
    author: "𝑨𝒔𝒊𝒇 𝑴𝒂𝒉𝒎𝒖𝒅",
    role: 2,
    category: "admin",
    shortDescription: {
      en: "𝑩𝒖𝒊𝒍𝒅𝒕𝒐𝒐𝒍𝒅𝒆𝒗 𝒂𝒖𝒓 𝑷𝒂𝒔𝒕𝒆𝒃𝒊𝒏 𝒔𝒆 𝒄𝒐𝒅𝒆 𝒂𝒑𝒍𝒂𝒊 𝒌𝒂𝒓𝒆𝒏"
    },
    longDescription: {
      en: "𝑫𝒐𝒘𝒏𝒍𝒐𝒂𝒅 𝒂𝒏𝒅 𝒊𝒏𝒔𝒕𝒂𝒍𝒍 𝒄𝒐𝒎𝒎𝒂𝒏𝒅𝒔 𝒇𝒓𝒐𝒎 𝒖𝒓𝒍𝒔"
    },
    guide: {
      en: "{p}adc [command_name] [url]"
    },
    cooldowns: 0
  },

  onStart: async function({ message, event, args }) {
    try {
      if (args.length === 0) {
        return message.reply(
          "📝 𝑨𝑫𝑪 𝑪𝒐𝒎𝒎𝒂𝒏𝒅 𝑼𝒔𝒂𝒈𝒆:\n\n" +
          "• {p}adc [command_name] - 𝑫𝒐𝒘𝒏𝒍𝒐𝒂𝒅 𝒂 𝒄𝒐𝒎𝒎𝒂𝒏𝒅\n" +
          "• {p}adc [command_name] [url] - 𝑫𝒐𝒘𝒏𝒍𝒐𝒂𝒅 𝒇𝒓𝒐𝒎 𝒖𝒓𝒍\n" +
          "• 𝑹𝒆𝒑𝒍𝒚 𝒕𝒐 𝒂 𝒎𝒆𝒔𝒔𝒂𝒈𝒆 𝒘𝒊𝒕𝒉 {p}adc [command_name]"
        );
      }

      const commandName = args[0];
      let fileUrl = args[1];
      let text = "";

      // Check if replying to a message
      if (event.type === "message_reply") {
        text = event.messageReply.body;
        if (text) {
          fileUrl = text;
        }
      }

      // Validate command name
      if (!commandName || !/^[a-zA-Z0-9]+$/.test(commandName)) {
        return message.reply("❌ 𝑰𝒏𝒗𝒂𝒍𝒊𝒅 𝒄𝒐𝒎𝒎𝒂𝒏𝒅 𝒏𝒂𝒎𝒆. 𝑼𝒔𝒆 𝒐𝒏𝒍𝒚 𝒍𝒆𝒕𝒕𝒆𝒓𝒔 𝒂𝒏𝒅 𝒏𝒖𝒎𝒃𝒆𝒓𝒔.");
      }

      const commandsDir = path.join(__dirname, '..');
      const filePath = path.join(commandsDir, `${commandName}.js`);

      // If no URL provided, create a backup of existing command
      if (!fileUrl) {
        if (!fs.existsSync(filePath)) {
          return message.reply(`❌ 𝑪𝒐𝒎𝒎𝒂𝒏𝒅 "${commandName}" 𝒅𝒐𝒆𝒔 𝒏𝒐𝒕 𝒆𝒙𝒊𝒔𝒕.`);
        }

        try {
          const commandData = await fs.readFile(filePath, "utf-8");
          const backupPath = path.join(__dirname, '..', '..', 'temp', `${commandName}_backup.js`);
          
          // Ensure temp directory exists
          const tempDir = path.dirname(backupPath);
          if (!fs.existsSync(tempDir)) {
            fs.mkdirSync(tempDir, { recursive: true });
          }
          
          await fs.writeFile(backupPath, commandData);
          
          return message.reply({
            body: `✅ 𝑩𝒂𝒄𝒌𝒖𝒑 𝒄𝒓𝒆𝒂𝒕𝒆𝒅 𝒇𝒐𝒓 "${commandName}.js"`,
            attachment: fs.createReadStream(backupPath)
          });
          
        } catch (err) {
          console.error(err);
          return message.reply(`❌ 𝑬𝒓𝒓𝒐𝒓: ${err.message}`);
        }
      }

      // Handle URL download
      try {
        let fileContent;

        // Handle different URL types
        if (fileUrl.includes('pastebin.com')) {
          // For Pastebin raw content
          const pasteId = fileUrl.split('/').pop();
          const rawUrl = `https://pastebin.com/raw/${pasteId}`;
          const response = await axios.get(rawUrl);
          fileContent = response.data;
        }
        else if (fileUrl.includes('github.com') || fileUrl.includes('raw.githubusercontent.com')) {
          // For GitHub raw content
          const response = await axios.get(fileUrl);
          fileContent = response.data;
        }
        else if (fileUrl.includes('drive.google.com')) {
          // For Google Drive (simplified approach)
          return message.reply("❌ 𝑮𝒐𝒐𝒈𝒍𝒆 𝑫𝒓𝒊𝒗𝒆 𝒅𝒐𝒘𝒏𝒍𝒐𝒂𝒅 𝒏𝒐𝒕 𝒔𝒖𝒑𝒑𝒐𝒓𝒕𝒆𝒅 𝒊𝒏 𝒕𝒉𝒊𝒔 𝒗𝒆𝒓𝒔𝒊𝒐𝒏.");
        }
        else if (fileUrl.includes('http')) {
          // Direct file download
          const response = await axios.get(fileUrl);
          fileContent = response.data;
        }
        else {
          return message.reply("❌ 𝑼𝒏𝒔𝒖𝒑𝒑𝒐𝒓𝒕𝒆𝒅 𝒖𝒓𝒍 𝒕𝒚𝒑𝒆.");
        }

        // Validate the downloaded content
        if (!fileContent || typeof fileContent !== 'string') {
          return message.reply("❌ 𝑰𝒏𝒗𝒂𝒍𝒊𝒅 𝒇𝒊𝒍𝒆 𝒄𝒐𝒏𝒕𝒆𝒏𝒕.");
        }

        // Basic validation to ensure it's a JavaScript file
        if (!fileContent.includes('module.exports') && !fileContent.includes('onStart')) {
          return message.reply("❌ 𝑻𝒉𝒆 𝒅𝒐𝒘𝒏𝒍𝒐𝒂𝒅𝒆𝒅 𝒇𝒊𝒍𝒆 𝒅𝒐𝒆𝒔 𝒏𝒐𝒕 𝒂𝒑𝒑𝒆𝒂𝒓 𝒕𝒐 𝒃𝒆 𝒂 𝒗𝒂𝒍𝒊𝒅 𝑮𝒐𝒂𝒕𝑩𝒐𝒕 𝒄𝒐𝒎𝒎𝒂𝒏𝒅.");
        }

        // Write the file
        await fs.writeFile(filePath, fileContent, "utf-8");
        
        return message.reply(`✅ 𝑪𝒐𝒎𝒎𝒂𝒏𝒅 "${commandName}.js" 𝒉𝒂𝒔 𝒃𝒆𝒆𝒏 𝒔𝒖𝒄𝒄𝒆𝒔𝒔𝒇𝒖𝒍𝒍𝒚 𝒊𝒏𝒔𝒕𝒂𝒍𝒍𝒆𝒅!\n\n📋 𝑼𝒔𝒆 "${global.config.PREFIX}load ${commandName}" 𝒕𝒐 𝒍𝒐𝒂𝒅 𝒕𝒉𝒆 𝒄𝒐𝒎𝒎𝒂𝒏𝒅.`);

      } catch (error) {
        console.error("Download error:", error);
        return message.reply(`❌ 𝑫𝒐𝒘𝒏𝒍𝒐𝒂𝒅 𝒆𝒓𝒓𝒐𝒓: ${error.message}`);
      }

    } catch (error) {
      console.error("ADC Command Error:", error);
      await message.reply("❌ 𝑨𝒏 𝒆𝒓𝒓𝒐𝒓 𝒐𝒄𝒄𝒖𝒓𝒓𝒆𝒅: " + error.message);
    }
  }
};
