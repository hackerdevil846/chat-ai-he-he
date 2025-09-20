const fs = require("fs-extra");
const axios = require("axios");
const path = require("path");

module.exports = {
  config: {
    name: "adc",
    aliases: ["downloadcmd", "getcmd"],
    version: "1.0.0",
    author: "Asif Mahmud",
    countDown: 0,
    role: 2,
    category: "admin",
    shortDescription: {
      en: "Download and install commands from URLs"
    },
    longDescription: {
      en: "Download and install commands from various sources"
    },
    guide: {
      en: "{p}adc [command_name] [url]"
    },
    dependencies: {
      "fs-extra": "",
      "axios": "",
      "path": ""
    }
  },

  onStart: async function({ message, event, args }) {
    try {
      if (args.length === 0) {
        return message.reply(
          "ADC Command Usage:\n\n" +
          "• {p}adc [command_name] - Download a command\n" +
          "• {p}adc [command_name] [url] - Download from url\n" +
          "• Reply to a message with {p}adc [command_name]"
        );
      }

      const commandName = args[0];
      let fileUrl = args[1];
      let text = "";

      if (event.type === "message_reply") {
        text = event.messageReply.body;
        if (text) {
          fileUrl = text;
        }
      }

      if (!commandName || !/^[a-zA-Z0-9]+$/.test(commandName)) {
        return message.reply("Invalid command name. Use only letters and numbers.");
      }

      const commandsDir = path.join(__dirname, '..');
      const filePath = path.join(commandsDir, `${commandName}.js`);

      if (!fileUrl) {
        if (!fs.existsSync(filePath)) {
          return message.reply(`Command "${commandName}" does not exist.`);
        }

        try {
          const commandData = await fs.readFile(filePath, "utf-8");
          const backupPath = path.join(__dirname, '..', '..', 'temp', `${commandName}_backup.js`);
          
          const tempDir = path.dirname(backupPath);
          if (!fs.existsSync(tempDir)) {
            fs.mkdirSync(tempDir, { recursive: true });
          }
          
          await fs.writeFile(backupPath, commandData);
          
          return message.reply({
            body: `Backup created for "${commandName}.js"`,
            attachment: fs.createReadStream(backupPath)
          });
          
        } catch (err) {
          console.error(err);
          return message.reply(`Error: ${err.message}`);
        }
      }

      try {
        let fileContent;

        if (fileUrl.includes('pastebin.com')) {
          const pasteId = fileUrl.split('/').pop();
          const rawUrl = `https://pastebin.com/raw/${pasteId}`;
          const response = await axios.get(rawUrl);
          fileContent = response.data;
        }
        else if (fileUrl.includes('github.com') || fileUrl.includes('raw.githubusercontent.com')) {
          const response = await axios.get(fileUrl);
          fileContent = response.data;
        }
        else if (fileUrl.includes('drive.google.com')) {
          return message.reply("Google Drive download not supported.");
        }
        else if (fileUrl.includes('http')) {
          const response = await axios.get(fileUrl);
          fileContent = response.data;
        }
        else {
          return message.reply("Unsupported url type.");
        }

        if (!fileContent || typeof fileContent !== 'string') {
          return message.reply("Invalid file content.");
        }

        if (!fileContent.includes('module.exports') && !fileContent.includes('onStart')) {
          return message.reply("The downloaded file does not appear to be a valid command.");
        }

        await fs.writeFile(filePath, fileContent, "utf-8");
        
        return message.reply(`Command "${commandName}.js" installed! Use "${global.config.PREFIX}load ${commandName}" to load.`);

      } catch (error) {
        console.error("Download error:", error);
        return message.reply(`Download error: ${error.message}`);
      }

    } catch (error) {
      console.error("ADC Command Error:", error);
      await message.reply("An error occurred: " + error.message);
    }
  }
};
