const https = require("https");
const fs = require("fs-extra");
const axios = require("axios");

module.exports.config = {
    name: "fluxpro",
    aliases: ["fluxai", "aiimage"],
    version: "2.1",
    author: "𝐴𝑠𝑖𝑓 𝑀𝑎ℎ𝑚𝑢𝑑",
    countDown: 20,
    role: 0,
    category: "image",
    shortDescription: {
        en: "🎨 𝐺𝑒𝑛𝑒𝑟𝑎𝑡𝑒 ℎ𝑖𝑔ℎ-𝑞𝑢𝑎𝑙𝑖𝑡𝑦 𝑖𝑚𝑎𝑔𝑒𝑠 𝑢𝑠𝑖𝑛𝑔 𝐹𝑙𝑢𝑥.1 𝑃𝑟𝑜 𝐴𝐼"
    },
    longDescription: {
        en: "𝐴𝐼-𝑝𝑜𝑤𝑒𝑟𝑒𝑑 𝑖𝑚𝑎𝑔𝑒 𝑔𝑒𝑛𝑒𝑟𝑎𝑡𝑖𝑜𝑛 𝑤𝑖𝑡ℎ 𝑎𝑑𝑣𝑎𝑛𝑐𝑒𝑑 𝑠𝑡𝑦𝑙𝑒 𝑎𝑛𝑑 𝑠𝑖𝑧𝑒 𝑜𝑝𝑡𝑖𝑜𝑛𝑠"
    },
    guide: {
        en: "{p}fluxpro [𝑝𝑟𝑜𝑚𝑝𝑡] --𝑠𝑡𝑦𝑙𝑒 [𝑠𝑡𝑦𝑙𝑒_𝑖𝑑] --𝑠𝑖𝑧𝑒 [𝑑𝑖𝑚𝑒𝑛𝑠𝑖𝑜𝑛𝑠]"
    },
    dependencies: {
        "axios": "",
        "fs-extra": ""
    }
};

module.exports.languages = {
    "en": {
        "missingPrompt": "🔍 𝑃𝑙𝑒𝑎𝑠𝑒 𝑝𝑟𝑜𝑣𝑖𝑑𝑒 𝑎 𝑝𝑟𝑜𝑚𝑝𝑡 𝑓𝑜𝑟 𝑖𝑚𝑎𝑔𝑒 𝑔𝑒𝑛𝑒𝑟𝑎𝑡𝑖𝑜𝑛\n💡 𝐸𝑥𝑎𝑚𝑝𝑙𝑒: .𝑓𝑙𝑢𝑥𝑝𝑟𝑜 𝑓𝑢𝑡𝑢𝑟𝑖𝑠𝑡𝑖𝑐 𝑐𝑖𝑡𝑦𝑠𝑐𝑎𝑝𝑒 --𝑠𝑡𝑦𝑙𝑒 7 --𝑠𝑖𝑧𝑒 1024𝑥768",
        "generating": (prompt) => `🖌️ 𝐺𝑒𝑛𝑒𝑟𝑎𝑡𝑖𝑛𝑔 𝑦𝑜𝑢𝑟 𝑖𝑚𝑎𝑔𝑒 𝑓𝑜𝑟:\n✨ "${prompt}" ...\n\n⏳ 𝑃𝑙𝑒𝑎𝑠𝑒 𝑤𝑎𝑖𝑡...`,
        "success": (prompt, styleId, size, time) =>
            `✅ 𝐹𝑙𝑢𝑥.1 𝑃𝑟𝑜 𝐼𝑚𝑎𝑔𝑒 𝐺𝑒𝑛𝑒𝑟𝑎𝑡𝑒𝑑 𝑆𝑢𝑐𝑐𝑒𝑠𝑠𝑓𝑢𝑙𝑙𝑦!\n\n` +
            `🎨 𝑃𝑟𝑜𝑚𝑝𝑡: ${prompt}\n` +
            `🎭 𝑆𝑡𝑦𝑙𝑒: ${styleId}\n` +
            `📐 𝑆𝑖𝑧𝑒: ${size}\n` +
            `⏱️ 𝑇𝑖𝑚𝑒 𝑇𝑎𝑘𝑒𝑛: ${time}𝑠\n\n✨ 𝐸𝑛𝑗𝑜𝑦 𝑦𝑜𝑢𝑟 𝑚𝑎𝑠𝑡𝑒𝑟𝑝𝑖𝑒𝑐𝑒!`,
        "failed": "❌ 𝐼𝑚𝑎𝑔𝑒 𝑔𝑒𝑛𝑒𝑟𝑎𝑡𝑖𝑜𝑛 𝑓𝑎𝑖𝑙𝑒𝑑."
    }
};

