const axios = require("axios");
const fs = require("fs-extra");

module.exports.config = {
    name: "textpro",
    version: "1.0",
    hasPermssion: 0,
    credits: "𝑨𝒔𝒊𝒇 𝑴𝒂𝒉𝒎𝒖𝒅",
    description: "✨ Textpro logo বানাও নিজের ইচ্ছামতো টেক্সট দিয়ে",
    category: "𝙇𝙤𝙜𝙤-𝙏𝙤𝙤𝙡𝙨",
    usages: "textpro [text]",
    cooldowns: 10,
    dependencies: {
        "axios": "latest",
        "fs-extra": "latest"
    }
};

module.exports.onStart = async function ({ api, event, args }) {
    const { threadID, messageID } = event;

    // Check if user provided text
    if (!args.length) {
        return api.sendMessage("❌ Invalid command! Use: .textpro [text]", threadID, messageID);
    }

    const text = args.join(" ");
    if (!text) return api.sendMessage("❌ Please enter text for the logo!", threadID, messageID);

    // Notify user about processing
    api.sendMessage("🔄 Processing your logo, please wait...", threadID, messageID);

    try {
        // Pollinations.AI text-to-image
        const imageUrl = `https://image.pollinations.ai/prompt/${encodeURIComponent(text)}`;

        const response = await axios.get(imageUrl, { responseType: "arraybuffer" });
        const imageData = response.data;
        const path = __dirname + `/cache/logo_${Date.now()}.png`;

        fs.writeFileSync(path, Buffer.from(imageData, "binary"));

        api.sendMessage({
            body: `✨ Your logo has been created by 𝑨𝒔𝒊𝒇 𝑴𝒂𝒉𝒎𝒖𝒅\n\n📝 Text: ${text}`,
            attachment: fs.createReadStream(path)
        }, threadID, () => fs.unlinkSync(path), messageID);

    } catch (error) {
        console.error(error);
        return api.sendMessage("❌ Logo creation failed! Please try again later.", threadID, messageID);
    }
};
