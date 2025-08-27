const axios = require('axios');
const fs = require('fs');

module.exports = {
  config: {
    name: "textart",
    aliases: ["textdesign", "textpro"],
    version: "1.0",
    author: "𝐴𝑠𝑖𝑓 𝑀𝑎ℎ𝑚𝑢𝑑",
    countDown: 5, 
    role: 0,
    shortDescription: "",
    longDescription: "",
    category: "𝑙𝑜𝑔𝑜",
    guide: "{pn}"
  },
  onStart: async function ({ api, event, args, Users }) {
    let { messageID, senderID, threadID } = event;

    if (args.length >= 2 && args[0].toLowerCase() === "list") {
      let page = parseInt(args[1]);
      switch (page) {
        case 1:
          return api.sendMessage(
            `╔════ஜ۩۞۩ஜ═══╗\n\n𝑯𝒆𝒓𝒆'𝒔 𝒕𝒉𝒆 𝒕𝒆𝒙𝒕 𝒂𝒓𝒕 𝒍𝒊𝒔𝒕 - 𝑷𝒂𝒈𝒆 1:\n\n
❍ 𝑎𝑔𝑙𝑖𝑡𝑐ℎ ❍ 𝐵𝑢𝑠𝑖𝑛𝑒𝑠𝑠 ❍  𝑏𝑙𝑜𝑜𝑑\n❍ 𝑏𝑙𝑎𝑐𝑘𝑝𝑖𝑛𝑘
❍ 𝑏𝑟𝑜𝑘𝑒𝑛 ❍ 𝑐ℎ𝑟𝑖𝑠𝑡𝑚𝑎𝑠\n❍ 𝑐𝑎𝑝𝑡𝑎𝑖𝑛𝑎𝑚𝑒𝑟𝑖𝑐𝑎
❍ 𝑐𝑎𝑟𝑏𝑜𝑛 ❍ 𝑐𝑖𝑟𝑐𝑢𝑖𝑡\n❍ 𝑐ℎ𝑜𝑟𝑜𝑟
❍ 𝑐ℎ𝑟𝑖𝑠𝑡𝑚𝑎𝑠 ❍ 𝑑𝑖𝑠𝑐𝑜𝑣𝑒𝑟𝑦\n❍ 𝑑𝑒𝑣𝑖𝑙
❍ 𝑑𝑟𝑜𝑝𝑤𝑎𝑡𝑒𝑟 ❍ 𝑓𝑖𝑐𝑡𝑖𝑜𝑛\n❍ 𝑓𝑖𝑟𝑒 ❍ 𝑔𝑙𝑎𝑠𝑠
❍ 𝑔𝑟𝑒𝑒𝑛ℎ𝑜𝑟𝑟𝑜𝑟\n❍ 𝑖𝑚𝑔𝑙𝑖𝑡𝑐ℎ ❍ 𝑙𝑎𝑦𝑒𝑟𝑒𝑑
❍ 𝑙𝑖𝑔ℎ𝑡\n❍ 𝑚𝑎𝑔𝑚𝑎 ❍ 𝑚𝑒𝑡𝑎𝑙𝑙𝑖𝑐
❍ 𝑛𝑒𝑜𝑛\n❍ 𝑠𝑘𝑒𝑙𝑒𝑡𝑜𝑛 ❍ 𝑠𝑘𝑒𝑡𝑐ℎ
❍ 𝑠𝑡𝑜𝑛𝑒\n❍ 𝑙𝑜𝑣𝑒 ❍ 𝑡𝑟𝑎𝑛𝑠𝑓𝑜𝑟𝑚𝑒𝑟𝑠 ❍ 𝑤𝑎𝑙𝑙\n\n
𝑷𝑨𝑮𝑬 1 - 3\n\n╚════ஜ۩۞۩ஜ═══╝`,
            threadID,
            messageID
          );
        case 2:
          return api.sendMessage(
            `╔════ஜ۩۞۩ஜ═══╗\n\n𝑯𝒆𝒓𝒆'𝒔 𝒕𝒉𝒆 𝒕𝒆𝒙𝒕 𝒂𝒓𝒕 𝒍𝒊𝒔𝒕 - 𝑷𝒂𝒈𝒆 2:\n\n❍ 𝑛𝑎𝑟𝑢𝑡𝑜 ❍ 𝑑𝑟𝑎𝑔𝑜𝑛𝑓𝑖𝑟𝑒𝑎𝑣𝑎𝑡𝑒𝑟\n❍ 𝑝𝑢𝑏𝑔𝑎𝑣𝑎𝑡𝑒𝑟 ❍ 𝑛𝑖𝑔ℎ𝑡𝑠𝑡𝑎𝑟𝑠 ❍ 𝑠𝑢𝑛𝑙𝑖𝑔ℎ𝑡\n❍ 𝑐𝑙𝑜𝑢𝑑 ❍ 𝑝𝑖𝑔 ❍ 𝑐𝑎𝑝𝑒𝑟\n❍ 𝑤𝑟𝑖𝑡𝑒𝑠𝑡𝑎𝑡𝑢𝑠 ❍ 𝑜𝑟𝑟𝑜𝑟 ❍ 𝑡𝑒𝑎𝑚𝑙𝑜𝑔𝑜 \n❍ 𝑞𝑢𝑒𝑒𝑛 ❍ 𝑏𝑒𝑎𝑐ℎ ❍ 𝑓𝑏𝑐3\n❍ 𝑡𝑎𝑡𝑡𝑜 ❍ 𝑠ℎ𝑖𝑟𝑡3 ❍ 𝑜𝑐𝑒𝑎𝑛𝑠𝑒𝑎\n❍ 𝑠ℎ𝑖𝑟𝑡4 ❍ 𝑠ℎ𝑖𝑟𝑡5 ❍ 𝑠ℎ𝑖𝑟𝑡6\n❍ 𝑙𝑜𝑣𝑒𝑚𝑠𝑔 ❍ 𝑐ℎ𝑠𝑡𝑚 ❍ 𝑐ℎ𝑟𝑖𝑠𝑡𝑚𝑎𝑠2\n❍ 𝑖𝑐𝑒𝑡𝑒𝑥𝑡 ❍ 𝑏𝑢𝑡𝑡𝑒𝑟𝑙𝑓𝑦 ❍ 𝑐𝑜𝑓𝑓𝑒\n\n𝑷𝑨𝑮𝑬 2 - 3\n\n╚════ஜ۩۞۩ஜ═══╝`,
            threadID,
            messageID
          );
        case 3:
          return api.sendMessage(
            `╔════ஜ۩۞۩ஜ═══╗\n\n𝑯𝒆𝒓𝒆'𝒔 𝒕𝒉𝒆 𝒕𝒆𝒙𝒕 𝒂𝒓𝒕 𝒍𝒊𝒔𝒕 - 𝑷𝒂𝒈𝒆 3:❍ 𝑠𝑚𝑜𝑘𝑒\n\n𝑷𝑨𝑮𝑬 3 - 3\n\n╚════ஜ۩۞۩ஜ═══╝`,
            threadID,
            messageID
          );
        default:
          return api.sendMessage(
            `╔════ஜ۩۞۩ஜ═══╗\n\n𝐼𝑛𝑣𝑎𝑙𝑖𝑑 𝑝𝑎𝑔𝑒 𝑛𝑢𝑚𝑏𝑒𝑟! 𝑃𝑙𝑒𝑎𝑠𝑒 𝑢𝑠𝑒 "𝑙𝑖𝑠𝑡 1" 𝑜𝑟 "𝑙𝑖𝑠𝑡 2" 𝑜𝑟 "𝑙𝑖𝑠𝑡 3" 𝑡𝑜 𝑣𝑖𝑒𝑤 𝑡ℎ𝑒 𝑎𝑣𝑎𝑖𝑙𝑎𝑏𝑙𝑒 𝑡𝑒𝑥𝑡 𝑎𝑟𝑡 𝑙𝑖𝑠𝑡𝑠.\n\n╚════ஜ۩۞۩ஜ═══╝`,
            threadID,
            messageID
          );
      }
    }

    if (args.length < 2) {
      return api.sendMessage(
        `╔════ஜ۩۞۩ஜ═══╗\n\n𝐼𝑛𝑣𝑎𝑙𝑖𝑑 𝑐𝑜𝑚𝑚𝑎𝑛𝑑 𝑓𝑜𝑟𝑚𝑎𝑡! 𝑈𝑠𝑒: 𝑡𝑒𝑥𝑡𝑎𝑟𝑡 𝑙𝑖𝑠𝑡 (𝑝𝑎𝑔𝑒 𝑛𝑢𝑚𝑏𝑒𝑟) 𝑜𝑟 𝑡𝑒𝑥𝑡𝑎𝑟𝑡 (𝑠𝑡𝑦𝑙𝑒 𝑛𝑎𝑚𝑒) (𝑡𝑒𝑥𝑡)\n\n╚════ஜ۩۞۩ஜ═══╝`,
        threadID,
        messageID
      );
    }

    let type = args[0].toLowerCase();
    let text = args.slice(1).join(" ");
    let pathImg = __dirname + `/cache/${type}_${text}.png`;
    let apiUrl, message;

    switch (type) {
      case "glass":
        apiUrl = `https://rest-api-001.faheem001.repl.co/api/textpro?number=4&text=${text}`;
        message = "𝐻𝑒𝑟𝑒'𝑠 𝑡ℎ𝑒 [𝐺𝐿𝐴𝑆𝑆] 𝑡𝑒𝑥𝑡 𝑎𝑟𝑡 𝑐𝑟𝑒𝑎𝑡𝑒𝑑:";
        break;
    case "business":
      apiUrl = `https://rest-api-001.faheem001.repl.co/api/textpro?number=5&text=${text}`;
      message = "𝐻𝑒𝑟𝑒'𝑠 𝑡ℎ𝑒 [𝐵𝑈𝑆𝐼𝑁𝐸𝑆𝑆] 𝑡𝑒𝑥𝑡 𝑎𝑟𝑡 𝑐𝑟𝑒𝑎𝑡𝑒𝑑:";
      break;
    case "wall":
      apiUrl = `https://faheem-vip-010.faheem001.repl.co/api/textpro/embossed?text=${text}`;
      message = "𝐻𝑒𝑟𝑒'𝑠 𝑡ℎ𝑒 [𝑊𝐴𝐿𝐿] 𝑡𝑒𝑥𝑡 𝑎𝑟𝑡 𝑐𝑟𝑒𝑎𝑡𝑒𝑑:";
     break;
    case "aglitch":
      apiUrl = `https://faheem-vip-010.faheem001.repl.co/api/textpro/aglitch?text=${text}&text2=${text}`;
      message = "𝐻𝑒𝑟𝑒'𝑠 𝑡ℎ𝑒 [𝐴𝐺𝐿𝐼𝑇𝐶𝐻] 𝑡𝑒𝑥𝑡 𝑎𝑟𝑡 𝑐𝑟𝑒𝑎𝑡𝑒𝑑:"; 
        break;
    case "berry":
      apiUrl = `https://faheem-vip-010.faheem001.repl.co/api/textpro/berry?text=${text}`;
      message = "𝐻𝑒𝑟𝑒'𝑠 𝑡ℎ𝑒 [𝐵𝐸𝑅𝑅𝑌] 𝑡𝑒𝑥𝑡 𝑎𝑟𝑡 𝑐𝑟𝑒𝑎𝑡𝑒𝑑:";
        break;
    case "blackpink":
      apiUrl = `https://faheem-vip-010.faheem001.repl.co/api/textpro/blackpink?text=${text}`;
      message = "𝐻𝑒𝑟𝑒'𝑠 𝑡ℎ𝑒 [𝐵𝐿𝐴𝐶𝐾𝑃𝐼𝑁𝐾] 𝑡𝑒𝑥𝑡 𝑎𝑟𝑡 𝑐𝑟𝑒𝑎𝑡𝑒𝑑:";
        break;
    case "blood":
      apiUrl = `https://faheem-vip-010.faheem001.repl.co/api/textpro/blood?text=${text}`;
      message = "𝐻𝑒𝑟𝑒'𝑠 𝑡ℎ𝑒 [𝐵𝐿𝑂𝑂𝐷] 𝑡𝑒𝑥𝑡 𝑎𝑟𝑡 𝑐𝑟𝑒𝑎𝑡𝑒𝑑:";
        break;
    case "broken":
      apiUrl = `https://faheem-vip-010.faheem001.repl.co/api/textpro/broken?text=${text}`;
      message = "𝐻𝑒𝑟𝑒'𝑠 𝑡ℎ𝑒 [𝐵𝑅𝑂𝐾𝐸𝑁] 𝑡𝑒𝑥𝑡 𝑎𝑟𝑡 𝑐𝑟𝑒𝑎𝑡𝑒𝑑:";
          break;
    case "smoke":
      apiUrl = `https://api.lolhuman.xyz/api/photooxy1/smoke?apikey=0a637f457396bf3dcc21243b&text=${text}`;
      message = "𝐻𝑒𝑟𝑒'𝑠 𝑡ℎ𝑒 [𝑆𝑀𝑂𝐾𝐸] 𝑡𝑒𝑥𝑡 𝑎𝑟𝑡 𝑐𝑟𝑒𝑎𝑡𝑒𝑑:";
      break;
    case "captainamerica":
      apiUrl = `https://faheem-vip-010.faheem001.repl.co/api/textpro/captainamerica?text=${test}&text2=${text}`;
      message = "𝐻𝑒𝑟𝑒'𝑠 𝑡ℎ𝑒 [𝐶𝐴𝑃𝑇𝐴𝐼𝑁𝐴𝑀𝐸𝑅𝐼𝐶𝐴] 𝑡𝑒𝑥𝑡 𝑎𝑟𝑡 𝑐𝑟𝑒𝑎𝑡𝑒𝑑:";
        break;
    case "carbon":
      apiUrl = `https://faheem-vip-010.faheem001.repl.co/api/textpro/carbon?text=${text}`;
      message = "𝐻𝑒𝑟𝑒'𝑠 𝑡ℎ𝑒 [𝐶𝐴𝑅𝐵𝑂𝑁] 𝑡𝑒𝑥𝑡 𝑎𝑟𝑡 𝑐𝑟𝑒𝑎𝑡𝑒𝑑:";
        break;
    case "choror":
      apiUrl = `https://faheem-vip-010.faheem001.repl.co/api/textpro/choror?text=${text}&text2=${text}`;
      message = "𝐻𝑒𝑟𝑒'𝑠 𝑡ℎ𝑒 [𝐶𝐻𝑂𝑅𝑂𝑅] 𝑡𝑒𝑥𝑡 𝑎𝑟𝑡 𝑐𝑟𝑒𝑎𝑡𝑒𝑑:";
        break;
    case "christmas":
      apiUrl = `https://faheem-vip-010.faheem001.repl.co/api/textpro/christmas?text=${text}`;
      message = "𝐻𝑒𝑟𝑒'𝑠 𝑡ℎ𝑒 [𝐶𝐻𝑅𝐼𝑆𝑇𝑀𝐴𝑆] 𝑡𝑒𝑥𝑡 𝑎𝑟𝑡 𝑐𝑟𝑒𝑎𝑡𝑒𝑑:";
        break;
    case "circuit":
      apiUrl = `https://faheem-vip-010.faheem001.repl.co/api/textpro/circuit?text=${text}`;
      message = "𝐻𝑒𝑟𝑒'𝑠 𝑡ℎ𝑒 [𝐶𝐼𝑅𝐶𝑈𝐼𝑇] 𝑡𝑒𝑥𝑡 𝑎𝑟𝑡 𝑐𝑟𝑒𝑎𝑡𝑒𝑑:";
        break;
    case "devil":
      apiUrl = `https://faheem-vip-010.faheem001.repl.co/api/textpro/devil?text=${text}`;
      message = "𝐻𝑒𝑟𝑒'𝑠 𝑡ℎ𝑒 [𝐷𝐸𝑉𝐼𝐿] 𝑡𝑒𝑥𝑡 𝑎𝑟𝑡 𝑐𝑟𝑒𝑎𝑡𝑒𝑑:";
        break;
    case "discovery":
      apiUrl = `https://faheem-vip-010.faheem001.repl.co/api/textpro/discovery?text=${text}`;
      message = "𝐻𝑒𝑟𝑒'𝑠 𝑡ℎ𝑒 [𝐷𝐼𝑆𝐶𝑂𝑉𝐸𝑅𝑌] 𝑡𝑒𝑥𝑡 𝑎𝑟𝑡 𝑐𝑟𝑒𝑎𝑡𝑒𝑑:";
        break;
    case "dropwater":
      apiUrl = `https://faheem-vip-010.faheem001.repl.co/api/textpro/dropwater?text=${text}`;
      message = "𝐻𝑒𝑟𝑒'𝑠 𝑡ℎ𝑒 [𝐷𝑅𝑂𝑃𝑊𝐴𝑇𝐸𝑅] 𝑡𝑒𝑥𝑡 𝑎𝑟𝑡 𝑐𝑟𝑒𝑎𝑡𝑒𝑑:";
        break;
    case "fiction":
      apiUrl = `https://faheem-vip-010.faheem001.repl.co/api/textpro/fiction?text=${text}`;
      message = "𝐻𝑒𝑟𝑒'𝑠 𝑡ℎ𝑒 [𝐹𝐼𝐶𝑇𝐼𝑂𝑁] 𝑡𝑒𝑥𝑡 𝑎𝑟𝑡 𝑐𝑟𝑒𝑎𝑡𝑒𝑑:";
        break;
    case "firework":
      apiUrl = `https://faheem-vip-010.faheem001.repl.co/api/textpro/firework?text=${text}`;
      message = "𝐻𝑒𝑟𝑒'𝑠 𝑡ℎ𝑒 [𝐹𝐼𝑅𝐸𝑊𝑂𝑅𝐾] 𝑡𝑒𝑥𝑡 𝑎𝑟𝑡 𝑐𝑟𝑒𝑎𝑡𝑒𝑑:";
        break;
    case "galaxy":
      apiUrl = `https://rest-api-001.faheem001.repl.co/api/textpro?number=173&text=${text}`;
      message = "𝐻𝑒𝑟𝑒'𝑠 𝑡ℎ𝑒 [𝐺𝐴𝐿𝐴𝑋𝑌] 𝑡𝑒𝑥𝑡 𝑎𝑟𝑡 𝑐𝑟𝑒𝑎𝑡𝑒𝑑:";
        break;
    case "glossy":
      apiUrl = `https://faheem-vip-010.faheem001.repl.co/api/textpro/glossy?text=${text}`;
      message = "𝐻𝑒𝑟𝑒'𝑠 𝑡ℎ𝑒 [𝐺𝐿𝑂𝑆𝑆𝑌] 𝑡𝑒𝑥𝑡 𝑎𝑟𝑡 𝑐𝑟𝑒𝑎𝑡𝑒𝑑:";
        break;
    case "glue":
      apiUrl = `https://faheem-vip-010.faheem001.repl.co/api/textpro/glue?text=${text}`;
      message = "𝐻𝑒𝑟𝑒'𝑠 𝑡ℎ𝑒 [𝐺𝐿𝑈𝐸] 𝑡𝑒𝑥𝑡 𝑎𝑟𝑡 𝑐𝑟𝑒𝑎𝑡𝑒𝑑:";
        break;
    case "gradient":
      apiUrl = `https://faheem-vip-010.faheem001.repl.co/api/textpro/gradient?text=${text}`;
      message = "𝐻𝑒𝑟𝑒'𝑠 𝑡ℎ𝑒 [𝐺𝑅𝐴𝐷𝐼𝐸𝑁𝑇] 𝑡𝑒𝑥𝑡 𝑎𝑟𝑡 𝑐𝑟𝑒𝑎𝑡𝑒𝑑:";
        break;
    case "greenhorror":
      apiUrl = `https://faheem-vip-010.faheem001.repl.co/api/textpro/greenhorror?text=${text}`;
      message = "𝐻𝑒𝑟𝑒'𝑠 𝑡ℎ𝑒 [𝐺𝑅𝐸𝐸𝑁𝐻𝑂𝑅𝑅𝑂𝑅] 𝑡𝑒𝑥𝑡 𝑎𝑟𝑡 𝑐𝑟𝑒𝑎𝑡𝑒𝑑:";
        break;
    case "spooky":
      apiUrl = `https://faheem-vip-010.faheem001.repl.co/api/textpro/spooky?text=${text}&text2=${text}`;
      message = "𝐻𝑒𝑟𝑒'𝑠 𝑡ℎ𝑒 [𝑆𝑃𝑂𝑂𝐾𝑌] 𝑡𝑒𝑥𝑡 𝑎𝑟𝑡 𝑐𝑟𝑒𝑎𝑡𝑒𝑑:";
        break;
    case "imglitch":
      apiUrl = `https://faheem-vip-010.faheem001.repl.co/api/textpro/imglitch?text=${text}`;
      message = "𝐻𝑒𝑟𝑒'𝑠 𝑡ℎ𝑒 [𝐼𝑀𝐺𝐿𝐼𝑇𝐶𝐻] 𝑡𝑒𝑥𝑡 𝑎𝑟𝑡 𝑐𝑟𝑒𝑎𝑡𝑒𝑑:";
        break;
    case "layered":
      apiUrl = `https://faheem-vip-010.faheem001.repl.co/api/textpro/layered?text=${text}&text2=${text}`;
      message = "𝐻𝑒𝑟𝑒'𝑠 𝑡ℎ𝑒 [𝐿𝐴𝑌𝐸𝑅𝐸𝐷] 𝑡𝑒𝑥𝑡 𝑎𝑟𝑡 𝑐𝑟𝑒𝑎𝑡𝑒𝑑:";
        break;
    case "light":
      apiUrl = `https://faheem-vip-010.faheem001.repl.co/api/textpro/light?text=${text}`;
      message = "𝐻𝑒𝑟𝑒'𝑠 𝑡ℎ𝑒 [𝐿𝐼𝐺𝐻𝑇] 𝑡𝑒𝑥𝑡 𝑎𝑟𝑡 𝑐𝑟𝑒𝑎𝑡𝑒𝑑:";
        break;
    case "magma":
      apiUrl = `https://faheem-vip-010.faheem001.repl.co/api/textpro/magma?text=${text}`;
      message = "𝐻𝑒𝑟𝑒'𝑠 𝑡ℎ𝑒 [𝑀𝐴𝐺𝑀𝐴] 𝑡𝑒𝑥𝑡 𝑎𝑟𝑡 𝑐𝑟𝑒𝑎𝑡𝑒𝑑:";
break;
    case "metallic":
      apiUrl = `https://faheem-vip-010.faheem001.repl.co/api/textpro/metallic?text=${text}`;
      message = "𝐻𝑒𝑟𝑒'𝑠 𝑡ℎ𝑒 [𝑀𝐸𝑇𝐴𝐿𝐿𝐼𝐶] 𝑡𝑒𝑥𝑡 𝑎𝑟𝑡 𝑐𝑟𝑒𝑎𝑡𝑒𝑑:";
break;
    case "neon":
      apiUrl = `https://faheem-vip-010.faheem001.repl.co/api/textpro/neon?text=${text}`;
      message = "𝐻𝑒𝑟𝑒'𝑠 𝑡ℎ𝑒 [𝑁𝐸𝑂𝑁] 𝑡𝑒𝑥𝑡 𝑎𝑟𝑡 𝑐𝑟𝑒𝑎𝑡𝑒𝑑:";
        break;
    case "skeleton":
      apiUrl = `https://faheem-vip-010.faheem001.repl.co/api/textpro/skeleton?text=${text}`;
      message = "𝐻𝑒𝑟𝑒'𝑠 𝑡ℎ𝑒 [𝑆𝐾𝐸𝐿𝐸𝑇𝑂𝑁] 𝑡𝑒𝑥𝑡 𝑎𝑟𝑡 𝑐𝑟𝑒𝑎𝑡𝑒𝑑:";
        break;
    case "sketch":
      apiUrl = `https://faheem-vip-010.faheem001.repl.co/api/textpro/sketch?text=${text}`;
      message = "𝐻𝑒𝑟𝑒'𝑠 𝑡ℎ𝑒 [𝑆𝐾𝐸𝑇𝐶𝐻] 𝑡𝑒𝑥𝑡 𝑎𝑟𝑡 𝑐𝑟𝑒𝑎𝑡𝑒𝑑:"; 
        break;
    case "stone":
      apiUrl = `https://faheem-vip-010.faheem001.repl.co/api/textpro/stone?text=${text}`;
      message = "𝐻𝑒𝑟𝑒'𝑠 𝑡ℎ𝑒 [𝑆𝑇𝑂𝑁𝐸] 𝑡𝑒𝑥𝑡 𝑎𝑟𝑡 𝑐𝑟𝑒𝑎𝑡𝑒𝑑:";break;
    case "transformer":
      apiUrl = `https://faheem-vip-010.faheem001.repl.co/api/textpro/transformer?text=${text}`;
      message = "𝐻𝑒𝑟𝑒'𝑠 𝑡ℎ𝑒 [𝑇𝑅𝐴𝑁𝑆𝐹𝑂𝑅𝑀𝐸𝑅] 𝑡𝑒𝑥𝑡 𝑎𝑟𝑡 𝑐𝑟𝑒𝑎𝑡𝑒𝑑:";
        break;
    case "fire":
      apiUrl = `https://chards-bot-api.richardretadao1.repl.co/api/photooxy/flaming?text=${text}`;
      message = "𝐻𝑒𝑟𝑒'𝑠 𝑡ℎ𝑒 [𝐹𝐼𝑅𝐸] 𝑡𝑒𝑥𝑡 𝑎𝑟𝑡 𝑐𝑟𝑒𝑎𝑡𝑒𝑑:";
        break;
    case "naruto":
      apiUrl = `https://rest-api-2.faheem007.repl.co/api/photooxy/naruto?text=${text}`;
      message = "𝐻𝑒𝑟𝑒'𝑠 𝑡ℎ𝑒 [𝑁𝐴𝑅𝑈𝑇𝑂] 𝑡𝑒𝑥𝑡 𝑎𝑟𝑡 𝑐𝑟𝑒𝑎𝑡𝑒𝑑:";
			  break;
    case "dragonfire":
      apiUrl = `https://faheem-vip-010.faheem001.repl.co/api/ephoto/dragonfire?text=${text}`;
      message = "𝐻𝑒𝑟𝑒'𝑠 𝑡ℎ𝑒 [𝑃𝑈𝐵𝐺] 𝑡𝑒𝑥𝑡 𝑎𝑟𝑡 𝑐𝑟𝑒𝑎𝑡𝑒𝑑:";
        break;
    case "avater":
      apiUrl = `https://faheem-vip-010.faheem001.repl.co/api/ephoto/lolnew?text=${text}`;
      message = "𝐻𝑒𝑟𝑒'𝑠 𝑡ℎ𝑒 [𝐴𝑉𝐴𝑇𝐴𝑅] 𝑡𝑒𝑥𝑡 𝑎𝑟𝑡 𝑐𝑟𝑒𝑎𝑡𝑒𝑑:";
				break;
    case "pubgavatar":
      apiUrl = `https://faheem-vip-010.faheem001.repl.co/api/ephoto/pubgavatar?text=${text}`;
      message = "𝐻𝑒𝑟𝑒'𝑠 𝑡ℎ𝑒 [𝑃𝑈𝐵𝐺𝐴𝑉𝐴𝑇𝐴𝑅] 𝑡𝑒𝑥𝑡 𝑎𝑟𝑡 𝑐𝑟𝑒𝑎𝑡𝑒𝑑:";
				break;
    case "nightstars":
      apiUrl = `https://faheem-vip-010.faheem001.repl.co/api/ephoto/nightstars?text=${text}`;
      message = "𝐻𝑒𝑟𝑒'𝑠 𝑡ℎ𝑒 [𝑁𝐼𝐺𝐻𝑇𝑆𝑇𝐴𝑅𝑆] 𝑡𝑒𝑥𝑡 𝑎𝑟𝑡 𝑐𝑟𝑒𝑎𝑡𝑒𝑑:";
				break;
    case "sunlight":
      apiUrl = `https://faheem-vip-010.faheem001.repl.co/api/ephoto/sunlight?text=${text}`;
      message = "𝐻𝑒𝑟𝑒'𝑠 𝑡ℎ𝑒 [𝑆𝑈𝑁𝐿𝐼𝐺𝐻𝑇] 𝑡𝑒𝑥𝑡 𝑎𝑟𝑡 𝑐𝑟𝑒𝑎𝑡𝑒𝑑:";
				break;
    case "cloud":
      apiUrl = `https://faheem-vip-010.faheem001.repl.co/api/ephoto/cloud?text=${text}`;
      message = "𝐻𝑒𝑟𝑒'𝑠 𝑡ℎ𝑒 [𝐶𝐿𝑂𝑈𝐷] 𝑡𝑒𝑥𝑡 𝑎𝑟𝑡 𝑐𝑟𝑒𝑎𝑡𝑒𝑑:";
        break;
    case "pig":
      apiUrl = `https://faheem-vip-010.faheem001.repl.co/api/ephoto/pig?text=${text}`;
      message = "𝐻𝑒𝑟𝑒'𝑠 𝑡ℎ𝑒 [𝑃𝐼𝐺] 𝑡𝑒𝑥𝑡 𝑎𝑟𝑡 𝑐𝑟𝑒𝑎𝑡𝑒𝑑:";
				break;
    case "caper":
      apiUrl = `https://faheem-vip-010.faheem001.repl.co/api/ephoto/caper?text=${text}`;
      message = "𝐻𝑒𝑟𝑒'𝑠 𝑡ℎ𝑒 [𝐶𝐴𝑃𝐸𝑅] 𝑡𝑒𝑥𝑡 𝑎𝑟𝑡 𝑐𝑟𝑒𝑎𝑡𝑒𝑑:";
				 break;
    case "horror":
      apiUrl = `https://faheem-vip-010.faheem001.repl.co/api/ephoto/horror?text=${text}`;
      message = "𝐻𝑒𝑟𝑒'𝑠 𝑡ℎ𝑒 [𝐻𝑂𝑅𝑅𝑂𝑅] 𝑡𝑒𝑥𝑡 𝑎𝑟𝑡 𝑐𝑟𝑒𝑎𝑡𝑒𝑑:";
         break;
    case "writestatus":
      apiUrl = `https://faheem-vip-010.faheem001.repl.co/api/ephoto/writestatus?text=${text}&text2=Your%20Quotes%20In%20Herm`;
      message = "𝐻𝑒𝑟𝑒'𝑠 𝑡ℎ𝑒 [𝑊𝑅𝐼𝑇𝐸𝑆𝑇𝐴𝑇𝑈𝑆] 𝑡𝑒𝑥𝑡 𝑎𝑟𝑡 𝑐𝑟𝑒𝑎𝑡𝑒𝑑:";
				 break;
    case "teamlogo":
      apiUrl = `https://faheem-vip-010.faheem001.repl.co/api/ephoto/teamlogo?text=${text}`;
      message = "𝐻𝑒𝑟𝑒'𝑠 𝑡ℎ𝑒 [𝑇𝐸𝐴𝑀𝐿𝑂𝐺𝑂] 𝑡𝑒𝑥𝑡 𝑎𝑟𝑡 𝑐𝑟𝑒𝑎𝑡𝑒𝑑:";
         break;
    case "beach":
      apiUrl = `https://faheem-vip-010.faheem001.repl.co/api/ephoto/beach?text=${text}`;
      message = "𝐻𝑒𝑟𝑒'𝑠 𝑡ℎ𝑒 [𝐵𝐸𝐴𝐶𝐻] 𝑡𝑒𝑥𝑡 𝑎𝑟𝑡 𝑐𝑟𝑒𝑎𝑡𝑒𝑑:";
         break;
    case "queen":
      apiUrl = `https://faheem-vip-010.faheem001.repl.co/api/ephoto/queen?text=${text}`;
      message = "𝐻𝑒𝑟𝑒'𝑠 𝑡ℎ𝑒 [𝑄𝑈𝐸𝐸𝑁] 𝑡𝑒𝑥𝑡 𝑎𝑟𝑡 𝑐𝑟𝑒𝑎𝑡𝑒𝑑:";
				 break;
    case "fbc3":
      apiUrl = `https://faheem-vip-010.faheem001.repl.co/api/ephoto/facebookcover3?text=${text}`;
      message = "𝐻𝑒𝑟𝑒'𝑠 𝑡ℎ𝑒 [𝐹𝐵𝐶3] 𝑡𝑒𝑥𝑡 𝑎𝑟𝑡 𝑐𝑟𝑒𝑎𝑡𝑒𝑑:";
				 break;
    case "tatto":
      apiUrl = `https://faheem-vip-010.faheem001.repl.co/api/ephoto/tatto?text=${text}`;
      message = "𝐻𝑒𝑟𝑒'𝑠 𝑡ℎ𝑒 [𝑇𝐴𝑇𝑇𝑂] 𝑡𝑒𝑥𝑡 𝑎𝑟𝑡 𝑐𝑟𝑒𝑎𝑡𝑒𝑑:";
         break;
    case "shirt3":
      apiUrl = `https://faheem-vip-010.faheem001.repl.co/api/ephoto/shirt3?text=${text}&text2=20`;
      message = "𝐻𝑒𝑟𝑒'𝑠 𝑡ℎ𝑒 [𝑆𝐻𝐼𝑅𝑇3] 𝑡𝑒𝑥𝑡 𝑎𝑟𝑡 𝑐𝑟𝑒𝑎𝑡𝑒𝑑:";
         break;
    case "oceansea":
      apiUrl = `https://faheem-vip-010.faheem001.repl.co/api/photooxy/oceansea?text=${text}`;
      message = "𝐻𝑒𝑟𝑒'𝑠 𝑡ℎ𝑒 [𝑆𝐸𝐴] 𝑡𝑒𝑥𝑡 𝑎𝑟𝑡 𝑐𝑟𝑒𝑎𝑡𝑒𝑑:";
				 break;
    case "shirt4":
      apiUrl = `https://faheem-vip-010.faheem001.repl.co/api/ephoto/shirt4?text=${text}&text2=20`;
      message = "𝐻𝑒𝑟𝑒'𝑠 𝑡ℎ𝑒 [𝑆𝐻𝐼𝑅𝑇4] 𝑡𝑒𝑥𝑡 𝑎𝑟𝑡 𝑐𝑟𝑒𝑎𝑡𝑒𝑑:";
				 break;
    case "shirt5":
      apiUrl = `https://faheem-vip-010.faheem001.repl.co/api/ephoto/shirt5?text=${text}&text2=20`;
      message = "𝐻𝑒𝑟𝑒'𝑠 𝑡ℎ𝑒 [𝑆𝐻𝐼𝑅𝑇5] 𝑡𝑒𝑥𝑡 𝑎𝑟𝑡 𝑐𝑟𝑒𝑎𝑡𝑒𝑑:";
				 break;
    case "shirt6":
      apiUrl = `https://faheem-vip-010.faheem001.repl.co/api/ephoto/shirt6?text=${text}&text2=20`;
      message = "𝐻𝑒𝑟𝑒'𝑠 𝑡ℎ𝑒 [𝑆𝐻𝐼𝑅𝑇6] 𝑡𝑒𝑥𝑡 𝑎𝑟𝑡 𝑐𝑟𝑒𝑎𝑡𝑒𝑑:";
				 break;
    case "lovemsg":
      apiUrl = `https://faheem-vip-010.faheem001.repl.co/api/photooxy/lovemessage?text=${text}`;
      message = "𝐻𝑒𝑟𝑒'𝑠 𝑡ℎ𝑒 [𝐿𝑂𝑉𝐸𝑀𝑆𝐺] 𝑡𝑒𝑥𝑡 𝑎𝑟𝑡 𝑐𝑟𝑒𝑎𝑡𝑒𝑑:";
				 break;
    case "chstm":
      apiUrl = `https://faheem-vip-010.faheem001.repl.co/api/ephoto/Chirstmasvideo?text=${text}&type=video/mp4`;
      message = "𝐻𝑒𝑟𝑒'𝑠 𝑡ℎ𝑒 [𝐶𝐻𝐼𝑅𝑇𝑀𝐴𝑆] 𝑡𝑒𝑥𝑡 𝑎𝑟𝑡 𝑐𝑟𝑒𝑎𝑡𝑒𝑑:";
				 break;
    case "christmas2":
      apiUrl = `https://faheem-vip-010.faheem001.repl.co/api/ephoto/Christmas2?text=${text}`;
      message = "𝐻𝑒𝑟𝑒'𝑠 𝑡ℎ𝑒 [𝐶𝐻𝑅𝐼𝑆𝑇𝑀𝐴𝑆] 𝑡𝑒𝑥𝑡 𝑎𝑟𝑡 �𝑐𝑟𝑒𝑎𝑡𝑒𝑑:";
				 break;
    case "icetext":
      apiUrl = `https://faheem-vip-010.faheem001.repl.co/api/ephoto/icetext?url=https://i.imgur.com/BTPUTRQ.jpg&text=${text}`;
      message = "𝐻𝑒𝑟𝑒'𝑠 𝑡ℎ𝑒 [𝐼𝐶𝐸𝑇𝐸𝑋𝑇] 𝑡𝑒𝑥𝑡 𝑎𝑟𝑡 𝑐𝑟𝑒𝑎𝑡𝑒𝑑:";
        break;
    case "butterfly":
      apiUrl = `https://faheem-vip-010.faheem001.repl.co/api/photooxy/butterfly?text=${text}`;
      message = "𝐻𝑒𝑟𝑒'𝑠 𝑡ℎ𝑒 [𝐵𝑈𝑇𝑇𝐸𝑅𝐹𝐿𝑌 🦋] 𝑡𝑒𝑥𝑡 𝑎𝑟𝑡 𝑐𝑟𝑒𝑎𝑡𝑒𝑑:";
				break;
    case "coffe":
      apiUrl = `https://faheem-vip-010.faheem001.repl.co/api/photooxy/coffecup?text=${text}`;
      message = "𝐻𝑒𝑟𝑒'𝑠 𝑡ℎ𝑒 [𝐶𝑂𝐹𝐹𝐸𝐸] 𝑡𝑒𝑥𝑡 𝑎𝑟𝑡 𝑐𝑟𝑒𝑎𝑡𝑒𝑑:";
				 break;
    case "love":
      apiUrl = `https://faheem-vip-010.faheem001.repl.co/api/ephoto/lovetext?text=${text}`;
      message = "𝐻𝑒𝑟𝑒'𝑠 𝑡ℎ𝑒 [𝐿𝑂𝑉𝐸𝑇𝐸𝑋𝑇] 𝑡𝑒𝑥𝑡 𝑎𝑟𝑡 𝑐𝑟𝑒𝑎𝑡𝑒𝑑:";
				 break;
    case "intro2":
      apiUrl = `https://faheem-vip-010.faheem001.repl.co/api/ephoto/intro2?text=${text}&type=video/mp4`;
      message = "𝐻𝑒𝑟𝑒'𝑠 𝑡ℎ𝑒 [𝐴𝑉𝐴𝑇𝐸𝑅] 𝑡𝑒𝑥𝑡 𝑎𝑟𝑡 𝑐𝑟𝑒𝑎𝑡𝑒𝑑:";
        break;
      default:
        return api.sendMessage(
          `•°•°•°•°•°•°۩۞۩°•°•°•°•°•°•\n\n𝐼𝑛𝑣𝑎𝑙𝑖𝑑 𝑡𝑒𝑥𝑡 𝑎𝑟𝑡 𝑠𝑡𝑦𝑙𝑒! 𝑈𝑠𝑒 "𝑙𝑖𝑠𝑡 1" 𝑡𝑜 𝑠𝑒𝑒 𝑡ℎ𝑒 𝑙𝑖𝑠𝑡 𝑜𝑓 𝑎𝑣𝑎𝑖𝑙𝑎𝑏𝑙𝑒 𝑠𝑡𝑦𝑙𝑒𝑠.\n\n•°•°•°•°•°•°۩۞۩°•°•°•°•°•°•`,
          threadID,
          messageID
        );
    }

    try {
      let response = await axios.get(apiUrl, { responseType: "arraybuffer" });
      fs.writeFileSync(pathImg, Buffer.from(response.data, "binary"));

      return api.sendMessage(
        {
          attachment: fs.createReadStream(pathImg),
          body: message
        },
        threadID,
        () => fs.unlinkSync(pathImg)
      );
    } catch (err) {
      console.error(err);
      return api.sendMessage(
        `╔════ஜ۩۞۩ஜ═══╗\n\n𝐴𝑛 𝑒𝑟𝑟𝑜𝑟 𝑜𝑐𝑐𝑢𝑟𝑟𝑒𝑑 𝑤ℎ𝑖𝑙𝑒 𝑔𝑒𝑛𝑒𝑟𝑎𝑡𝑖𝑛𝑔 𝑡ℎ𝑒 𝑡𝑒𝑥𝑡 𝑎𝑟𝑡. 𝑃𝑙𝑒𝑎𝑠𝑒 𝑡𝑟𝑦 𝑎𝑔𝑎𝑖𝑛 𝑙𝑎𝑡𝑒𝑟.\n\n╚════ஜ۩۞۩ஜ═══╝`,
        threadID,
        messageID
      );
    }
  },
};
