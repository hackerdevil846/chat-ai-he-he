module.exports.config = {
	name: "penis",
	version: "1.1.0",
	hasPermssion: 0,
	credits: "𝑨𝒔𝒊𝒇 𝑴𝒂𝒉𝒎𝒖𝒅",
	description: "𝑷𝒆𝒏𝒊𝒔 𝒔𝒊𝒛𝒆 𝒄𝒉𝒆𝒄𝒌𝒆𝒓 𝒌𝒉𝒆𝒍𝒂 ( ͡° ͜ʖ ͡°)",
	commandCategory: "fun",
	cooldowns: 5,
	dependencies: {
		"canvas": ""
	},
	envConfig: {}
};

module.exports.run = async function({ api, event, args }) {
    try {
        const { createCanvas } = require('canvas');
        const fs = require('fs');
        const path = require('path');
        
        // Generate random penis size
        const size = Math.floor(Math.random() * 15);
        const penisText = `8${'='.repeat(size)}D`;
        
        // Create canvas
        const canvas = createCanvas(600, 300);
        const ctx = canvas.getContext('2d');
        
        // Background gradient
        const gradient = ctx.createLinearGradient(0, 0, 600, 300);
        gradient.addColorStop(0, '#8a2be2');  // Violet
        gradient.addColorStop(1, '#1e90ff');  // DodgerBlue
        ctx.fillStyle = gradient;
        ctx.fillRect(0, 0, 600, 300);
        
        // Draw title
        ctx.font = 'bold 40px Arial';
        ctx.fillStyle = '#ffffff';
        ctx.textAlign = 'center';
        ctx.shadowColor = '#000000';
        ctx.shadowBlur = 5;
        ctx.fillText('🍆 PENIS SIZE CHECKER 🍆', 300, 60);
        
        // Draw result box
        ctx.fillStyle = 'rgba(0, 0, 0, 0.3)';
        ctx.fillRect(150, 100, 300, 100);
        
        // Draw penis size
        ctx.font = `bold ${60 + size * 2}px Arial`;
        ctx.fillStyle = '#ff69b4';  // HotPink
        ctx.fillText(penisText, 300, 170);
        
        // Draw measurement
        ctx.font = 'italic 25px Arial';
        ctx.fillStyle = '#00ff7f';  // SpringGreen
        ctx.fillText(`📏 Size: ${size + 1} cm`, 300, 230);
        
        // Draw footer
        ctx.font = '20px Arial';
        ctx.fillStyle = '#ffff00';  // Yellow
        ctx.fillText('Powered by Goat Bot • 𝑨𝒔𝒊𝒇 𝑴𝒂𝒉𝒎𝒖𝒅', 300, 280);
        
        // Save image
        const imagePath = path.join(__dirname, 'penis_result.png');
        const out = fs.createWriteStream(imagePath);
        const stream = canvas.createPNGStream();
        stream.pipe(out);
        
        out.on('finish', () => {
            // Send result with rich formatting
            const messages = [
                "✨ 𝑨𝒂𝒋𝒌𝒆 𝒂𝒂𝒑𝒏𝒂𝒓 𝒑𝒆𝒏𝒊𝒔 𝒔𝒊𝒛𝒆 ✨",
                "💖 𝑻𝒐𝒅𝒂𝒚'𝒔 𝑷𝒆𝒏𝒊𝒔 𝑶𝒇 𝑻𝒉𝒆 𝑫𝒂𝒚 💖",
                "🍆 𝑫𝒂𝒊𝒍𝒚 𝑷𝒆𝒏𝒊𝒔 𝑹𝒆𝒑𝒐𝒓𝒕 🍆",
                "🔥 𝑯𝑶𝑻 𝑷𝑬𝑵𝑰𝑺 𝑨𝑳𝑬𝑹𝑻! 🔥"
            ];
            const randomMessage = messages[Math.floor(Math.random() * messages.length)];
            
            api.sendMessage({
                body: `${randomMessage}\n━━━━━━━━━━━━━━━\n${penisText}\n📏 𝑺𝒊𝒛𝒆: ${size + 1} 𝒄𝒎\n\n"${getFunComment(size)}" 😏`,
                attachment: fs.createReadStream(imagePath)
            }, event.threadID, () => fs.unlinkSync(imagePath), event.messageID);
        });
    } catch (error) {
        console.error(error);
        // Fallback to text if canvas fails
        const size = Math.floor(Math.random() * 15);
        const penisText = `8${'='.repeat(size)}D`;
        api.sendMessage(
            `🎯 𝑬𝑹𝑹𝑶𝑹: 𝒇𝒂𝒊𝒍𝒆𝒅! 𝑯𝒆𝒓𝒆'𝒔 𝒕𝒆𝒙𝒕 𝒗𝒆𝒓𝒔𝒊𝒐𝒏:\n\n` +
            `🍆 𝑨𝒂𝒋𝒌𝒆 𝒂𝒂𝒑𝒏𝒂𝒓 𝒑𝒆𝒏𝒊𝒔: ${penisText}\n` +
            `📏 𝑺𝒊𝒛𝒆: ${size + 1} 𝒄𝒎\n` +
            `💬 "${getFunComment(size)}" 😏`,
            event.threadID,
            event.messageID
        );
    }
};

function getFunComment(size) {
    const comments = [
        "Tiny but mighty!",
        "Average king 👑",
        "Respectable size!",
        "Big PP energy!",
        "Absolute unit!",
        "Godzilla size!",
        "Colossal champion!",
        "Microscopic marvel",
        "Pocket-sized pleasure",
        "Fun-sized friend",
        "Grower not shower!",
        "Temperature compensator",
        "Perfect handful!",
        "Legendary length!",
        "Mythical measurements!"
    ];
    
    return size < 3 ? comments[0] :
           size < 5 ? comments[1] :
           size < 8 ? comments[2] :
           size < 10 ? comments[3] :
           comments[4 + Math.floor(Math.random() * 11)];
}
