module.exports.config = {
	name: "infoip",
	version: "1.0.0",
	hasPermssion: 0,
	credits: "𝑨𝒔𝒊𝒇 𝑴𝒂𝒉𝒎𝒖𝒅",
	description: "𝑰𝑷 𝒂𝒅𝒅𝒓𝒆𝒔𝒔 𝒆𝒓 𝒊𝒏𝒇𝒐𝒓𝒎𝒂𝒕𝒊𝒐𝒏 𝒋𝒂𝒏𝒖𝒏",
  usages: "[𝒊𝒑 𝒂𝒅𝒅𝒓𝒆𝒔𝒔]",
	commandCategory: "𝒕𝒐𝒐𝒍𝒔",
	cooldowns: 5
};

module.exports.run = async ({ api, event, args }) => {
  if (!args[0]) return api.sendMessage("❗ 𝑫𝒂𝒚𝒂 𝒌𝒐𝒓𝒆 𝒆𝒌𝒕𝒊 𝑰𝑷 𝒂𝒅𝒅𝒓𝒆𝒔𝒔 𝒆𝒏𝒕𝒆𝒓 𝒌𝒐𝒓𝒖𝒏", event.threadID, event.messageID);
  
  const axios = global.nodemodule["axios"];
  const juswa = args.join(" ");
  
  try {
    const res = await axios.get(`https://ostch.herokuapp.com/api/v1/iplookup?q=${juswa}`);
    const data = res.data;
    
    const message = `🌐 𝑰𝑷 𝑰𝒏𝒇𝒐𝒓𝒎𝒂𝒕𝒊𝒐𝒏\n━━━━━━━━━━━━━━\n🔹 𝑰𝑷: ${data.ip}\n🌍 𝑪𝒐𝒖𝒏𝒕𝒓𝒚: ${data.country}\n🏙️ 𝑪𝒊𝒕𝒚: ${data.city}\n📍 𝑹𝒆𝒈𝒊𝒐𝒏: ${data.region}\n📡 𝑳𝒂𝒕𝒊𝒕𝒖𝒅𝒆: ${data.latitude}\n📡 𝑳𝒐𝒏𝒈𝒊𝒕𝒖𝒅𝒆: ${data.longtitude}\n🗺️ 𝑮𝒐𝒐𝒈𝒍𝒆 𝑴𝒂𝒑: ${data.maps}`;
    
    return api.sendMessage(message, event.threadID, event.messageID);
  } catch (error) {
    console.error(error);
    return api.sendMessage("⚠️ 𝑰𝑷 𝒊𝒏𝒇𝒐𝒓𝒎𝒂𝒕𝒊𝒐𝒏 𝒑𝒂𝒘𝒂𝒓 𝒎𝒂𝒏𝒂 𝒋𝒂𝒄𝒄𝒉𝒆 𝒏𝒂, 𝒑𝒖𝒏𝒂𝒓 𝒄𝒉𝒆𝒔𝒕𝒂 𝒌𝒐𝒓𝒖𝒏", event.threadID, event.messageID);
  }
}
