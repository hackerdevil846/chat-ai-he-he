const fs = require("fs-extra");
const axios = require("axios");

const ARYAN_API = "ArYANAHMEDRUDRO";

module.exports.config = {
    name: "4k",
    aliases: ["enhance", "upscale"],
    version: "1.0.1",
    author: "𝐴𝑠𝑖𝑓 𝑀𝑎ℎ𝑚𝑢𝑑",
    countDown: 10,
    role: 0,
    shortDescription: {
        en: "𝐸𝑛ℎ𝑎𝑛𝑐𝑒 𝑝ℎ𝑜𝑡𝑜𝑠 𝑡𝑜 𝑠𝑡𝑢𝑛𝑛𝑖𝑛𝑔 4𝐾 𝑟𝑒𝑠𝑜𝑙𝑢𝑡𝑖𝑜𝑛"
    },
    longDescription: {
        en: "𝐸𝑛ℎ𝑎𝑛𝑐𝑒 𝑖𝑚𝑎𝑔𝑒𝑠 𝑡𝑜 ℎ𝑖𝑔ℎ-𝑞𝑢𝑎𝑙𝑖𝑡𝑦 4𝐾 𝑟𝑒𝑠𝑜𝑙𝑢𝑡𝑖𝑜𝑛 𝑤𝑖𝑡ℎ 𝑎𝑖"
    },
    category: "𝑒𝑑𝑖𝑡-𝑖𝑚𝑔",
    guide: {
        en: "{p}4k [𝑟𝑒𝑝𝑙𝑦 𝑡𝑜 𝑖𝑚𝑎𝑔𝑒 𝑜𝑟 𝑖𝑚𝑎𝑔𝑒 𝑈𝑅𝐿]"
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
                return api.sendMessage("⚠️ 𝑃𝑙𝑒𝑎𝑠𝑒 𝑟𝑒𝑝𝑙𝑦 𝑡𝑜 𝑎 𝑣𝑎𝑙𝑖𝑑 𝑖𝑚𝑎𝑔𝑒 𝑜𝑟 𝑠𝑡𝑖𝑐𝑘𝑒𝑟.", threadID, messageID);
            }
        } else if (args[0] && /^https?:\/\//.test(args[0])) {
            imageUrl = args[0];
        } else {
            return api.sendMessage(
                `📸 𝑃𝑙𝑒𝑎𝑠𝑒 𝑟𝑒𝑝𝑙𝑦 𝑡𝑜 𝑎𝑛 𝑖𝑚𝑎𝑔𝑒 𝑜𝑟 𝑝𝑟𝑜𝑣𝑖𝑑𝑒 𝑎 𝑣𝑎𝑙𝑖𝑑 𝑖𝑚𝑎𝑔𝑒 𝑈𝑅𝐿.\n𝐸𝑥𝑎𝑚𝑝𝑙𝑒: ${global.config.PREFIX}4k [𝑖𝑚𝑎𝑔𝑒_𝑢𝑟𝑙]`,
                threadID,
                messageID
            );
        }

        const waitMsg = await api.sendMessage("🖼️ 𝐸𝑛ℎ𝑎𝑛𝑐𝑖𝑛𝑔 𝑦𝑜𝑢𝑟 𝑖𝑚𝑎𝑔𝑒 𝑡𝑜 4𝐾... 𝑃𝑙𝑒𝑎𝑠𝑒 𝑤𝑎𝑖𝑡.", threadID, messageID);

        const enhancementUrl = `https://aryan-xyz-upscale-api-phi.vercel.app/api/upscale-image?imageUrl=${encodeURIComponent(imageUrl)}&apikey=${ARYAN_API}`;
        const { data } = await axios.get(enhancementUrl, { timeout: 60000 });

        if (!data || !data.resultImageUrl) {
            throw new Error("𝐼𝑛𝑣𝑎𝑙𝑖𝑑 𝐴𝑃𝐼 𝑟𝑒𝑠𝑝𝑜𝑛𝑠𝑒: 𝑁𝑜 𝑟𝑒𝑠𝑢𝑙𝑡 𝑖𝑚𝑎𝑔𝑒 𝑈𝑅𝐿");
        }

        const imageResponse = await axios.get(data.resultImageUrl, {
            responseType: "arraybuffer",
            timeout: 120000
        });

        await fs.writeFileSync(tempPath, imageResponse.data);

        await api.sendMessage({
            body: "✅ 𝐼𝑚𝑎𝑔𝑒 𝑒𝑛ℎ𝑎𝑛𝑐𝑒𝑑 𝑡𝑜 4𝐾 𝑠𝑢𝑐𝑐𝑒𝑠𝑠𝑓𝑢𝑙𝑙𝑦!",
            attachment: fs.createReadStream(tempPath)
        }, threadID);

        api.unsendMessage(waitMsg.messageID);
        fs.unlinkSync(tempPath);

    } catch (error) {
        console.error("4𝐾 𝐸𝑟𝑟𝑜𝑟:", error);
        const { threadID, messageID } = event;
        
        let errorText = "❌ 𝐹𝑎𝑖𝑙𝑒𝑑 𝑡𝑜 𝑒𝑛ℎ𝑎𝑛𝑐𝑒 𝑖𝑚𝑎𝑔𝑒. ";

        if (error.message.includes("timeout")) {
            errorText += "𝑇ℎ𝑒 𝑟𝑒𝑞𝑢𝑒𝑠𝑡 𝑡𝑖𝑚𝑒𝑑 𝑜𝑢𝑡. 𝑃𝑙𝑒𝑎𝑠𝑒 𝑡𝑟𝑦 𝑎𝑔𝑎𝑖𝑛 𝑙𝑎𝑡𝑒𝑟.";
        } else if (error.message.includes("resultImageUrl")) {
            errorText += "𝐴𝑃𝐼 𝑑𝑖𝑑 𝑛𝑜𝑡 𝑟𝑒𝑡𝑢𝑟𝑛 𝑎 𝑣𝑎𝑙𝑖𝑑 𝑖𝑚𝑎𝑔𝑒 𝑈𝑅𝐿.";
        } else {
            errorText += `𝐸𝑟𝑟𝑜𝑟: ${error.message}`;
        }

        await api.sendMessage(errorText, threadID, messageID);
        
        const tempPath = __dirname + `/cache/4k_${Date.now()}_${event.senderID}.jpg`;
        if (fs.existsSync(tempPath)) {
            fs.unlinkSync(tempPath);
        }
    }
};
