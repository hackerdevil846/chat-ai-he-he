const request = require('request');

module.exports.config = {
    name: "iss",
    version: "1.0.0",
    hasPermssion: 0,
    credits: "𝑨𝒔𝒊𝒇 𝑴𝒂𝒉𝒎𝒖𝒅",
    description: "𝑰𝒏𝒕𝒆𝒓𝒏𝒂𝒕𝒊𝒐𝒏𝒂𝒍 𝑺𝒑𝒂𝒄𝒆 𝑺𝒕𝒂𝒕𝒊𝒐𝒏 𝒆𝒓 𝒄𝒖𝒓𝒓𝒆𝒏𝒕 𝒍𝒐𝒄𝒂𝒕𝒊𝒐𝒏 𝒅𝒆𝒌𝒉𝒖𝒏",
    category: "𝑻𝒐𝒐𝒍",
    usages: "iss",
    cooldowns: 5,
    dependencies: {
        "request": ""
    }
};

module.exports.onStart = async function({ api, event }) {
    try {
        request(`http://api.open-notify.org/iss-now.json`, (err, response, body) => {
            if (err) {
                console.error(err);
                return api.sendMessage("❌ 𝑰𝑺𝑺 𝒍𝒐𝒄𝒂𝒕𝒊𝒐𝒏 𝒋𝒂𝒏𝒕𝒆 𝒑𝒂𝒓𝒄𝒉𝒊𝒏𝒊! 𝑷𝒖𝒏𝒂𝒓 𝒄𝒉𝒆𝒔𝒕𝒂 𝒌𝒐𝒓𝒖𝒏", event.threadID, event.messageID);
            }
            
            try {
                const jsonData = JSON.parse(body);
                api.sendMessage(
                    `🌌 ━━━━━━━━━━━━━━━━━━━━ 🌌\n` +
                    `        𝑰𝑵𝑻𝑬𝑹𝑵𝑨𝑻𝑰𝑶𝑵𝑨𝑳 𝑺𝑷𝑨𝑪𝑬 𝑺𝑻𝑨𝑻𝑰𝑶𝑵\n` +
                    `🌌 ━━━━━━━━━━━━━━━━━━━━ 🌌\n\n` +
                    `📍 𝑳𝒂𝒕𝒊𝒕𝒖𝒅𝒆: ${jsonData.iss_position.latitude}\n` +
                    `📍 𝑳𝒐𝒏𝒈𝒊𝒕𝒖𝒅𝒆: ${jsonData.iss_position.longitude}\n\n` +
                    `🔭 𝑹𝒆𝒂𝒍-𝒕𝒊𝒎𝒆 𝒕𝒓𝒂𝒄𝒌𝒊𝒏𝒈:\n` +
                    `https://spotthestation.nasa.gov/tracking_map.cfm\n\n` +
                    `🛰️ 𝑪𝒖𝒓𝒓𝒆𝒏𝒕 𝒔𝒑𝒆𝒆𝒅: 28,000 𝒌𝒎/𝒉\n` +
                    `🌎 𝑶𝒓𝒃𝒊𝒕 𝒕𝒊𝒎𝒆: 90 𝒎𝒊𝒏𝒖𝒕𝒆𝒔`,
                    event.threadID,
                    event.messageID
                );
            } catch (error) {
                console.error(error);
                api.sendMessage("❌ 𝑫𝒂𝒕𝒂 𝒑𝒓𝒐𝒄𝒆𝒔𝒔 𝒌𝒐𝒓𝒕𝒆 𝒑𝒓𝒐𝒃𝒍𝒆𝒎 𝒉𝒐𝒍𝒐! 𝑷𝒖𝒏𝒂𝒓 𝒄𝒉𝒆𝒔𝒕𝒂 𝒌𝒐𝒓𝒖𝒏", event.threadID, event.messageID);
            }
        });
    } catch (error) {
        console.error(error);
        api.sendMessage("❌ 𝑪𝒐𝒎𝒎𝒂𝒏𝒅 𝒆𝒙𝒆𝒄𝒖𝒕𝒆 𝒌𝒐𝒓𝒕𝒆 𝒑𝒓𝒐𝒃𝒍𝒆𝒎 𝒉𝒐𝒍𝒐!", event.threadID, event.messageID);
    }
};
