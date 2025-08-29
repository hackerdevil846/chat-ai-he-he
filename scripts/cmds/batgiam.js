/**
* @author 𝐴𝑠𝑖𝑓 𝑀𝑎ℎ𝑚𝑢𝑑
* @warn Do not edit code or edit credits
*/

module.exports = {
  config: {
    name: "batgiam",
    aliases: ["govemploy"],
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
    }
  },

  onStart: async function ({ api, event, args }) {
    try {
      const fs = global.nodemodule["fs-extra"];
      const path = global.nodemodule["path"];
      const axios = global.nodemodule["axios"];
      const jimp = global.nodemodule["jimp"];
      
      const { threadID, messageID, senderID } = event;
      
      // Check if user tagged someone
      if (!args[0] || !Object.keys(event.mentions).length) {
        return api.sendMessage("❌ Please tag someone to use this command", threadID, messageID);
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
        const { downloadFile } = global.utils;
        await downloadFile("https://i.imgur.com/ep1gG3r.png", templatePath);
      }
      
      // Generate the image
      const pathImg = await makeImage({ one, two, __root, templatePath });
      
      // Get user name for personalized message
      const userName = await getUserName(api, two);
      
      return api.sendMessage({ 
        body: `🎉 Congratulations ${userName}! You've been recruited as a government employee!\nWishing you happiness in your new position! 😆`,
        mentions: [{
          tag: userName,
          id: mention
        }],
        attachment: fs.createReadStream(pathImg) 
      }, threadID, () => fs.unlinkSync(pathImg), messageID);
      
    } catch (error) {
      console.error("Error:", error);
      api.sendMessage("❌ An error occurred while creating the image!", event.threadID, event.messageID);
    }
  }
};

// Helper function to get user name
async function getUserName(api, userID) {
  try {
    const userInfo = await api.getUserInfo(userID);
    return userInfo[userID].name || "friend";
  } catch {
    return "friend";
  }
}

// Function to create the batgiam image
async function makeImage({ one, two, __root, templatePath }) {
  const fs = global.nodemodule["fs-extra"];
  const axios = global.nodemodule["axios"]; 
  const jimp = global.nodemodule["jimp"];
  
  const pathImg = __root + `/batgiam_${one}_${two}.png`;
  const avatarOne = __root + `/avt_${one}.png`;
  const avatarTwo = __root + `/avt_${two}.png`;
  
  // Download and save avatars
  let getAvatarOne = (await axios.get(`https://4boxvn.com/api/avt?s=${one}`, { responseType: 'arraybuffer' })).data;
  fs.writeFileSync(avatarOne, Buffer.from(getAvatarOne, 'utf-8'));
  
  let getAvatarTwo = (await axios.get(`https://4boxvn.com/api/avt?s=${two}`, { responseType: 'arraybuffer' })).data;
  fs.writeFileSync(avatarTwo, Buffer.from(getAvatarTwo, 'utf-8'));
  
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
}

// Function to create circular avatars
async function circle(imagePath) {
  const jimp = global.nodemodule["jimp"];
  const image = await jimp.read(imagePath);
  image.circle();
  return await image.getBufferAsync("image/png");
}
