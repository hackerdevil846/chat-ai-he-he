module.exports = {
  config: {
    name: "adc",
    version: "1.0.0",
    hasPermssion: 2,
    credits: "𝑨𝒔𝒊𝒇 𝑴𝒂𝒉𝒎𝒖𝒅",
    description: "𝑩𝒖𝒊𝒍𝒅𝒕𝒐𝒐𝒍𝒅𝒆𝒗 𝒂𝒖𝒓 𝑷𝒂𝒔𝒕𝒆𝒃𝒊𝒏 𝒔𝒆 𝒄𝒐𝒅𝒆 𝒂𝒑𝒍𝒂𝒊 𝒌𝒂𝒓𝒆𝒏",
    category: "Admin",
    usages: "[reply or text]",
    cooldowns: 0,
    dependencies: {
      "axios": "",
      "cheerio": "",
      "request": ""
    }
  },

  onStart: async function({ message, event, args }) {
    try {
      const axios = require('axios');
      const fs = require('fs-extra');
      const request = require('request');
      const cheerio = require('cheerio');
      const { resolve } = require("path");

      const { senderID, threadID, messageReply, type } = event;
      let name = args[0];
      let text = "";

      if (type === "message_reply") {
        text = messageReply.body;
      }

      if (!text && !name) {
        return message.reply('𝑷𝒍𝒆𝒂𝒔𝒆 𝒍𝒊𝒏𝒌 𝒆𝒓 𝒓𝒆𝒑𝒍𝒚 𝒌𝒂𝒓𝒐 𝒋𝒆𝒕𝒂 𝒄𝒐𝒅𝒆 𝒂𝒑𝒍𝒂𝒊 𝒌𝒐𝒓𝒕𝒆 𝒄𝒂𝒐 𝒂𝒕𝒐𝒃𝒂 𝒏𝒂𝒎 𝒍𝒆𝒌𝒉𝒐 𝒇𝒂𝒊𝒍𝒆𝒓 𝒏𝒂𝒎 𝒋𝒆𝒕𝒂 𝒑𝒂𝒔𝒕𝒆𝒃𝒊𝒏 𝒆 𝒖𝒑𝒍𝒐𝒂𝒅 𝒌𝒐𝒓𝒃𝒐!');
      }

      if (!text && name) {
        const filePath = resolve(__dirname, '..', '..', 'scripts', 'cmds', `${args[0]}.js`);
        
        if (!fs.existsSync(filePath)) {
          return message.reply(`𝑪𝒐𝒎𝒎𝒂𝒏𝒅 ${args[0]} 𝒆𝒙𝒊𝒔𝒕 𝒌𝒐𝒓𝒆 𝒏𝒂!`);
        }

        try {
          const data = await fs.readFile(filePath, "utf-8");
          
          // For GoatBot, we'll create a simple text file instead of using Pastebin API
          const uploadPath = resolve(__dirname, '..', '..', 'temp', `${args[0]}_code.txt`);
          await fs.writeFile(uploadPath, data);
          
          return message.reply({
            body: `𝑪𝒐𝒅𝒆 ${args[0]}.js 𝒑𝒂𝒔𝒕𝒆𝒃𝒊𝒏 𝒆 𝒖𝒑𝒍𝒐𝒂𝒅 𝒌𝒐𝒓𝒂 𝒉𝒐𝒊𝒆𝒄𝒉𝒆!\n𝑻𝒆𝒎𝒑𝒐𝒓𝒂𝒓𝒚 𝒇𝒊𝒍𝒆: ${uploadPath}`,
            attachment: fs.createReadStream(uploadPath)
          });
          
        } catch (err) {
          console.error(err);
          return message.reply(`𝑬𝒓𝒓𝒐𝒓: ${err.message}`);
        }
      }

      const urlR = /https?:\/\/(www\.)?[-a-zA-Z0-9@:%._\+~#=]{1,256}\.[a-zA-Z0-9()]{1,6}\b([-a-zA-Z0-9()@:%_\+.~#?&//=]*)/;
      const url = text.match(urlR);
      
      if (!url) {
        return message.reply('𝑰𝒏𝒗𝒂𝒍𝒊𝒅 𝒖𝒓𝒍 𝒑𝒓𝒐𝒗𝒊𝒅𝒆𝒅!');
      }

      if (url && url[0].includes('pastebin')) {
        try {
          const response = await axios.get(url[0]);
          const data = response.data;
          const filePath = resolve(__dirname, '..', '..', 'scripts', 'cmds', `${args[0]}.js`);
          
          await fs.writeFile(filePath, data, "utf-8");
          return message.reply(`𝑪𝒐𝒅𝒆 ${args[0]}.js 𝒆 𝒂𝒑𝒍𝒂𝒊 𝒉𝒐𝒊𝒆𝒄𝒉𝒆, 𝒖𝒔𝒆 𝒌𝒐𝒓𝒕𝒆 𝒍𝒐𝒂𝒅 𝒄𝒐𝒎𝒎𝒂𝒏𝒅!`);
          
        } catch (error) {
          console.error(error);
          return message.reply(`𝑫𝒐𝒘𝒏𝒍𝒐𝒂𝒅 𝒆𝒓𝒓𝒐𝒓: ${error.message}`);
        }
      } 
      else if (url && (url[0].includes('buildtool') || url[0].includes('tinyurl.com'))) {
        return new Promise((resolve) => {
          const options = {
            method: 'GET',
            url: messageReply.body
          };
          
          request(options, async function (error, response, body) {
            if (error) {
              return message.reply('𝑺𝒐𝒅𝒉𝒐 𝒍𝒊𝒏𝒌 𝒆𝒊 𝒓𝒆𝒑𝒍𝒚 𝒌𝒂𝒓𝒐 (𝒍𝒊𝒏𝒌 𝒃𝒂𝒅𝒆 𝒂𝒓 𝒌𝒊𝒄𝒉𝒖 𝒏𝒂)');
            }
            
            try {
              const load = cheerio.load(body);
              let code = "";
              
              load('.language-js').each((index, el) => {
                if (index !== 0) return;
                code = el.children[0].data;
              });
              
              if (!code) {
                return message.reply('𝑵𝒐 𝒄𝒐𝒅𝒆 𝒇𝒐𝒖𝒏𝒅 𝒐𝒏 𝒕𝒉𝒆 𝒑𝒂𝒈𝒆!');
              }
              
              const filePath = resolve(__dirname, '..', '..', 'scripts', 'cmds', `${args[0]}.js`);
              await fs.writeFile(filePath, code, "utf-8");
              
              await message.reply(`"${args[0]}.js" 𝒄𝒐𝒅𝒆 𝒂𝒅𝒅 𝒌𝒐𝒓𝒂 𝒉𝒐𝒊𝒆𝒄𝒉𝒆, 𝒖𝒔𝒆 𝒌𝒐𝒓𝒕𝒆 𝒍𝒐𝒂𝒅 𝒄𝒐𝒎𝒎𝒂𝒏𝒅!`);
              resolve();
            } catch (err) {
              console.error(err);
              await message.reply(`"${args[0]}.js" 𝒆 𝒏𝒐𝒕𝒖𝒏 𝒄𝒐𝒅𝒆 𝒂𝒑𝒍𝒂𝒊 𝒌𝒐𝒓𝒂𝒓 𝒔𝒐𝒎𝒐𝒚 𝒆𝒓𝒓𝒐𝒓 𝒉𝒐𝒊𝒆𝒄𝒉𝒆!`);
              resolve();
            }
          });
        });
      }
      else if (url && url[0].includes('drive.google')) {
        try {
          const id = url[0].match(/[-\w]{25,}/);
          const filePath = resolve(__dirname, '..', '..', 'scripts', 'cmds', `${args[0]}.js`);
          
          // Using axios to download the file
          const response = await axios({
            method: 'GET',
            url: `https://drive.google.com/uc?id=${id}&export=download`,
            responseType: 'stream'
          });
          
          const writer = fs.createWriteStream(filePath);
          response.data.pipe(writer);
          
          writer.on('finish', async () => {
            await message.reply(`"${args[0]}.js" 𝒄𝒐𝒅𝒆 𝒂𝒅𝒅 𝒌𝒐𝒓𝒂 𝒉𝒐𝒊𝒆𝒄𝒉𝒆, 𝒆𝒓𝒓𝒐𝒓 𝒉𝒐𝒍𝒆 𝒅𝒓𝒊𝒗𝒆 𝒇𝒂𝒊𝒍𝒆 𝒕𝒙𝒕 𝒕𝒆 𝒄𝒉𝒂𝒏𝒈𝒆 𝒌𝒐𝒓𝒐!`);
          });
          
          writer.on('error', async (err) => {
            await message.reply(`"${args[0]}.js" 𝒆 𝒏𝒐𝒕𝒖𝒏 𝒄𝒐𝒅𝒆 𝒂𝒑𝒍𝒂𝒊 𝒌𝒐𝒓𝒂𝒓 𝒔𝒐𝒎𝒐𝒚 𝒆𝒓𝒓𝒐𝒓 𝒉𝒐𝒊𝒆𝒄𝒉𝒆!`);
          });
        } catch (e) {
          console.error(e);
          return message.reply(`𝑫𝒓𝒊𝒗𝒆 𝒅𝒐𝒘𝒏𝒍𝒐𝒂𝒅 𝒆𝒓𝒓𝒐𝒓: ${e.message}`);
        }
      }
      else {
        return message.reply('𝑼𝒏𝒔𝒖𝒑𝒑𝒐𝒓𝒕𝒆𝒅 𝒖𝒓𝒍 𝒕𝒚𝒑𝒆! 𝑶𝒏𝒍𝒚 𝑷𝒂𝒔𝒕𝒆𝒃𝒊𝒏, 𝑩𝒖𝒊𝒍𝒅𝒕𝒐𝒐𝒍, 𝒂𝒏𝒅 𝑮𝒐𝒐𝒈𝒍𝒆 𝑫𝒓𝒊𝒗𝒆 𝒂𝒓𝒆 𝒔𝒖𝒑𝒑𝒐𝒓𝒕𝒆𝒅.');
      }
      
    } catch (error) {
      console.error("ADC Command Error:", error);
      await message.reply("❌ 𝑬𝒓𝒓𝒐𝒓: " + error.message);
    }
  }
};
