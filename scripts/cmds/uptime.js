const fs = require("fs-extra");
const axios = require("axios");
const { createCanvas, loadImage, registerFont } = require("canvas");

module.exports = {
  config: {
    name: "uptime",
    aliases: ["upt", "botinfo"],
    version: "1.0.0",
    author: "𝐴𝑠𝑖𝑓 𝑀𝑎ℎ𝑚𝑢𝑑",
    role: 0,
    category: "system",
    shortDescription: {
      en: "📊 𝑆ℎ𝑜𝑤 𝑏𝑜𝑡 𝑢𝑝𝑡𝑖𝑚𝑒 𝑎𝑛𝑑 𝑠𝑦𝑠𝑡𝑒𝑚 𝑖𝑛𝑓𝑜𝑟𝑚𝑎𝑡𝑖𝑜𝑛"
    },
    longDescription: {
      en: "𝐷𝑖𝑠𝑝𝑙𝑎𝑦𝑠 𝑏𝑜𝑡 𝑢𝑝𝑡𝑖𝑚𝑒, 𝑠𝑦𝑠𝑡𝑒𝑚 𝑠𝑡𝑎𝑡𝑢𝑠, 𝑎𝑛𝑑 𝑎𝑛𝑖𝑚𝑒-𝑡ℎ𝑒𝑚𝑒𝑑 𝑖𝑛𝑓𝑜𝑔𝑟𝑎𝑝ℎ𝑖𝑐"
    },
    guide: {
      en: "{p}uptime [𝑎𝑛𝑖𝑚𝑒_𝑖𝑑] 𝑜𝑟 {p}uptime list [𝑝𝑎𝑔𝑒]"
    },
    countDown: 3,
    dependencies: {
      "axios": "",
      "fs-extra": "",
      "canvas": "",
      "moment-timezone": "",
      "pidusage": ""
    }
  },

  onStart: async function ({ api, event, args, message }) {
    try {
      const time = process.uptime();
      const hours = Math.floor(time / 3600);
      const minutes = Math.floor((time % 3600) / 60);
      const seconds = Math.floor(time % 60);

      const { commands } = global.client || { commands: new Map() };
      const moment = require("moment-timezone");
      const timeNow = moment.tz("Asia/Dhaka").format("DD/MM/YYYY || HH:mm:ss");
      const pidusage = require("pidusage");
      const timeStart = Date.now();

      // LIST handler
      if (args[0] === "list") {
        try {
          const alime = (await axios.get('https://raw.githubusercontent.com/mraikero-01/saikidesu_data/main/anilist2.json')).data;
          const count = alime.listAnime.length;
          const page = parseInt(args[1]) || 1;
          const limit = 20;
          const numPage = Math.ceil(count / limit);

          let msg = "╔═════════════════╗\n";
          msg +=     "║  𝐴𝑁𝐼𝑀𝐸 𝐿𝐼𝑆𝑇  ║\n";
          msg +=     "╚═════════════════╝\n\n";

          const start = limit * (page - 1);
          const end = start + limit;

          for (let i = start; i < Math.min(end, count); i++) {
            msg += `[${i + 1}] ${alime.listAnime[i].ID} | ${alime.listAnime[i].name}\n`;
          }

          msg += `\n╔═════════════════════════╗\n`;
          msg += `║ 𝑃𝑎𝑔𝑒: ${page}/${numPage}          ║\n`;
          msg += `║ 𝑈𝑠𝑒: ${global.config.PREFIX}uptime list <page> ║\n`;
          msg += `╚═════════════════════════╝`;

          return message.reply(msg);
        } catch (errList) {
          console.error("Error fetching anime list:", errList);
          return message.reply("Failed to fetch anime list.");
        }
      }

      // ensure tad directory exists
      const tadDir = __dirname + "/tad";
      fs.ensureDirSync(tadDir);

      // Font setup
      const fontPaths = {
        avo: __dirname + '/tad/UTM-Avo.ttf',
        phenomicon: __dirname + '/tad/phenomicon.ttf',
        caviar: __dirname + '/tad/CaviarDreams.ttf'
      };

      // Download fonts if missing
      for (const [name, path] of Object.entries(fontPaths)) {
        if (!fs.existsSync(path)) {
          const fontUrl = `https://github.com/hanakuUwU/font/raw/main/${
            name === 'avo' ? 'UTM%20Avo.ttf' :
            name === 'phenomicon' ? 'phenomicon.ttf' : 'CaviarDreams.ttf'
          }`;
          try {
            const resp = await axios.get(fontUrl, { responseType: "arraybuffer" });
            fs.writeFileSync(path, Buffer.from(resp.data));
          } catch (err) {
            console.error(`Failed to download font ${name}:`, err.message);
          }
        }
      }

      // Random background images
      const backgrounds = [
        "https://i.imgur.com/9jbBPIM.jpg",
        "https://i.imgur.com/cPvDTd9.jpg",
        "https://i.imgur.com/ZT8CgR1.jpg",
        "https://i.imgur.com/WhOaTx7.jpg",
        "https://i.imgur.com/BIcgJOA.jpg",
        "https://i.imgur.com/EcJt1yq.jpg",
        "https://i.imgur.com/0dtnQ2m.jpg"
      ];

      // Choose id
      const requestedId = args[0] ? parseInt(args[0]) : NaN;
      const id = !isNaN(requestedId) && requestedId > 0 ? requestedId : Math.floor(Math.random() * 883) + 1;

      // fetch character data
      let charData = [];
      try {
        charData = (await axios.get('https://raw.githubusercontent.com/mraikero-01/saikidesu_data/main/imgs_data2.json')).data;
      } catch (errChar) {
        console.error("Failed to fetch charData:", errChar);
      }
      const char = (charData && charData[id - 1]) ? charData[id - 1] : {
        imgAnime: backgrounds[0],
        colorBg: "#2c3e50"
      };

      // Path setup
      const pathImg = __dirname + `/tad/background_${id}.png`;
      const pathAva = __dirname + `/tad/avatar_${id}.png`;

      // Download images
      try {
        const bgUrl = encodeURI(backgrounds[Math.floor(Math.random() * backgrounds.length)]);
        const avaUrl = encodeURI(char.imgAnime || backgrounds[0]);
        const [bgResp, avaResp] = await Promise.all([
          axios.get(bgUrl, { responseType: "arraybuffer" }),
          axios.get(avaUrl, { responseType: "arraybuffer" })
        ]);
        fs.writeFileSync(pathImg, Buffer.from(bgResp.data));
        fs.writeFileSync(pathAva, Buffer.from(avaResp.data));
      } catch (errImg) {
        console.error("Failed to download images:", errImg);
        return message.reply("Failed to download background/avatar images.");
      }

      // Load images & create canvas
      const [bg, avatar] = await Promise.all([loadImage(pathImg), loadImage(pathAva)]);
      const canvas = createCanvas(bg.width, bg.height);
      const ctx = canvas.getContext("2d");

      // Register fonts
      try { registerFont(fontPaths.phenomicon, { family: "Phenomicon" }); } catch (e) {}
      try { registerFont(fontPaths.avo, { family: "UTM Avo" }); } catch (e) {}
      try { registerFont(fontPaths.caviar, { family: "Caviar Dreams" }); } catch (e) {}

      // Draw background
      ctx.fillStyle = char.colorBg || "#2c3e50";
      ctx.fillRect(0, 0, canvas.width, canvas.height);
      ctx.drawImage(bg, 0, 0, canvas.width, canvas.height);

      // Draw avatar
      try {
        ctx.drawImage(avatar, 800, -160, 1100, 1100);
      } catch (e) {
        const avaW = Math.min(400, canvas.width / 3);
        ctx.drawImage(avatar, canvas.width - avaW - 50, 50, avaW, avaW);
      }

      // Add text elements
      ctx.textAlign = "left";
      ctx.fillStyle = "#ffffff";

      // Uptime Bot title
      ctx.font = "130px Phenomicon";
      try { ctx.fillText("𝑈𝑃𝑇𝐼𝑀𝐸 𝐵𝑂𝑇", 95, 340); } catch (e) {
        ctx.font = "80px UTM Avo";
        ctx.fillText("𝑈𝑃𝑇𝐼𝑀𝐸 𝐵𝑂𝑇", 95, 260);
      }

      // Time display
      ctx.font = "70px 'UTM Avo'";
      ctx.fillText(`${hours} : ${minutes} : ${seconds}`, 180, 440);

      // Credit information
      ctx.font = "45px 'Caviar Dreams'";
      ctx.fillText("@asif.mahmud.official", 250, 515);
      ctx.fillText("@asif_mahmud", 250, 575);

      // Save final image
      const imageBuffer = canvas.toBuffer();
      fs.writeFileSync(pathImg, imageBuffer);

      // Get system info
      const usage = await pidusage(process.pid);

      // Create information table
      let infoTable = "╔═════════════════════════════╗\n";
      infoTable +=    "║  🕒 𝑈𝑃𝑇𝐼𝑀𝐸 𝐼𝑁𝐹𝑂𝑅𝑀𝐴𝑇𝐼𝑂𝑁  ║\n";
      infoTable +=    "╚═════════════════════════════╝\n\n";

      infoTable += `🕒 𝐵𝑜𝑡 𝑟𝑢𝑛𝑛𝑖𝑛𝑔: ${hours}ℎ ${minutes}𝑚 ${seconds}𝑠\n\n`;
      infoTable += `🤖 𝐵𝑜𝑡 𝑁𝑎𝑚𝑒: ${global.config.BOTNAME || "Bot"}\n`;
      infoTable += `⌨️ 𝑃𝑟𝑒𝑓𝑖𝑥: ${global.config.PREFIX || "."}\n`;
      infoTable += `📚 𝐶𝑜𝑚𝑚𝑎𝑛𝑑𝑠: ${commands.size || 0}\n`;
      infoTable += `👥 𝑈𝑠𝑒𝑟𝑠: ${global.data?.allUserID?.length || 0}\n`;
      infoTable += `💬 𝐺𝑟𝑜𝑢𝑝𝑠: ${global.data?.allThreadID?.length || 0}\n`;
      infoTable += `⚙️ 𝐶𝑃𝑈: ${usage?.cpu?.toFixed(1) || "N/A"}%\n`;
      infoTable += `💾 𝑅𝐴𝑀: ${this.byte2mb(usage?.memory) || "N/A"}\n`;
      infoTable += `📡 𝑃𝑖𝑛𝑔: ${Date.now() - timeStart}ms\n`;
      infoTable += `🆔 𝐴𝑛𝑖𝑚𝑒 𝐼𝐷: ${id}\n\n`;
      infoTable += `📆 𝐷𝑎𝑡𝑒: ${timeNow}\n`;
      infoTable += `⭐ 𝐶𝑟𝑒𝑎𝑡𝑜𝑟: 𝐴𝑠𝑖𝑓 𝑀𝑎ℎ𝑚𝑢𝑑`;

      // Send final message with image
      await message.reply({
        body: infoTable,
        attachment: fs.createReadStream(pathImg)
      });

      // Cleanup files
      try { fs.unlinkSync(pathImg); } catch (e) {}
      try { fs.unlinkSync(pathAva); } catch (e) {}

    } catch (error) {
      console.error("Uptime command error:", error);
      return message.reply("An error occurred while running the uptime command.");
    }
  },

  byte2mb: function(bytes) {
    if (!bytes && bytes !== 0) return '0 MB';
    const units = ['𝐵𝑦𝑡𝑒𝑠', '𝐾𝐵', '𝑀𝐵', '𝐺𝐵', '𝑇𝐵', '𝑃𝐵', '𝐸𝐵', '𝑍𝐵', '𝑌𝐵'];
    let l = 0;
    let n = Number(bytes) || 0;
    while (n >= 1024 && ++l) n = n / 1024;
    return `${n.toFixed(n < 10 && l > 0 ? 1 : 0)} ${units[l]}`;
  }
};
