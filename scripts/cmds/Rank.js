const fs = require("fs-extra");
const path = require("path");
const Canvas = require("canvas");
const request = require("node-superfetch");

// Helper function to make an image circular (assuming jimp is available globally or within the environment)
async function circle(image) {
    const jimp = global.nodemodule["jimp"];
    image = await jimp.read(image);
    image.circle();
    return await image.getBufferAsync("image/png");
}

// Helper function to convert experience points to level
function expToLevel(point) {
    if (point < 0) return 0;
    return Math.floor((Math.sqrt(1 + (4 * point) / 3) + 1) / 2);
}

// Helper function to convert level to experience points
function levelToExp(level) {
    if (level <= 0) return 0;
    return 3 * level * (level - 1);
}

// Helper function to get user's rank information
async function getInfo(uid, Currencies) {
    let point = (await Currencies.getData(uid)).exp;
    const level = expToLevel(point);
    const expCurrent = point - levelToExp(level);
    const expNextLevel = levelToExp(level + 1) - levelToExp(level);
    return { level, expCurrent, expNextLevel };
}

// Helper function to create the rank card image
async function makeRankCard(data) {
    const { id, name, rank, level, expCurrent, expNextLevel } = data;
    const __root = path.resolve(__dirname, "cache");
    
    // Register custom fonts (assuming they are downloaded during onLoad)
    Canvas.registerFont(__root + "/regular-font.ttf", { family: "Manrope", weight: "regular", style: "normal" });
    Canvas.registerFont(__root + "/bold-font.ttf", { family: "Manrope", weight: "bold", style: "normal" });
    // You can add more font registrations here if 'Metalix Italic Bold' is a separate file
    // For now, using 'Manrope Bold' as a stand-in, as 'Metalix Italic Bold' usually refers to a style, not a separate font file.
    // If you have a specific font file for Metalix Italic Bold, replace the path below.
    // Example: Canvas.registerFont(__root + "/metalix-italic-bold.ttf", { family: "Metalix", weight: "bold", style: "italic" });

    const pathCustom = path.resolve(__dirname, "cache", "customrank");
    let dirImage = __root + "/rankcard.png";
    if (fs.existsSync(pathCustom)) {
        const customDir = fs.readdirSync(pathCustom).map(item => item.replace(/\.png/g, ""));
        for (const singleLimit of customDir) {
            let limitRate = false;
            const split = singleLimit.split(/-/g);
            let min = parseInt(split[0]), max = parseInt((split[1]) ? split[1] : min);
            for (; min <= max; min++) if (level == min) { limitRate = true; break; }
            if (limitRate) { dirImage = pathCustom + `/${singleLimit}.png`; break; }
        }
    }

    let rankCard = await Canvas.loadImage(dirImage);
    const pathImg = __root + `/rank_${id}.png`;
    let expWidth = (expCurrent * 610) / expNextLevel;
    if (expWidth > 610 - 19.5) expWidth = 610 - 19.5;

    let avatar = await request.get(`https://graph.facebook.com/${id}/picture?width=512&height=512&access_token=6628568379%7Cc1e620fa708a1d5696fb991c1bde5662`);
    avatar = await circle(avatar.body);

    const canvas = Canvas.createCanvas(1000, 282);
    const ctx = canvas.getContext("2d");
    ctx.drawImage(rankCard, 0, 0, canvas.width, canvas.height);
    ctx.drawImage(await Canvas.loadImage(avatar), 70, 75, 150, 150);

    // Apply "Metalix Italic Bold" style for the text
    // Assuming 'Manrope Bold' is a close alternative or your custom font file is named appropriately
    ctx.font = `italic bold 36px Manrope`; // Changed to italic bold
    ctx.fillStyle = "#FFFFFF";
    ctx.textAlign = "start";
    ctx.fillText(name, 270, 164);

    ctx.font = `italic bold 38px Manrope`; // Changed to italic bold
    ctx.fillStyle = "#FF0000";
    ctx.textAlign = "end";
    ctx.fillText(level, 866, 82);
    ctx.fillText("Lv.", 793, 82);
    ctx.fillText(`#${rank}`, 700, 82);

    ctx.font = `italic bold 40px Manrope`; // Changed to italic bold
    ctx.fillStyle = "#00BFFF";
    ctx.fillText(expCurrent, 710, 164);
    ctx.fillStyle = "#1874CD";
    ctx.fillText(`/ ${expNextLevel}`, 710 + ctx.measureText(expCurrent).width + 10, 164);

    ctx.beginPath();
    ctx.fillStyle = "#FFB90F";
    ctx.arc(257 + 18.5, 147.5 + 18.5 + 36.25, 18.5, 1.5 * Math.PI, 0.5 * Math.PI, true);
    ctx.fill();
    ctx.fillRect(257 + 18.5, 147.5 + 36.25, expWidth, 37.5);
    ctx.arc(257 + 18.5 + expWidth, 147.5 + 18.5 + 36.25, 18.75, 1.5 * Math.PI, 0.5 * Math.PI, false);
    ctx.fill();

    const imageBuffer = canvas.toBuffer();
    fs.writeFileSync(pathImg, imageBuffer);
    return pathImg;
}

