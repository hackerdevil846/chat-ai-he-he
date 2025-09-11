const fs = require('fs-extra');
const axios = require('axios');
const { createCanvas, loadImage } = require('canvas');

module.exports.config = {
    name: 'bboard',
    aliases: ['billboard', 'board'],
    version: '1.0.1',
    author: '𝐴𝑠𝑖𝑓 𝑀𝑎ℎ𝑚𝑢𝑑',
    countDown: 10,
    role: 0,
    category: 'media',
    shortDescription: {
        en: '𝐵𝑒𝑎𝑢𝑡𝑖𝑓𝑢𝑙 𝑏𝑖𝑙𝑙𝑏𝑜𝑎𝑟𝑑 𝑐𝑟𝑒𝑎𝑡𝑜𝑟'
    },
    longDescription: {
        en: '𝐶𝑟𝑒𝑎𝑡𝑒𝑠 𝑎 𝑏𝑒𝑎𝑢𝑡𝑖𝑓𝑢𝑙 𝑏𝑖𝑙𝑙𝑏𝑜𝑎𝑟𝑑 𝑤𝑖𝑡ℎ 𝑦𝑜𝑢𝑟 𝑡𝑒𝑥𝑡 𝑎𝑛𝑑 𝑝𝑟𝑜𝑓𝑖𝑙𝑒'
    },
    guide: {
        en: '{p}bboard [𝑡𝑒𝑥𝑡]'
    },
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

module.exports.onStart = async function({ api, event, args }) {
    try {
        const { senderID, threadID, messageID } = event;
        const text = args.join(' ');
        
        if (!text) {
            return api.sendMessage('🌟 𝑃𝑙𝑒𝑎𝑠𝑒 𝑎𝑑𝑑 𝑡𝑒𝑥𝑡 𝑓𝑜𝑟 𝑦𝑜𝑢𝑟 𝑏𝑖𝑙𝑙𝑏𝑜𝑎𝑟𝑑!', threadID, messageID);
        }
        
        await api.sendMessage('🔄 𝐶𝑟𝑒𝑎𝑡𝑖𝑛𝑔 𝑦𝑜𝑢𝑟 𝑏𝑒𝑎𝑢𝑡𝑖𝑓𝑢𝑙 𝑏𝑖𝑙𝑙𝑏𝑜𝑎𝑟𝑑, 𝑝𝑙𝑒𝑎𝑠𝑒 𝑤𝑎𝑖𝑡...', threadID, messageID);
        
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
        ctx.save();
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
            return api.sendMessage('❌ 𝑇𝑒𝑥𝑡 𝑡𝑜𝑜 𝑙𝑜𝑛𝑔 𝑡𝑜 𝑑𝑖𝑠𝑝𝑙𝑎𝑦!', threadID, messageID);
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
            body: `🎉 𝐻𝑒𝑟𝑒'𝑠 𝑦𝑜𝑢𝑟 𝑏𝑒𝑎𝑢𝑡𝑖𝑓𝑢𝑙 𝑏𝑖𝑙𝑙𝑏𝑜𝑎𝑟𝑑!\n┏━━━━━━━━━━━━━━┓\n┃ 𝑁𝑎𝑚𝑒: ${name}\n┃ 𝑇𝑒𝑥𝑡: ${text}\n┗━━━━━━━━━━━━━━┛`,
            attachment: fs.createReadStream(outputPath)
        }, threadID, messageID);
        
        // Clean up
        await Promise.all([
            fs.remove(bgPath),
            fs.remove(avtPath),
            fs.remove(outputPath)
        ]);
        
    } catch (error) {
        console.error('𝐵𝐵𝑜𝑎𝑟𝑑 𝐸𝑟𝑟𝑜𝑟:', error);
        api.sendMessage('❌ 𝐸𝑟𝑟𝑜𝑟 𝑔𝑒𝑛𝑒𝑟𝑎𝑡𝑖𝑛𝑔 𝑏𝑖𝑙𝑙𝑏𝑜𝑎𝑟𝑑 𝑖𝑚𝑎𝑔𝑒!', event.threadID, event.messageID);
    }
};
