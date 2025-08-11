module.exports.config = {
  name: "info",
  version: "1.2.0",
  permission: 0,
  credits: "Asif",
  description: "Shows bot information in beautiful style",
  category: "information",
  usages: "",
  cooldowns: 5,
  dependencies: {
    "request": "",
    "fs-extra": "",
    "moment-timezone": ""
  }
};

module.exports.onLoad = () => {
  const fs = global.nodemodule["fs-extra"];
  const path = require("path");
  const cacheDir = path.join(__dirname, "cache");
  if (!fs.existsSync(cacheDir)) fs.mkdirSync(cacheDir, { recursive: true });
};

module.exports.run = async function({ api, event }) {
  try {
    const request = global.nodemodule["request"];
    const fs = global.nodemodule["fs-extra"];
    const moment = global.nodemodule["moment-timezone"];
    const path = require("path");

    // Calculate uptime
    const time = process.uptime();
    const hours = Math.floor(time / 3600);
    const minutes = Math.floor((time % 3600) / 60);
    const seconds = Math.floor(time % 60);
    const uptime = `${hours}h ${minutes}m ${seconds}s`;

    // Get current date/time in Dhaka timezone
    const date = moment.tz("Asia/Dhaka").format("D/MM/YYYY [at] hh:mm:ss A");

    // Prepare cache folder & image path
    const cacheDir = path.join(__dirname, "cache");
    if (!fs.existsSync(cacheDir)) fs.mkdirSync(cacheDir, { recursive: true });
    const imagePath = path.join(cacheDir, "elegant_info.png");

    // Download bot avatar
    await new Promise((resolve, reject) => {
      request({
        method: "GET",
        url: "https://graph.facebook.com/61571630409265/picture?height=720&width=720",
        encoding: null
      })
      .pipe(fs.createWriteStream(imagePath))
      .on("error", reject)
      .on("finish", resolve);
    });

    // Message body with beautiful style and dynamic data
    const infoBody = 
`╭───────『 ✧  𝑰-𝑨𝑴-𝑨𝑻𝑶𝑴𝑰𝑪  ✧ 』───────╮
┃
┃   ❄️ 𝗕𝗢𝗧 𝗜𝗡𝗙𝗢𝗥𝗠𝗔𝗧𝗜𝗢𝗡
┠────────────────────────────────────
┃   ✦ 𝗡𝗮𝗺𝗲: 𝑨𝒔𝒊𝒇 𝑴𝒂𝒉𝒎𝒖𝒅
┃   ✦ 𝗚𝗲𝗻𝗱𝗲𝗿: 𝑴𝒂𝒍𝒆
┃   ✦ 𝗔𝗴𝗲: 18+
┠────────────────────────────────────
┃   ✦ 𝗥𝗲𝗹𝗶𝗴𝗶𝗼𝗻: 𝑰𝒔𝒍𝒂𝒎
┃   ✦ 𝗥𝗲𝗹𝗮𝘁𝗶𝗼𝗻𝘀𝗵𝗶𝗽: 𝑺𝒊𝒏𝒈𝒍𝒆
┠────────────────────────────────────
┃   ✦ 𝗣𝗲𝗿𝗺𝗮𝗻𝗲𝗻𝘁 𝗔𝗱𝗱𝗿𝗲𝘀𝘀: 𝑪𝒉𝒂𝒏𝒅𝒑𝒖𝒓
┃   ✦ 𝗖𝘂𝗿𝗿𝗲𝗻𝘁 𝗔𝗱𝗱𝗿𝗲𝘀𝘀: 𝑫𝒉𝒂𝒌𝒂-1236
┠────────────────────────────────────
┃   ✦ 𝗪𝗼𝗿𝗸: 𝑺𝒕𝒖𝒅𝒆𝒏𝒕
┃   ✦ 𝗚𝗺𝗮𝗶𝗹: 𝒎𝒓𝒔𝒎𝒐𝒌𝒆𝒚232@gmail.com
┠────────────────────────────────────
┃   ✦ 𝗪𝗵𝗮𝘁𝘀𝗔𝗽𝗽: 𝒘𝒂.𝒎𝒆/+8801586400590
┃   ✦ 𝗙𝗮𝗰𝗲𝗯𝗼𝗼𝗸: 𝒇𝒃.𝒄𝒐𝒎/𝑨𝒔𝒊𝒇𝑴𝒂𝒉𝒎𝒖𝒅
┠────────────────────────────────────
┃   ✦ 𝗨𝗽𝘁𝗶𝗺𝗲: ${uptime}
┃   ✦ 𝗗𝗮𝘁𝗲: ${date}
╰────────────────────────────────────╯`;

    // Send message with avatar attachment
    api.sendMessage({
      body: infoBody,
      attachment: fs.createReadStream(imagePath)
    }, event.threadID, (err) => {
      if (err) console.error(err);
      // Delete cached image after sending
      fs.unlink(imagePath).catch(console.error);
    }, event.messageID);

  } catch (error) {
    console.error("Info Command Error:", error);
    api.sendMessage(`❌ Failed to load information: ${error.message}`, event.threadID, event.messageID);
  }
};
