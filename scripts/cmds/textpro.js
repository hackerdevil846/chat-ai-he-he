const axios = global.nodemodule["axios"];
const fs = global.nodemodule["fs-extra"];

module.exports.config = {
    name: "textpro",
    version: "1.0",
    hasPermssion: 0,
    credits: "𝑨𝒔𝒊𝒇 𝑴𝒂𝒉𝒎𝒖𝒅",
    description: "𝙏𝙚𝙭𝙩𝙥𝙧𝙤 𝙡𝙤𝙜𝙤 𝙗𝙖𝙣𝙖𝙤 𝙖𝙥𝙣𝙖𝙧 𝙞𝙘𝙘𝙝𝙖𝙢𝙤𝙩𝙤",
    commandCategory: "𝙇𝙤𝙜𝙤-𝙏𝙤𝙤𝙡𝙨",
    usages: "textpro [text]",
    cooldowns: 10
};

module.exports.run = async function ({ api, event, args }) {
    const { threadID, messageID } = event;
    
    if (args.length < 1) {
        return api.sendMessage("❌ 𝙄𝙣𝙫𝙖𝙡𝙞𝙙 𝙘𝙤𝙢𝙢𝙖𝙣𝙙! 𝙐𝙨𝙚: .𝙩𝙚𝙭𝙩𝙥𝙧𝙤 [𝙩𝙚𝙭𝙩]", threadID, messageID);
    }

    const text = args.join(" ");

    if (!text) {
        return api.sendMessage("❌ 𝙋𝙡𝙚𝙖𝙨𝙚 𝙚𝙣𝙩𝙚𝙧 𝙩𝙚𝙭𝙩 𝙛𝙤𝙧 𝙩𝙝𝙚 𝙡𝙤𝙜𝙤", threadID, messageID);
    }

    api.sendMessage("🔄 𝙋𝙧𝙤𝙘𝙚𝙨𝙨𝙞𝙣𝙜 𝙮𝙤𝙪𝙧 𝙡𝙤𝙜𝙤, 𝙥𝙡𝙚𝙖𝙨𝙚 𝙬𝙖𝙞𝙩...", threadID, messageID);

    try {
        // Using Pollinations.AI for text-to-image generation
        const imageUrl = `https://image.pollinations.ai/prompt/${encodeURIComponent(text)}`;
        
        const response = await axios.get(imageUrl, { responseType: "arraybuffer" });
        const imageData = response.data;
        const path = __dirname + `/cache/logo_${Date.now()}.png`;
        fs.writeFileSync(path, Buffer.from(imageData, "binary"));
        
        api.sendMessage({
            body: `✨ 𝙔𝙤𝙪𝙧 𝙡𝙤𝙜𝙤 𝙘𝙧𝙚𝙖𝙩𝙚𝙙 𝙗𝙮 𝑨𝒔𝒊𝒇 𝑴𝒂𝒉𝒎𝒖𝒅\n\n𝙏𝙚𝙭𝙩: ${text}`,
            attachment: fs.createReadStream(path)
        }, threadID, () => fs.unlinkSync(path), messageID);

    } catch (error) {
        console.error(error);
        return api.sendMessage("❌ 𝙇𝙤𝙜𝙤 𝙘𝙧𝙚𝙖𝙩𝙞𝙤𝙣 𝙛𝙖𝙞𝙡𝙚𝙙! 𝙋𝙡𝙚𝙖𝙨𝙚 𝙩𝙧𝙮 𝙖𝙜𝙖𝙞𝙣 𝙡𝙖𝙩𝙚𝙧.", threadID, messageID);
    }
};

