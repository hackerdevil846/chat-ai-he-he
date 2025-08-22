const DIG = require("discord-image-generation");
const fs = require("fs-extra");
const { Canvas, loadImage } = require("canvas-wrapper");

module.exports.config = {
    name: "clown",
    version: "1.0",
    hasPermssion: 0,
    credits: "𝑨𝒔𝒊𝒇 𝑴𝒂𝒉𝒎𝒖𝒅",
    description: "🎪 Add some clown vibes to yourself or a friend!",
    commandCategory: "edit-img",
    usages: "[reply/tag someone]",
    cooldowns: 5,
    dependencies: {
        "discord-image-generation": "latest",
        "canvas-wrapper": "latest",
        "fs-extra": "latest"
    },
    envConfig: {
        deltaNext: 5
    }
};

module.exports.languages = {
    vi: {
        noTag: "Bạn phải tag người bạn muốn tát"
    },
    en: {
        noTag: "You must tag the person you want to clownify!"
    }
};

module.exports.run = async function({ api, event, args, Users }) {
    try {
        const mentions = Object.keys(event.mentions);
        let uid;

        // Determine target user
        if (event.type === "message_reply") {
            uid = event.messageReply.senderID;
        } else {
            uid = mentions[0] || event.senderID;
        }

        // Get avatar URL
        const avatarUrl = await Users.getAvatarUrl(uid);

        // Generate triggered/clowned base image
        const triggeredImage = await new DIG.Triggered().getImage(avatarUrl);

        // Load canvas and clown overlay
        const clownOverlay = await loadImage("./clownImage.jpg");
        const canvas = new Canvas(triggeredImage.width, triggeredImage.height);
        const ctx = canvas.getContext("2d");

        // Draw base and overlay with style
        ctx.drawImage(triggeredImage, 0, 0, canvas.width, canvas.height);
        ctx.globalAlpha = 0.7; // transparency for effect
        ctx.drawImage(clownOverlay, 0, 0, canvas.width, canvas.height);

        // Optional: Add emoji/text overlay
        ctx.globalAlpha = 1;
        ctx.font = "60px Comic Sans MS";
        ctx.fillStyle = "#FF0000";
        ctx.fillText("🤡 Clown Time!", 50, 100);

        // Save image
        const buffer = canvas.toBuffer();
        const pathSave = `${__dirname}/tmp/clown.png`;
        fs.writeFileSync(pathSave, buffer);

        // Create message body
        let body = mentions[0]
            ? `🤡 ${event.senderName} added some clownish vibes to someone!`
            : `🤡 You're the clown! Look at yourself!\nReply or tag someone else.`;

        // Send reply
        api.sendMessage(
            {
                body,
                attachment: fs.createReadStream(pathSave)
            },
            event.threadID,
            () => fs.unlinkSync(pathSave)
        );

    } catch (err) {
        console.error("Error in clown command:", err);
        api.sendMessage("⚠️ Something went wrong while clownifying.", event.threadID);
    }
};
