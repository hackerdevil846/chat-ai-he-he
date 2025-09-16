const axios = require("axios");
const fs = require("fs-extra");

module.exports = {
  config: {
    name: "nsfwimage",
    aliases: ["adultpic", "chobi"],
    version: "1.0.2",
    author: "𝑨𝒔𝒊𝒇 𝑴𝒂𝒉𝒎𝒖𝒅",
    countDown: 5,
    role: 0,
    category: "🔞 18+",
    shortDescription: {
      en: "🔞 𝒏𝒖𝒅𝒆 𝒄𝒉𝒐𝒃𝒊 𝒑𝒂𝒕𝒉𝒂𝒏𝒐 📸"
    },
    longDescription: {
      en: "🔞 𝑮𝒆𝒕 𝒏𝒖𝒅𝒆 𝒊𝒎𝒂𝒈𝒆𝒔 𝒇𝒓𝒐𝒎 𝒗𝒂𝒓𝒊𝒐𝒖𝒔 𝒄𝒂𝒕𝒆𝒈𝒐𝒓𝒊𝒆𝒔"
    },
    guide: {
      en: "{𝑝}nsfwimage"
    },
    dependencies: {
      "axios": "",
      "fs-extra": ""
    }
  },

  onStart: async function({ message, event }) {
    try {
      // Dependency check
      if (!axios) throw new Error("𝑀𝑖𝑠𝑠𝑖𝑛𝑔 𝑑𝑒𝑝𝑒𝑛𝑑𝑒𝑛𝑐𝑦: 𝑎𝑥𝑖𝑜𝑠");
      if (!fs) throw new Error("𝑀𝑖𝑠𝑠𝑖𝑛𝑔 𝑑𝑒𝑝𝑒𝑛𝑑𝑒𝑛𝑐𝑦: 𝑓𝑠-𝑒𝑥𝑡𝑟𝑎");

      // Define categories for image search
      const categories = ["boobs", "ass", "pussy", "feet"];
      // Select a random category
      const randomCategory = categories[Math.floor(Math.random() * categories.length)];
      
      // Configuration for the primary RapidAPI endpoint
      const primaryOptions = {
        method: "GET",
        url: "https://girls-nude-image.p.rapidapi.com/",
        params: { type: randomCategory },
        headers: {
          "x-rapidapi-key": "44a0d41bb0msh7963185219ba506p117328jsned41eee4c796",
          "x-rapidapi-host": "girls-nude-image.p.rapidapi.com"
        }
      };

      let imageUrl;
      let imageList;

      try {
        // Attempt to fetch image from primary API
        const response = await axios.request(primaryOptions);
        imageList = response.data;
      } catch (primaryError) {
        console.error("𝑃𝑟𝑖𝑚𝑎𝑟𝑦 𝐴𝑃𝐼 𝑓𝑎𝑖𝑙𝑒𝑑, 𝑡𝑟𝑦𝑖𝑛𝑔 𝑏𝑎𝑐𝑘𝑢𝑝: ", primaryError);
        // Configuration for the backup RapidAPI endpoint
        const backupOptions = {
          method: "GET",
          url: "https://porn-image1.p.rapidapi.com/",
          params: { type: randomCategory },
          headers: {
            "x-rapidapi-key": "44a0d41bb0msh7963185219ba506p117328jsned41eee4c796",
            "x-rapidapi-host": "porn-image1.p.rapidapi.com"
          }
        };
        // Attempt to fetch image from backup API
        const backupResponse = await axios.request(backupOptions);
        imageList = backupResponse.data;
      }
      
      // Check if any images were found
      if (!imageList || imageList.length === 0) {
        throw new Error("𝑁𝑜 𝑖𝑚𝑎𝑔𝑒𝑠 𝑓𝑜𝑢𝑛𝑑 𝑖𝑛 𝐴𝑃𝐼 𝑟𝑒𝑠𝑝𝑜𝑛𝑠𝑒 😔");
      }

      // Select a random image from the list
      const randomIndex = Math.floor(Math.random() * imageList.length);
      imageUrl = imageList[randomIndex];
      
      // Download the image
      const imgResponse = await axios.get(imageUrl, { responseType: "arraybuffer" });
      const imgPath = __dirname + `/cache/nude_${event.senderID}_${event.threadID}.jpg`;
      fs.writeFileSync(imgPath, Buffer.from(imgResponse.data, "binary"));
      
      // Send the image with a success message
      await message.reply({
        body: `📸 𝒄𝒉𝒐𝒃𝒊 𝒔𝒐𝒏𝒌𝒉𝒂: (${randomIndex + 1}/${imageList.length}) ✨\n🔞 𝑪𝒂𝒕𝒆𝒈𝒐𝒓𝒚: ${randomCategory}`,
        attachment: fs.createReadStream(imgPath)
      });

      // Clean up
      fs.unlinkSync(imgPath);

    } catch (error) {
      console.error("𝐸𝑟𝑟𝑜𝑟 𝑖𝑛 𝑛𝑠𝑓𝑤𝑖𝑚𝑎𝑔𝑒 𝑐𝑜𝑚𝑚𝑎𝑛𝑑: ", error);
      // Send an error message to the user
      await message.reply("❌ 𝒆𝒓𝒓𝒐𝒓: 𝒄𝒉𝒐𝒃𝒊 𝒑𝒂𝒕𝒉𝒂𝒏𝒐 𝒋𝒂𝒄𝒄𝒉𝒆 𝒏𝒂 😔");
    }
  }
};
