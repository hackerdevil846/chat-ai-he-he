const axios = require("axios");
const fs = require("fs-extra");
const { createCanvas, loadImage } = require("canvas");

module.exports.config = {
    name: "imgsearch",
    version: "1.1.0",
    hasPermssion: 0,
    credits: "𝑨𝒔𝒊𝒇 𝑴𝒂𝒉𝒎𝒖𝒅",
    description: "🔍 𝑰𝒎𝒂𝒈𝒆 𝒔𝒆𝒂𝒓𝒄𝒉 𝒘𝒊𝒕𝒉 𝒔𝒕𝒚𝒍𝒊𝒔𝒉 𝒓𝒆𝒔𝒖𝒍𝒕𝒔",
    category: "media",
    usages: "[query] - [number]",
    cooldowns: 15,
    dependencies: {
        "axios": "",
        "fs-extra": "",
        "canvas": ""
    }
};

module.exports.run = async function({ api, event, args }) {
    const { threadID, messageID } = event;
    const keySearch = args.join(" ");
    
    if (!keySearch.includes("-")) {
        return api.sendMessage(
            `✨ 𝐔𝐬𝐚𝐠𝐞 𝐄𝐱𝐚𝐦𝐩𝐥𝐞:\nimgsearch cats - 5\n\n🔍 𝐒𝐞𝐚𝐫𝐜𝐡 𝐪𝐮𝐞𝐫𝐲 - 𝐍𝐮𝐦𝐛𝐞𝐫 𝐨𝐟 𝐢𝐦𝐚𝐠𝐞𝐬`,
            threadID, messageID
        );
    }

    const [query, number] = keySearch.split("-").map(str => str.trim());
    const numberSearch = parseInt(number) || 6;

    try {
        api.sendMessage(`🔍 𝐒𝐞𝐚𝐫𝐜𝐡𝐢𝐧𝐠 "${query}"...`, threadID, messageID);
        
        const res = await axios.get(`https://api.ndtmint.repl.co/pinterest?search=${encodeURIComponent(query)}`);
        const data = res.data.data.slice(0, numberSearch);
        
        if (!data.length) {
            return api.sendMessage("❌ 𝐍𝐨 𝐢𝐦𝐚𝐠𝐞𝐬 𝐟𝐨𝐮𝐧𝐝 𝐟𝐨𝐫 𝐲𝐨𝐮𝐫 𝐪𝐮𝐞𝐫𝐲", threadID, messageID);
        }

        // Create stylish header with canvas
        const canvas = createCanvas(600, 200);
        const ctx = canvas.getContext('2d');
        
        // Background
        ctx.fillStyle = '#2c3e50';
        ctx.fillRect(0, 0, canvas.width, canvas.height);
        
        // Title
        ctx.font = 'bold 30px Arial';
        ctx.fillStyle = '#1abc9c';
        ctx.textAlign = 'center';
        ctx.fillText('🔍 𝐈𝐌𝐀𝐆𝐄 𝐒𝐄𝐀𝐑𝐂𝐇', canvas.width/2, 60);
        
        // Query
        ctx.font = '25px Arial';
        ctx.fillStyle = '#ecf0f1';
        ctx.fillText(`"${query}"`, canvas.width/2, 110);
        
        // Footer
        ctx.font = '18px Arial';
        ctx.fillStyle = '#3498db';
        ctx.fillText(`𝐅𝐨𝐮𝐧𝐝: ${data.length} 𝐢𝐦𝐚𝐠𝐞${data.length > 1 ? 's' : ''}`, canvas.width/2, 160);
        
        const headerPath = __dirname + '/cache/imgHeader.jpg';
        const out = fs.createWriteStream(headerPath);
        const stream = canvas.createJPEGStream({ quality: 0.95 });
        stream.pipe(out);
        
        await new Promise(resolve => out.on('finish', resolve));
        
        const imgData = [fs.createReadStream(headerPath)];
        const downloadPromises = [];
        
        for (let i = 0; i < data.length; i++) {
            const path = __dirname + `/cache/img${i + 1}.jpg`;
            downloadPromises.push(
                axios.get(data[i], { responseType: 'arraybuffer' })
                    .then(res => fs.writeFile(path, res.data))
                    .then(() => imgData.push(fs.createReadStream(path)))
            );
        }
        
        await Promise.all(downloadPromises);
        
        api.sendMessage({
            body: `✅ 𝐒𝐮𝐜𝐜𝐞𝐬𝐬𝐟𝐮𝐥𝐥𝐲 𝐫𝐞𝐭𝐫𝐢𝐞𝐯𝐞𝐝 ${data.length} 𝐢𝐦𝐚𝐠𝐞${data.length > 1 ? 's' : ''} 𝐟𝐨𝐫:\n"${query}"`,
            attachment: imgData
        }, threadID, async () => {
            // Cleanup files
            fs.unlinkSync(headerPath);
            for (let i = 0; i < data.length; i++) {
                fs.unlinkSync(__dirname + `/cache/img${i + 1}.jpg`);
            }
        }, messageID);
        
    } catch (error) {
        console.error(error);
        api.sendMessage("❌ 𝐄𝐫𝐫𝐨𝐫 𝐢𝐧 𝐢𝐦𝐚𝐠𝐞 𝐬𝐞𝐚𝐫𝐜𝐡 𝐩𝐫𝐨𝐜𝐞𝐬𝐬", threadID, messageID);
    }
};