module.exports.onStart = async function({ api, event, args }) {
    try {
        const { threadID, messageID, senderID } = event;
        const tempPath = __dirname + `/cache/fluxpro_${Date.now()}_${senderID}.jpg`;

        if (!args.length) {
            return api.sendMessage(
                module.exports.languages.en.missingPrompt,
                threadID,
                messageID
            );
        }

        let fullInput = args.join(" ");

        let styleId = 4;
        let size = "1024x1024";

        function extractFlag(input, flag) {
            const regex = new RegExp(`--${flag}\\s+(\\S+)`);
            const match = input.match(regex);
            if (match) {
                input = input.replace(match[0], "").trim();
                return { input, value: match[1] };
            }
            return { input, value: null };
        }

        let res = extractFlag(fullInput, "style");
        fullInput = res.input;
        if (res.value && !isNaN(res.value)) styleId = parseInt(res.value);

        res = extractFlag(fullInput, "size");
        fullInput = res.input;
        if (res.value) size = res.value;

        const prompt = fullInput;

        const sizeMap = {
            "1024x1024": "1-1",
            "1024x768": "4-3",
            "768x1024": "3-4",
            "1920x1080": "16-9",
            "1080x1920": "9-16"
        };
        const apiSize = sizeMap[size] || "1-1";

        const processingMsg = await api.sendMessage(
            module.exports.languages.en.generating(prompt),
            threadID,
            messageID
        );

        api.setMessageReaction("⏳", messageID, () => {}, true);

        const postData = JSON.stringify({
            prompt: prompt,
            style_id: styleId,
            size: apiSize
        });

        const options = {
            method: "POST",
            hostname: "ai-text-to-image-generator-flux-free-api.p.rapidapi.com",
            path: "/aaaaaaaaaaaaaaaaaiimagegenerator/quick.php",
            headers: {
                "x-rapidapi-key": "78186a3f74msh516a9d9dd0f051cp19fea6jsnac2a9d4351fb",
                "x-rapidapi-host": "ai-text-to-image-generator-flux-free-api.p.rapidapi.com",
                "Content-Type": "application/json",
                "Content-Length": Buffer.byteLength(postData)
            },
            timeout: 60000
        };

        const startTime = Date.now();

        const imageUrl = await new Promise((resolve, reject) => {
            const req = https.request(options, (res) => {
                let data = "";
                res.on("data", (chunk) => {
                    data += chunk;
                });
                res.on("end", () => {
                    try {
                        const json = JSON.parse(data);
                        if (json.image_url) resolve(json.image_url);
                        else reject(new Error("𝐴𝑃𝐼 𝑑𝑖𝑑 𝑛𝑜𝑡 𝑟𝑒𝑡𝑢𝑟𝑛 𝑎𝑛 𝑖𝑚𝑎𝑔𝑒 𝑈𝑅𝐿"));
                    } catch (e) {
                        reject(e);
                    }
                });
            });

            req.on("error", (err) => reject(err));
            req.on("timeout", () => {
                req.destroy();
                reject(new Error("𝑅𝑒𝑞𝑢𝑒𝑠𝑡 𝑡𝑖𝑚𝑒𝑑 𝑜𝑢𝑡"));
            });

            req.write(postData);
            req.end();
        });

        const imageResponse = await axios.get(imageUrl, {
            responseType: "arraybuffer",
            timeout: 60000
        });

        await fs.outputFile(tempPath, imageResponse.data);

        const generationTime = ((Date.now() - startTime) / 1000).toFixed(1);

        await api.sendMessage(
            {
                body: module.exports.languages.en.success(prompt, styleId, size, generationTime),
                attachment: fs.createReadStream(tempPath)
            },
            threadID,
            messageID
        );

        api.unsendMessage(processingMsg.messageID);
        api.setMessageReaction("✅", messageID, () => {}, true);

        fs.unlinkSync(tempPath);

    } catch (err) {
        console.error("𝐹𝑙𝑢𝑥𝑃𝑟𝑜 𝐸𝑟𝑟𝑜𝑟:", err);

        const { threadID, messageID, senderID } = event;
        const tempPath = __dirname + `/cache/fluxpro_${Date.now()}_${senderID}.jpg`;

        let errorMessage = module.exports.languages.en.failed + " ";
        if (err.message.includes("𝑡𝑖𝑚𝑒𝑑 𝑜𝑢𝑡"))
            errorMessage += "⏱️ 𝑅𝑒𝑞𝑢𝑒𝑠𝑡 𝑡𝑖𝑚𝑒𝑑 𝑜𝑢𝑡. 𝑇𝑟𝑦 𝑎 𝑠𝑖𝑚𝑝𝑙𝑒𝑟 𝑝𝑟𝑜𝑚𝑝𝑡.";
        else if (err.message.includes("𝑖𝑚𝑎𝑔𝑒 𝑈𝑅𝐿"))
            errorMessage += "⚠️ 𝐴𝑃𝐼 𝑑𝑖𝑑𝑛'𝑡 𝑟𝑒𝑡𝑢𝑟𝑛 𝑎 𝑣𝑎𝑙𝑖𝑑 𝑖𝑚𝑎𝑔𝑒.";
        else errorMessage += `𝐸𝑟𝑟𝑜𝑟: ${err.message || "𝑈𝑛𝑘𝑛𝑜𝑤𝑛 𝑒𝑟𝑟𝑜𝑟"}`;

        api.sendMessage(errorMessage, threadID, messageID);
        api.setMessageReaction("❌", messageID, () => {}, true);

        if (fs.existsSync(tempPath)) fs.unlinkSync(tempPath);
    }
};
