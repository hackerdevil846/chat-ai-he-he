module.exports = {
    config: {
        name: "bam",
        version: "2.2.2",
        author: "𝐴𝑠𝑖𝑓 𝑀𝑎ℎ𝑚𝑢𝑑",
        role: 0,
        category: "fun",
        shortDescription: {
            en: "Slap someone fun"
        },
        longDescription: {
            en: "Create funny slap pic with tagged user"
        },
        guide: {
            en: "{p}bam @tag"
        }
    },

    onStart: async function ({ event, message, usersData, args }) {
        try {
            const fs = require("fs-extra");
            const path = require("path");
            const axios = require("axios");
            const jimp = require("jimp");
            
            const { senderID, mentions } = event;
            const mention = Object.keys(mentions);
            
            if (!mention[0]) {
                return message.reply("Tag someone 👊");
            }

            const one = senderID;
            const two = mention[0];
            
            // Use the specified local path
            const imagePath = path.resolve(__dirname, '../scripts/cmds/cache/canvas/slap.png');
            
            // Check if local slap image exists
            if (!fs.existsSync(imagePath)) {
                return message.reply("❌ Slap template missing!");
            }

            // Create output directory if it doesn't exist
            const outputDir = path.resolve(__dirname, '../scripts/cmds/cache/canvas');
            if (!fs.existsSync(outputDir)) {
                fs.mkdirSync(outputDir, { recursive: true });
            }

            const pathImg = path.resolve(outputDir, `slap_${one}_${two}.png`);
            
            // Helper function to create circular avatars
            async function circleAvatar(userId) {
                try {
                    const avatarUrl = `https://graph.facebook.com/${userId}/picture?width=512&height=512&access_token=6628568379%7Cc1e620fa708a1d5696fb991c1bde5662`;
                    const response = await axios.get(avatarUrl, { responseType: 'arraybuffer' });
                    const avatar = await jimp.read(Buffer.from(response.data));
                    avatar.circle();
                    return avatar;
                } catch (error) {
                    console.error("Avatar error:", error);
                    const defaultAvatar = await jimp.create(150, 150, 0x808080ff);
                    defaultAvatar.circle();
                    return defaultAvatar;
                }
            }

            // Create the slap image
            const slap_image = await jimp.read(imagePath);
            const circleOne = await circleAvatar(one);
            const circleTwo = await circleAvatar(two);
            
            slap_image.composite(circleOne.resize(150, 150), 745, 25)
                     .composite(circleTwo.resize(140, 140), 180, 40);
            
            await slap_image.writeAsync(pathImg);
            
            // Short English messages array
            const shortMessages = [
                "বাম! থাপ্পড় মারলো! 👊",
                "চড় বসিয়ে দিল! 😂",
                "থাপ্পড় খাওয়ার সময় হলো! 👋",
                "একটা জোড়ালো চড়! 💥",
                "টোয়াং! থাপ্পড় খেলো! 🖐️",
                "চড় মারার মজা নাও! 🤚",
                "বাংলা স্টাইলে থাপ্পড়! 🇧🇩"
            ];
            
            const randomMessage = shortMessages[Math.floor(Math.random() * shortMessages.length)];
            
            await message.reply({
                body: randomMessage,
                attachment: fs.createReadStream(pathImg)
            });
            
            // Clean up after 5 seconds
            setTimeout(() => {
                if (fs.existsSync(pathImg)) {
                    fs.unlinkSync(pathImg);
                }
            }, 5000);
            
        } catch (error) {
            console.error("Slap error:", error);
            await message.reply("❌ Slap failed!");
        }
    }
};
