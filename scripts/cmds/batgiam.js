/**
* @author 𝐴𝑠𝑖𝑓 𝑀𝑎ℎ𝑚𝑢𝑑
* @warn Do not edit code or edit credits
*/

const fs = require('fs-extra');
const path = require('path');
const axios = require('axios');
const jimp = require('jimp');

module.exports.config = {
    name: "batgiam",
    aliases: ["govemploy", "government"],
    version: "2.0.0",
    author: "𝐴𝑠𝑖𝑓 𝑀𝑎ℎ𝑚𝑢𝑑",
    countDown: 5,
    role: 0,
    shortDescription: {
        en: "𝐶𝑟𝑒𝑎𝑡𝑒 𝑏𝑎𝑡 𝑔𝑖𝑎𝑚 𝑚𝑒𝑚𝑒 𝑤𝑖𝑡ℎ 𝑢𝑠𝑒𝑟 𝑎𝑣𝑎𝑡𝑎𝑟𝑠"
    },
    longDescription: {
        en: "𝐺𝑒𝑛𝑒𝑟𝑎𝑡𝑒 𝑎 𝑓𝑢𝑛𝑛𝑦 𝑣𝑖𝑒𝑡𝑛𝑎𝑚𝑒𝑠𝑒 𝑔𝑜𝑣𝑒𝑟𝑛𝑚𝑒𝑛𝑡 𝑒𝑚𝑝𝑙𝑜𝑦𝑚𝑒𝑛𝑡 𝑚𝑒𝑚𝑒 𝑤𝑖𝑡ℎ 𝑦𝑜𝑢𝑟 𝑓𝑟𝑖𝑒𝑛𝑑'𝑠 𝑎𝑣𝑎𝑡𝑎𝑟𝑠"
    },
    category: "𝑓𝑢𝑛",
    guide: {
        en: "{p}batgiam [tag]"
    },
    dependencies: {
        "fs-extra": "",
        "path": "",
        "axios": "",
        "jimp": ""
    }
};

module.exports.onStart = async function ({ api, event, args, message }) {
    try {
        const { threadID, messageID, senderID } = event;
        
        // Check if user tagged someone
        if (!args[0] || !Object.keys(event.mentions).length) {
            return message.reply("❌ 𝑃𝑙𝑒𝑎𝑠𝑒 𝑡𝑎𝑔 𝑠𝑜𝑚𝑒𝑜𝑛𝑒 𝑡𝑜 𝑢𝑠𝑒 𝑡ℎ𝑖𝑠 𝑐𝑜𝑚𝑚𝑎𝑛𝑑");
        }
        
        const mention = Object.keys(event.mentions)[0];
        const tag = event.mentions[mention].replace("@", "");
        const one = senderID;
        const two = mention;
        
        // Use the specified custom path
        const __root = path.resolve(__dirname, "..", "cache", "canvas");
        if (!fs.existsSync(__root)) {
            fs.mkdirSync(__root, { recursive: true });
        }
        
        // Use the specified custom path for the template
        const templatePath = path.resolve(__dirname, "..", "cache", "canvas", "batgiam.png");
        if (!fs.existsSync(templatePath)) {
            const { data } = await axios.get("https://i.imgur.com/ep1gG3r.png", { responseType: 'arraybuffer' });
            fs.writeFileSync(templatePath, Buffer.from(data, 'binary'));
        }
        
        // Generate the image
        const pathImg = await makeImage({ one, two, __root, templatePath });
        
        // Get user name for personalized message
        const userName = await getUserName(api, two);
        
        return message.reply({ 
            body: `🎉 𝐶𝑜𝑛𝑔𝑟𝑎𝑡𝑢𝑙𝑎𝑡𝑖𝑜𝑛𝑠 ${userName}! 𝑌𝑜𝑢'𝑣𝑒 𝑏𝑒𝑒𝑛 𝑟𝑒𝑐𝑟𝑢𝑖𝑡𝑒𝑑 𝑎𝑠 𝑎 𝑔𝑜𝑣𝑒𝑟𝑛𝑚𝑒𝑛𝑡 𝑒𝑚𝑝𝑙𝑜𝑦𝑒𝑒!\n𝒲𝒾𝓈𝒽𝒾𝓃𝑔 𝓎𝑜𝓊 𝒽𝒶𝓅𝓅𝒾𝓃𝑒𝓈𝓈 𝒾𝓃 𝓎𝑜𝓊𝓇 𝓃𝑒𝓌 𝓅𝑜𝓈𝒾𝓉𝒾𝑜𝓃! 😆`,
            mentions: [{
                tag: userName,
                id: mention
            }],
            attachment: fs.createReadStream(pathImg) 
        }, () => fs.unlinkSync(pathImg));

    } catch (error) {
        console.error("𝐸𝑟𝑟𝑜𝑟:", error);
        message.reply("❌ 𝒜𝓃 𝑒𝓇𝓇𝑜𝓇 𝑜𝒸𝒸𝓊𝓇𝓇𝑒𝒹 𝓌𝒽𝒾𝓁𝑒 𝒸𝓇𝑒𝒶𝓉𝒾𝓃𝑔 𝓉𝒽𝑒 𝒾𝓂𝒶𝑔𝑒!");
    }
};

