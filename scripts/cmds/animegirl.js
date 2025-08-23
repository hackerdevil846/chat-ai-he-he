module.exports.config = {
  name: "animegirl",
  version: "5.0.0",
  hasPermssion: 0,
  credits: "Asif",
  description: "Fetches a random anime picture from various categories with multiple fallbacks.",
  category: "media",
  usages: "animegirl [category]\n\nAvailable Categories:\n- waifu (default)\n- neko\n- shinobu\n- megumin",
  cooldowns: 3,
  dependencies: {
    "axios": "",
    "fs-extra": ""
  }
};

// --- Helper function to download and send an image ---
async function sendImage(api, event, imageUrl, caption) {
  const axios = global.nodemodule["axios"];
  const fs = global.nodemodule["fs-extra"];
  const path = __dirname + "/cache/anime.jpg";

  try {
    const imageResponse = await axios({
      url: imageUrl,
      method: 'GET',
      responseType: 'stream'
    });

    const writer = fs.createWriteStream(path);
    imageResponse.data.pipe(writer);

    return new Promise((resolve, reject) => {
      writer.on('finish', () => {
        api.sendMessage({
          body: caption,
          attachment: fs.createReadStream(path)
        }, event.threadID, () => {
          fs.unlinkSync(path);
          resolve();
        }, event.messageID);
      });
      writer.on('error', reject);
    });
  } catch (error) {
    console.error("Failed to download or send image:", error);
    throw error; // Propagate error to the main handler
  }
}

