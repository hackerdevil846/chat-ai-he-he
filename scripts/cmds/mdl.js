const axios = require('axios');
const fs = require('fs-extra');
const request = require('request');
const cheerio = require('cheerio');
const { PasteClient } = require('pastebin-api');
const { join, resolve } = require("path");

module.exports = {
  config: {
    name: "mdl",
    version: "1.0.0",
    role: 2,
    author: "Asif Mahmud",
    category: "admin",
    shortDescription: {
      en: "Apply code from buildtooldev and pastebin"
    },
    longDescription: {
      en: "Download and apply code from various sources including pastebin, buildtool, and Google Drive"
    },
    guide: {
      en: "mdl [filename] (reply to link)"
    },
    countDown: 0,
    dependencies: {
      "axios": "",
      "fs-extra": "",
      "request": "",
      "cheerio": "",
      "pastebin-api": ""
    }
  },

  onStart: async function ({ api, event, args }) {
    try {
      const permission = ["100067191000400"];
      if (!permission.includes(event.senderID)) {
        return api.sendMessage("Report to admin: Someone is trying to use mdl without permission 😏", event.threadID, event.messageID);
      }

      const { senderID, threadID, messageID, messageReply, type } = event;
      const name = args[0];
      
      if (type == "message_reply") {
        var text = messageReply.body;
      }
      
      if (!text && !name) {
        return api.sendMessage('Please reply to a message with a link to upload to pastebin', threadID, messageID);
      }
      
      if (!text && name) {
        const filePath = `${__dirname}/${args[0]}.js`;
        
        if (!fs.existsSync(filePath)) {
          return api.sendMessage(`Command ${args[0]} does not exist!`, threadID, messageID);
        }
        
        try {
          const data = fs.readFileSync(filePath, "utf-8");
          const client = new PasteClient("R02n6-lNPJqKQCd5VtL4bKPjuK6ARhHb");
          
          const url = await client.createPaste({
            code: data,
            expireDate: 'N',
            format: "javascript",
            name: args[1] || 'noname',
            publicity: 1
          });
          
          const id = url.split('/')[3];
          const rawLink = 'https://pastebin.com/raw/' + id;
          
          return api.sendMessage(rawLink, threadID, messageID);
        } catch (error) {
          console.error(error);
          return api.sendMessage("An error occurred while creating the pastebin", threadID, messageID);
        }
      }
      
      const urlR = /https?:\/\/(www\.)?[-a-zA-Z0-9@:%._\+~#=]{1,256}\.[a-zA-Z0-9()]{1,6}\b([-a-zA-Z0-9()@:%_\+.~#?&//=]*)/;
      const url = text.match(urlR);
      
      if (!url) {
        return api.sendMessage("Invalid URL provided", threadID, messageID);
      }
      
      if (url[0].includes('pastebin')) {
        try {
          const response = await axios.get(url[0]);
          const data = response.data;
          const filePath = `${__dirname}/${args[0]}.js`;
          
          fs.writeFileSync(filePath, data, "utf-8");
          return api.sendMessage(`Applied code to ${args[0]}.js, use the load command to use it!`, threadID, messageID);
        } catch (error) {
          console.error(error);
          return api.sendMessage(`An error occurred while applying code to ${args[0]}.js`, threadID, messageID);
        }
      }
      
      if (url[0].includes('buildtool') || url[0].includes('tinyurl.com')) {
        const options = {
          method: 'GET',
          url: messageReply.body
        };
        
        request(options, function (error, response, body) {
          if (error) {
            return api.sendMessage('Please reply with only a link (without any other text)', threadID, messageID);
          }
          
          const $ = cheerio.load(body);
          $('.language-js').each((index, el) => {
            if (index !== 0) return;
            
            const code = $(el).text();
            const filePath = `${__dirname}/${args[0]}.js`;
            
            fs.writeFile(filePath, code, "utf-8", function (err) {
              if (err) {
                return api.sendMessage(`An error occurred while applying new code to "${args[0]}.js".`, threadID, messageID);
              }
              return api.sendMessage(`Added this code to "${args[0]}.js", use the load command to use it!`, threadID, messageID);
            });
          });
        });
        return;
      }
      
      if (url[0].includes('drive.google')) {
        try {
          const id = url[0].match(/[-\w]{25,}/);
          const path = resolve(__dirname, `${args[0]}.js`);
          
          // This would need a proper Google Drive download implementation
          // For now, we'll just show a message
          return api.sendMessage(`Google Drive download support needs to be implemented properly. File ID: ${id}`, threadID, messageID);
        } catch (e) {
          return api.sendMessage(`An error occurred while applying new code to "${args[0]}.js".`, threadID, messageID);
        }
      }
      
    } catch (error) {
      console.error(error);
      api.sendMessage("An error occurred while processing the command.", event.threadID, event.messageID);
    }
  }
};