module.exports = {
  config: {
    name: "rank",
    version: "2.0.1",
    author: "𝑨𝒔𝒊𝒇 𝑴𝒂𝒉𝒎𝒖𝒅", // Used the requested font style
    role: 0,
    category: "group",
    shortDescription: {
      en: "𝑴𝒆𝒎𝒃𝒆𝒓 𝑹𝒂𝒏𝒌𝒊𝒏𝒈𝒔 𝒅𝒆𝒌𝒉𝒂𝒏 💫"
    },
    longDescription: {
      en: "Displays the rank card for a user, showing their level, experience, and global ranking."
    },
    guide: {
      en: "{p}rank or {p}rank @user"
    },
    cooldowns: 5,
    dependencies: {
        "fs-extra": "",
        "path": "",
        "jimp": "", // Added jimp as a dependency, assuming it's used for circle function
        "node-superfetch": "",
        "canvas": ""
    }
  },

  onLoad: async function () {
      const { resolve } = path;
      const { existsSync, mkdirSync } = fs;
      const { downloadFile } = global.utils; // Assuming global.utils exists for downloadFile
      const cachePath = resolve(__dirname, "cache");
      const customPath = resolve(cachePath, "customrank");

      if (!existsSync(customPath)) mkdirSync(customPath, { recursive: true });
      if (!existsSync(resolve(cachePath, 'regular-font.ttf'))) await downloadFile("https://raw.githubusercontent.com/catalizcs/storage-data/master/rank/fonts/regular-font.ttf", resolve(cachePath, 'regular-font.ttf'));
      if (!existsSync(resolve(cachePath, 'bold-font.ttf'))) await downloadFile("https://raw.githubusercontent.com/catalizcs/storage-data/master/rank/fonts/bold-font.ttf", resolve(cachePath, 'bold-font.ttf'));
      // If you have a specific font file for "Metalix Italic Bold", download it here:
      // if (!existsSync(resolve(cachePath, 'metalix-italic-bold.ttf'))) await downloadFile("YOUR_METALIX_FONT_URL.ttf", resolve(cachePath, 'metalix-italic-bold.ttf'));
      if (!existsSync(resolve(cachePath, 'rankcard.png'))) await downloadFile("https://raw.githubusercontent.com/catalizcs/storage-data/master/rank/rank_card/rankcard.png", resolve(cachePath, 'rankcard.png'));
  },

  onStart: async function({ message, args, event, api, Currencies, Users }) {
    try {
      // Ensure global.nodemodule.jimp is initialized if not already
      if (!global.nodemodule.jimp) {
        global.nodemodule.jimp = require("jimp");
      }

      const mention = Object.keys(event.mentions);
      let dataAll = (await Currencies.getAll(["userID", "exp"]));
      dataAll.sort((a, b) => b.exp - a.exp);

      const sendRank = async (userID) => {
          const rank = dataAll.findIndex(item => parseInt(item.userID) == parseInt(userID)) + 1;
          const name = global.data.userName.get(userID) || (await Users.getData(userID)).name; // Corrected to use Users.getData for name
          if (rank == 0) return message.reply("❌ Error, please try again after 5 seconds!");
          const point = await getInfo(userID, Currencies);
          const startTime = Date.now();
          const pathRankCard = await makeRankCard({ id: userID, name, rank, ...point });
          
          await message.reply({ 
            body: `⏱ Time taken: ${Date.now() - startTime}ms`, 
            attachment: fs.createReadStream(pathRankCard) 
          });
          fs.unlinkSync(pathRankCard); // Clean up the generated image file
      };

      if (args.length === 0) return sendRank(event.senderID);
      if (mention.length >= 1) return sendRank(mention[0]);
      
    } catch (error) {
      console.error("Rank Command Error:", error);
      await message.reply("❌ An error occurred while generating the rank card. Please try again later.");
    }
  }
};
