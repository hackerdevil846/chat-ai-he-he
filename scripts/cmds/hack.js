const { createCanvas, loadImage } = require('canvas');
const fs = require('fs-extra');
const path = require('path');
const axios = require('axios');

module.exports.config = {
    name: "hack",
    aliases: ["hacking", "simulatehack"],
    version: "1.1.0",
    author: "𝐴𝑠𝑖𝑓 𝑀𝑎ℎ𝑚𝑢𝑑",
    countDown: 15,
    role: 0,
    category: "fun",
    shortDescription: {
        en: "𝐻𝑎𝑐𝑘𝑖𝑛𝑔 𝑠𝑖𝑚𝑢𝑙𝑎𝑡𝑖𝑜𝑛 𝑤𝑖𝑡ℎ 𝑣𝑖𝑠𝑢𝑎𝑙 𝑒𝑓𝑓𝑒𝑐𝑡𝑠"
    },
    longDescription: {
        en: "𝑆𝑖𝑚𝑢𝑙𝑎𝑡𝑒𝑠 ℎ𝑎𝑐𝑘𝑖𝑛𝑔 𝑤𝑖𝑡ℎ 𝑣𝑖𝑠𝑢𝑎𝑙 𝑡𝑒𝑟𝑚𝑖𝑛𝑎𝑙 𝑒𝑓𝑓𝑒𝑐𝑡𝑠 𝑎𝑛𝑑 𝑑𝑎𝑡𝑎 𝑒𝑥𝑡𝑟𝑎𝑐𝑡𝑖𝑜𝑛"
    },
    guide: {
        en: "{p}hack [@𝑚𝑒𝑛𝑡𝑖𝑜𝑛]"
    },
    dependencies: {
        "axios": "",
        "canvas": "",
        "fs-extra": ""
    }
};

