const fs = require('fs-extra');
const axios = require('axios');
const { createCanvas, loadImage } = require('canvas');

module.exports.config = {
    name: 'bboard',
    version: '1.0.1',
    hasPermssion: 0,
    credits: '𝑨𝒔𝒊𝒇 𝑴𝒂𝒉𝒎𝒖𝒅',
    description: '✨ 𝑩𝒆𝒂𝒖𝒕𝒊𝒇𝒖𝒍 𝒃𝒊𝒍𝒍𝒃𝒐𝒂𝒓𝒅 𝒄𝒓𝒆𝒂𝒕𝒐𝒓',
    category: 'media',
    usages: '[text]',
    cooldowns: 10,
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
        let line = '';
        
        while (words.length > 0) {
            let split = false;
            while (ctx.measureText(words[0]).width >= maxWidth) {
                const temp = words[0];
                words[0] = temp.slice(0, -1);
                if (split) {
                    words[1] = `${temp.slice(-1)}${words[1]}`;
                } else {
                    split = true;
                    words.splice(1, 0, temp.slice(-1));
                }
            }
            
            const testLine = line ? `${line} ${words[0]}` : words[0];
            const testWidth = ctx.measureText(testLine).width;
            
            if (testWidth <= maxWidth) {
                line = testLine;
                words.shift();
            } else {
                lines.push(line);
                line = '';
            }
            
            if (words.length === 0) lines.push(line);
        }
        resolve(lines.filter(line => line !== ''));
    });
}

module.exports.run = async function({ api, event, args }) {
    const { senderID, threadID, messageID } = event;
    const text = args.join(' ');
    
    if (!text) {
        return api.sendMessage('🌟 𝑷𝒍𝒆𝒂𝒔𝒆 𝒂𝒅𝒅 𝒕𝒆𝒙𝒕 𝒇𝒐𝒓 𝒚𝒐𝒖𝒓 𝒃𝒊𝒍𝒍𝒃𝒐𝒂𝒓𝒅!', threadID, messageID);
    }
    
    try {
        api.sendMessage('🔄 𝑪𝒓𝒆𝒂𝒕𝒊𝒏𝒈 𝒚𝒐𝒖𝒓 𝒃𝒆𝒂𝒖𝒕𝒊𝒇𝒖𝒍 𝒃𝒊𝒍𝒍𝒃𝒐𝒂𝒓𝒅, 𝒑𝒍𝒆𝒂𝒔𝒆 𝒘𝒂𝒊𝒕...', threadID, messageID);
        
        const bgPath = __dirname + '/cache/bboard_bg.jpg';
        const avtPath = __dirname + `/cache/avt_${senderID}.png`;
        const outputPath = __dirname + `/cache/bboard_${senderID}.png`;
        
        // Get user info
        const userInfo = await api.getUserInfo(senderID);
        const avatarUrl = `https://graph.facebook.com/${senderID}/picture?width=512&height=512&access_token=6628568379%7Cc1e620fa708a1d5696fb991c1bde5662`;
        const name = userInfo[senderID].name;
        
        // Download background and avatar
        const [bgResponse, avtResponse] = await Promise.all([
            axios.get('https://i.imgur.com/PkAGPu4.jpg', { responseType: 'arraybuffer' }),
            axios.get(avatarUrl, { responseType: 'arraybuffer' })
        ]);
        
        await fs.writeFile(bgPath, bgResponse.data);
        await fs.writeFile(avtPath, avtResponse.data);
        
        // Load images
        const bg = await loadImage(bgPath);
        const avt = await loadImage(avtPath);
        const canvas = createCanvas(bg.width, bg.height);
        const ctx = canvas.getContext('2d');
        
        // Draw background
        ctx.drawImage(bg, 0, 0, canvas.width, canvas.height);
        
        // Draw circular avatar
        ctx.beginPath();
        ctx.arc(200, 90, 35, 0, Math.PI * 2, true);
        ctx.closePath();
        ctx.clip();
        ctx.drawImage(avt, 165, 55, 70, 70);
        
        // Reset clipping
        ctx.restore();
        
        // Draw name
        ctx.font = 'bold 22px Arial';
        ctx.fillStyle = '#000000';
        ctx.textAlign = 'left';
        ctx.fillText(name, 250, 90);
        
        // Draw text with wrapping
        ctx.font = 'bold 32px Arial';
        ctx.fillStyle = '#000000';
        
        const maxWidth = 340;
        const lines = await wrapText(ctx, text, maxWidth);
        
        if (!lines || lines.length === 0) {
            return api.sendMessage('❌ 𝑻𝒆𝒙𝒕 𝒕𝒐𝒐 𝒍𝒐𝒏𝒈 𝒕𝒐 𝒅𝒊𝒔𝒑𝒍𝒂𝒚!', threadID, messageID);
        }
        
        // Draw each line of text
        const lineHeight = 40;
        let yPosition = 170;
        
        for (const line of lines) {
            ctx.fillText(line, 200, yPosition);
            yPosition += lineHeight;
        }
        
        // Save image
        const buffer = canvas.toBuffer('image/png');
        await fs.writeFile(outputPath, buffer);
        
        // Send result
        await api.sendMessage({
            body: `🎉 𝑯𝒆𝒓𝒆'𝒔 𝒚𝒐𝒖𝒓 𝒃𝒆𝒂𝒖𝒕𝒊𝒇𝒖𝒍 𝒃𝒊𝒍𝒍𝒃𝒐𝒂𝒓𝒅!\n┏━━━━━━━━━━━━━━┓\n┃ 𝗡𝗮𝗺𝗲: ${name}\n┃ 𝗧𝗲𝘅𝘁: ${text}\n┗━━━━━━━━━━━━━━┛`,
            attachment: fs.createReadStream(outputPath)
        }, threadID, messageID);
        
        // Clean up
        await Promise.all([
            fs.remove(bgPath),
            fs.remove(avtPath),
            fs.remove(outputPath)
        ]);
        
    } catch (error) {
        console.error('BBoard Error:', error);
        api.sendMessage('❌ 𝑬𝒓𝒓𝒐𝒓 𝒈𝒆𝒏𝒆𝒓𝒂𝒕𝒊𝒏𝒈 𝒃𝒊𝒍𝒍𝒃𝒐𝒂𝒓𝒅 𝒊𝒎𝒂𝒈𝒆!', threadID, messageID);
    }
};