// --- Main command logic ---
module.exports.run = async ({ api, event, args }) => {
  // --- API and Backup Configuration ---
  const primaryApi = "https://nekos.best/api/v2/";
  const secondaryApi = "https://api.waifu.pics/sfw/";
  const staticBackupLinks = [
    "https://i.imgur.com/2iXk7mU.jpg", "https://i.imgur.com/OQQeOP3.jpg", "https://i.imgur.com/bMM8iJZ.jpg",
    "https://i.imgur.com/vJBXAhy.jpg", "https://i.imgur.com/C3b91UO.jpg", "https://i.imgur.com/iQbs8eX.jpg",
    "https://i.imgur.com/ZkpN7kz.jpg", "https://i.imgur.com/rfzt2WQ.jpg", "https://i.imgur.com/KSJQf1f.jpg",
    "https://i.imgur.com/BJ6yXNe.jpg", "https://i.imgur.com/IMubWyZ.jpg", "https://i.imgur.com/bXHiz1E.jpg",
    "https://i.imgur.com/6TF2Xft.jpg", "https://i.imgur.com/ZLCFLkt.jpg", "https://i.imgur.com/dfBFRCY.jpg",
    "https://i.imgur.com/8hEm7Ib.jpg", "https://i.imgur.com/VjrmG8l.jpg", "https://i.imgur.com/g0rKS8v.jpg",
    "https://i.imgur.com/pwIiuie.jpg", "https://i.imgur.com/3JSCTMb.jpg", "https://i.imgur.com/cwaipdJ.jpg",
    "https://i.imgur.com/6YrFPL6.jpg", "https://i.imgur.com/hefR6oA.jpg", "https://i.imgur.com/IEellAV.jpg",
    "https://i.imgur.com/sIIKN0X.jpg", "https://i.imgur.com/U1dHNbT.jpg", "https://i.imgur.com/fWsdzoT.jpg",
    "https://i.imgur.com/9rwW06s.jpg", "https://i.imgur.com/kCtN9ET.jpg", "https://i.imgur.com/IfdtKRK.jpg",
    "https://i.imgur.com/YQQ4OSq.jpg", "https://i.imgur.com/byXallB.jpg", "https://i.imgur.com/COb8HI9.jpg",
    "https://i.imgur.com/xFIa63u.jpg", "https://i.imgur.com/7JKSRQi.jpg", "https://i.imgur.com/EADdeTw.jpg",
    "https://i.imgur.com/zW5Yjr6.jpg", "https://i.imgur.com/i0lZw0Z.jpg", "https://i.imgur.com/COu7WrN.jpg",
    "https://i.imgur.com/z7RmDnI.jpg", "https://i.imgur.com/owd3yEE.jpg", "https://i.imgur.com/g5zU3Mg.jpg",
    "https://i.imgur.com/1M8Qo3e.jpg", "https://i.imgur.com/vVynRQK.jpg", "https://i.imgur.com/RHoJdo4.jpg",
    "https://i.imgur.com/NhnPV3T.jpg", "https://i.imgur.com/i9C8TaY.jpg", "https://i.imgur.com/JL99iUN.jpg",
    "https://i.imgur.com/4sZxV7H.jpg", "https://i.imgur.com/9ij2ZBZ.jpg", "https://i.imgur.com/qEJ1Bac.jpg",
    "https://i.imgur.com/TaxJ5C0.jpg", "https://i.imgur.com/yAr7DHH.jpg", "https://i.imgur.com/dYZ3Fvm.jpg",
    "https://i.imgur.com/EteGnuY.jpg", "https://i.imgur.com/E5axqu9.jpg", "https://i.imgur.com/hZxona6.jpg",
    "https://i.imgur.com/5HsEx6v.jpg", "https://i.imgur.com/r4G6tQi.jpg", "https://i.imgur.com/3eMPpUl.jpg",
    "https://i.imgur.com/tasryGt.jpg", "https://i.imgur.com/rzlJZst.jpg", "https://i.imgur.com/4gx3rnh.jpg",
    "https://i.imgur.com/j4WDARE.jpg", "https://i.imgur.com/J9rhsQn.jpg", "https://i.imgur.com/tMwtFht.jpg",
    "https://i.imgur.com/AXmBgGk.jpg"
  ];
  const availableCategories = ["waifu", "neko", "shinobu", "megumin"];
  const axios = global.nodemodule["axios"];

  // --- User Input Processing ---
  let category = args[0] ? args[0].toLowerCase( ) : 'waifu';
  if (!availableCategories.includes(category)) {
    api.sendMessage(`❌ Invalid Category!\n\nAvailable: ${availableCategories.join(', ')}`, event.threadID, event.messageID);
    return;
  }

  // --- Attempt to Fetch from APIs ---
  try {
    // 1. Try Primary API (nekos.best)
    console.log(`Attempting to fetch from primary API for category: ${category}`);
    const response = await axios.get(`${primaryApi}${category}`);
    const result = response.data.results[0];
    const caption = `🎀 Random ${result.anime_name || capitalize(category)} Picture 🎀\n\nArtist: ${result.artist_name}\n🔗 Source: ${result.source_url}`;
    await sendImage(api, event, result.url, caption);
    return; // Success
  } catch (error) {
    console.error(`Primary API failed for ${category}:`, error.message);
    
    try {
      // 2. Try Secondary API (waifu.pics) - Note: only supports 'waifu' and 'neko'
      if (category === 'waifu' || category === 'neko') {
        console.log(`Attempting to fetch from secondary API for category: ${category}`);
        const response = await axios.get(`${secondaryApi}${category}`);
        const caption = `🎀 Random ${capitalize(category)} Picture 🎀\n\n(Backup API)`;
        await sendImage(api, event, response.data.url, caption);
        return; // Success
      }
    } catch (error2) {
      console.error(`Secondary API failed for ${category}:`, error2.message);
      // Fall through to static backup
    }
  }

  // --- 3. Use Static Backup Links as Last Resort ---
  try {
    console.log("All APIs failed. Using static backup links.");
    const randomLink = staticBackupLinks[Math.floor(Math.random() * staticBackupLinks.length)];
    const caption = `🎀 Random Anime Picture 🎀\n\n(APIs are down, using a backup image)`;
    await sendImage(api, event, randomLink, caption);
  } catch (finalError) {
    console.error("Fatal: All backup systems failed.", finalError);
    api.sendMessage("I'm sorry, but all image sources, including the static backups, are currently unavailable. Please try again later.", event.threadID, event.messageID);
  }
};

// Helper function to capitalize the first letter
function capitalize(str) {
  if (!str) return '';
  return str.charAt(0).toUpperCase() + str.slice(1);
}
