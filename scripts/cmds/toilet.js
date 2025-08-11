module.exports.config = {
    name: "toilet",
    version: "1.0.0",
    permission: 0,
    credits: "Asif",
    description: "Put someone's profile picture on a toilet seat",
    prefix: true,
    category: "fun",
    usages: "[@mention]",
    cooldowns: 5,
    dependencies: {
        "fs-extra": "",
        "axios": "",
        "canvas": "",
        "jimp": "",
        "node-superfetch": ""
    }
};

module.exports.onStart = function() {
    console.log("[!] Toilet command initialized");
};

module.exports.circle = async (image) => {
    try {
        const jimp = global.nodemodule['jimp'];
        const img = await jimp.read(image);
        img.circle();
        return await img.getBufferAsync("image/png");
    } catch (err) {
        console.error('Circle processing error:', err);
        throw err;
    }
};

module.exports.run = async ({ event, api, args }) => {
    try {
        const Canvas = global.nodemodule['canvas'];
        const request = global.nodemodule["node-superfetch"];
        const fs = global.nodemodule["fs-extra"];
        const path = global.nodemodule["path"];
        
        // Create cache directory if not exists
        const cacheDir = path.join(__dirname, 'cache');
        if (!fs.existsSync(cacheDir)) {
            fs.mkdirSync(cacheDir, { recursive: true });
        }
        
        const path_toilet = path.join(cacheDir, 'toilet.png');
        const id = Object.keys(event.mentions)[0] || event.senderID;
        const name = (await api.getUserInfo(id))[id].name;
        
        // Create canvas
        const canvas = Canvas.createCanvas(500, 670);
        const ctx = canvas.getContext('2d');
        
        // Load background
        const background = await Canvas.loadImage('https://i.imgur.com/Kn7KpAr.jpg');
        ctx.drawImage(background, 0, 0, canvas.width, canvas.height);
        
        // Load and process avatar
        const avatarResponse = await request.get(
            `https://graph.facebook.com/${id}/picture?width=512&height=512&access_token=6628568379%7Cc1e620fa708a1d5696fb991c1bde5662`
        );
        const circledAvatar = await this.circle(avatarResponse.body);
        const avatar = await Canvas.loadImage(circledAvatar);
        
        // Draw avatar on toilet seat
        ctx.drawImage(avatar, 135, 350, 205, 205);
        
        // Add username text
        ctx.font = 'bold 24px Arial';
        ctx.fillStyle = '#ffffff';
        ctx.textAlign = 'center';
        ctx.fillText(name, canvas.width / 2, 320);
        
        // Save image
        const buffer = canvas.toBuffer('image/png');
        fs.writeFileSync(path_toilet, buffer);
        
        // Send result
        api.sendMessage({
            body: `🚽 ${name} is sitting on the toilet! 🐸`,
            attachment: fs.createReadStream(path_toilet)
        }, event.threadID, () => {
            try {
                fs.unlinkSync(path_toilet);
            } catch (e) {
                console.error('Error deleting file:', e);
            }
        }, event.messageID);
        
    } catch (error) {
        console.error('Toilet command error:', error);
        api.sendMessage("❌ An error occurred while creating the toilet image. Please try again later.", event.threadID);
    }
};
