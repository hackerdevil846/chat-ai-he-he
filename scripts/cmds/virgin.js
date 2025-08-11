module.exports.config = {
    name: "virgin",
    version: "1.0.1",
    hasPermssion: 0,
    credits: "𝑨𝒔𝒊𝒇 𝑴𝒂𝒉𝒎𝒖𝒅",
    description: "𝑹𝒂𝒏𝒅𝒐𝒎 𝑽𝒊𝒓𝒈𝒊𝒏 𝒃𝒂𝒃𝒖𝒅𝒆𝒓 𝒔𝒐𝒏𝒅𝒆𝒓 𝒄𝒉𝒐𝒃𝒊 𝒅𝒆𝒌𝒉𝒂𝒏𝒐",
    commandCategory: "𝑹𝒂𝒏𝒅𝒐𝒎-𝑰𝑴𝑮",
    usages: "virgin",
    cooldowns: 5
};

module.exports.run = async ({ api, event }) => {
    const axios = require('axios');
    const fs = require("fs");
    const path = require("path");

    // Primary API URL
    const primaryApiUrl = 'https://ngoctrinh.ocvat2810.repl.co/';
    
    // Backup image links
    const backupLinks = [
        "https://i.ibb.co/jfqMF07/image.jpg",
        "https://i.ibb.co/tBBCS4y/image.jpg",
        "https://i.ibb.co/3zpyMVY/image.jpg",
        "https://i.ibb.co/gWbWT8k/image.jpg",
        "https://i.ibb.co/mHtyD1P/image.jpg",
        "https://i.ibb.co/vPHNhdY/image.jpg",
        "https://i.ibb.co/rm6rPjb/image.jpg",
        "https://i.ibb.co/7GpN2GW/image.jpg",
        "https://i.ibb.co/CnfMVpg/image.jpg"
    ];

    let imageUrl;

    try {
        // Primary API try
        const res = await axios.get(primaryApiUrl);
        imageUrl = res.data.data;
    } catch (error) {
        // Backup image selection
        console.log("𝑷𝒓𝒊𝒎𝒂𝒓𝒚 𝑨𝑷𝑰 𝒇𝒂𝒊𝒍𝒆𝒅, 𝒖𝒔𝒊𝒏𝒈 𝒃𝒂𝒄𝒌𝒖𝒑 𝒊𝒎𝒂𝒈𝒆𝒔");
        const randomIndex = Math.floor(Math.random() * backupLinks.length);
        imageUrl = backupLinks[randomIndex];
    }

    try {
        // Get image extension
        let ext = path.extname(imageUrl) || '.jpg';
        if (ext.includes('?')) ext = ext.split('?')[0];
        
        const imagePath = path.join(__dirname, 'cache', `virgin${ext}`);
        
        // Download image
        const response = await axios.get(imageUrl, { responseType: 'arraybuffer' });
        fs.writeFileSync(imagePath, Buffer.from(response.data, 'binary'));
        
        // Send image
        api.sendMessage({
            attachment: fs.createReadStream(imagePath)
        }, event.threadID, () => fs.unlinkSync(imagePath), event.messageID);
        
    } catch (error) {
        console.error("𝑬𝒓𝒓𝒐𝒓 𝒑𝒓𝒐𝒄𝒆𝒔𝒔𝒊𝒏𝒈 𝒊𝒎𝒂𝒈𝒆:", error);
        api.sendMessage("❌ 𝑰𝒎𝒂𝒈𝒆 𝒅𝒐𝒘𝒏𝒍𝒐𝒂𝒅 𝒌𝒐𝒓𝒕𝒆 𝒑𝒂𝒓𝒄𝒉𝒊 𝒏𝒂, 𝒂𝒈𝒆 𝒂𝒃𝒂𝒓 𝒄𝒉𝒆𝒔𝒕𝒂 𝒌𝒐𝒓𝒖𝒏", event.threadID, event.messageID);
    }
};
