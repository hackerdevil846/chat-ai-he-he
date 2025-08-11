const fs = require('fs-extra');
const axios = require('axios');
const { createCanvas, loadImage } = require('canvas');

module.exports.config = {
    name: 'bboard',
    version: '1.0.1',
    hasPermssion: 0,
    credits: '𝑨𝒔𝒊𝒇 𝑴𝒂𝒉𝒎𝒖𝒅',
    description: '✨ 𝑩𝒆𝒂𝒖𝒕𝒊𝒇𝒖𝒍 𝒃𝒊𝒍𝒍𝒃𝒐𝒂𝒓𝒅 𝒄𝒓𝒆𝒂𝒕𝒐𝒓',
    commandCategory: '𝒎𝒆𝒅𝒊𝒂',
    usages: '[𝒕𝒆𝒙𝒕]',
    cooldowns: 1,
    dependencies: {
        'canvas': '',
        'axios': '',
        'fs-extra': ''
    }
};

async function wrapText(ctx, text, maxWidth) {
    return new Promise(resolve => {
        if (ctx.measureText(text).width <= maxWidth) return resolve([text]);
        if (ctx.measureText('W').width > maxWidth) return resolve(null);
        
        const words = text.split(' ');
        const lines = [];
        let currentLine = '';
        
        while (words.length > 0) {
            let split = false;
            while (ctx.measureText(words[0]).width >= maxWidth) {
                const temp = words[0];
                words[0] = temp.slice(0, -1);
                if (split) {
                    words[1] = temp.slice(-1) + words[1];
                } else {
                    split = true;
                    words.splice(1, 0, temp.slice(-1));
                }
            }
            
            const testLine = currentLine ? `${currentLine} ${words[0]}` : words[0];
            if (ctx.measureText(testLine).width < maxWidth) {
                currentLine = testLine;
                words.shift();
            } else {
                lines.push(currentLine.trim());
                currentLine = '';
            }
            
            if (words.length === 0) lines.push(currentLine.trim());
        }
        resolve(lines);
    });
}

module.exports.run = async function({ api, event, args }) {
    const { senderID, threadID, messageID } = event;
    const text = args.join(' ');
    
    if (!text) return api.sendMessage('🌟 𝑷𝒍𝒆𝒂𝒔𝒆 𝒂𝒅𝒅 𝒕𝒆𝒙𝒕 𝒇𝒐𝒓 𝒚𝒐𝒖𝒓 𝒃𝒊𝒍𝒍𝒃𝒐𝒂𝒓𝒅', threadID, messageID);
    
    try {
        const bgPath = __dirname + '/cache/bboard_bg.jpg';
        const avtPath = __dirname + `/cache/avt_${senderID}.jpg`;
        const outputPath = __dirname + `/cache/bboard_${senderID}.jpg`;
        
        // Get user info
        const userInfo = await api.getUserInfo(senderID);
        const avatarUrl = userInfo[senderID].thumbSrc;
        const name = userInfo[senderID].name;
        
        // Download images
        const bgImage = (await axios.get('https://i.imgur.com/PkAGPu4.jpg', { 
            responseType: 'arraybuffer' 
        })).data;
        
        const avtImage = (await axios.get(avatarUrl, { 
            responseType: 'arraybuffer' 
        })).data;
        
        fs.writeFileSync(bgPath, Buffer.from(bgImage, 'utf-8'));
        fs.writeFileSync(avtPath, Buffer.from(avtImage, 'utf-8'));
        
        // Process images
        const bg = await loadImage(bgPath);
        const avt = await loadImage(avtPath);
        const canvas = createCanvas(bg.width, bg.height);
        const ctx = canvas.getContext('2d');
        
        ctx.drawImage(bg, 0, 0, canvas.width, canvas.height);
        ctx.drawImage(avt, 180, 70, 40, 40);
        
        // Draw name
        ctx.font = '400 18px Arial';
        ctx.fillStyle = '#000000';
        ctx.textAlign = 'start';
        ctx.fillText(name, 230, 95);
        
        // Adjust text size
        ctx.textAlign = 'left';
        let fontSize = 200;
        ctx.font = `400 ${fontSize}px Arial`;
        
        while (ctx.measureText(text).width > 1200) {
            fontSize--;
            ctx.font = `400 ${fontSize}px Arial`;
        }
        
        // Wrap text
        const wrapped = await wrapText(ctx, text, 340);
        if (!wrapped) return api.sendMessage('⚠️ 𝑻𝒆𝒙𝒕 𝒕𝒐𝒐 𝒍𝒐𝒏𝒈 𝒕𝒐 𝒅𝒊𝒔𝒑𝒍𝒂𝒚!', threadID, messageID);
        
        // Draw wrapped text
        const lineHeight = fontSize * 1.2;
        let y = 150;
        for (const line of wrapped) {
            ctx.fillText(line, 200, y);
            y += lineHeight;
        }
        
        // Save and send
        const outBuffer = canvas.toBuffer();
        fs.writeFileSync(outputPath, outBuffer);
        
        api.sendMessage({
            body: `🎉 𝑯𝒆𝒓𝒆'𝒔 𝒚𝒐𝒖𝒓 𝒃𝒆𝒂𝒖𝒕𝒊𝒇𝒖𝒍 𝒃𝒊𝒍𝒍𝒃𝒐𝒂𝒓𝒅!\n┏━━━━━━━━━━━━━━┓\n┃ 𝗡𝗮𝗺𝗲: ${name}\n┃ 𝗧𝗲𝘅𝘁: ${text}\n┗━━━━━━━━━━━━━━┛`,
            attachment: fs.createReadStream(outputPath)
        }, threadID, () => {
            [bgPath, avtPath, outputPath].forEach(path => fs.unlinkSync(path));
        }, messageID);
        
    } catch (error) {
        console.error(error);
        api.sendMessage('❌ 𝑬𝒓𝒓𝒐𝒓 𝒈𝒆𝒏𝒆𝒓𝒂𝒕𝒊𝒏𝒈 𝒃𝒊𝒍𝒍𝒃𝒐𝒂𝒓𝒅 𝒊𝒎𝒂𝒈𝒆', threadID, messageID);
    }
};
