const axios = require("axios");
const fs = require("fs-extra");
const path = require("path");

module.exports = {
  config: {
    name: "animegirl",
    version: "5.0.0",
    author: "𝑨𝒔𝒊𝒇 𝑴𝒂𝒉𝒎𝒖𝒅",
    role: 0,
    category: "media",
    shortDescription: {
      en: "𝑭𝒆𝒕𝒄𝒉𝒆𝒔 𝒓𝒂𝒏𝒅𝒐𝒎 𝒂𝒏𝒊𝒎𝒆 𝒑𝒊𝒄𝒕𝒖𝒓𝒆𝒔"
    },
    longDescription: {
      en: "𝑮𝒆𝒕 𝒓𝒂𝒏𝒅𝒐𝒎 𝒂𝒏𝒊𝒎𝒆 𝒑𝒊𝒄𝒕𝒖𝒓𝒆𝒔 𝒇𝒓𝒐𝒎 𝒗𝒂𝒓𝒊𝒐𝒖𝒔 𝒄𝒂𝒕𝒆𝒈𝒐𝒓𝒊𝒆𝒔"
    },
    guide: {
      en: "{p}animegirl [category]\n\n𝑨𝒗𝒂𝒊𝒍𝒂𝒃𝒍𝒆 𝑪𝒂𝒕𝒆𝒈𝒐𝒓𝒊𝒆𝒔:\n• waifu (default)\n• neko\n• shinobu\n• megumin"
    },
    cooldowns: 3
  },

  onStart: async function({ message, event, args }) {
    try {
      const availableCategories = ["waifu", "neko", "shinobu", "megumin"];
      const category = args[0] ? args[0].toLowerCase() : 'waifu';
      
      if (!availableCategories.includes(category)) {
        return message.reply(`❌ 𝑰𝒏𝒗𝒂𝒍𝒊𝒅 𝒄𝒂𝒕𝒆𝒈𝒐𝒓𝒚!\n\n𝑨𝒗𝒂𝒊𝒍𝒂𝒃𝒍𝒆: ${availableCategories.join(', ')}`);
      }

      // Create cache directory if it doesn't exist
      const cacheDir = path.join(__dirname, 'cache');
      if (!fs.existsSync(cacheDir)) {
        fs.mkdirSync(cacheDir, { recursive: true });
      }

      const imagePath = path.join(cacheDir, `anime_${Date.now()}.jpg`);

      // Primary API
      try {
        const response = await axios.get(`https://nekos.best/api/v2/${category}`);
        const result = response.data.results[0];
        const caption = `🎀 𝑹𝒂𝒏𝒅𝒐𝒎 ${result.anime_name || this.capitalize(category)} 𝑷𝒊𝒄𝒕𝒖𝒓𝒆 🎀\n\n𝑨𝒓𝒕𝒊𝒔𝒕: ${result.artist_name}\n🔗 𝑺𝒐𝒖𝒓𝒄𝒆: ${result.source_url}`;
        
        // Download image
        const imageResponse = await axios.get(result.url, {
          responseType: 'arraybuffer'
        });
        fs.writeFileSync(imagePath, Buffer.from(imageResponse.data));
        
        await message.reply({
          body: caption,
          attachment: fs.createReadStream(imagePath)
        });
        
        fs.unlinkSync(imagePath);
        return;
        
      } catch (error) {
        console.error(`Primary API failed for ${category}:`, error.message);
      }

      // Secondary API
      try {
        if (category === 'waifu' || category === 'neko') {
          const response = await axios.get(`https://api.waifu.pics/sfw/${category}`);
          const caption = `🎀 𝑹𝒂𝒏𝒅𝒐𝒎 ${this.capitalize(category)} 𝑷𝒊𝒄𝒕𝒖𝒓𝒆 🎀\n\n(𝑩𝒂𝒄𝒌𝒖𝒑 𝑨𝑷𝑰)`;
          
          const imageResponse = await axios.get(response.data.url, {
            responseType: 'arraybuffer'
          });
          fs.writeFileSync(imagePath, Buffer.from(imageResponse.data));
          
          await message.reply({
            body: caption,
            attachment: fs.createReadStream(imagePath)
          });
          
          fs.unlinkSync(imagePath);
          return;
        }
      } catch (error) {
        console.error(`Secondary API failed for ${category}:`, error.message);
      }

      // Static backup APIs
      const backupApis = [
        "https://nekos.best/api/v2/happy",
        "https://nekos.best/api/v2/dance",
        "https://api.otakugifs.xyz/gif?reaction=kiss",
        "https://api.otakugifs.xyz/gif/allreactions",
        "https://nekos.best/api/v2/cry",
        "https://nekos.best/api/v2/bite",
        "https://nekos.best/api/v2/blush",
        "https://nekos.best/api/v2/cuddle",
        "https://nekos.best/api/v2/dance",
        "https://nekos.best/api/v2/facepalm",
        "https://nekos.best/api/v2/handhold",
        "https://nekos.best/api/v2/hug",
        "https://nekos.best/api/v2/kiss",
        "https://nekos.best/api/v2/laugh",
        "https://nekos.best/api/v2/nom",
        "https://nekos.best/api/v2/pat",
        "https://nekos.best/api/v2/poke",
        "https://nekos.best/api/v2/pout",
        "https://nekos.best/api/v2/punch",
        "https://nekos.best/api/v2/run",
        "https://nekos.best/api/v2/shrug",
        "https://nekos.best/api/v2/slap",
        "https://nekos.best/api/v2/sleep",
        "https://nekos.best/api/v2/smile",
        "https://nekos.best/api/v2/smug",
        "https://nekos.best/api/v2/stare",
        "https://nekos.best/api/v2/thumbsup",
        "https://nekos.best/api/v2/tickle",
        "https://nekos.best/api/v2/wave",
        "https://nekos.best/api/v2/wink",
        "https://nekos.best/api/v2/yawn",
        "https://api.waifu.pics/sfw/happy",
        "https://api.waifu.pics/sfw/wink",
        "https://api.waifu.pics/sfw/wave",
        "https://api.waifu.pics/sfw/smug",
        "https://api.waifu.pics/sfw/smile",
        "https://api.waifu.pics/sfw/slap",
        "https://api.waifu.pics/sfw/poke",
        "https://api.waifu.pics/sfw/pat",
        "https://api.waifu.pics/sfw/nom",
        "https://api.waifu.pics/sfw/lick",
        "https://api.waifu.pics/sfw/kiss",
        "https://api.waifu.pics/sfw/hug",
        "https://api.waifu.pics/sfw/happy",
        "https://api.waifu.pics/sfw/handhold",
        "https://api.waifu.pics/sfw/dance",
        "https://api.waifu.pics/sfw/cuddle",
        "https://api.waifu.pics/sfw/cry",
        "https://api.waifu.pics/sfw/blush",
        "https://api.waifu.pics/sfw/bite",
        "https://nekos.life/api/v2/img/neko",
        "https://nekos.life/api/v2/img/lewd",
        "https://nekobot.xyz/api/image?type=neko",
        "https://nekos.moe/api/v1/random/image?tags=neko",
        // 18+ APIs (kept as backup but won't be used for SFW command)
        "https://api.waifu.pics/nsfw/neko",
        "https://api.waifu.pics/nsfw/waifu",
        "https://api.waifu.pics/nsfw/blowjob",
        "https://nekobot.xyz/api/image?type=hentai",
        // Human NSFW GIF
        "https://nekobot.xyz/api/image?type=pgif"
      ];

      try {
        // Filter out NSFW APIs for this SFW command
        const sfwApis = backupApis.filter(api => 
          !api.includes('nsfw') && 
          !api.includes('hentai') && 
          !api.includes('pgif') &&
          !api.includes('lewd')
        );

        const randomApi = sfwApis[Math.floor(Math.random() * sfwApis.length)];
        const caption = `🎀 𝑹𝒂𝒏𝒅𝒐𝒎 𝑨𝒏𝒊𝒎𝒆 𝑷𝒊𝒄𝒕𝒖𝒓𝒆 🎀\n\n(𝑼𝒔𝒊𝒏𝒈 𝒃𝒂𝒄𝒌𝒖𝒑 𝑨𝑷𝑰)`;
        
        let imageUrl;
        
        if (randomApi.includes('nekos.best') || randomApi.includes('nekos.life')) {
          const response = await axios.get(randomApi);
          imageUrl = response.data.url || response.data.message;
        } else if (randomApi.includes('waifu.pics')) {
          const response = await axios.get(randomApi);
          imageUrl = response.data.url;
        } else if (randomApi.includes('otakugifs.xyz')) {
          const response = await axios.get(randomApi);
          imageUrl = response.data.url;
        } else if (randomApi.includes('nekobot.xyz')) {
          const response = await axios.get(randomApi);
          imageUrl = response.data.message;
        } else if (randomApi.includes('nekos.moe')) {
          const response = await axios.get(randomApi);
          imageUrl = `https://nekos.moe/image/${response.data.images[0].id}`;
        }

        if (imageUrl) {
          const imageResponse = await axios.get(imageUrl, {
            responseType: 'arraybuffer'
          });
          fs.writeFileSync(imagePath, Buffer.from(imageResponse.data));
          
          await message.reply({
            body: caption,
            attachment: fs.createReadStream(imagePath)
          });
          
          fs.unlinkSync(imagePath);
        } else {
          throw new Error("Could not extract image URL from backup API");
        }
        
      } catch (finalError) {
        console.error("All backup systems failed:", finalError);
        await message.reply("❌ 𝑰'𝒎 𝒔𝒐𝒓𝒓𝒚, 𝒃𝒖𝒕 𝒂𝒍𝒍 𝒊𝒎𝒂𝒈𝒆 𝒔𝒐𝒖𝒓𝒄𝒆𝒔 𝒂𝒓𝒆 𝒄𝒖𝒓𝒓𝒆𝒏𝒕𝒍𝒚 𝒖𝒏𝒂𝒗𝒂𝒊𝒍𝒂𝒃𝒍𝒆. 𝑷𝒍𝒆𝒂𝒔𝒆 𝒕𝒓𝒚 𝒂𝒈𝒂𝒊𝒏 𝒍𝒂𝒕𝒆𝒓.");
      }

    } catch (error) {
      console.error("Animegirl command error:", error);
      await message.reply("❌ 𝑨𝒏 𝒆𝒓𝒓𝒐𝒓 𝒐𝒄𝒄𝒖𝒓𝒓𝒆𝒅. 𝑷𝒍𝒆𝒂𝒔𝒆 𝒕𝒓𝒚 𝒂𝒈𝒂𝒊𝒏 𝒍𝒂𝒕𝒆𝒓.");
    }
  },

  capitalize: function(str) {
    if (!str) return '';
    return str.charAt(0).toUpperCase() + str.slice(1);
  }
};
