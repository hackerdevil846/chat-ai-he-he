module.exports = {
    config: {
        name: "loli",
        version: "4.0.0",
        author: "𝐴𝑠𝑖𝑓 𝑀𝑎ℎ𝑚𝑢𝑑",
        role: 0,
        category: "media",
        shortDescription: {
            en: "𝑅𝑎𝑛𝑑𝑜𝑚 𝑙𝑜𝑙𝑖 𝑖𝑚𝑎𝑔𝑒𝑠"
        },
        longDescription: {
            en: "𝑆𝑒𝑛𝑑𝑠 𝑟𝑎𝑛𝑑𝑜𝑚 𝑙𝑜𝑙𝑖 𝑖𝑚𝑎𝑔𝑒𝑠 𝑤ℎ𝑒𝑛 𝑢𝑠𝑒𝑟 𝑡𝑦𝑝𝑒𝑠 '𝑙𝑜𝑙𝑖'"
        },
        guide: {
            en: ""
        }
    },

    onStart: async function ({ event, message }) {
        await message.reply(`𝐽𝑢𝑠𝑡 𝑡𝑦𝑝𝑒 '𝑙𝑜𝑙𝑖' 𝑎𝑛𝑑 𝐼'𝑙𝑙 𝑠𝑒𝑛𝑑 𝑦𝑜𝑢 𝑠𝑜𝑚𝑒 𝑐𝑢𝑡𝑒 𝑖𝑚𝑎𝑔𝑒𝑠! 📸`);
    },

    onChat: async function ({ event, message }) {
        const request = require('request');
        const fs = require("fs");
        const path = require("path");
        const { body } = event;

        // Updated path
        const loliDataPath = path.resolve(__dirname, '../scripts/cmds/datajson/loli.json');
        
        // Check if the file exists
        if (!fs.existsSync(loliDataPath)) {
            console.error("𝐿𝑜𝑙𝑖 𝑑𝑎𝑡𝑎 𝑓𝑖𝑙𝑒 𝑛𝑜𝑡 𝑓𝑜𝑢𝑛𝑑 𝑎𝑡:", loliDataPath);
            return await message.reply("❌ 𝐼𝑚𝑎𝑔𝑒 𝑑𝑎𝑡𝑎𝑏𝑎𝑠𝑒 𝑛𝑜𝑡 𝑓𝑜𝑢𝑛𝑑!");
        }

        const imageData = require(loliDataPath);
        const imageUrls = Array.isArray(imageData) ? imageData : [imageData];

        function downloadImage(imageUrl, fileName, callback) {
            request(imageUrl).pipe(fs.createWriteStream(__dirname + `/` + fileName)).on("close", callback);
        }

        if (body.toLowerCase() === "loli") {
            try {
                const numImages = Math.floor(Math.random() * 15) + 1;
                let imagesDownloaded = 0;
                let attachments = [];

                for (let i = 0; i < numImages; i++) {
                    const randomImage = imageUrls[Math.floor(Math.random() * imageUrls.length)].trim();
                    const imgFileName = `loli_${i}.png`;
                    
                    downloadImage(randomImage, imgFileName, () => {
                        imagesDownloaded++;
                        attachments.push(fs.createReadStream(__dirname + `/${imgFileName}`));
                        
                        if (imagesDownloaded === numImages) {
                            message.reply({
                                body: `𝐸𝑛𝑗𝑜𝑦 𝑡ℎ𝑒𝑠𝑒 𝑐𝑢𝑡𝑒 𝑖𝑚𝑎𝑔𝑒𝑠! 💕`,
                                attachment: attachments
                            }).then(() => {
                                // Clean up temporary files
                                attachments.forEach(img => {
                                    try {
                                        if (fs.existsSync(img.path)) {
                                            fs.unlinkSync(img.path);
                                        }
                                    } catch (e) {
                                        console.error("𝐸𝑟𝑟𝑜𝑟 𝑑𝑒𝑙𝑒𝑡𝑖𝑛𝑔 𝑓𝑖𝑙𝑒:", e);
                                    }
                                });
                            }).catch(error => {
                                console.error("𝐸𝑟𝑟𝑜𝑟 𝑠𝑒𝑛𝑑𝑖𝑛𝑔 𝑚𝑒𝑠𝑠𝑎𝑔𝑒:", error);
                            });
                        }
                    });
                }
            } catch (error) {
                console.error("𝐿𝑜𝑙𝑖 𝑐𝑜𝑚𝑚𝑎𝑛𝑑 𝑒𝑟𝑟𝑜𝑟:", error);
                await message.reply("❌ 𝐸𝑟𝑟𝑜𝑟 𝑙𝑜𝑎𝑑𝑖𝑛𝑔 𝑖𝑚𝑎𝑔𝑒𝑠!");
            }
        }
    }
};
