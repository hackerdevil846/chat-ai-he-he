const axios = require("axios");
const fs = require("fs-extra");
const path = require("path");

module.exports = {
  config: {
    name: "animegifpro", // different name
    aliases: ["anigifpro", "aigifpro"],
    version: "1.0",
    author: "𝐴𝑠𝑖𝑓 𝑀𝑎ℎ𝑚𝑢𝑑",
    countDown: 5,
    role: 0,
    shortDescription: {
      en: "𝐺𝑒𝑛𝑒𝑟𝑎𝑡𝑒 𝑎𝑛 𝑎𝑛𝑖𝑚𝑒 𝐺𝐼𝐹 𝑏𝑎𝑠𝑒𝑑 𝑜𝑛 𝑎 𝑝𝑟𝑜𝑚𝑝𝑡",
    },
    longDescription: {
      en: "𝐺𝑒𝑛𝑒𝑟𝑎𝑡𝑒 𝑎𝑛 𝑎𝑛𝑖𝑚𝑒 𝐺𝐼𝐹 𝑏𝑎𝑠𝑒𝑑 𝑜𝑛 𝑎 𝑡𝑒𝑥𝑡 𝑝𝑟𝑜𝑚𝑝𝑡",
    },
    category: "𝑚𝑒𝑑𝑖𝑎",
    guide: {
      en: "{p}animegifpro [prompt]",
    },
    dependencies: {
      axios: "",
      "fs-extra": "",
    },
  },

  onStart: async function ({ message, args }) {
    try {
      if (!args[0]) {
        return message.reply(
          "🎨 𝑃𝑙𝑒𝑎𝑠𝑒 𝑝𝑟𝑜𝑣𝑖𝑑𝑒 𝑎 𝑝𝑟𝑜𝑚𝑝𝑡 𝑓𝑜𝑟 𝑔𝑒𝑛𝑒𝑟𝑎𝑡𝑖𝑛𝑔 𝑎𝑛 𝑎𝑛𝑖𝑚𝑒 𝐺𝐼𝐹.\n\n𝐸𝑥𝑎𝑚𝑝𝑙𝑒: {p}animegifpro 𝑐𝑢𝑡𝑒 𝑎𝑛𝑖𝑚𝑒 𝑔𝑖𝑟𝑙 𝑑𝑎𝑛𝑐𝑖𝑛𝑔"
        );
      }

      const userPrompt = args.join(" ");
      await message.reply(
        "⏳ 𝐺𝑒𝑛𝑒𝑟𝑎𝑡𝑖𝑛𝑔 𝑎𝑛𝑖𝑚𝑒 𝐺𝐼𝐹... 𝑝𝑙𝑒𝑎𝑠𝑒 𝑤𝑎𝑖𝑡 ✨"
      );

      // cache dir
      const cacheDir = path.join(__dirname, "cache");
      if (!fs.existsSync(cacheDir)) {
        fs.mkdirSync(cacheDir, { recursive: true });
      }

      const gifPath = path.join(cacheDir, `anime_${Date.now()}.gif`);
      const encodedPrompt = encodeURIComponent(userPrompt);

      let success = false;

      // Tenor API only
      try {
        const tenorUrl = `https://tenor.googleapis.com/v2/search?q=${encodedPrompt}&key=AIzaSyBv0DNbrwe7XyGoRu1xx_lrlaAcyKNThkA&limit=1`;
        const tenorResponse = await axios.get(tenorUrl);

        if (
          tenorResponse.data &&
          tenorResponse.data.results &&
          tenorResponse.data.results.length > 0 &&
          tenorResponse.data.results[0].media_formats &&
          tenorResponse.data.results[0].media_formats.gif
        ) {
          const gifUrl =
            tenorResponse.data.results[0].media_formats.gif.url;

          // download gif to cache
          const gifData = await axios.get(gifUrl, {
            responseType: "arraybuffer",
          });
          fs.writeFileSync(gifPath, Buffer.from(gifData.data));

          await message.reply({
            body: `✅ 𝐴𝑛𝑖𝑚𝑒 𝐺𝐼𝐹 𝑓𝑜𝑢𝑛𝑑!\n📝 𝑃𝑟𝑜𝑚𝑝𝑡: "${userPrompt}"`,
            attachment: fs.createReadStream(gifPath),
          });
          success = true;
        }
      } catch (tenorError) {
        console.log("𝑇𝑒𝑛𝑜𝑟 𝐴𝑃𝐼 𝑓𝑎𝑖𝑙𝑒𝑑:", tenorError.message);
      }

      if (!success) {
        await message.reply(
          "❌ 𝑆𝑜𝑟𝑟𝑦, 𝑐𝑜𝑢𝑙𝑑 𝑛𝑜𝑡 𝑔𝑒𝑛𝑒𝑟𝑎𝑡𝑒 𝐺𝐼𝐹 𝑟𝑖𝑔ℎ𝑡 𝑛𝑜𝑤. 𝑃𝑙𝑒𝑎𝑠𝑒 𝑡𝑟𝑦 𝑎 𝑑𝑖𝑓𝑓𝑒𝑟𝑒𝑛𝑡 𝑝𝑟𝑜𝑚𝑝𝑡 𝑜𝑟 𝑡𝑟𝑦 𝑎𝑔𝑎𝑖𝑛 𝑙𝑎𝑡𝑒𝑟."
        );
      }

      // clean up
      if (fs.existsSync(gifPath)) {
        fs.unlinkSync(gifPath);
      }
    } catch (error) {
      console.error("𝐴𝑛𝑖𝑚𝑒𝐺𝐼𝐹 𝑐𝑜𝑚𝑚𝑎𝑛𝑑 𝑒𝑟𝑟𝑜𝑟:", error);
      // no error message to chat
    }
  },
};
