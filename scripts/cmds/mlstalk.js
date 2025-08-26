module.exports.config = {
	name: "mlstalk",
	version: "1.0.0",
	hasPermssion: 0,
	credits: "𝑨𝒔𝒊𝒇 𝑴𝒂𝒉𝒎𝒖𝒅",
	description: "𝑴𝒐𝒃𝒂𝒊𝒍𝒆 𝑳𝒆𝒈𝒆𝒏𝒅𝒔 𝒑𝒍𝒂𝒚𝒆𝒓 𝒅𝒆𝒓 𝒊𝒏𝒇𝒐𝒓𝒎𝒂𝒔𝒊𝒐𝒏 𝒅𝒆𝒌𝒉𝒂𝒏",
	usages: "[𝒊𝒅 | 𝒔𝒆𝒓𝒗𝒆𝒓]",
	category: "𝑮𝒂𝒎𝒆",
	cooldowns: 5,
  dependencies: {
    "canvas":"",
    "discord-image-generation":""
  }
};

module.exports.onStart = async ({ api, event, args }) => {
	const axios = global.nodemodule["axios"];
	const Canvas = global.nodemodule["canvas"];
	const DIG = global.nodemodule["discord-image-generation"];
	const fs = global.nodemodule["fs-extra"];

	let text = args.join(" ");
	
	if (!text) {
		return api.sendMessage("𝒂𝒑𝒏𝒂𝒓 𝒌𝒉𝒐𝒏𝒋𝒂 𝒊𝒅 𝒂𝒓 𝒔𝒆𝒓𝒗𝒆𝒓 𝒏𝒂𝒎 𝒅𝒆𝒘𝒂𝒓 𝒅𝒐𝒓𝒌𝒂𝒓 | 𝒖𝒔𝒂𝒈𝒆: 𝒎𝒍𝒔𝒕𝒂𝒍𝒌 12345 | 1234", event.threadID);
	}
	
	const text1 = text.substr(0, text.indexOf("|")).trim();
	const text2 = text.split("|").pop().trim();
	
	if (!text1 || !text2) {
		return api.sendMessage("𝒂𝒑𝒏𝒂𝒓 𝒌𝒉𝒐𝒏𝒋𝒂 𝒊𝒅 𝒂𝒓 𝒔𝒆𝒓𝒗𝒆𝒓 𝒏𝒂𝒎 𝒕𝒉𝒊𝒌 𝒗𝒂𝒃𝒉𝒆 𝒅𝒆𝒘𝒂 𝒉𝒐𝒚𝒏𝒊 | 𝒖𝒔𝒂𝒈𝒆: 𝒎𝒍𝒔𝒕𝒂𝒍𝒌 12345 | 1234", event.threadID);
	}
	
	const playerId = text1;
	const serverId = text2;
	const playerName = "Unknown Player"; // Default placeholder name

  try {
    // Create a blank canvas for the player info card
    const canvas = Canvas.createCanvas(700, 300);
    const ctx = canvas.getContext("2d");

    // Background
    ctx.fillStyle = "#23272A";
    ctx.fillRect(0, 0, canvas.width, canvas.height);

    // Title
    ctx.font = "bold 40px Arial";
    ctx.fillStyle = "#FFFFFF";
    ctx.textAlign = "center";
    ctx.fillText("🎮 Mobile Legends Player Info 🎮", canvas.width / 2, 60);

    // Player ID and Server ID
    ctx.font = "25px Arial";
    ctx.fillStyle = "#B0B0B0";
    ctx.textAlign = "left";
    ctx.fillText(`Player ID: ${playerId}`, 50, 130);
    ctx.fillText(`Server ID: ${serverId}`, 50, 170);

    // Player Name (Placeholder)
    ctx.font = "bold 30px Arial";
    ctx.fillStyle = "#00BFFF";
    ctx.fillText(`Player Name: ${playerName}`, 50, 230);

    // Warning message
    ctx.font = "20px Arial";
    ctx.fillStyle = "#FFD700";
    ctx.textAlign = "center";
    ctx.fillText("⚠️ Player data is currently unavailable due to API limitations.", canvas.width / 2, 270);

    const buffer = canvas.toBuffer();
    fs.writeFileSync(__dirname + "/cache/mlstalk_info.png", buffer);

    api.sendMessage({
      body: `✨ 𝑴𝒐𝒃𝒂𝒊𝒍𝒆 𝑳𝒆𝒈𝒆𝒏𝒅𝒔 𝒑𝒍𝒂𝒚𝒆𝒓 𝒊𝒏𝒇𝒐𝒓𝒎𝒂𝒕𝒊𝒐𝒏 𝒄𝒂𝒓𝒅 ✨\n\n🔥 𝑪𝒓𝒆𝒅𝒊𝒕𝒔: ${module.exports.config.credits} 🔥`,
      attachment: fs.createReadStream(__dirname + "/cache/mlstalk_info.png")
    }, event.threadID, () => fs.unlinkSync(__dirname + "/cache/mlstalk_info.png"));

  } catch (error) {
    console.error("Error generating player info card:", error);
    api.sendMessage("❌ 𝑺𝒐𝒓𝒓𝒚, 𝒂𝒏 𝒆𝒓𝒓𝒐𝒓 𝒐𝒄𝒄𝒖𝒓𝒓𝒆𝒅 𝒘𝒉𝒊𝒍𝒆 𝒈𝒆𝒏𝒆𝒓𝒂𝒕𝒊𝒏𝒈 𝒕𝒉𝒆 𝒑𝒍𝒂𝒚𝒆𝒓 𝒊𝒏𝒇𝒐 𝒄𝒂𝒓𝒅. 𝑷𝒍𝒆𝒂𝒔𝒆 𝒕𝒓𝒚 𝒂𝒈𝒂𝒊𝒏 𝒍𝒂𝒕𝒆𝒓.", event.threadID);
  }
};
