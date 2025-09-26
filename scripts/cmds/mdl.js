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
                return;
            }

            const permission = ["61571630409265"];
            if (!permission.includes(event.senderID)) {
                return;
            }

            const { senderID, threadID, messageID, messageReply, type } = event;
            const name = args[0];
            
            if (type == "message_reply") {
                var text = messageReply.body;
            }
            
            if (!text && !name) {
                return message.reply('💡 𝑃𝑙𝑒𝑎𝑠𝑒 𝑟𝑒𝑝𝑙𝑦 𝑡𝑜 𝑎 𝑚𝑒𝑠𝑠𝑎𝑔𝑒 𝑤𝑖𝑡ℎ 𝑎 𝑙𝑖𝑛𝑘 𝑜𝑟 𝑝𝑟𝑜𝑣𝑖𝑑𝑒 𝑎 𝑓𝑖𝑙𝑒𝑛𝑎𝑚𝑒');
            }
            
            if (!text && name) {
                const filePath = `${__dirname}/${args[0]}.js`;
                
                if (!fs.existsSync(filePath)) {
                    return message.reply(`❌ 𝐶𝑜𝑚𝑚𝑎𝑛𝑑 "${args[0]}" 𝑑𝑜𝑒𝑠 𝑛𝑜𝑡 𝑒𝑥𝑖𝑠𝑡!`);
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
                    
                    return message.reply(`📋 𝑃𝑎𝑠𝑡𝑒𝑏𝑖𝑛 𝑐𝑟𝑒𝑎𝑡𝑒𝑑: ${rawLink}`);
                } catch (error) {
                    console.error(error);
                    return;
                }
            }
            
            const urlR = /https?:\/\/(www\.)?[-a-zA-Z0-9@:%._\+~#=]{1,256}\.[a-zA-Z0-9()]{1,6}\b([-a-zA-Z0-9()@:%_\+.~#?&//=]*)/;
            const url = text.match(urlR);
            
            if (!url) {
                return message.reply("❌ 𝐼𝑛𝑣𝑎𝑙𝑖𝑑 𝑈𝑅𝐿 𝑝𝑟𝑜𝑣𝑖𝑑𝑒𝑑");
            }
            
            if (url[0].includes('pastebin')) {
                try {
                    const response = await axios.get(url[0].includes('raw') ? url[0] : url[0].replace('pastebin.com', 'pastebin.com/raw'));
                    const data = response.data;
                    const filePath = `${__dirname}/${args[0]}.js`;
                    
                    fs.writeFileSync(filePath, data, "utf-8");
                    return message.reply(`✅ 𝐴𝑝𝑝𝑙𝑖𝑒𝑑 𝑐𝑜𝑑𝑒 𝑡𝑜 ${args[0]}.𝑗𝑠\n💡 𝑈𝑠𝑒: ${global.config.PREFIX}𝑙𝑜𝑎𝑑 ${args[0]}`);
                } catch (error) {
                    console.error(error);
                    return;
                }
            }
            
            if (url[0].includes('buildtool') || url[0].includes('tinyurl.com')) {
                return new Promise((resolve) => {
                    const options = {
                        method: 'GET',
                        url: messageReply.body
                    };
                    
                    request(options, function (error, response, body) {
                        if (error) {
                            return message.reply('❌ 𝐹𝑎𝑖𝑙𝑒𝑑 𝑡𝑜 𝑓𝑒𝑡𝑐ℎ 𝑙𝑖𝑛𝑘');
                        }
                        
                        const $ = cheerio.load(body);
                        $('.language-js').each((index, el) => {
                            if (index !== 0) return;
                            
                            const code = $(el).text();
                            const filePath = `${__dirname}/${args[0]}.js`;
                            
                            fs.writeFile(filePath, code, "utf-8", function (err) {
                                if (err) {
                                    console.error(err);
                                    return;
                                }
                                return message.reply(`✅ 𝐴𝑑𝑑𝑒𝑑 𝑐𝑜𝑑𝑒 𝑡𝑜 "${args[0]}.𝑗𝑠"\n💡 𝑈𝑠𝑒: ${global.config.PREFIX}𝑙𝑜𝑎𝑑 ${args[0]}`);
                            });
                        });
                    });
                });
            }
            
            if (url[0].includes('drive.google')) {
                try {
                    return message.reply("🔧 𝐺𝑜𝑜𝑔𝑙𝑒 𝐷𝑟𝑖𝑣𝑒 𝑠𝑢𝑝𝑝𝑜𝑟𝑡 𝑖𝑠 𝑐𝑢𝑟𝑟𝑒𝑛𝑡𝑙𝑦 𝑢𝑛𝑑𝑒𝑟 𝑑𝑒𝑣𝑒𝑙𝑜𝑝𝑚𝑒𝑛𝑡");
                } catch (e) {
                    console.error(e);
                    return;
                }
            }
            
        } catch (error) {
            console.error(error);
            // Don't send error message to avoid spam
        }
    }
};
