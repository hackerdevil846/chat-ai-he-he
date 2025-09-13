const axios = require("axios");
const fs = require("fs-extra");
const request = require("request");

module.exports.config = {
    name: "fbcover",
    aliases: ["cover", "fbcoverv2"],
    version: "1.0.9",
    author: "𝐴𝑠𝑖𝑓 𝑀𝑎ℎ𝑚𝑢𝑑",
    countDown: 0,
    role: 0,
    category: "𝑖𝑚𝑎𝑔𝑒-𝑔𝑒𝑛𝑒𝑟𝑎𝑡𝑜𝑟",
    shortDescription: {
        en: "🎨 𝐶𝑢𝑠𝑡𝑜𝑚 𝐹𝑎𝑐𝑒𝑏𝑜𝑜𝑘 𝑐𝑜𝑣𝑒𝑟 𝑔𝑒𝑛𝑒𝑟𝑎𝑡𝑜𝑟"
    },
    longDescription: {
        en: "🎨 𝐶𝑢𝑠𝑡𝑜𝑚 𝐹𝑎𝑐𝑒𝑏𝑜𝑜𝑘 𝑐𝑜𝑣𝑒𝑟 𝑔𝑒𝑛𝑒𝑟𝑎𝑡𝑜𝑟 𝑤𝑖𝑡ℎ 𝑝𝑒𝑟𝑠𝑜𝑛𝑎𝑙𝑖𝑧𝑒𝑑 𝑖𝑛𝑓𝑜𝑟𝑚𝑎𝑡𝑖𝑜𝑛"
    },
    guide: {
        en: "{p}fbcover"
    },
    dependencies: {
        "fs-extra": "",
        "request": "",
        "axios": ""
    }
};

module.exports.onStart = async function({ api, event, args }) {
    const { threadID, messageID, senderID } = event;
    
    if (!args[0]) {
        api.sendMessage(`🎨 | 𝐴𝑝𝑛𝑖 𝑐𝑜𝑛𝑡𝑖𝑛𝑢𝑒 𝑘𝑜𝑟𝑡𝑒 𝑐𝑎𝑖𝑠𝑜𝑛? 𝑅𝑒𝑝𝑙𝑦 𝑘𝑜𝑟𝑒 𝑛𝑖𝑗𝑒𝑟 𝑗𝑜𝑛𝑛𝑜 𝐻𝑎𝑛`, threadID, (err, info) => {
            global.client.handleReply.push({
                type: "characters",
                name: this.config.name,
                author: senderID,
                messageID: info.messageID
            });
        }, messageID);
    }
};

