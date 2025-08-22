const axios = require("axios");
const fs = require("fs");
const path = require("path");
const https = require("https");

const encodedUrl = "aHR0cHM6Ly9yYXNpbi1hcGlzLm9ucmVuZGVyLmNvbQ==";
const encodedKey = "cnNfaGVpNTJjbTgtbzRvai11Y2ZjLTR2N2MtZzE=";

function decode(b64) {
    return Buffer.from(b64, "base64").toString("utf-8");
}

function downloadImage(url, filePath) {
    return new Promise((resolve, reject) => {
        const file = fs.createWriteStream(filePath);
        https.get(url, res => {
            if (res.statusCode !== 200) return reject(new Error(`❌ Image fetch failed with status: ${res.statusCode}`));
            res.pipe(file);
            file.on("finish", () => file.close(resolve));
        }).on("error", err => {
            fs.unlinkSync(filePath);
            reject(err);
        });
    });
}

module.exports.config = {
    name: "needgf",
    version: "1.0.4",
    hasPermssion: 0,
    credits: "𝑨𝒔𝒊𝒇 𝑴𝒂𝒉𝒎𝒖𝒅",
    description: "💝 সিঙ্গেলদের শেষ ভরসার ফাইল",
    usePrefix: false,
    commandCategory: "fun",
    usages: "/needgf",
    cooldowns: 20,
    dependencies: {
        "axios": "",
        "https": "",
        "fs": "",
        "path": ""
    }
};

module.exports.run = async function ({ api, event }) {
    try {
        const apiUrl = decode(encodedUrl);
        const apiKey = decode(encodedKey);
        const fullUrl = `${apiUrl}/api/rasin/gf?apikey=${apiKey}`;

        api.sendMessage("💖 আপনার গার্লফ্রেন্ড ইমেজ তৈরি করা হচ্ছে...", event.threadID, event.messageID);

        const res = await axios.get(fullUrl);
        const title = res.data.data.title;
        const imgUrl = res.data.data.url;

        const imgPath = path.join(__dirname, "cache", `gf_${event.senderID}.jpg`);
        await downloadImage(imgUrl, imgPath);

        api.sendMessage({
            body: `💝 ${title}\n\n✨ আপনার গার্লফ্রেন্ড আসছে...`,
            attachment: fs.createReadStream(imgPath)
        }, event.threadID, () => fs.unlinkSync(imgPath), event.messageID);

    } catch (err) {
        console.error("❌ Error:", err.message);
        api.sendMessage("⚠️ ইমেজ লোড করতে সমস্যা হয়েছে, পরে আবার চেষ্টা করুন", event.threadID, event.messageID);
    }
};
