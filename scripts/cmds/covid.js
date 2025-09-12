const axios = require('axios');
const fs = require("fs-extra");
const path = require("path");

module.exports.config = {
    name: "covid",
    aliases: ["covid19", "corona"],
    version: "1.0.0",
    author: "𝐴𝑠𝑖𝑓 𝑀𝑎ℎ𝑚𝑢𝑑",
    countDown: 5,
    role: 0,
    category: "𝑢𝑡𝑖𝑙𝑖𝑡𝑦",
    shortDescription: {
        en: "𝑉𝑖𝑒𝑤 𝐶𝑂𝑉𝐼𝐷-19 𝑠𝑡𝑎𝑡𝑖𝑠𝑡𝑖𝑐𝑠"
    },
    longDescription: {
        en: "𝐺𝑒𝑡 𝑐𝑢𝑟𝑟𝑒𝑛𝑡 𝐶𝑂𝑉𝐼𝐷-19 𝑠𝑡𝑎𝑡𝑖𝑠𝑡𝑖𝑐𝑠 𝑓𝑜𝑟 𝑎𝑛𝑦 𝑐𝑜𝑢𝑛𝑡𝑟𝑦"
    },
    guide: {
        en: "{p}covid [𝑐𝑜𝑢𝑛𝑡𝑟𝑦 𝑛𝑎𝑚𝑒]"
    },
    dependencies: {
        "axios": "",
        "fs-extra": ""
    }
};

module.exports.onStart = async function({ message, args }) {
    try {
        const country = args.join(" ");
        if (!country) {
            return message.reply(`🌍 𝑃𝑙𝑒𝑎𝑠𝑒 𝑒𝑛𝑡𝑒𝑟 𝑎 𝑐𝑜𝑢𝑛𝑡𝑟𝑦 𝑛𝑎𝑚𝑒`);
        }

        const response = await axios.get(`https://disease.sh/v3/covid-19/countries/${encodeURIComponent(country)}`);
        const data = response.data;
        
        if (!data.country) {
            return message.reply(`❌ 𝐶𝑜𝑢𝑛𝑡𝑟𝑦 "${country}" 𝑛𝑜𝑡 𝑓𝑜𝑢𝑛𝑑. 𝑃𝑙𝑒𝑎𝑠𝑒 𝑡𝑟𝑦 𝑎𝑔𝑎𝑖𝑛 𝑤𝑖𝑡ℎ 𝑎 𝑣𝑎𝑙𝑖𝑑 𝑐𝑜𝑢𝑛𝑡𝑟𝑦 𝑛𝑎𝑚𝑒.`);
        }

        const cachePath = path.join(__dirname, "cache", "covid_flags");
        if (!fs.existsSync(cachePath)) fs.mkdirSync(cachePath, { recursive: true });
        
        const flagPath = path.join(cachePath, `${data.countryInfo.iso3 || Date.now()}.png`);
        const flagUrl = data.countryInfo.flag;
        
        const flagResponse = await axios.get(flagUrl, { responseType: 'arraybuffer' });
        fs.writeFileSync(flagPath, flagResponse.data);
        
        const formatNumber = num => num.toLocaleString();
        
        const messageText = `🟢 𝐶𝑂𝑉𝐼𝐷-19 𝑆𝑡𝑎𝑡𝑖𝑠𝑡𝑖𝑐𝑠 🟢

🌎 𝐶𝑜𝑢𝑛𝑡𝑟𝑦: ${data.country}
🌐 𝐶𝑜𝑛𝑡𝑖𝑛𝑒𝑛𝑡: ${data.continent}
👥 𝑃𝑜𝑝𝑢𝑙𝑎𝑡𝑖𝑜𝑛: ${formatNumber(data.population)}

📊 𝐶𝑢𝑟𝑟𝑒𝑛𝑡 𝑆𝑡𝑎𝑡𝑢𝑠:
🦠 𝑇𝑜𝑡𝑎𝑙 𝐶𝑎𝑠𝑒𝑠: ${formatNumber(data.cases)}
⚠️ 𝑇𝑜𝑑𝑎𝑦'𝑠 𝐶𝑎𝑠𝑒𝑠: ${formatNumber(data.todayCases)}
☠️ 𝑇𝑜𝑡𝑎𝑙 𝐷𝑒𝑎𝑡ℎ𝑠: ${formatNumber(data.deaths)}
💀 𝑇𝑜𝑑𝑎𝑦'𝑠 𝐷𝑒𝑎𝑡ℎ𝑠: ${formatNumber(data.todayDeaths)}
❤️ 𝑅𝑒𝑐𝑜𝑣𝑒𝑟𝑒𝑑: ${formatNumber(data.recovered)}
🏥 𝐴𝑐𝑡𝑖𝑣𝑒 𝐶𝑎𝑠𝑒𝑠: ${formatNumber(data.active)}
🆘 𝐶𝑟𝑖𝑡𝑖𝑐𝑎𝑙: ${formatNumber(data.critical)}
🧪 𝑇𝑒𝑠𝑡𝑠: ${formatNumber(data.tests)}

📅 𝐿𝑎𝑠𝑡 𝑈𝑝𝑑𝑎𝑡𝑒𝑑: ${new Date(data.updated).toLocaleString()}`;

        await message.reply({
            body: messageText,
            attachment: fs.createReadStream(flagPath)
        });

        fs.unlinkSync(flagPath);

    } catch (error) {
        console.error('[𝐶𝑂𝑉𝐼𝐷 𝐸𝑅𝑅𝑂𝑅]', error);
        if (error.response && error.response.status === 404) {
            return message.reply(`❌ 𝐶𝑜𝑢𝑛𝑡𝑟𝑦 𝑛𝑜𝑡 𝑓𝑜𝑢𝑛𝑑. 𝑃𝑙𝑒𝑎𝑠𝑒 𝑡𝑟𝑦 𝑎 𝑣𝑎𝑙𝑖𝑑 𝑐𝑜𝑢𝑛𝑡𝑟𝑦 𝑛𝑎𝑚𝑒.`);
        }
        message.reply(`🚫 𝐴𝑛 𝑒𝑟𝑟𝑜𝑟 𝑜𝑐𝑐𝑢𝑟𝑒𝑑 𝑤ℎ𝑖𝑙𝑒 𝑓𝑒𝑡𝑐ℎ𝑖𝑛𝑔 𝐶𝑂𝑉𝐼𝐷 𝑑𝑎𝑡𝑎. 𝑃𝑙𝑒𝑎𝑠𝑒 𝑡𝑟𝑦 𝑎𝑔𝑎𝑖𝑛 𝑙𝑎𝑡𝑒𝑟.`);
    }
};
