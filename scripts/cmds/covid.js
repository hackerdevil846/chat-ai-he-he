module.exports.config = {
  name: "covid",
  version: "1.0.0",
  hasPermssion: 0,
  credits: "𝑨𝒔𝒊𝒇 𝑴𝒂𝒉𝒎𝒖𝒅",
  description: "𝑽𝒊𝒆𝒘 𝒄𝒐𝒗𝒊𝒅-𝟭𝟵 𝒔𝒕𝒂𝒕𝒊𝒔𝒕𝒊𝒄𝒔",
  category: "𝑼𝒕𝒊𝒍𝒊𝒕𝒊𝒆𝒔",
  usages: "[𝒄𝒐𝒖𝒏𝒕𝒓𝒚 𝒏𝒂𝒎𝒆]",
  cooldowns: 5,
  dependencies: {
    "axios": "",
    "fs-extra": ""
  }
};

module.exports.onStart = async function({ api, event, args }) {
  const axios = require('axios');
  const fs = require("fs-extra");
  const path = require("path");
  
  try {
    const country = args.join(" ");
    if (!country) {
      return api.sendMessage(`🌍 𝑷𝒍𝒆𝒂𝒔𝒆 𝒆𝒏𝒕𝒆𝒓 𝒂 𝒄𝒐𝒖𝒏𝒕𝒓𝒚 𝒏𝒂𝒎𝒆`, event.threadID, event.messageID);
    }

    const response = await axios.get(`https://disease.sh/v3/covid-19/countries/${encodeURIComponent(country)}`);
    const data = response.data;
    
    if (!data.country) {
      return api.sendMessage(`❌ 𝑪𝒐𝒖𝒏𝒕𝒓𝒚 "${country}" 𝒏𝒐𝒕 𝒇𝒐𝒖𝒏𝒅. 𝑷𝒍𝒆𝒂𝒔𝒆 𝒕𝒓𝒚 𝒂𝒈𝒂𝒊𝒏 𝒘𝒊𝒕𝒉 𝒂 𝒗𝒂𝒍𝒊𝒅 𝒄𝒐𝒖𝒏𝒕𝒓𝒚 𝒏𝒂𝒎𝒆.`, event.threadID, event.messageID);
    }

    const cachePath = path.join(__dirname, "cache", "covid_flags");
    if (!fs.existsSync(cachePath)) fs.mkdirSync(cachePath, { recursive: true });
    
    const flagPath = path.join(cachePath, `${data.countryInfo.iso3 || Date.now()}.png`);
    const flagUrl = data.countryInfo.flag;
    
    const flagResponse = await axios.get(flagUrl, { responseType: 'arraybuffer' });
    fs.writeFileSync(flagPath, flagResponse.data);
    
    const formatNumber = num => num.toLocaleString();
    
    const message = `🟢 𝑪𝒐𝒗𝒊𝒅-𝟭𝟵 𝑺𝒕𝒂𝒕𝒊𝒔𝒕𝒊𝒄𝒔 🟢

🌎 𝑪𝒐𝒖𝒏𝒕𝒓𝒚: ${data.country}
🌐 𝑪𝒐𝒏𝒕𝒊𝒏𝒆𝒏𝒕: ${data.continent}
👥 𝑷𝒐𝒑𝒖𝒍𝒂𝒕𝒊𝒐𝒏: ${formatNumber(data.population)}

📊 𝑪𝒖𝒓𝒓𝒆𝒏𝒕 𝑺𝒕𝒂𝒕𝒖𝒔:
🦠 𝑻𝒐𝒕𝒂𝒍 𝑪𝒂𝒔𝒆𝒔: ${formatNumber(data.cases)}
⚠️ 𝑻𝒐𝒅𝒂𝒚'𝒔 𝑪𝒂𝒔𝒆𝒔: ${formatNumber(data.todayCases)}
☠️ 𝑻𝒐𝒕𝒂𝒍 𝑫𝒆𝒂𝒕𝒉𝒔: ${formatNumber(data.deaths)}
💀 𝑻𝒐𝒅𝒂𝒚'𝒔 𝑫𝒆𝒂𝒕𝒉𝒔: ${formatNumber(data.todayDeaths)}
❤️ 𝑹𝒆𝒄𝒐𝒗𝒆𝒓𝒆𝒅: ${formatNumber(data.recovered)}
🏥 𝑨𝒄𝒕𝒊𝒗𝒆 𝑪𝒂𝒔𝒆𝒔: ${formatNumber(data.active)}
🆘 𝑪𝒓𝒊𝒕𝒊𝒄𝒂𝒍: ${formatNumber(data.critical)}
🧪 𝑻𝒆𝒔𝒕𝒔: ${formatNumber(data.tests)}

📅 𝑳𝒂𝒔𝒕 𝑼𝒑𝒅𝒂𝒕𝒆𝒅: ${new Date(data.updated).toLocaleString()}`;

    api.sendMessage({
      body: message,
      attachment: fs.createReadStream(flagPath)
    }, event.threadID, () => {
      fs.unlinkSync(flagPath);
    }, event.messageID);

  } catch (error) {
    console.error('[COVID ERROR]', error);
    if (error.response && error.response.status === 404) {
      return api.sendMessage(`❌ 𝑪𝒐𝒖𝒏𝒕𝒓𝒚 𝒏𝒐𝒕 𝒇𝒐𝒖𝒏𝒅. 𝑷𝒍𝒆𝒂𝒔𝒆 𝒕𝒓𝒚 𝒂 𝒗𝒂𝒍𝒊𝒅 𝒄𝒐𝒖𝒏𝒕𝒓𝒚 𝒏𝒂𝒎𝒆.`, event.threadID);
    }
    api.sendMessage(`🚫 𝑨𝒏 𝒆𝒓𝒓𝒐𝒓 𝒐𝒄𝒄𝒖𝒓𝒆𝒅 𝒘𝒉𝒊𝒍𝒆 𝒇𝒆𝒕𝒄𝒉𝒊𝒏𝒈 𝑪𝒐𝒗𝒊𝒅 𝒅𝒂𝒕𝒂. 𝑷𝒍𝒆𝒂𝒔𝒆 𝒕𝒓𝒚 𝒂𝒈𝒂𝒊𝒏 𝒍𝒂𝒕𝒆𝒓.`, event.threadID, event.messageID);
  }
};
