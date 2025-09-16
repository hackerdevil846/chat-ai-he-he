const axios = require("axios");
const fs = require("fs-extra");
const path = require("path");
const jimp = require("jimp");

module.exports = {
    config: {
        name: "pair8",
        aliases: ["pair8", "couple8", "juti8"],
        version: "7.3.1",
        role: 0,
        author: "𝐴𝑠𝑖𝑓 𝑀𝑎ℎ𝑚𝑢𝑑",
        shortDescription: {
            en: "💞 𝑀𝑒𝑛𝑡𝑖𝑜𝑛 𝑘𝑎𝑟𝑎 𝑏𝑎𝑛𝑑𝑒𝑟 𝑠𝑎𝑡ℎ𝑒 𝑗𝑢𝑡𝑖 𝑏𝑎𝑛𝑑ℎ𝑎𝑟 𝑘ℎ𝑒𝑙𝑎"
        },
        longDescription: {
            en: "𝑃𝑙𝑎𝑦 𝑎 𝑓𝑢𝑛 𝑝𝑎𝑖𝑟𝑖𝑛𝑔 𝑔𝑎𝑚𝑒 𝑤𝑖𝑡ℎ 𝑚𝑒𝑛𝑡𝑖𝑜𝑛𝑒𝑑 𝑢𝑠𝑒𝑟"
        },
        category: "𝑖𝑚𝑔",
        guide: {
            en: "{p}pair8 [@𝑚𝑒𝑛𝑡𝑖𝑜𝑛]"
        },
        countDown: 5,
        dependencies: {
            "axios": "",
            "fs-extra": "",
            "path": "",
            "jimp": ""
        }
    },

    onLoad: async function() {
        try {
            // Dependency check
            require("axios");
            require("fs-extra");
            require("path");
            require("jimp");
            
            const dirMaterial = path.resolve(__dirname, 'cache', 'canvas');
            const imagePath = path.resolve(dirMaterial, 'ar1r2.png');
            
            if (!fs.existsSync(dirMaterial)) fs.mkdirSync(dirMaterial, { recursive: true });
            
            if (!fs.existsSync(imagePath)) {
                try {
                    const response = await axios.get("https://i.imgur.com/iaOiAXe.jpeg", { responseType: 'arraybuffer' });
                    fs.writeFileSync(imagePath, Buffer.from(response.data));
                } catch (error) {
                    console.error("𝐸𝑟𝑟𝑜𝑟 𝑑𝑜𝑤𝑛𝑙𝑜𝑎𝑑𝑖𝑛𝑔 𝑡𝑒𝑚𝑝𝑙𝑎𝑡𝑒 𝑖𝑚𝑎𝑔𝑒:", error);
                }
            }
        } catch (e) {
            console.log("❌ 𝑀𝑖𝑠𝑠𝑖𝑛𝑔 𝑑𝑒𝑝𝑒𝑛𝑑𝑒𝑛𝑐𝑖𝑒𝑠: 𝑎𝑥𝑖𝑜𝑠, 𝑓𝑠-𝑒𝑥𝑡𝑟𝑎, 𝑝𝑎𝑡ℎ, 𝑗𝑖𝑚𝑝");
        }
    },

    onStart: async function({ message, event, args, usersData }) {
        try {
            const { threadID, messageID, senderID } = event;
            const mention = Object.keys(event.mentions);
            
            if (!mention.length) {
                return message.reply("❌ 𝐷𝑎𝑦𝑎 𝑘𝑜𝑟𝑒 𝑒𝑘𝑗𝑜𝑛 𝑘𝑒 𝑚𝑒𝑛𝑡𝑖𝑜𝑛 𝑘𝑜𝑟𝑢𝑛");
            }
            
            const one = senderID;
            const two = mention[0];
            
            async function circle(imagePath) {
                const image = await jimp.read(imagePath);
                image.circle();
                return await image.getBufferAsync("image/png");
            }

            async function makeImage({ one, two }) {
                const __root = path.resolve(__dirname, "cache", "canvas");
                const templatePath = path.resolve(__root, 'ar1r2.png');
                const outputPath = path.resolve(__root, `pair_${one}_${two}.png`);
                const avatarOnePath = path.resolve(__root, `avt_${one}.png`);
                const avatarTwoPath = path.resolve(__root, `avt_${two}.png`);

                // Download and process first avatar
                const avatarOne = (await axios.get(`https://graph.facebook.com/${one}/picture?width=512&height=512`, 
                    { responseType: 'arraybuffer' })).data;
                fs.writeFileSync(avatarOnePath, Buffer.from(avatarOne, 'binary'));
                
                // Download and process second avatar
                const avatarTwo = (await axios.get(`https://graph.facebook.com/${two}/picture?width=512&height=512`, 
                    { responseType: 'arraybuffer' })).data;
                fs.writeFileSync(avatarTwoPath, Buffer.from(avatarTwo, 'binary'));
                
                // Process images
                const template = await jimp.read(templatePath);
                const circledAvatarOne = await jimp.read(await circle(avatarOnePath));
                const circledAvatarTwo = await jimp.read(await circle(avatarTwoPath));
                
                // Composite avatars onto template
                template.composite(circledAvatarOne.resize(200, 200), 70, 110)
                       .composite(circledAvatarTwo.resize(200, 200), 465, 110);
                
                // Save final image
                await template.writeAsync(outputPath);
                
                // Cleanup temp files
                fs.unlinkSync(avatarOnePath);
                fs.unlinkSync(avatarTwoPath);
                
                return outputPath;
            }

            const pairedImage = await makeImage({ one, two });
            
            const userName = await usersData.getName(two);
            
            await message.reply({
                body: `✨╭──•◈•───✮───•◈•──╮\n\n  「 𝑆𝑎𝑝ℎ𝑎𝑙 𝐽𝑢𝑡𝑖𝑏𝑎𝑛𝑑ℎ𝑎𝑛 」\n\n╰──•◈•───✮───•◈•──╯\n\n🥀 | 𝑃𝑎𝑖𝑟𝑒𝑑 𝑤𝑖𝑡ℎ: @${userName}`,
                mentions: [{
                    tag: userName,
                    id: two
                }],
                attachment: fs.createReadStream(pairedImage)
            });
            
            // Clean up final image
            fs.unlinkSync(pairedImage);
            
        } catch (error) {
            console.error("❌ 𝑃𝑎𝑖𝑟8 𝑒𝑟𝑟𝑜𝑟:", error);
            await message.reply("⚠️ 𝐸𝑟𝑟𝑜𝑟 𝑖𝑛 𝑖𝑚𝑎𝑔𝑒 𝑝𝑟𝑜𝑐𝑒𝑠𝑠𝑖𝑛𝑔!");
        }
    }
};
