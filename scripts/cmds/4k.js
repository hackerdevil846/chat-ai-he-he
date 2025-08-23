const fs = require("fs-extra");
const axios = require("axios");

const ARYAN_API = "ArYANAHMEDRUDRO";

module.exports.config = {
    name: "4k",
    version: "1.0.1",
    hasPermssion: 0,
    credits: "𝑨𝒔𝒊𝒇 𝑴𝒂𝒉𝒎𝒖𝒅",
    description: "Enhance photos to stunning 4K resolution",
    commandCategory: "edit-img",
    usages: "Reply to an image or provide image URL",
    cooldowns: 10,
    dependencies: {
        axios: "",
        "fs-extra": ""
    },
    envConfig: {
        ARYAN_API_KEY: ARYAN_API
    }
};

module.exports.run = async function({ api, event, args }) {
    const { threadID, messageID, senderID, messageReply } = event;
    const tempPath = __dirname + `/cache/4k_${Date.now()}_${senderID}.jpg`;

    try {
        let imageUrl;
        if (messageReply && messageReply.attachments && messageReply.attachments.length > 0) {
            const attachment = messageReply.attachments[0];
            if (["photo", "sticker"].includes(attachment.type)) {
                imageUrl = attachment.url;
            } else {
                return api.sendMessage("⚠️ Please reply to a valid image or sticker.", threadID, messageID);
            }
        } else if (args[0] && /^https?:\/\//.test(args[0])) {
            imageUrl = args[0];
        } else {
            return api.sendMessage(
                `📸 Please reply to an image or provide a valid image URL.\nExample: ${global.config.PREFIX}4k [image_url]`,
                threadID,
                messageID
            );
        }

        const waitMsg = await api.sendMessage("🖼️ Enhancing your image to 4K... Please wait.", threadID);

        const enhancementUrl = `https://aryan-xyz-upscale-api-phi.vercel.app/api/upscale-image?imageUrl=${encodeURIComponent(imageUrl)}&apikey=${ARYAN_API}`;
        const { data } = await axios.get(enhancementUrl, { timeout: 60000 });

        if (!data || !data.resultImageUrl) throw new Error("Invalid API response: No result image URL");

        const imageResponse = await axios.get(data.resultImageUrl, {
            responseType: "arraybuffer",
            timeout: 120000
        });

        fs.writeFileSync(tempPath, imageResponse.data);

        await api.sendMessage({
            body: "✅ Image enhanced to 4K successfully!",
            attachment: fs.createReadStream(tempPath)
        }, threadID);

        api.unsendMessage(waitMsg.messageID);
        fs.unlinkSync(tempPath);

    } catch (error) {
        console.error("4K Error:", error);
        let errorText = "❌ Failed to enhance image. ";

        if (error.message.includes("timeout")) {
            errorText += "The request timed out. Please try again later.";
        } else if (error.message.includes("resultImageUrl")) {
            errorText += "API did not return a valid image URL.";
        } else {
            errorText += `Error: ${error.message}`;
        }

        api.sendMessage(errorText, threadID, messageID);
        if (fs.existsSync(tempPath)) fs.unlinkSync(tempPath);
    }
};
