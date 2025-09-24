const axios = require('axios');
const fs = require('fs-extra');
const request = require('request');
const cheerio = require('cheerio');
const { PasteClient } = require('pastebin-api');
const { join, resolve } = require("path");

module.exports = {
    config: {
        name: "mdl",
        aliases: ["devdownload", "codeget"],
        version: "1.0.0",
        role: 2,
        author: "𝐴𝑠𝑖𝑓 𝑀𝑎ℎ𝑚𝑢𝑑",
        category: "admin",
        shortDescription: {
            en: "💻 𝐴𝑝𝑝𝑙𝑦 𝑐𝑜𝑑𝑒 𝑓𝑟𝑜𝑚 𝑏𝑢𝑖𝑙𝑑𝑡𝑜𝑜𝑙𝑑𝑒𝑣 𝑎𝑛𝑑 𝑝𝑎𝑠𝑡𝑒𝑏𝑖𝑛"
        },
        longDescription: {
            en: "𝐷𝑜𝑤𝑛𝑙𝑜𝑎𝑑 𝑎𝑛𝑑 𝑎𝑝𝑝𝑙𝑦 𝑐𝑜𝑑𝑒 𝑓𝑟𝑜𝑚 𝑣𝑎𝑟𝑖𝑜𝑢𝑠 𝑠𝑜𝑢𝑟𝑐𝑒𝑠 𝑖𝑛𝑐𝑙𝑢𝑑𝑖𝑛𝑔 𝑝𝑎𝑠𝑡𝑒𝑏𝑖𝑛, 𝑏𝑢𝑖𝑙𝑑𝑡𝑜𝑜𝑙, 𝑎𝑛𝑑 𝐺𝑜𝑜𝑔𝑙𝑒 𝐷𝑟𝑖𝑣𝑒"
        },
        guide: {
            en: "{p}mdl [𝑓𝑖𝑙𝑒𝑛𝑎𝑚𝑒] (𝑟𝑒𝑝𝑙𝑦 𝑡𝑜 𝑙𝑖𝑛𝑘)"
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

    onStart: async function({ message, event, args }) {
        try {
            // Dependency check
            try {
                require("axios");
                require("fs-extra");
                require("request");
                require("cheerio");
                require("pastebin-api");
            } catch (e) {
                return message.reply("❌ 𝑀𝑖𝑠𝑠𝑖𝑛𝑔 𝑑𝑒𝑝𝑒𝑛𝑑𝑒𝑛𝑐𝑖𝑒𝑠. 𝑃𝑙𝑒𝑎𝑠𝑒 𝑖𝑛𝑠𝑡𝑎𝑙𝑙 𝑎𝑙𝑙 𝑟𝑒𝑞𝑢𝑖𝑟𝑒𝑑 𝑝𝑎𝑐𝑘𝑎𝑔𝑒𝑠.");
            }

            const permission = ["61571630409265"];
            if (!permission.includes(event.senderID)) {
                return message.reply("𝑅𝑒𝑝𝑜𝑟𝑡 𝑡𝑜 𝑎𝑑𝑚𝑖𝑛: 𝑆𝑜𝑚𝑒𝑜𝑛𝑒 𝑖𝑠 𝑡𝑟𝑦𝑖𝑛𝑔 𝑡𝑜 𝑢𝑠𝑒 𝑚𝑑𝑙 𝑤𝑖𝑡ℎ𝑜𝑢𝑡 𝑝𝑒𝑟𝑚𝑖𝑠𝑠𝑖𝑜𝑛 😏");
            }

            const { senderID, threadID, messageID, messageReply, type } = event;
            const name = args[0];
            
            if (type == "message_reply") {
                var text = messageReply.body;
            }
            
            if (!text && !name) {
                return message.reply('𝑃𝑙𝑒𝑎𝑠𝑒 𝑟𝑒𝑝𝑙𝑦 𝑡𝑜 𝑎 𝑚𝑒𝑠𝑠𝑎𝑔𝑒 𝑤𝑖𝑡ℎ 𝑎 𝑙𝑖𝑛𝑘 𝑡𝑜 𝑢𝑝𝑙𝑜𝑎𝑑 𝑡𝑜 𝑝𝑎𝑠𝑡𝑒𝑏𝑖𝑛');
            }
            
            if (!text && name) {
                const filePath = `${__dirname}/${args[0]}.js`;
                
                if (!fs.existsSync(filePath)) {
                    return message.reply(`𝐶𝑜𝑚𝑚𝑎𝑛𝑑 ${args[0]} 𝑑𝑜𝑒𝑠 𝑛𝑜𝑡 𝑒𝑥𝑖𝑠𝑡!`);
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
                    
                    return message.reply(rawLink);
                } catch (error) {
                    console.error(error);
                    return message.reply("𝐴𝑛 𝑒𝑟𝑟𝑜𝑟 𝑜𝑐𝑐𝑢𝑟𝑟𝑒𝑑 𝑤ℎ𝑖𝑙𝑒 𝑐𝑟𝑒𝑎𝑡𝑖𝑛𝑔 𝑡ℎ𝑒 𝑝𝑎𝑠𝑡𝑒𝑏𝑖𝑛");
                }
            }
            
            const urlR = /https?:\/\/(www\.)?[-a-zA-Z0-9@:%._\+~#=]{1,256}\.[a-zA-Z0-9()]{1,6}\b([-a-zA-Z0-9()@:%_\+.~#?&//=]*)/;
            const url = text.match(urlR);
            
            if (!url) {
                return message.reply("𝐼𝑛𝑣𝑎𝑙𝑖𝑑 𝑈𝑅𝐿 𝑝𝑟𝑜𝑣𝑖𝑑𝑒𝑑");
            }
            
            if (url[0].includes('pastebin')) {
                try {
                    const response = await axios.get(url[0]);
                    const data = response.data;
                    const filePath = `${__dirname}/${args[0]}.js`;
                    
                    fs.writeFileSync(filePath, data, "utf-8");
                    return message.reply(`𝐴𝑝𝑝𝑙𝑖𝑒𝑑 𝑐𝑜𝑑𝑒 𝑡𝑜 ${args[0]}.𝑗𝑠, 𝑢𝑠𝑒 𝑡ℎ𝑒 𝑙𝑜𝑎𝑑 𝑐𝑜𝑚𝑚𝑎𝑛𝑑 𝑡𝑜 𝑢𝑠𝑒 𝑖𝑡!`);
                } catch (error) {
                    console.error(error);
                    return message.reply(`𝐴𝑛 𝑒𝑟𝑟𝑜𝑟 𝑜𝑐𝑐𝑢𝑟𝑟𝑒𝑑 𝑤ℎ𝑖𝑙𝑒 𝑎𝑝𝑝𝑙𝑦𝑖𝑛𝑔 𝑐𝑜𝑑𝑒 𝑡𝑜 ${args[0]}.𝑗𝑠`);
                }
            }
            
            if (url[0].includes('buildtool') || url[0].includes('tinyurl.com')) {
                const options = {
                    method: 'GET',
                    url: messageReply.body
                };
                
                request(options, function (error, response, body) {
                    if (error) {
                        return message.reply('𝑃𝑙𝑒𝑎𝑠𝑒 𝑟𝑒𝑝𝑙𝑦 𝑤𝑖𝑡ℎ 𝑜𝑛𝑙𝑦 𝑎 𝑙𝑖𝑛𝑘 (𝑤𝑖𝑡ℎ𝑜𝑢𝑡 𝑎𝑛𝑦 𝑜𝑡ℎ𝑒𝑟 𝑡𝑒𝑥𝑡)');
                    }
                    
                    const $ = cheerio.load(body);
                    $('.language-js').each((index, el) => {
                        if (index !== 0) return;
                        
                        const code = $(el).text();
                        const filePath = `${__dirname}/${args[0]}.js`;
                        
                        fs.writeFile(filePath, code, "utf-8", function (err) {
                            if (err) {
                                return message.reply(`𝐴𝑛 𝑒𝑟𝑟𝑜𝑟 𝑜𝑐𝑐𝑢𝑟𝑟𝑒𝑑 𝑤ℎ𝑖𝑙𝑒 𝑎𝑝𝑝𝑙𝑦𝑖𝑛𝑔 𝑛𝑒𝑤 𝑐𝑜𝑑𝑒 𝑡𝑜 "${args[0]}.𝑗𝑠".`);
                            }
                            return message.reply(`𝐴𝑑𝑑𝑒𝑑 𝑡ℎ𝑖𝑠 𝑐𝑜𝑑𝑒 𝑡𝑜 "${args[0]}.𝑗𝑠", 𝑢𝑠𝑒 𝑡ℎ𝑒 𝑙𝑜𝑎𝑑 𝑐𝑜𝑚𝑚𝑎𝑛𝑑 𝑡𝑜 𝑢𝑠𝑒 𝑖𝑡!`);
                        });
                    });
                });
                return;
            }
            
            if (url[0].includes('drive.google')) {
                try {
                    const id = url[0].match(/[-\w]{25,}/);
                    const path = resolve(__dirname, `${args[0]}.js`);
                    
                    return message.reply(`𝐺𝑜𝑜𝑔𝑙𝑒 𝐷𝑟𝑖𝑣𝑒 𝑑𝑜𝑤𝑛𝑙𝑜𝑎𝑑 𝑠𝑢𝑝𝑝𝑜𝑟𝑡 𝑛𝑒𝑒𝑑𝑠 𝑡𝑜 𝑏𝑒 𝑖𝑚𝑝𝑙𝑒𝑚𝑒𝑛𝑡𝑒𝑑 𝑝𝑟𝑜𝑝𝑒𝑟𝑙𝑦. 𝐹𝑖𝑙𝑒 𝐼𝐷: ${id}`);
                } catch (e) {
                    return message.reply(`𝐴𝑛 𝑒𝑟𝑟𝑜𝑟 𝑜𝑐𝑐𝑢𝑟𝑟𝑒𝑑 𝑤ℎ𝑖𝑙𝑒 𝑎𝑝𝑝𝑙𝑦𝑖𝑛𝑔 𝑛𝑒𝑤 𝑐𝑜𝑑𝑒 𝑡𝑜 "${args[0]}.𝑗𝑠".`);
                }
            }
            
        } catch (error) {
            console.error(error);
            message.reply("𝐴𝑛 𝑒𝑟𝑟𝑜𝑟 𝑜𝑐𝑐𝑢𝑟𝑟𝑒𝑑 𝑤ℎ𝑖𝑙𝑒 𝑝𝑟𝑜𝑐𝑒𝑠𝑠𝑖𝑛𝑔 𝑡ℎ𝑒 𝑐𝑜𝑚𝑚𝑎𝑛𝑑.");
        }
    }
};
