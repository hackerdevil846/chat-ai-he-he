const fs = require("fs-extra");
const axios = require("axios");

const ARYAN_API = "ArYANAHMEDRUDRO";

module.exports.config = {
    name: "4k",
    aliases: ["enhance", "upscale"],
    version: "1.0.1",
    author: "Asif Mahmud",
    countDown: 10,
    role: 0,
    shortDescription: {
        en: "Enhance photos to stunning 4K resolution"
    },
    longDescription: {
        en: "Enhance images to high-quality 4K resolution with ai"
    },
    category: "edit-img",
    guide: {
        en: "{p}4k [reply to image or image URL]"
    },
    dependencies: {
        "axios": "",
        "fs-extra": ""
    },
    envConfig: {
        "ARYAN_API_KEY": ARYAN_API
    }
};

module.exports.onStart = async function({ api, event, args }) {
    try {
        const { threadID, messageID, senderID, messageReply } = event;
        const tempPath = __dirname + `/cache/4k_${Date.now()}_${senderID}.jpg`;

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

        const waitMsg = await api.sendMessage("🖼️ Enhancing your image to 4K... Please wait.", threadID, messageID);

        const enhancementUrl = `https://aryan-xyz-upscale-api-phi.vercel.app/api/upscale-image?imageUrl=${encodeURIComponent(imageUrl)}&apikey=${ARYAN_API}`;
        const { data } = await axios.get(enhancementUrl, { timeout: 60000 });

        if (!data || !data.resultImageUrl) {
            throw new Error("Invalid API response: No result image URL");
        }

        const imageResponse = await axios.get(data.resultImageUrl, {
            responseType: "arraybuffer",
            timeout: 120000
        });

        await fs.writeFileSync(tempPath, imageResponse.data);

        await api.sendMessage({
            body: "✅ Image enhanced to 4K successfully!",
            attachment: fs.createReadStream(tempPath)
        }, threadID);

        api.unsendMessage(waitMsg.messageID);
        fs.unlinkSync(tempPath);

    } catch (error) {
        console.error("4K Error:", error);
        const { threadID, messageID } = event;
        
        let errorText = "❌ Failed to enhance image. ";

        if (error.message.includes("timeout")) {
            errorText += "The request timed out. Please try again later.";
        } else if (error.message.includes("resultImageUrl")) {
            errorText += "API did not return a valid image URL.";
        } else {
            errorText += `Error: ${error.message}`;
        }

        await api.sendMessage(errorText, threadID, messageID);
        
        const tempPath = __dirname + `/cache/4k_${Date.now()}_${event.senderID}.jpg`;
        if (fs.existsSync(tempPath)) {
            fs.unlinkSync(tempPath);
        }
    }
};
