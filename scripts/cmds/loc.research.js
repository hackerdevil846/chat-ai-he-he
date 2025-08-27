const axios = require("axios");
const google = require("googlethis");
module.exports = {
  config: {
    name: "loc.research",
    aliases: ['locresearch'],
    version: "1.1",
    author: "𝐴𝑠𝑖𝑓 𝑀𝑎ℎ𝑚𝑢𝑑",
    coolDown: 5,
    role: 0,
    shortDescription: "𝐼𝑛𝑓𝑜𝑟𝑚𝑎𝑡𝑖𝑜𝑛 𝑅𝑒𝑡𝑟𝑖𝑒𝑣𝑎𝑙",
    longDescription: "𝐺𝑒𝑡 𝑐𝑜𝑚𝑝𝑟𝑒ℎ𝑒𝑛𝑠𝑖𝑣𝑒 𝑖𝑛𝑠𝑖𝑔ℎ𝑡𝑠 𝑓𝑟𝑜𝑚 𝑙𝑜𝑐.𝑔𝑜𝑣, 𝑊𝑖𝑘𝑖𝑝𝑒𝑑𝑖𝑎, 𝑎𝑛𝑑 𝐺𝑜𝑜𝑔𝑙𝑒 𝑤𝑖𝑡ℎ 𝑡ℎ𝑒 𝑙𝑜𝑐.𝑔𝑜𝑣 𝑐𝑜𝑚𝑚𝑎𝑛𝑑.",
    category: "𝑠𝑡𝑢𝑑𝑦",
    guide: {
      en: "{pn} <𝑘𝑒𝑦𝑤𝑜𝑟𝑑𝑠>"
    },
  },
  onStart: async function ({ api, event, args }) {

    let query = args.join(" ");
    const options = {
      page: 0,
      safe: false,
      additional_params: {
        hl: "en",
      },
    };

    if (!query) {
      return api.sendMessage("𝐼𝑛𝑣𝑎𝑙𝑖𝑑 𝑓𝑜𝑟𝑚𝑎𝑡!\n\n𝑃𝑙𝑒𝑎𝑠𝑒 𝑒𝑛𝑡𝑒𝑟 𝑦𝑜𝑢𝑟 𝑠𝑒𝑎𝑟𝑐ℎ 𝑘𝑒𝑦𝑤𝑜𝑟𝑑𝑠.", event.threadID);
    }

    api.sendMessage(`🔎 𝑆𝑒𝑎𝑟𝑐ℎ𝑖𝑛𝑔 𝑓𝑜𝑟 "${query}" 𝑜𝑛 𝑙𝑜𝑐.𝑔𝑜𝑣...`, event.threadID, event.messageID);

    const response = await google.search(`site:loc.gov/ ${query}`, options);

    let results = "";
    for (let i = 0; i < Math.min(5, response.results.length); i++) {
      let title = response.results[i].title;
      let authorCite = response.results[i].description;
      let link = response.results[i].url;

      results += `\n📄 𝑹𝑬𝑺𝑬𝑨𝑹𝑪𝑯 𝑹𝑬𝑺𝑶𝑼𝑹𝑪𝑬 ${i + 1}:\n\n ⦿ 𝑻𝑰𝑻𝑳𝑬: ${title}\n\n ⦿ 𝑪𝑰𝑻𝑬: ${authorCite}\n\n ⦿ 𝑳𝑰𝑵𝑲: ${link}\n\n`;

      try {
        const apiResponse = await axios.get(`https://en.wikipedia.org/w/api.php?format=json&action=query&prop=extracts&exintro&explaintext&titles=${encodeURIComponent(title)}`);
        const pages = apiResponse.data.query.pages;
        const pageId = Object.keys(pages)[0];
        const pageData = pages[pageId];
        const extract = pageData.extract || "";

        if (extract) {
          const paragraphs = extract.split("\n\n").filter(para => para.length > 0);
          for (const paragraph of paragraphs) {
            results += `𝑾𝑰𝑲𝑰𝑷𝑬𝑫𝑰𝑨 𝑹𝑨𝑵𝑫𝑶𝑴 𝑹𝑬𝑺𝑼𝑳𝑻: ${paragraph}\n\n`;
          }
        }
      } catch (error) {
        console.error(error);
      }
    }

    api.sendMessage(results, event.threadID);

    const alternativeResponse = await google.search(`${query}`, options);
    let alternativeResults = "\n\n🔎 𝑨𝑳𝑻𝑬𝑹𝑵𝑨𝑻𝑰𝑽𝑬 𝑺𝑬𝑨𝑹𝑪𝑯 𝑹𝑬𝑺𝑼𝑳𝑻𝑺 𝑭𝑹𝑶𝑴 𝑮𝑶𝑶𝑮𝑳𝑬\n";
    for (let i = 0; i < Math.min(5, alternativeResponse.results.length); i++) {
      let alternativeTitle = alternativeResponse.results[i].title;
      let alternativeDescription = alternativeResponse.results[i].description;
      let alternativeLink = alternativeResponse.results[i].url;

      alternativeResults += `\n\n𝑻𝑰𝑻𝑳𝑬: ${alternativeTitle}\n\n𝑫𝑬𝑺𝑪𝑹𝑰𝑷𝑻𝑰𝑶𝑵: ${alternativeDescription}\n\n𝑳𝑰𝑵𝑲: ${alternativeLink}`;
    }

    api.sendMessage(alternativeResults, event.threadID);
  }
};