module.exports.onStart = async function({ api, event, args, Users }) {
    try {
        const targetID = Object.keys(event.mentions)[0] || event.senderID;
        const targetName = await Users.getNameUser(targetID);
        
        // Send initial message
        const initMsg = await api.sendMessage(`🔍 𝐼𝑛𝑖𝑡𝑖𝑎𝑡𝑖𝑛𝑔 ℎ𝑎𝑐𝑘𝑖𝑛𝑔 𝑠𝑒𝑞𝑢𝑒𝑛𝑐𝑒 𝑓𝑜𝑟 ${targetName}...\n⏳ 𝑃𝑙𝑒𝑎𝑠𝑒 𝑤𝑎𝑖𝑡, 𝑡ℎ𝑖𝑠 𝑚𝑎𝑦 𝑡𝑎𝑘𝑒 𝑎 𝑚𝑜𝑚𝑒𝑛𝑡...`, event.threadID);
        
        // Get user's profile picture
        const avatarUrl = `https://graph.facebook.com/${targetID}/picture?width=512&height=512&access_token=6628568379%7Cc1e620fa708a1d5696fb991c1bde5662`;
        const avatarResponse = await axios.get(avatarUrl, { responseType: 'arraybuffer' });
        const avatarBuffer = Buffer.from(avatarResponse.data, 'binary');
        
        // Create hacking simulation
        const canvas = createCanvas(800, 500);
        const ctx = canvas.getContext('2d');
        
        // Draw background
        ctx.fillStyle = '#0a0a0a';
        ctx.fillRect(0, 0, canvas.width, canvas.height);
        
        // Add matrix code effect
        ctx.font = '14px "Courier New"';
        ctx.fillStyle = '#00ff00';
        for (let i = 0; i < 50; i++) {
            ctx.fillText(
                Math.random().toString(36).substring(2, 15),
                Math.random() * canvas.width,
                Math.random() * canvas.height
            );
        }
        
        // Draw terminal window
        ctx.fillStyle = 'rgba(0, 30, 0, 0.8)';
        ctx.fillRect(50, 50, canvas.width - 100, canvas.height - 100);
        
        // Add terminal text
        ctx.font = 'bold 16px "Courier New"';
        ctx.fillStyle = '#00ff00';
        ctx.fillText('> 𝐼𝑁𝐼𝑇𝐼𝐴𝑇𝐼𝑁𝐺 𝐻𝐴𝐶𝐾𝐼𝑁𝐺 𝑆𝐸𝑄𝑈𝐸𝑁𝐶𝐸...', 70, 80);
        ctx.fillText('> 𝑇𝐴𝑅𝐺𝐸𝑇: ' + targetName, 70, 105);
        ctx.fillText('> 𝐵𝑌𝑃𝐴𝑆𝑆𝐼𝑁𝐺 𝑆𝐸𝐶𝑈𝑅𝐼𝑇𝑌 𝑃𝑅𝑂𝑇𝑂𝐶𝑂𝐿𝑆...', 70, 130);
        
        // Add progress bar
        ctx.fillStyle = '#003300';
        ctx.fillRect(70, 160, 600, 25);
        ctx.fillStyle = '#00cc00';
        ctx.fillRect(70, 160, 600 * 0.75, 25);
        ctx.fillStyle = '#00ff00';
        ctx.fillText('75% 𝐶𝑂𝑀𝑃𝐿𝐸𝑇𝐸', 300, 178);
        
        // Add more terminal output
        ctx.fillText('> 𝐸𝑋𝑇𝑅𝐴𝐶𝑇𝐼𝑁𝐺 𝑃𝐸𝑅𝑆𝑂𝑁𝐴𝐿 𝐷𝐴𝑇𝐴...', 70, 220);
        ctx.fillText('> 𝐹𝑂𝑈𝑁𝐷: 𝐸𝑚𝑎𝑖𝑙 - ' + generateFakeEmail(targetName), 90, 245);
        ctx.fillText('> 𝐹𝑂𝑈𝑁𝐷: 𝑃𝑎𝑠𝑠𝑤𝑜𝑟𝑑 - ' + generatePassword(12), 90, 270);
        ctx.fillText('> 𝐴𝐶𝐶𝐸𝑆𝑆𝐼𝑁𝐺 𝑃𝑅𝐼𝑉𝐴𝑇𝐸 𝑀𝐸𝑆𝑆𝐴𝐺𝐸𝑆...', 70, 295);
        ctx.fillText('> 𝐸𝑁𝐶𝑅𝑌𝑃𝑇𝐼𝑂𝑁 𝐵𝑌𝑃𝐴𝑆𝑆𝐸𝐷 𝑆𝑈𝐶𝐶𝐸𝑆𝑆𝐹𝑈𝐿𝐿𝑌!', 70, 320);
        
        // Draw user avatar
        try {
            const avatar = await loadImage(avatarBuffer);
            // Draw circular avatar
            ctx.save();
            ctx.beginPath();
            ctx.arc(650, 350, 40, 0, Math.PI * 2, true);
            ctx.closePath();
            ctx.clip();
            ctx.drawImage(avatar, 610, 310, 80, 80);
            ctx.restore();
            
            // Draw border around avatar
            ctx.beginPath();
            ctx.arc(650, 350, 40, 0, Math.PI * 2, true);
            ctx.strokeStyle = '#00ff00';
            ctx.lineWidth = 2;
            ctx.stroke();
        } catch (e) {
            console.error("𝐸𝑟𝑟𝑜𝑟 𝑙𝑜𝑎𝑑𝑖𝑛𝑔 𝑎𝑣𝑎𝑡𝑎𝑟:", e);
        }
        
        // Add hack complete message
        ctx.font = 'bold 20px "Courier New"';
        ctx.fillStyle = '#00ff00';
        ctx.fillText('>>> 𝐻𝐴𝐶𝐾 𝐶𝑂𝑀𝑃𝐿𝐸𝑇𝐸 - 𝐴𝐿𝐿 𝐷𝐴𝑇𝐴 𝐸𝑋𝑇𝑅𝐴𝐶𝑇𝐸𝐷 <<<', 150, 370);
        
        // Add target info
        ctx.font = '16px "Courier New"';
        ctx.fillText('𝑇𝑎𝑟𝑔𝑒𝑡: ' + targetName, 70, 410);
        ctx.fillText('𝑆𝑡𝑎𝑡𝑢𝑠: 𝐶𝑂𝑀𝑃𝑅𝑂𝑀𝐼𝑆𝐸𝐷', 70, 435);
        ctx.fillText('𝐷𝑎𝑡𝑎 𝑆𝑒𝑐𝑢𝑟𝑖𝑡𝑦: 𝐵𝑅𝐸𝐴𝐶𝐻𝐸𝐷', 70, 460);
        
        // Save the image
        const buffer = canvas.toBuffer('image/png');
        const imagePath = path.join(__dirname, 'cache', 'hack_result.png');
        await fs.outputFile(imagePath, buffer);
        
        // Send the result
        await api.sendMessage({
            body: `🔓 𝐻𝑎𝑐𝑘𝑖𝑛𝑔 𝑐𝑜𝑚𝑝𝑙𝑒𝑡𝑒𝑑 𝑠𝑢𝑐𝑐𝑒𝑠𝑠𝑓𝑢𝑙𝑙𝑦!\n👨‍💻 𝑇𝑎𝑟𝑔𝑒𝑡: ${targetName}\n📂 𝐷𝑎𝑡𝑎 𝑒𝑥𝑡𝑟𝑎𝑐𝑡𝑒𝑑 𝑎𝑛𝑑 𝑠𝑒𝑛𝑡 𝑡𝑜 𝑠𝑒𝑐𝑢𝑟𝑒 𝑠𝑒𝑟𝑣𝑒𝑟`,
            attachment: fs.createReadStream(imagePath)
        }, event.threadID);
        
        // Clean up
        fs.unlinkSync(imagePath);
        api.unsendMessage(initMsg.messageID);
        
    } catch (error) {
        console.error("𝐻𝑎𝑐𝑘 𝐸𝑟𝑟𝑜𝑟:", error);
        api.sendMessage('❌ 𝐸𝑟𝑟𝑜𝑟 𝑖𝑛 ℎ𝑎𝑐𝑘𝑖𝑛𝑔 𝑝𝑟𝑜𝑐𝑒𝑑𝑢𝑟𝑒: ' + error.message, event.threadID, event.messageID);
    }
};

// Helper function to generate fake email
function generateFakeEmail(name) {
    const domains = ['gmail.com', 'yahoo.com', 'protonmail.com', 'hushmail.com'];
    const namePart = name.replace(/\s+/g, '').toLowerCase();
    const randomNum = Math.floor(Math.random() * 1000);
    const domain = domains[Math.floor(Math.random() * domains.length)];
    return `${namePart}${randomNum}@${domain}`;
}

// Helper function to generate random password
function generatePassword(length) {
    const charset = 'abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789!@#$%^&*';
    let password = '';
    for (let i = 0; i < length; i++) {
        password += charset.charAt(Math.floor(Math.random() * charset.length));
    }
    return password;
}
