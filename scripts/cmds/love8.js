module.exports = {
    config: {
        name: "love8",
        version: "2.6.0",
        author: "𝐴𝑠𝑖𝑓 𝑀𝑎ℎ𝑚𝑢𝑑",
        role: 0,
        category: "love",
        shortDescription: {
            en: "𝐶𝑟𝑒𝑎𝑡𝑒 𝑎 𝑙𝑜𝑣𝑒 𝑖𝑚𝑎𝑔𝑒"
        },
        longDescription: {
            en: "𝐶𝑟𝑒𝑎𝑡𝑒𝑠 𝑎 𝑟𝑜𝑚𝑎𝑛𝑡𝑖𝑐 𝑙𝑜𝑣𝑒 𝑖𝑚𝑎𝑔𝑒 𝑤𝑖𝑡ℎ 𝑎 𝑡𝑎𝑔𝑔𝑒𝑑 𝑢𝑠𝑒𝑟"
        },
        guide: {
            en: "{𝑝}𝑙𝑜𝑣𝑒 @𝑡𝑎𝑔"
        }
    },

    onStart: async function ({ event, message, usersData, args }) {
        try {
            const fs = require("fs-extra");
            const path = require("path");
            const axios = require("axios");
            const jimp = require("jimp");
            
            const { senderID, mentions } = event;
            const mention = Object.keys(mentions)[0];
            
            if (!mention) {
                return message.reply("𝑃𝑙𝑒𝑎𝑠𝑒 𝑡𝑎𝑔 𝑠𝑜𝑚𝑒𝑜𝑛𝑒 𝑡𝑜 𝑐𝑟𝑒𝑎𝑡𝑒 𝑎 𝑙𝑜𝑣𝑒 𝑖𝑚𝑎𝑔𝑒 𝑤𝑖𝑡ℎ! 💕");
            }

            const tag = mentions[mention].replace("@", "");
            const one = senderID;
            const two = mention;
            
            // Create cache directory
            const dirMaterial = path.resolve(__dirname, '../scripts/cmds/cache/canvas');
            if (!fs.existsSync(dirMaterial)) {
                fs.mkdirSync(dirMaterial, { recursive: true });
            }

            const templatePath = path.resolve(dirMaterial, "love.jpg");
            
            // Download template if it doesn't exist
            if (!fs.existsSync(templatePath)) {
                try {
                    const { data } = await axios.get("https://i.imgur.com/zwBuMaE.jpg", {
                        responseType: 'arraybuffer'
                    });
                    fs.writeFileSync(templatePath, Buffer.from(data, 'binary'));
                } catch (error) {
                    return message.reply("❌ 𝐹𝑎𝑖𝑙𝑒𝑑 𝑡𝑜 𝑑𝑜𝑤𝑛𝑙𝑜𝑎𝑑 𝑙𝑜𝑣𝑒 𝑡𝑒𝑚𝑝𝑙𝑎𝑡𝑒!");
                }
            }

            const pathImg = path.resolve(dirMaterial, `love_${one}_${two}.png`);
            const avatarOne = path.resolve(dirMaterial, `avt_${one}.png`);
            const avatarTwo = path.resolve(dirMaterial, `avt_${two}.png`);
            
            // Download avatars
            try {
                const getAvatarOne = await axios.get(`https://graph.facebook.com/${one}/picture?width=512&height=512&access_token=6628568379%7Cc1e620fa708a1d5696fb991c1bde5662`, {
                    responseType: 'arraybuffer'
                });
                fs.writeFileSync(avatarOne, Buffer.from(getAvatarOne.data, 'binary'));
                
                const getAvatarTwo = await axios.get(`https://graph.facebook.com/${two}/picture?width=512&height=512&access_token=6628568379%7Cc1e620fa708a1d5696fb991c1bde5662`, {
                    responseType: 'arraybuffer'
                });
                fs.writeFileSync(avatarTwo, Buffer.from(getAvatarTwo.data, 'binary'));
            } catch (error) {
                return message.reply("❌ 𝐹𝑎𝑖𝑙𝑒𝑑 𝑡𝑜 𝑑𝑜𝑤𝑛𝑙𝑜𝑎𝑑 𝑝𝑟𝑜𝑓𝑖𝑙𝑒 𝑝𝑖𝑐𝑡𝑢𝑟𝑒𝑠!");
            }

            // Process images
            try {
                const loveImage = await jimp.read(templatePath);
                
                // Helper function to create circular avatars
                async function circleAvatar(avatarPath) {
                    try {
                        const image = await jimp.read(avatarPath);
                        image.circle();
                        return image;
                    } catch (error) {
                        console.error("Error creating circle avatar:", error);
                        const defaultAvatar = await jimp.create(90, 70, 0x808080ff);
                        defaultAvatar.circle();
                        return defaultAvatar;
                    }
                }

                const circleOne = await circleAvatar(avatarOne);
                const circleTwo = await circleAvatar(avatarTwo);
                
                loveImage.composite(circleOne.resize(90, 70), 215, 177)
                         .composite(circleTwo.resize(93, 70), 76, 178);
                
                await loveImage.writeAsync(pathImg);
                
                await message.reply({
                    body: `𝐼 𝑙𝑜𝑣𝑒 𝑦𝑜𝑢 𝑠𝑜 𝑚𝑢𝑐ℎ, ${tag}! 💔`,
                    mentions: [{
                        tag: tag,
                        id: mention
                    }],
                    attachment: fs.createReadStream(pathImg)
                });
                
                // Clean up temporary files
                setTimeout(() => {
                    [avatarOne, avatarTwo, pathImg].forEach(file => {
                        if (fs.existsSync(file)) {
                            fs.unlinkSync(file);
                        }
                    });
                }, 5000);
                
            } catch (error) {
                console.error("𝐼𝑚𝑎𝑔𝑒 𝑝𝑟𝑜𝑐𝑒𝑠𝑠𝑖𝑛𝑔 𝑒𝑟𝑟𝑜𝑟:", error);
                await message.reply("❌ 𝐸𝑟𝑟𝑜𝑟 𝑝𝑟𝑜𝑐𝑒𝑠𝑠𝑖𝑛𝑔 𝑙𝑜𝑣𝑒 𝑖𝑚𝑎𝑔𝑒!");
            }
            
        } catch (error) {
            console.error("𝐿𝑜𝑣𝑒 𝑐𝑜𝑚𝑚𝑎𝑛𝑑 𝑒𝑟𝑟𝑜𝑟:", error);
            await message.reply("❌ 𝐴𝑛 𝑒𝑟𝑟𝑜𝑟 𝑜𝑐𝑐𝑢𝑟𝑟𝑒𝑑 𝑤ℎ𝑖𝑙𝑒 𝑐𝑟𝑒𝑎𝑡𝑖𝑛𝑔 𝑡ℎ𝑒 𝑙𝑜𝑣𝑒 𝑖𝑚𝑎𝑔𝑒!");
        }
    }
};
