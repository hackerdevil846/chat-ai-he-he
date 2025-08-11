const fs = require('fs-extra');
const axios = require('axios');
const { createCanvas, loadImage } = require('canvas');

module.exports.config = {
    name: 'mia',
    version: '1.0.0',
    permission: 0,
    credits: 'Asif',
    description: 'Create a custom image with text',
    prefix: true,
    category: 'Love',
    usages: '[text]',
    cooldowns: 5,
};

module.exports.onStart = function() {
    return true;
};

module.exports.onLoad = function() {
    // Initialize cache directory
    if (!global.nodemodule || !global.nodemodule["fs-extra"]) {
        global.nodemodule = {};
        global.nodemodule["fs-extra"] = fs;
    }
};

module.exports.wrapText = function(ctx, text, maxWidth) {
    return new Promise(resolve => {
        if (ctx.measureText(text).width < maxWidth) return resolve([text]);
        if (ctx.measureText('W').width > maxWidth) return resolve(null);

        const words = text.split(' ');
        const lines = [];
        let line = '';

        while (words.length > 0) {
            let split = false;
            while (ctx.measureText(words[0]).width > maxWidth) {
                const temp = words[0];
                words[0] = temp.slice(0, -1);
                if (split) words[1] = `${temp.slice(-1)}${words[1]}`;
                else {
                    split = true;
                    words.splice(1, 0, temp.slice(-1));
                }
            }
            if (ctx.measureText(`${line}${words[0]}`).width < maxWidth) {
                line += `${words.shift()} `;
            } else {
                lines.push(line.trim());
                line = '';
            }
            if (words.length === 0) lines.push(line.trim());
        }
        resolve(lines);
    });
};

module.exports.run = async function({ api, event, args }) {
    const { senderID, threadID, messageID } = event;
    let text = args.join(' ');

    if (!text) {
        return api.sendMessage('Enter the content of the comment on the board', threadID, messageID);
    }

    try {
        // Create cache directory if it doesn't exist
        if (!fs.existsSync(__dirname + '/cache')) {
            fs.mkdirSync(__dirname + '/cache', { recursive: true });
        }

        const pathImg = __dirname + '/cache/mia_' + Date.now() + '.png';

        // Download the base image
        let response = await axios.get('https://i.postimg.cc/Jh86TFLn/Pics-Art-08-14-10-45-31.jpg', {
            responseType: 'arraybuffer'
        });

        fs.writeFileSync(pathImg, response.data);

        // Load the image
        let baseImage = await loadImage(pathImg);
        let canvas = createCanvas(baseImage.width, baseImage.height);
        let ctx = canvas.getContext('2d');

        // Draw the base image
        ctx.drawImage(baseImage, 0, 0, canvas.width, canvas.height);

        // Set up text styling
        ctx.font = '400 45px Arial';
        ctx.fillStyle = '#000000';
        ctx.textAlign = 'start';

        // Dynamically adjust font size
        let fontSize = 250;
        while (ctx.measureText(text).width > 2600) {
            fontSize--;
            ctx.font = `400 ${fontSize}px Arial, sans-serif`;
            if (fontSize < 45) break;
        }

        // Wrap and draw text
        const lines = await this.wrapText(ctx, text, 1160);
        ctx.fillText(lines.join('\n'), 60, 165);

        // Save and send the final image
        fs.writeFileSync(pathImg, canvas.toBuffer());

        return api.sendMessage(
            { attachment: fs.createReadStream(pathImg) },
            threadID,
            () => {
                try {
                    fs.unlinkSync(pathImg);
                } catch (e) {
                    console.error('Error deleting temporary file:', e);
                }
            },
            messageID
        );
    } catch (error) {
        console.error('Error in mia command:', error);
        return api.sendMessage('Failed to generate the image. Please try again later.', threadID, messageID);
    }
};
