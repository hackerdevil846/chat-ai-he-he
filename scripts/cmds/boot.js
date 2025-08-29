module.exports = {
    config: {
        name: "boot",
        version: "1.0.0",
        author: "𝐴𝑠𝑖𝑓 𝑀𝑎ℎ𝑚𝑢𝑑",
        role: 0,
        category: "fun",
        shortDescription: {
            en: "𝐾𝑖𝑐𝑘 𝑠𝑜𝑚𝑒𝑜𝑛𝑒"
        },
        longDescription: {
            en: "𝑆𝑒𝑛𝑑 𝑎 𝑓𝑢𝑛𝑛𝑦 𝑘𝑖𝑐𝑘 𝑎𝑛𝑖𝑚𝑎𝑡𝑖𝑜𝑛"
        },
        guide: {
            en: "{𝑝}𝑏𝑜𝑜𝑡 @𝑡𝑎𝑔"
        }
    },

    onStart: async function ({ event, message, usersData, args }) {
        try {
            const fs = require("fs-extra");
            const axios = require("axios");
            const path = require("path");
            
            const { mentions } = event;
            const mention = Object.keys(mentions);
            
            if (!mention[0]) {
                return message.reply("𝑇𝑎𝑔 𝑠𝑜𝑚𝑒𝑜𝑛𝑒! 👟");
            }

            const tag = mentions[mention[0]].replace("@", "");
            const userId = mention[0];
            
            const gifLinks = [
                "https://i.postimg.cc/65TSxJYD/2ce5a017f6556ff103bce87b273b89b7.gif",
                "https://i.postimg.cc/65SP9jPT/Anime-083428-6224795.gif",
                "https://i.postimg.cc/RFXP2XfS/jXOwoHx.gif",
                "https://i.postimg.cc/jSPMRsNk/tumblr-nyc5ygy2a-Z1uz35lto1-540.gif",
            ];
            
            const randomGif = gifLinks[Math.floor(Math.random() * gifLinks.length)];
            
            // Create cache directory
            const cacheDir = path.resolve(__dirname, '../scripts/cmds/cache');
            if (!fs.existsSync(cacheDir)) {
                fs.mkdirSync(cacheDir, { recursive: true });
            }
            
            const gifPath = path.resolve(cacheDir, "boot.gif");
            
            // Download the GIF
            const response = await axios.get(randomGif, {
                responseType: 'arraybuffer'
            });
            
            fs.writeFileSync(gifPath, Buffer.from(response.data, 'binary'));
            
            await message.reply({
                body: `${tag} 𝐺𝑒𝑡 𝑏𝑜𝑜𝑡𝑒𝑑! 👢`,
                mentions: [{
                    tag: tag,
                    id: userId
                }],
                attachment: fs.createReadStream(gifPath)
            });
            
            // Clean up after 5 seconds
            setTimeout(() => {
                if (fs.existsSync(gifPath)) {
                    fs.unlinkSync(gifPath);
                }
            }, 5000);
            
        } catch (error) {
            console.error("𝐵𝑜𝑜𝑡 𝑒𝑟𝑟𝑜𝑟:", error);
            await message.reply("❌ 𝐹𝑎𝑖𝑙𝑒𝑑!");
        }
    }
};