// Helper function to get user name
async function getUserName(api, userID) {
    try {
        const userInfo = await api.getUserInfo(userID);
        return userInfo[userID].name || "𝒻𝓇𝒾𝑒𝓃𝒹";
    } catch {
        return "𝒻𝓇𝒾𝑒𝓃𝒹";
    }
}

// Function to create the batgiam image
async function makeImage({ one, two, __root, templatePath }) {
    const pathImg = __root + `/batgiam_${one}_${two}.png`;
    const avatarOne = __root + `/avt_${one}.png`;
    const avatarTwo = __root + `/avt_${two}.png`;
    
    // Download and save avatars
    try {
        const getAvatarOne = await axios.get(`https://4boxvn.com/api/avt?s=${one}`, { responseType: 'arraybuffer' });
        fs.writeFileSync(avatarOne, Buffer.from(getAvatarOne.data, 'binary'));
        
        const getAvatarTwo = await axios.get(`https://4boxvn.com/api/avt?s=${two}`, { responseType: 'arraybuffer' });
        fs.writeFileSync(avatarTwo, Buffer.from(getAvatarTwo.data, 'binary'));
    } catch (error) {
        throw new Error("𝐹𝒶𝒾𝓁𝑒𝒹 𝓉𝑜 𝒹𝑜𝓌𝓃𝓁𝑜𝒶𝒹 𝒶𝓋𝒶𝓉𝒶𝓇𝓈");
    }
    
    try {
        // Process images
        let batgiam_img = await jimp.read(templatePath);
        let circleOne = await jimp.read(await circle(avatarOne));
        let circleTwo = await jimp.read(await circle(avatarTwo));
        
        // Composite images
        batgiam_img.resize(500, 500)
            .composite(circleOne.resize(100, 100), 375, 9)
            .composite(circleTwo.resize(100, 100), 160, 92);
        
        // Save and clean up
        let raw = await batgiam_img.getBufferAsync("image/png");
        fs.writeFileSync(pathImg, raw);
        fs.unlinkSync(avatarOne);
        fs.unlinkSync(avatarTwo);
        
        return pathImg;
    } catch (error) {
        // Clean up on error
        if (fs.existsSync(avatarOne)) fs.unlinkSync(avatarOne);
        if (fs.existsSync(avatarTwo)) fs.unlinkSync(avatarTwo);
        throw error;
    }
}

// Function to create circular avatars
async function circle(imagePath) {
    const image = await jimp.read(imagePath);
    image.circle();
    return await image.getBufferAsync("image/png");
}