module.exports.onReply = async function({ api, event, handleReply }) {
    const { threadID, messageID, senderID, body } = event;
    
    if (handleReply.author !== senderID) return;
    
    const userInfo = await api.getUserInfo(senderID);
    const nameSender = userInfo[senderID].name;
    const arraytag = [{ id: senderID, tag: nameSender }];
    
    switch (handleReply.type) {
        case "characters": {
            api.unsendMessage(handleReply.messageID);
            api.sendMessage(`📛 | 𝑅𝑒𝑝𝑙𝑦 𝑘𝑜𝑟𝑒 𝑛𝑖𝑗𝑒𝑟 𝑝𝑟𝑖𝑚𝑎𝑟𝑦 𝑛𝑎𝑚𝑒 𝑙𝑖𝑘ℎ𝑎𝑛`, threadID, (err, info) => {
                global.client.handleReply.push({
                    type: "subname",
                    name: "fbcover",
                    author: senderID,
                    characters: body,
                    messageID: info.messageID
                });
            }, messageID);
            break;
        }
        
        case "subname": {
            api.unsendMessage(handleReply.messageID);
            api.sendMessage(`✅ | 𝐴𝑝𝑛𝑖 𝑒𝑟 𝑝𝑟𝑖𝑚𝑎𝑟𝑦 𝑛𝑎𝑚𝑒: ${body}\n📛 | 𝑅𝑒𝑝𝑙𝑦 𝑘𝑜𝑟𝑒 𝑛𝑖𝑗𝑒𝑟 𝑠𝑒𝑐𝑜𝑛𝑑𝑎𝑟𝑦 𝑛𝑎𝑚𝑒 𝑙𝑖𝑘ℎ𝑎𝑛`, threadID, (err, info) => {
                global.client.handleReply.push({
                    type: "number",
                    name: "fbcover",
                    author: senderID,
                    characters: handleReply.characters,
                    name_s: body,
                    messageID: info.messageID
                });
            }, messageID);
            break;
        }
        
        case "number": {
            api.unsendMessage(handleReply.messageID);
            api.sendMessage(`✅ | 𝐴𝑝𝑛𝑖 𝑒𝑟 𝑠𝑒𝑐𝑜𝑛𝑑𝑎𝑟𝑦 𝑛𝑎𝑚𝑒: ${body}\n📞 | 𝑅𝑒𝑝𝑙𝑦 𝑘𝑜𝑟𝑒 𝑛𝑖𝑗𝑒𝑟 𝑝ℎ𝑜𝑛𝑒 𝑛𝑢𝑚𝑏𝑒𝑟 𝑙𝑖𝑘ℎ𝑎𝑛`, threadID, (err, info) => {
                global.client.handleReply.push({
                    type: "address",
                    name: "fbcover",
                    author: senderID,
                    characters: handleReply.characters,
                    subname: body,
                    name_s: handleReply.name_s,
                    messageID: info.messageID
                });
            }, messageID);
            break;
        }
        
        case "address": {
            api.unsendMessage(handleReply.messageID);
            api.sendMessage(`✅ | 𝐴𝑝𝑛𝑖 𝑒𝑟 𝑝ℎ𝑜𝑛𝑒 𝑛𝑢𝑚𝑏𝑒𝑟: ${body}\n🏠 | 𝑅𝑒𝑝𝑙𝑦 𝑘𝑜𝑟𝑒 𝑛𝑖𝑗𝑒𝑟 𝑎𝑑𝑑𝑟𝑒𝑠𝑠 𝑙𝑖𝑘ℎ𝑎𝑛`, threadID, (err, info) => {
                global.client.handleReply.push({
                    type: "email",
                    name: "fbcover",
                    author: senderID,
                    characters: handleReply.characters,
                    subname: handleReply.subname,
                    number: body,
                    name_s: handleReply.name_s,
                    messageID: info.messageID
                });
            }, messageID);
            break;
        }
        
        case "email": {
            api.unsendMessage(handleReply.messageID);
            api.sendMessage(`✅ | 𝐴𝑝𝑛𝑖 𝑒𝑟 𝑎𝑑𝑑𝑟𝑒𝑠𝑠: ${body}\n📧 | 𝑅𝑒𝑝𝑙𝑦 𝑘𝑜𝑟𝑒 𝑛𝑖𝑗𝑒𝑟 𝑒𝑚𝑎𝑖𝑙 𝑙𝑖𝑘ℎ𝑎𝑛`, threadID, (err, info) => {
                global.client.handleReply.push({
                    type: "color",
                    name: "fbcover",
                    author: senderID,
                    characters: handleReply.characters,
                    subname: handleReply.subname,
                    number: handleReply.number,
                    address: body,
                    name_s: handleReply.name_s,
                    messageID: info.messageID
                });
            }, messageID);
            break;
        }
        
        case "color": {
            api.unsendMessage(handleReply.messageID);
            api.sendMessage(`✅ | 𝐴𝑝𝑛𝑖 𝑒𝑟 𝑒𝑚𝑎𝑖𝑙: ${body}\n🎨 | 𝑅𝑒𝑝𝑙𝑦 𝑘𝑜𝑟𝑒 𝑏𝑎𝑐𝑘𝑔𝑟𝑜𝑢𝑛𝑑 𝑐𝑜𝑙𝑜𝑟 𝑒𝑟 𝑛𝑎𝑚 𝑙𝑖𝑘ℎ𝑎𝑛 - 𝐽𝑜𝑑𝑖 𝑛𝑎 𝑐ℎ𝑎𝑖𝑙𝑒 "𝑛𝑜" 𝑙𝑖𝑘ℎ𝑎𝑛`, threadID, (err, info) => {
                global.client.handleReply.push({
                    type: "create",
                    name: "fbcover",
                    author: senderID,
                    characters: handleReply.characters,
                    subname: handleReply.subname,
                    number: handleReply.number,
                    address: handleReply.address,
                    email: body,
                    name_s: handleReply.name_s,
                    messageID: info.messageID
                });
            }, messageID);
            break;
        }
        
        case "create": {
            const { characters, name_s, subname, number, address, email } = handleReply;
            const color = body;
            const uid = senderID;
            
            api.unsendMessage(handleReply.messageID);
            api.sendMessage(`🔄 | 𝐼𝑛𝑖𝑡𝑖𝑎𝑙𝑖𝑧𝑖𝑛𝑔...`, threadID, (err, info) => {
                setTimeout(() => {
                    api.unsendMessage(info.messageID);
                    
                    const callback = () => {
                        api.sendMessage({
                            body: `✨ 𝑆𝑢𝑐𝑐𝑒𝑠𝑠𝑓𝑢𝑙𝑙𝑦 𝐺𝑒𝑛𝑒𝑟𝑎𝑡𝑒𝑑!\n\n👤 𝑆𝑒𝑛𝑑𝑒𝑟 𝑁𝑎𝑚𝑒: ${nameSender}\n📛 𝑁𝑎𝑚𝑒: ${name_s}\n🔖 𝑆𝑢𝑏 𝑁𝑎𝑚𝑒: ${subname}\n🆔 𝐼𝐷: ${uid}\n🎨 𝐶𝑜𝑙𝑜𝑟: ${color}\n🏠 𝐴𝑑𝑑𝑟𝑒𝑠𝑠: ${address}\n📧 𝐸𝑚𝑎𝑖𝑙: ${email}\n📞 𝑃ℎ𝑜𝑛𝑒: ${number}`,
                            mentions: arraytag,
                            attachment: fs.createReadStream(__dirname + "/cache/fbcover.png")
                        }, threadID, () => {
                            if (fs.existsSync(__dirname + "/cache/fbcover.png")) {
                                fs.unlinkSync(__dirname + "/cache/fbcover.png");
                            }
                        }, messageID);
                    };
                    
                    const apiUrl = encodeURI(`https://api.phamvandien.xyz/fbcover/v1?name=${name_s}&uid=${uid}&address=${address}&email=${email}&subname=${subname}&sdt=${number}&color=${color}&apikey=KeyTest`);
                    
                    request(apiUrl)
                        .pipe(fs.createWriteStream(__dirname + '/cache/fbcover.png'))
                        .on('close', callback)
                        .on('error', (err) => {
                            console.error("𝐷𝑜𝑤𝑛𝑙𝑜𝑎𝑑 𝐸𝑟𝑟𝑜𝑟:", err);
                            api.sendMessage("❌ 𝐹𝑎𝑖𝑙𝑒𝑑 𝑡𝑜 𝑔𝑒𝑛𝑒𝑟𝑎𝑡𝑒 𝑐𝑜𝑣𝑒𝑟 𝑖𝑚𝑎𝑔𝑒. 𝑃𝑙𝑒𝑎𝑠𝑒 𝑡𝑟𝑦 𝑎𝑔𝑎𝑖𝑛 𝑙𝑎𝑡𝑒𝑟.", threadID, messageID);
                        });
                }, 1000);
            }, messageID);
            break;
        }
    }
};
