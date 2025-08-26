module.exports = {
    config: {
        name: "marriedv4",
        version: "3.1.1",
        hasPermssion: 0,
        credits: "𝑨𝒔𝒊𝒇 𝑴𝒂𝒉𝒎𝒖𝒅",
        description: {
            en: "💍 Create marriage images for couples",
            bn: "💑 দম্পতিদের জন্য বিবাহের ছবি তৈরি করুন"
        },
        category: {
            en: "Image",
            bn: "ছবি"
        },
        usages: {
            en: "[@mention]",
            bn: "[@মেনশন]"
        },
        cooldowns: 5,
        dependencies: {
            "axios": "",
            "fs-extra": "",
            "path": "",
            "jimp": ""
        }
    },

    onLoad: async function() {
        const path = require("path");
        const { existsSync, mkdirSync } = require("fs-extra");
        const { downloadFile } = global.utils;
        const dirMaterial = __dirname + `/cache/canvas/`;
        const filePath = path.resolve(__dirname, 'cache/canvas', 'marriedv4.png');
        
        if (!existsSync(dirMaterial)) mkdirSync(dirMaterial, { recursive: true });
        if (!existsSync(filePath)) await downloadFile("https://i.ibb.co/9ZZCSzR/ba6abadae46b5bdaa29cf6a64d762874.jpg", filePath);
    },

    onStart: async function({ event, api, args, Users }) {
        const fs = require("fs-extra");
        const path = require("path");
        const { threadID, messageID, senderID } = event;
        const mention = Object.keys(event.mentions);

        // Helper functions
        const circleImage = async (imagePath) => {
            const jimp = require("jimp");
            const image = await jimp.read(imagePath);
            image.circle();
            return await image.getBufferAsync("image/png");
        };

        const makeMarriageImage = async (one, two) => {
            const __root = path.resolve(__dirname, "cache", "canvas");
            const marriedImgPath = __root + `/married_${one}_${two}.png`;
            const avatarOnePath = __root + `/avt_${one}.png`;
            const avatarTwoPath = __root + `/avt_${two}.png`;
            
            try {
                // Download and process avatars
                const avatarOne = (await global.utils.getStreamFromURL(`https://graph.facebook.com/${one}/picture?width=512&height=512&access_token=6628568379%7Cc1e620fa708a1d5696fb991c1bde5662`));
                const avatarTwo = (await global.utils.getStreamFromURL(`https://graph.facebook.com/${two}/picture?width=512&height=512&access_token=6628568379%7Cc1e620fa708a1d5696fb991c1bde5662`));
                
                fs.writeFileSync(avatarOnePath, avatarOne);
                fs.writeFileSync(avatarTwoPath, avatarTwo);
                
                // Create circular avatars
                const circleOne = await circleImage(avatarOnePath);
                const circleTwo = await circleImage(avatarTwoPath);
                
                // Composite image
                const marriedImg = await require("jimp").read(__root + "/marriedv4.png");
                const circleOneImg = await require("jimp").read(circleOne);
                const circleTwoImg = await require("jimp").read(circleTwo);
                
                marriedImg.composite(circleOneImg.resize(130, 130), 200, 70);
                marriedImg.composite(circleTwoImg.resize(130, 130), 350, 150);
                
                // Save final image
                const buffer = await marriedImg.getBufferAsync("image/png");
                fs.writeFileSync(marriedImgPath, buffer);
                
                // Cleanup temp files
                fs.unlinkSync(avatarOnePath);
                fs.unlinkSync(avatarTwoPath);
                
                return marriedImgPath;
            } catch (error) {
                console.error("Image creation error:", error);
                return null;
            }
        };

        // Main execution
        if (!mention[0]) {
            return api.sendMessage("💍 দয়া করে একজনকে মেনশন করুন!", threadID, messageID);
        }
        
        try {
            const one = senderID;
            const two = mention[0];
            const userNameOne = await Users.getNameUser(one);
            const userNameTwo = await Users.getNameUser(two);
            
            const imagePath = await makeMarriageImage(one, two);
            if (!imagePath) return api.sendMessage("❌ ছবি তৈরি করতে সমস্যা হয়েছে!", threadID, messageID);
            
            const msg = {
                body: `💑 ${userNameOne} আর ${userNameTwo}-এর বিবাহের ছবি!\n━━━━━━━━━━━━━━━\n💍 ডেভেলপার: 𝑨𝒔𝒊𝒇 𝑴𝒂𝒉𝒎𝒖𝒅`,
                attachment: fs.createReadStream(imagePath)
            };
            
            api.sendMessage(msg, threadID, () => fs.unlinkSync(imagePath), messageID);
        } catch (error) {
            console.error("Command error:", error);
            api.sendMessage("❌ কমান্ড এক্সিকিউট করতে সমস্যা হয়েছে!", threadID, messageID);
        }
    }
};
