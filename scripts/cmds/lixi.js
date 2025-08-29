module.exports = {
    config: {
        name: "lixi",
        version: "2.0.0",
        author: "𝐴𝑠𝑖𝑓 𝑀𝑎ℎ𝑚𝑢𝑑",
        role: 0,
        category: "fun",
        shortDescription: {
            en: "𝐶𝑟𝑒𝑎𝑡𝑒 𝑙𝑢𝑐𝑘𝑦 𝑚𝑜𝑛𝑒𝑦 𝑖𝑚𝑎𝑔𝑒"
        },
        longDescription: {
            en: "𝐺𝑒𝑛𝑒𝑟𝑎𝑡𝑒 𝑎 𝑐𝑢𝑠𝑡𝑜𝑚 𝑙𝑢𝑐𝑘𝑦 𝑚𝑜𝑛𝑒𝑦 (𝑙ì 𝑥ì) 𝑖𝑚𝑎𝑔𝑒 𝑤𝑖𝑡ℎ 𝑄𝑅 𝑐𝑜𝑑𝑒"
        },
        guide: {
            en: "{𝑝}𝑙𝑖𝑥𝑖"
        }
    },

    onStart: async function ({ event, message, usersData, args }) {
        try {
            const fs = require("fs-extra");
            const axios = require("axios");
            const path = require("path");
            const jimp = require("jimp");
            
            const { senderID } = event;
            
            // Create cache directory
            const dirMaterial = path.resolve(__dirname, '../scripts/cmds/cache/canvas');
            if (!fs.existsSync(dirMaterial)) {
                fs.mkdirSync(dirMaterial, { recursive: true });
            }

            const templatePath = path.resolve(dirMaterial, "lixi.png");
            
            // Download template if it doesn't exist
            if (!fs.existsSync(templatePath)) {
                try {
                    const { data } = await axios.get("https://i.imgur.com/VUWRn9N.jpg", {
                        responseType: 'arraybuffer'
                    });
                    fs.writeFileSync(templatePath, Buffer.from(data, 'binary'));
                } catch (error) {
                    return message.reply("❌ 𝐹𝑎𝑖𝑙𝑒𝑑 𝑡𝑜 𝑑𝑜𝑤𝑛𝑙𝑜𝑎𝑑 𝑡𝑒𝑚𝑝𝑙𝑎𝑡𝑒!");
                }
            }

            const pathImg = path.resolve(dirMaterial, `lixi_${senderID}.png`);
            const avatarPath = path.resolve(dirMaterial, `avt_${senderID}.png`);
            const qrPath = path.resolve(dirMaterial, `qr_${senderID}.png`);
            
            // Download user avatar
            try {
                const avatarData = await axios.get(`https://graph.facebook.com/${senderID}/picture?width=1500&height=1500`, {
                    responseType: 'arraybuffer'
                });
                fs.writeFileSync(avatarPath, Buffer.from(avatarData.data, 'binary'));
            } catch (error) {
                return message.reply("❌ 𝐹𝑎𝑖𝑙𝑒𝑑 𝑡𝑜 𝑑𝑜𝑤𝑛𝑙𝑜𝑎𝑑 𝑎𝑣𝑎𝑡𝑎𝑟!");
            }
            
            // Download QR code
            try {
                const qrData = await axios.get(`https://api.qrserver.com/v1/create-qr-code/?size=150x150&data=ThankYouForTheLuckyMoney`, {
                    responseType: 'arraybuffer'
                });
                fs.writeFileSync(qrPath, Buffer.from(qrData.data, 'binary'));
            } catch (error) {
                return message.reply("❌ 𝐹𝑎𝑖𝑙𝑒𝑑 𝑡𝑜 𝑔𝑒𝑛𝑒𝑟𝑎𝑡𝑒 𝑄𝑅 𝑐𝑜𝑑𝑒!");
            }

            // Process images
            try {
                const lixiImage = await jimp.read(templatePath);
                
                // Helper function to create circular images
                async function circleImage(imagePath) {
                    try {
                        const image = await jimp.read(imagePath);
                        image.circle();
                        return image;
                    } catch (error) {
                        console.error("Error creating circle image:", error);
                        const defaultImage = await jimp.create(150, 150, 0x808080ff);
                        defaultImage.circle();
                        return defaultImage;
                    }
                }

                const circleAvatar = await circleImage(avatarPath);
                const circleQR = await circleImage(qrPath);
                circleQR.rotate(-10);
                
                lixiImage.composite(circleAvatar.resize(150, 150), 226, 79)
                         .composite(circleQR.resize(75, 75), 218, 260);
                
                await lixiImage.writeAsync(pathImg);
                
                await message.reply({
                    body: "𝐿𝑢𝑐𝑘𝑦 𝑚𝑜𝑛𝑒𝑦 𝑓𝑜𝑟 𝑦𝑜𝑢! 🧧💖",
                    attachment: fs.createReadStream(pathImg)
                });
                
                // Clean up temporary files
                setTimeout(() => {
                    [avatarPath, qrPath, pathImg].forEach(file => {
                        if (fs.existsSync(file)) {
                            fs.unlinkSync(file);
                        }
                    });
                }, 5000);
                
            } catch (error) {
                console.error("𝐼𝑚𝑎𝑔𝑒 𝑝𝑟𝑜𝑐𝑒𝑠𝑠𝑖𝑛𝑔 𝑒𝑟𝑟𝑜𝑟:", error);
                await message.reply("❌ 𝐸𝑟𝑟𝑜𝑟 𝑝𝑟𝑜𝑐𝑒𝑠𝑠𝑖𝑛𝑔 𝑖𝑚𝑎𝑔𝑒𝑠!");
            }
            
        } catch (error) {
            console.error("𝐿𝑖𝑥𝑖 𝑒𝑟𝑟𝑜𝑟:", error);
            await message.reply("❌ 𝐹𝑎𝑖𝑙𝑒𝑑 𝑡𝑜 𝑐𝑟𝑒𝑎𝑡𝑒 𝑙𝑢𝑐𝑘𝑦 𝑚𝑜𝑛𝑒𝑦 𝑖𝑚𝑎𝑔𝑒!");
        }
    }
};
