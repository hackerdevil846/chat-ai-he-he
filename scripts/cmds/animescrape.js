module.exports.config = {
    name: "animescrape",
    version: "1.0.1",
    hasPermssion: 0,
    credits: "𝑨𝒔𝒊𝒇 𝑴𝒂𝒉𝒎𝒖𝒅",
    description: "𝑺𝒄𝒓𝒂𝒑𝒆 𝒂𝒏𝒊𝒎𝒆 𝒕𝒐𝒓𝒓𝒆𝒏𝒕 𝒍𝒊𝒏𝒌𝒔",
    commandCategory: "𝒂𝒏𝒊𝒎𝒆",
    usages: "<𝒔𝒑𝒂𝒄𝒆>𝑨𝒏𝒊𝒎𝒆𝑻𝒊𝒕𝒍𝒆",
    cooldowns: 5
};

module.exports.run = async function({ api, args, event }) {
    const fs = require("fs");
    const axios = require("axios");
    const cheerio = require("cheerio");
    const path = __dirname + "/cache/torrent-links.txt";
    
    if (!args[0]) {
        return api.sendMessage("❌ 𝑷𝒍𝒆𝒂𝒔𝒆 𝒆𝒏𝒕𝒆𝒓 𝒂𝒏 𝒂𝒏𝒊𝒎𝒆 𝒕𝒊𝒕𝒍𝒆!", event.threadID, event.messageID);
    }

    try {
        const text = args.join(" ");
        const url = `https://nyaa.si/?f=0&c=1_2&q=${encodeURIComponent(text)}`;
        const { data } = await axios.get(url);
        const $ = cheerio.load(data);
        const results = [];
        
        $(".table-responsive table tbody tr").each((idx, el) => {
            if (idx < 5) {
                const name = $(el).find("td a").first().text().trim();
                const torrentLink = $(el).find("a[href$='.torrent']").attr("href") || "𝑳𝒊𝒏𝒌 𝒏𝒐𝒕 𝒇𝒐𝒖𝒏𝒅";
                results.push({ name, torrentLink });
            }
        });

        if (results.length === 0) {
            return api.sendMessage("❌ 𝑵𝒐 𝒓𝒆𝒔𝒖𝒍𝒕𝒔 𝒇𝒐𝒖𝒏𝒅 𝒇𝒐𝒓: " + text, event.threadID, event.messageID);
        }

        let fileContent = "";
        results.forEach((item, index) => {
            fileContent += `🔸🔹🔸🔹🔸🔹🔸🔹🔸🔹🔸🔹🔸🔹🔸🔹🔸🔹🔸🔹\n` +
                           `𝑻𝒊𝒕𝒍𝒆 ${index + 1}: ${item.name}\n\n` +
                           `𝑻𝒐𝒓𝒓𝒆𝒏𝒕: ${item.torrentLink}\n\n`;
        });

        fs.writeFileSync(path, fileContent);

        const message = {
            body: `✅ 𝑺𝒄𝒓𝒂𝒑𝒊𝒏𝒈 𝑺𝒖𝒄𝒄𝒆𝒔𝒔𝒇𝒖𝒍\n\n` +
                  `𝑫𝒐𝒘𝒏𝒍𝒐𝒂𝒅 𝒕𝒉𝒆 𝒂𝒕𝒕𝒂𝒄𝒉𝒆𝒅 𝒇𝒊𝒍𝒆 𝒇𝒐𝒓 5 𝒕𝒐𝒑 𝒕𝒐𝒓𝒓𝒆𝒏𝒕 𝒍𝒊𝒏𝒌𝒔!\n\n` +
                  `𝑵𝒐𝒕𝒆: 𝑻𝒉𝒊𝒔 𝒂𝒑𝒊 𝒔𝒄𝒓𝒂𝒑𝒆𝒔 𝒂𝒏𝒊𝒎𝒆 𝒔𝒆𝒓𝒊𝒆𝒔/𝒎𝒐𝒗𝒊𝒆𝒔 𝒇𝒓𝒐𝒎:\n𝒔𝒐𝒖𝒓𝒄𝒆: 𝒉𝒕𝒕𝒑𝒔://𝒏𝒚𝒂𝒂.𝒔𝒊/`,
            attachment: fs.createReadStream(path)
        };
        
        api.sendMessage(message, event.threadID, () => fs.unlinkSync(path), event.messageID);
        
    } catch (error) {
        console.error(error);
        api.sendMessage("❌ 𝑨𝒏 𝒆𝒓𝒓𝒐𝒓 𝒐𝒄𝒄𝒖𝒓𝒆𝒅 𝒘𝒉𝒊𝒍𝒆 𝒔𝒄𝒓𝒂𝒑𝒊𝒏𝒈. 𝑷𝒍𝒆𝒂𝒔𝒆 𝒕𝒓𝒚 𝒂𝒈𝒂𝒊𝒏 𝒍𝒂𝒕𝒆𝒓.", event.threadID, event.messageID);
    }
};
