const fs = require("fs-extra");
const axios = require("axios");
const path = require("path");
const { createCanvas, loadImage } = require("canvas");

// ✨ Helper: Auto-wrap text to fit the board
function wrapText(ctx, text, x, y, maxWidth, lineHeight) {
    const words = text.split(' ');
    let line = '';
    let currentY = y;

    for (let n = 0; n < words.length; n++) {
        const testLine = line + words[n] + ' ';
        const metrics = ctx.measureText(testLine);
        const testWidth = metrics.width;
        
        if (testWidth > maxWidth && n > 0) {
            ctx.fillText(line, x, currentY);
            line = words[n] + ' ';
            currentY += lineHeight;
        } else {
            line = testLine;
        }
    }
    ctx.fillText(line, x, currentY);
}

module.exports = {
    config: {
        name: "student",
        aliases: ["studentboard", "board"],
        version: "4.0.0", // Major Upgrade
        author: "𝐴𝑠𝑖𝑓 𝑀𝑎ℎ𝑚𝑢𝑑",
        role: 0,
        category: "fun",
        shortDescription: {
            en: "🎓 𝐵𝑜𝑎𝑟𝑑 𝑒 𝑠𝑡𝑢𝑑𝑒𝑛𝑡𝑒𝑟 𝑚𝑒𝑟𝑎 𝑘𝑜𝑚𝑒𝑛𝑡 𝑘𝑜𝑟𝑎"
        },
        longDescription: {
            en: "Writes your text on the student's whiteboard using realistic canvas rendering."
        },
        guide: {
            en: "{p}student [𝑡𝑒𝑥𝑡]"
        },
        countDown: 5,
        dependencies: {
            "axios": "",
            "fs-extra": "",
            "canvas": ""
        }
    },

    onStart: async function({ message, event, args }) {
        const { threadID, messageID, senderID } = event;
        const cacheDir = path.join(__dirname, "cache");
        const filePath = path.join(cacheDir, `student_${senderID}_${Date.now()}.jpg`);

        try {
            // 1. Dependency & Input Check
            try {
                require("canvas");
            } catch (e) {
                return message.reply("❌ 𝑀𝑖𝑠𝑠𝑖𝑛𝑔 '𝑐𝑎𝑛𝑣𝑎𝑠'. 𝑃𝑙𝑒𝑎𝑠𝑒 𝑖𝑛𝑠𝑡𝑎𝑙𝑙 𝑖𝑡.");
            }

            const text = args.join(" ");
            if (!text) {
                return message.reply("🎓 𝑃𝑙𝑒𝑎𝑠𝑒 𝑒𝑛𝑡𝑒𝑟 𝑡𝑒𝑥𝑡 𝑓𝑜𝑟 𝑡ℎ𝑒 𝑏𝑜𝑎𝑟𝑑.");
            }

            // 2. Send Loading Message
            const processingMsg = await message.reply("🎨 𝑊𝑟𝑖𝑡𝑖𝑛𝑔 𝑜𝑛 𝑡ℎ𝑒 𝑏𝑜𝑎𝑟𝑑...");

            // 3. Ensure Cache Directory
            if (!fs.existsSync(cacheDir)) {
                fs.mkdirSync(cacheDir, { recursive: true });
            }

            // 4. Load Template Image
            // Using a reliable buffer download method
            const templateURL = "https://i.ibb.co/yf4yCVh/Picsart-22-08-14-01-57-26-461.jpg";
            const response = await axios.get(templateURL, { responseType: 'arraybuffer' });
            const template = await loadImage(Buffer.from(response.data));

            // 5. Setup Canvas
            const canvas = createCanvas(template.width, template.height);
            const ctx = canvas.getContext("2d");

            // Draw Background
            ctx.drawImage(template, 0, 0, canvas.width, canvas.height);

            // 6. Configure Text Style (Marker Look)
            ctx.font = "bold 35px Arial"; // Fallback to Arial, bold for visibility
            ctx.fillStyle = "#2c3e50"; // Dark blue-gray (Marker color)
            ctx.textAlign = "center";
            ctx.textBaseline = "middle";

            // 7. Calculate Position & Rotation
            // The board is titled slightly to the left.
            // Center of the whiteboard area roughly:
            const centerX = 380; 
            const centerY = 850;
            const rotationAngle = -8 * (Math.PI / 180); // -8 degrees in radians
            const maxWidth = 400; // Width of the writing area
            const lineHeight = 40;

            // 8. Apply Rotation and Draw
            ctx.save();
            ctx.translate(centerX, centerY);
            ctx.rotate(rotationAngle);
            
            // Wrap text function call (offsets from the rotated center)
            wrapText(ctx, text, 0, 0 - (lineHeight), maxWidth, lineHeight);
            
            ctx.restore();

            // 9. Save and Send
            const buffer = canvas.toBuffer("image/jpeg");
            fs.writeFileSync(filePath, buffer);

            await message.reply({
                body: "🎓 𝐻𝑒𝑟𝑒 𝑖𝑠 𝑦𝑜𝑢𝑟 𝑏𝑜𝑎𝑟𝑑:",
                attachment: fs.createReadStream(filePath)
            });

            // 10. Cleanup
            try {
                global.api.unsendMessage(processingMsg.messageID);
                fs.unlinkSync(filePath);
            } catch (e) {}

        } catch (error) {
            console.error("Student Board Error:", error);
            message.reply("⚠️ 𝐸𝑟𝑟𝑜𝑟 𝑔𝑒𝑛𝑒𝑟𝑎𝑡𝑖𝑛𝑔 𝑖𝑚𝑎𝑔𝑒. 𝑃𝑙𝑒𝑎𝑠𝑒 𝑡𝑟𝑦 𝑎𝑔𝑎𝑖𝑛.");
        }
    }
};
