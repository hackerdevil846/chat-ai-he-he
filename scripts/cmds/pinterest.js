const axios = require("axios");
const fs = require("fs-extra");
const { createCanvas, loadImage } = require("canvas");

module.exports.config = {
    name: "pinterest",
    version: "2.0.0",
    hasPermssion: 0,
    credits: "𝑨𝒔𝒊𝒇 𝑴𝒂𝒉𝒎𝒖𝒅",
    description: "✨ 𝑺𝒕𝒚𝒍𝒊𝒔𝒉 𝑰𝒎𝒂𝒈𝒆 𝑺𝒆𝒂𝒓𝒄𝒉 𝒇𝒓𝒐𝒎 𝑷𝒊𝒏𝒕𝒆𝒓𝒆𝒔𝒕",
    category: "media",
    usePrefix: false,
    usages: "[keyword] - [number]",
    cooldowns: 15,
    dependencies: {
        "axios": "",
        "fs-extra": "",
        "canvas": ""
    }
};

module.exports.onStart = async function({ api, event, args }) {
    try {
        const { threadID, messageID } = event;
        const keySearch = args.join(" ");
        
        if (!keySearch.includes("-")) {
            return api.sendMessage("🌸 𝐏𝐥𝐞𝐚𝐬𝐞 𝐮𝐬𝐞 𝐜𝐨𝐫𝐫𝐞𝐜𝐭 𝐟𝐨𝐫𝐦𝐚𝐭:\n𝐩𝐢𝐧𝐭𝐞𝐫𝐞𝐬𝐭 𝐤𝐞𝐲𝐰𝐨𝐫𝐝 - 𝐧𝐮𝐦𝐛𝐞𝐫 (𝐞𝐱: 𝐩𝐢𝐧𝐭𝐞𝐫𝐞𝐬𝐭 𝐜𝐚𝐭 - 𝟓)", threadID, messageID);
        }

        const [keySearchs, numberSearch] = keySearch.split("-").map(item => item.trim());
        const searchCount = parseInt(numberSearch) || 6;
        
        if (isNaN(searchCount) || searchCount > 20 || searchCount < 1) {
            return api.sendMessage("⚠️ 𝐏𝐥𝐞𝐚𝐬𝐞 𝐞𝐧𝐭𝐞𝐫 𝐚 𝐯𝐚𝐥𝐢𝐝 𝐧𝐮𝐦𝐛𝐞𝐫 𝐛𝐞𝐭𝐰𝐞𝐞𝐧 𝟏 𝐚𝐧𝐝 𝟐𝟎", threadID, messageID);
        }

        api.sendMessage("🔍 𝐒𝐞𝐚𝐫𝐜𝐡𝐢𝐧𝐠 𝐏𝐢𝐧𝐭𝐞𝐫𝐞𝐬𝐭...", threadID, messageID);

        const res = await axios.get(`https://asif-pinterest-api.onrender.com/v1/pinterest?search=${encodeURIComponent(keySearchs)}`);
        const data = res.data.data || res.data;
        
        if (!data || !Array.isArray(data) || data.length === 0) {
            return api.sendMessage("❌ 𝐍𝐨 𝐢𝐦𝐚𝐠𝐞𝐬 𝐟𝐨𝐮𝐧𝐝 𝐟𝐨𝐫 𝐲𝐨𝐮𝐫 𝐬𝐞𝐚𝐫𝐜𝐡 𝐪𝐮𝐞𝐫𝐲", threadID, messageID);
        }

        const imgData = [];
        const canvas = createCanvas(600, 200);
        const ctx = canvas.getContext("2d");
        
        // Create stylish header
        ctx.fillStyle = "#e60023";
        ctx.fillRect(0, 0, 600, 200);
        ctx.font = "bold 28px Arial";
        ctx.fillStyle = "#ffffff";
        ctx.textAlign = "center";
        ctx.fillText("✨ Pinterest Search Results ✨", 300, 60);
        ctx.font = "20px Arial";
        ctx.fillText(`🔍 Keyword: ${keySearchs}`, 300, 110);
        ctx.fillText(`📸 Images: ${searchCount}`, 300, 150);
        
        const headerPath = __dirname + '/cache/pin_header.jpg';
        const out = fs.createWriteStream(headerPath);
        const stream = canvas.createPNGStream();
        stream.pipe(out);
        
        await new Promise((resolve, reject) => {
            out.on('finish', resolve);
            out.on('error', reject);
        });

        imgData.push(fs.createReadStream(headerPath));

        // Process images
        for (let i = 0; i < Math.min(searchCount, data.length); i++) {
            try {
                const path = __dirname + `/cache/pin_${i}.jpg`;
                const imgResponse = await axios.get(data[i], { responseType: 'arraybuffer' });
                fs.writeFileSync(path, Buffer.from(imgResponse.data, 'binary'));
                imgData.push(fs.createReadStream(path));
            } catch (e) {
                console.error("Error downloading image:", e);
            }
        }

        // Send results
        await api.sendMessage({
            body: `🌟 𝐒𝐮𝐜𝐜𝐞𝐬𝐬𝐟𝐮𝐥𝐥𝐲 𝐟𝐞𝐭𝐜𝐡𝐞𝐝 ${imgData.length - 1} 𝐢𝐦𝐚𝐠𝐞𝐬!\n🔍 𝐊𝐞𝐲𝐰𝐨𝐫𝐝: ${keySearchs}`,
            attachment: imgData
        }, threadID);

        // Cleanup
        fs.unlinkSync(headerPath);
        for (let i = 0; i < Math.min(searchCount, data.length); i++) {
            const path = __dirname + `/cache/pin_${i}.jpg`;
            if (fs.existsSync(path)) fs.unlinkSync(path);
        }

    } catch (error) {
        console.error(error);
        api.sendMessage("❌ 𝐄𝐫𝐫𝐨𝐫 𝐨𝐜𝐜𝐮𝐫𝐞𝐝 𝐰𝐡𝐢𝐥𝐞 𝐟𝐞𝐭𝐜𝐡𝐢𝐧𝐠 𝐢𝐦𝐚𝐠𝐞𝐬", event.threadID, event.messageID);
    }
};
