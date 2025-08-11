module.exports.config = {
	name: "ip",	
	version: "1.0.0", 
	hasPermssion: 0,
	credits: "𝑨𝒔𝒊𝒇 𝑴𝒂𝒉𝒎𝒖𝒅",
	description: "𝑨𝒑𝒏𝒂𝒓 𝑰𝑷 𝒃𝒂 𝒂𝒏𝒏𝒐 𝑰𝑷 𝒆𝒓 𝒊𝒏𝒇𝒐𝒓𝒎𝒂𝒕𝒊𝒐𝒏 𝒅𝒆𝒌𝒉𝒖𝒏", 
	commandCategory: "𝒂𝒏𝒚𝒐",
	usages: "[𝑰𝑷 𝒂𝒅𝒅𝒓𝒆𝒔𝒔]",
	cooldowns: 5, 
	dependencies: "",
};

module.exports.run = async function({ api, args, event }) {
  const timeStart = Date.now();
  const axios = require("axios");
  
  if (!args[0]) {
    return api.sendMessage("𝑫𝒂𝒚𝒂 𝒌𝒐𝒓𝒆 𝒆𝒌𝒕𝒊 𝑰𝑷 𝒆𝒏𝒕𝒆𝒓 𝒌𝒐𝒓𝒖𝒏 𝒋𝒆 𝒕𝒂 𝒄𝒉𝒆𝒄𝒌 𝒌𝒐𝒓𝒕𝒆 𝒄𝒂𝒐 🌐", event.threadID, event.messageID);
  }

  try {
    const infoip = (await axios.get(`http://ip-api.com/json/${args.join(' ')}?fields=66846719`)).data;
    
    if (infoip.status == 'fail') {
      return api.sendMessage(`𝑬𝒓𝒓𝒐𝒓! 𝑬𝒌𝒕𝒂 𝒑𝒓𝒐𝒃𝒍𝒆𝒎 𝒉𝒐𝒍𝒐 😢\n${infoip.message}`, event.threadID, event.messageID);
    }

    const responseTime = Date.now() - timeStart;
    
    api.sendMessage({
      body: `📡 𝑰𝑷 𝑰𝒏𝒇𝒐𝒓𝒎𝒂𝒕𝒊𝒐𝒏 [${responseTime}ms]
━━━━━━━━━━━━━━━━
🗺️ 𝑪𝒐𝒏𝒕𝒊𝒏𝒆𝒏𝒕: ${infoip.continent}
🏳️ 𝑵𝒂𝒕𝒊𝒐𝒏: ${infoip.country}
🎊 𝑪𝒐𝒖𝒏𝒕𝒓𝒚 𝑪𝒐𝒅𝒆: ${infoip.countryCode}
🕋 𝑨𝒓𝒆𝒂: ${infoip.region}
⛱️ 𝑹𝒆𝒈𝒊𝒐𝒏/𝑺𝒕𝒂𝒕𝒆: ${infoip.regionName}
🏙️ 𝑪𝒊𝒕𝒚: ${infoip.city}
🛣️ 𝑫𝒊𝒔𝒕𝒓𝒊𝒄𝒕: ${infoip.district}
📮 𝒁𝑰𝑷 𝒄𝒐𝒅𝒆: ${infoip.zip}
🧭 𝑳𝒂𝒕𝒊𝒕𝒖𝒅𝒆: ${infoip.lat}
🧭 𝑳𝒐𝒏𝒈𝒊𝒕𝒖𝒅𝒆: ${infoip.lon}
⏱️ 𝑻𝒊𝒎𝒆𝒛𝒐𝒏𝒆: ${infoip.timezone}
👨‍✈️ 𝑶𝒓𝒈𝒂𝒏𝒊𝒛𝒂𝒕𝒊𝒐𝒏: ${infoip.org}
💵 𝑪𝒖𝒓𝒓𝒆𝒏𝒄𝒚: ${infoip.currency}
━━━━━━━━━━━━━━━━`,
      location: {
        latitude: infoip.lat,
        longitude: infoip.lon,
        current: true
      }
    }, event.threadID, event.messageID);
  } catch (error) {
    console.error(error);
    api.sendMessage("⚠️ 𝑰𝑷 𝒊𝒏𝒇𝒐 𝒑𝒂𝒘𝒂𝒓 𝒎𝒂𝒔𝒉𝒂𝒍𝒂 𝒉𝒐𝒍𝒐! 𝑷𝒖𝒏𝒂𝒓 𝒄𝒉𝒆𝒔𝒕𝒂 𝒌𝒐𝒓𝒖𝒏 😢", event.threadID, event.messageID);
  }
};
