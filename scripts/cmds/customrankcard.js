const { createCanvas, loadImage } = require('canvas');
const fs = require("fs-extra");
const path = require("path");
const axios = require("axios");

module.exports = {
  config: {
    name: "customrankcard",
    aliases: [],
    version: "1.12",
    author: "𝐴𝑠𝑖𝑓 𝑀𝑎ℎ𝑚𝑢𝑑",
    countDown: 5,
    role: 0,
    shortDescription: {
      en: "✨ 𝖣𝖾𝗌𝗂𝗀𝗇 𝗒𝗈𝗎𝗋 𝗈𝗐𝗇 𝗌𝗍𝗒𝗅𝗂𝗌𝗁 𝗋𝖺𝗇𝗄 𝖼𝖺𝗋𝖽 𝗐𝗂𝗍𝗁 𝖼𝗎𝗌𝗍𝗈𝗆 𝖼𝗈𝗅𝗈𝗋𝗌 𝖺𝗇𝖽 𝖻𝖺𝖼𝗄𝗀𝗋𝗈𝗎𝗇𝖽𝗌"
    },
    longDescription: {
      en: "✨ 𝖣𝖾𝗌𝗂𝗀𝗇 𝗒𝗈𝗎𝗋 𝗈𝗐𝗇 𝗌𝗍𝗒𝗅𝗂𝗌𝗁 𝗋𝖺𝗇𝗄 𝖼𝖺𝗋𝖽 𝗐𝗂𝗍𝗁 𝖼𝗎𝗌𝗍𝗈𝗆 𝖼𝗈𝗅𝗈𝗋𝗌 𝖺𝗇𝖽 𝖻𝖺𝖼𝗄𝗀𝗋𝗈𝗎𝗇𝖽𝗌"
    },
    category: "rank",
    guide: {
      en: "{p}customrankcard [𝗈𝗉𝗍𝗂𝗈𝗇] [𝗏𝖺𝗅𝗎𝖾]"
    },
    dependencies: {
      "canvas": "",
      "fs-extra": "",
      "axios": ""
    }
  },

  onStart: async function({ message, event, args, usersData, threadsData }) {
    try {
      // Dependency check
      let dependenciesAvailable = true;
      try {
        require("canvas");
        require("fs-extra");
        require("axios");
      } catch (e) {
        dependenciesAvailable = false;
      }

      if (!dependenciesAvailable) {
        return message.reply("❌ 𝖬𝗂𝗌𝗌𝗂𝗇𝗀 𝖽𝖾𝗉𝖾𝗇𝖽𝖾𝗇𝖼𝗂𝖾𝗌. 𝖯𝗅𝖾𝖺𝗌𝖾 𝗂𝗇𝗌𝗍𝖺𝗅𝗅 𝖼𝖺𝗇𝗏𝖺𝗌, 𝖿𝗌-𝖾𝗑𝗍𝗋𝖺, 𝖺𝗇𝖽 𝖺𝗑𝗂𝗈𝗌.");
      }

      const threadID = event.threadID;
      const senderID = event.senderID;

      const reply = async (msg, attach) => {
        try {
          if (attach) {
            return await message.reply({ body: msg, attachment: attach });
          } else {
            return await message.reply(msg);
          }
        } catch (replyError) {
          console.error("❌ 𝖥𝖺𝗂𝗅𝖾𝖽 𝗍𝗈 𝗌𝖾𝗇𝖽 𝗋𝖾𝗉𝗅𝗒:", replyError.message);
        }
      };

      if (!args || !args[0]) {
        const guideMsg = 
          "🎨 𝖼𝗎𝗌𝗍𝗈𝗆𝗋𝖺𝗇𝗄𝖼𝖺𝗋𝖽 [𝗆𝖺𝗂𝗇𝖼𝗈𝗅𝗈𝗋 | 𝗌𝗎𝖻𝖼𝗈𝗅𝗈𝗋 | 𝗅𝗂𝗇𝖾𝖼𝗈𝗅𝗈𝗋 | 𝖾𝗑𝗉𝖻𝖺𝗋𝖼𝗈𝗅𝗈𝗋 | 𝗉𝗋𝗈𝗀𝗋𝖾𝗌𝗌𝖼𝗈𝗅𝗈𝗋 | 𝖺𝗅𝗉𝗁𝖺𝗌𝗎𝖻𝖼𝗈𝗅𝗈𝗋 | 𝗍𝖾𝗑𝗍𝖼𝗈𝗅𝗈𝗋 | 𝗇𝖺𝗆𝖾𝖼𝗈𝗅𝗈𝗋 | 𝖾𝗑𝗉𝖼𝗈𝗅𝗈𝗋 | 𝗋𝖺𝗇𝗄𝖼𝗈𝗅𝗈𝗋 | 𝗅𝖾𝗏𝖾𝗅𝖼𝗈𝗅𝗈𝗋 | 𝗋𝖾𝗌𝖾𝗍] <𝗏𝖺𝗅𝗎𝖾>\n\n" +
          "🌈 𝖠𝗏𝖺𝗂𝗅𝖺𝖻𝗅𝖾 𝗈𝗉𝗍𝗂𝗈𝗇𝗌:\n" +
          "  • 𝗆𝖺𝗂𝗇𝖼𝗈𝗅𝗈𝗋 | 𝖻𝖺𝖼𝗄𝗀𝗋𝗈𝗎𝗇𝖽 <𝗏𝖺𝗅𝗎𝖾> - 𝖬𝖺𝗂𝗇 𝖻𝖺𝖼𝗄𝗀𝗋𝗈𝗎𝗇𝖽 (𝗀𝗋𝖺𝖽𝗂𝖾𝗇𝗍/𝗂𝗆𝖺𝗀𝖾)\n" +
          "  • 𝗌𝗎𝖻𝖼𝗈𝗅𝗈𝗋 <𝗏𝖺𝗅𝗎𝖾> - 𝖲𝗎𝖻 𝖻𝖺𝖼𝗄𝗀𝗋𝗈𝗎𝗇𝖽\n" +
          "  • 𝗅𝗂𝗇𝖾𝖼𝗈𝗅𝗈𝗋 <𝗏𝖺𝗅𝗎𝖾> - 𝖫𝗂𝗇𝖾 𝖻𝖾𝗍𝗐𝖾𝖾𝗇 𝖻𝖺𝖼𝗄𝗀𝗋𝗈𝗎𝗇𝖽𝗌\n" +
          "  • 𝖾𝗑𝗉𝖻𝖺𝗋𝖼𝗈𝗅𝗈𝗋 <𝗏𝖺𝗅𝗎𝖾> - 𝖤𝗑𝗉𝖾𝗋𝗂𝖾𝗇𝖼𝖾 𝖻𝖺𝗋 𝖼𝗈𝗅𝗈𝗋\n" +
          "  • 𝗉𝗋𝗈𝗀𝗋𝖾𝗌𝗌𝖼𝗈𝗅𝗈𝗋 <𝗏𝖺𝗅𝗎𝖾> - 𝖢𝗎𝗋𝗋𝖾𝗇𝗍 𝗉𝗋𝗈𝗀𝗋𝖾𝗌𝗌 𝖼𝗈𝗅𝗈𝗋\n" +
          "  • 𝖺𝗅𝗉𝗁𝖺𝗌𝗎𝖻𝖼𝗈𝗅𝗈𝗋 <𝗏𝖺𝗅𝗎𝖾> - 𝖲𝗎𝖻 𝖻𝖺𝖼𝗄𝗀𝗋𝗈𝗎𝗇𝖽 𝗈𝗉𝖺𝖼𝗂𝗍𝗒 (0-1)\n" +
          "  • 𝗍𝖾𝗑𝗍𝖼𝗈𝗅𝗈𝗋 <𝗏𝖺𝗅𝗎𝖾> - 𝖳𝖾𝗑𝗍 𝖼𝗈𝗅𝗈𝗋\n" +
          "  • 𝗇𝖺𝗆𝖾𝖼𝗈𝗅𝗈𝗋 <𝗏𝖺𝗅𝗎𝖾> - 𝖭𝖺𝗆𝖾 𝖼𝗈𝗅𝗈𝗋\n" +
          "  • 𝖾𝗑𝗉𝖼𝗈𝗅𝗈𝗋 <𝗏𝖺𝗅𝗎𝖾> - 𝖤𝖷𝖯 𝗍𝖾𝗑𝗍 𝖼𝗈𝗅𝗈𝗋\n" +
          "  • 𝗋𝖺𝗇𝗄𝖼𝗈𝗅𝗈𝗋 <𝗏𝖺𝗅𝗎𝖾> - 𝖱𝖺𝗇𝗄 𝗍𝖾𝗑𝗍 𝖼𝗈𝗅𝗈𝗋\n" +
          "  • 𝗅𝖾𝗏𝖾𝗅𝖼𝗈𝗅𝗈𝗋 <𝗏𝖺𝗅𝗎𝖾> - 𝖫𝖾𝗏𝖾𝗅 𝗍𝖾𝗑𝗍 𝖼𝗈𝗅𝗈𝗋\n\n" +
          "💡 𝖵𝖺𝗅𝗎𝖾 𝖼𝖺𝗇 𝖻𝖾: 𝗁𝖾𝗑 𝖼𝗈𝖽𝖾, 𝗋𝗀𝖻, 𝗋𝗀𝖻𝖺, 𝗀𝗋𝖺𝖽𝗂𝖾𝗇𝗍 (𝗆𝗎𝗅𝗍𝗂𝗉𝗅𝖾 𝖼𝗈𝗅𝗈𝗋𝗌 𝗌𝖾𝗉𝖺𝗋𝖺𝗍𝖾𝖽 𝖻𝗒 𝗌𝗉𝖺𝖼𝖾), 𝗈𝗋 𝗂𝗆𝖺𝗀𝖾 𝖴𝖱𝖫\n" +
          "📸 𝖸𝗈𝗎 𝖼𝖺𝗇 𝖺𝗅𝗌𝗈 𝗌𝖾𝗇𝖽 𝖺𝗇 𝗂𝗆𝖺𝗀𝖾 𝖺𝗌 𝖺𝗍𝗍𝖺𝖼𝗁𝗆𝖾𝗇𝗍\n\n" +
          "🔄 𝖼𝗎𝗌𝗍𝗈𝗆𝗋𝖺𝗇𝗄𝖼𝖺𝗋𝖽 𝗋𝖾𝗌𝖾𝗍 - 𝖱𝖾𝗌𝖾𝗍 𝖺𝗅𝗅 𝗌𝖾𝗍𝗍𝗂𝗇𝗀𝗌 𝗍𝗈 𝖽𝖾𝖿𝖺𝗎𝗅𝗍";
        
        return reply(guideMsg);
      }

      let customRankCard = {};
      try {
        customRankCard = (await threadsData.get(threadID, "data.customRankCard")) || {};
      } catch (dataError) {
        console.error("❌ 𝖤𝗋𝗋𝗈𝗋 𝗀𝖾𝗍𝗍𝗂𝗇𝗀 𝗍𝗁𝗋𝖾𝖺𝖽 𝖽𝖺𝗍𝖺:", dataError);
        customRankCard = {};
      }

      const key = args[0].toLowerCase();
      let value = args.slice(1).join(" ").trim();

      const checkUrlRegex = /https?:\/\/.*\.(?:png|jpg|jpeg|gif|webp)/gi;
      const regExColor = /#([0-9a-f]{6})|rgb\((\d{1,3}),\s*(\d{1,3}),\s*(\d{1,3})\)|rgba\((\d{1,3}),\s*(\d{1,3}),\s*(\d{1,3}),\s*(\d+\.?\d*)\)/gi;

      const supportImage = ["maincolor", "background", "bg", "subcolor", "expbarcolor", "progresscolor", "linecolor"];
      const notSupportImage = ["textcolor", "namecolor", "expcolor", "rankcolor", "levelcolor", "lvcolor"];

      const attachments = [
        ...(event.attachments || []).filter(a => ["photo", "animated_image"].includes(a.type)),
        ...(event.messageReply?.attachments || []).filter(a => ["photo", "animated_image"].includes(a.type))
      ];

      if (value === 'reset' || key === 'reset') {
        try {
          await threadsData.set(threadID, { customRankCard: {} }, "data");
          return reply("🔄 𝖠𝗅𝗅 𝗋𝖺𝗇𝗄 𝖼𝖺𝗋𝖽 𝗌𝖾𝗍𝗍𝗂𝗇𝗀𝗌 𝗁𝖺𝗏𝖾 𝖻𝖾𝖾𝗇 𝗋𝖾𝗌𝖾𝗍 𝗍𝗈 𝖽𝖾𝖿𝖺𝗎𝗅𝗍");
        } catch (resetError) {
          console.error("❌ 𝖤𝗋𝗋𝗈𝗋 𝗋𝖾𝗌𝖾𝗍𝗍𝗂𝗇𝗀 𝖽𝖺𝗍𝖺:", resetError);
          return reply("❌ 𝖥𝖺𝗂𝗅𝖾𝖽 𝗍𝗈 𝗋𝖾𝗌𝖾𝗍 𝗌𝖾𝗍𝗍𝗂𝗇𝗀𝗌. 𝖯𝗅𝖾𝖺𝗌𝖾 𝗍𝗋𝗒 𝖺𝗀𝖺𝗂𝗇.");
        }
      }

      if ([...notSupportImage, ...supportImage].includes(key)) {
        if (value.match(/^https?:\/\//)) {
          const matchUrl = value.match(checkUrlRegex);
          if (!matchUrl) return reply("❌ 𝖨𝗇𝗏𝖺𝗅𝗂𝖽 𝗂𝗆𝖺𝗀𝖾 𝖴𝖱𝖫. 𝖯𝗅𝖾𝖺𝗌𝖾 𝗉𝗋𝗈𝗏𝗂𝖽𝖾 𝖺 𝖽𝗂𝗋𝖾𝖼𝗍 𝗂𝗆𝖺𝗀𝖾 𝗅𝗂𝗇𝗄 (𝗃𝗉𝗀, 𝗃𝗉𝖾𝗀, 𝗉𝗇𝗀, 𝗀𝗂𝖿, 𝗐𝖾𝖻𝗉).");
          value = matchUrl[0];
        } else if (attachments.length > 0) {
          if (!["photo", "animated_image"].includes(attachments[0].type))
            return reply("❌ 𝖯𝗅𝖾𝖺𝗌𝖾 𝖺𝗍𝗍𝖺𝖼𝗁 𝖺 𝗏𝖺𝗅𝗂𝖽 𝗂𝗆𝖺𝗀𝖾 𝖿𝗂𝗅𝖾");
          value = attachments[0].url;
        } else {
          const colors = value.match(regExColor);
          if (!colors) return reply("❌ 𝖨𝗇𝗏𝖺𝗅𝗂𝖽 𝖼𝗈𝗅𝗈𝗋 𝖼𝗈𝖽𝖾. 𝖯𝗅𝖾𝖺𝗌𝖾 𝗎𝗌𝖾 𝗁𝖾𝗑 (#𝖱𝖱𝖦𝖦𝖡𝖡) 𝗈𝗋 𝗋𝗀𝖻𝖺 𝖿𝗈𝗋𝗆𝖺𝗍");
          value = colors.length === 1 ? colors[0] : colors;
        }

        if (value !== "reset" && notSupportImage.includes(key) && String(value).startsWith?.("http")) {
          return reply(`❌ 𝖨𝗆𝖺𝗀𝖾 𝖴𝖱𝖫𝗌 𝖺𝗋𝖾 𝗇𝗈𝗍 𝗌𝗎𝗉𝗉𝗈𝗋𝗍𝖾𝖽 𝖿𝗈𝗋 "${key}" 𝗈𝗉𝗍𝗂𝗈𝗇`);
        }

        switch (key) {
          case "maincolor":
          case "background":
          case "bg":
            value === "reset" ? delete customRankCard.main_color : customRankCard.main_color = value;
            break;
          case "subcolor":
            value === "reset" ? delete customRankCard.sub_color : customRankCard.sub_color = value;
            break;
          case "linecolor":
            value === "reset" ? delete customRankCard.line_color : customRankCard.line_color = value;
            break;
          case "progresscolor":
            value === "reset" ? delete customRankCard.exp_color : customRankCard.exp_color = value;
            break;
          case "expbarcolor":
            value === "reset" ? delete customRankCard.expNextLevel_color : customRankCard.expNextLevel_color = value;
            break;
          case "textcolor":
            value === "reset" ? delete customRankCard.text_color : customRankCard.text_color = value;
            break;
          case "namecolor":
            value === "reset" ? delete customRankCard.name_color : customRankCard.name_color = value;
            break;
          case "rankcolor":
            value === "reset" ? delete customRankCard.rank_color : customRankCard.rank_color = value;
            break;
          case "levelcolor":
          case "lvcolor":
            value === "reset" ? delete customRankCard.level_color : customRankCard.level_color = value;
            break;
          case "expcolor":
            value === "reset" ? delete customRankCard.exp_text_color : customRankCard.exp_text_color = value;
            break;
        }

        try {
          await threadsData.set(threadID, { customRankCard }, "data");
        } catch (saveError) {
          console.error("❌ 𝖤𝗋𝗋𝗈𝗋 𝗌𝖺𝗏𝗂𝗇𝗀 𝖽𝖺𝗍𝖺:", saveError);
          return reply("❌ 𝖥𝖺𝗂𝗅𝖾𝖽 𝗍𝗈 𝗌𝖺𝗏𝖾 𝗌𝖾𝗍𝗍𝗂𝗇𝗀𝗌. 𝖯𝗅𝖾𝖺𝗌𝖾 𝗍𝗋𝗒 𝖺𝗀𝖺𝗂𝗇.");
        }
        
        let userData = {};
        try {
          userData = await usersData.get(senderID) || {};
        } catch (userError) {
          console.error("❌ 𝖤𝗋𝗋𝗈𝗋 𝗀𝖾𝗍𝗍𝗂𝗇𝗀 𝗎𝗌𝖾𝗋 𝖽𝖺𝗍𝖺:", userError);
        }

        let rankCardPreviewBuffer;
        try {
          rankCardPreviewBuffer = await generateRankCardPreview(userData, customRankCard);
        } catch (previewError) {
          console.error("❌ 𝖤𝗋𝗋𝗈𝗋 𝗀𝖾𝗇𝖾𝗋𝖺𝗍𝗂𝗇𝗀 𝗉𝗋𝖾𝗏𝗂𝖾𝗐:", previewError);
          return reply("❌ 𝖥𝖺𝗂𝗅𝖾𝖽 𝗍𝗈 𝗀𝖾𝗇𝖾𝗋𝖺𝗍𝖾 𝗉𝗋𝖾𝗏𝗂𝖾𝗐. 𝖯𝗅𝖾𝖺𝗌𝖾 𝗍𝗋𝗒 𝖺𝗀𝖺𝗂𝗇 𝗐𝗂𝗍𝗁 𝖽𝗂𝖿𝖿𝖾𝗋𝖾𝗇𝗍 𝗌𝖾𝗍𝗍𝗂𝗇𝗀𝗌.");
        }

        const cacheDir = path.join(__dirname, 'cache');
        try {
          fs.ensureDirSync(cacheDir);
        } catch (dirError) {
          console.error("❌ 𝖤𝗋𝗋𝗈𝗋 𝖼𝗋𝖾𝖺𝗍𝗂𝗇𝗀 𝖼𝖺𝖼𝗁𝖾 𝖽𝗂𝗋:", dirError);
          return reply("❌ 𝖥𝖺𝗂𝗅𝖾𝖽 𝗍𝗈 𝖼𝗋𝖾𝖺𝗍𝖾 𝖼𝖺𝖼𝗁𝖾 𝖽𝗂𝗋𝖾𝖼𝗍𝗈𝗋𝗒.");
        }

        const tmpPath = path.join(cacheDir, `crc_preview_${senderID}_${Date.now()}.png`);
        try {
          fs.writeFileSync(tmpPath, rankCardPreviewBuffer);
        } catch (writeError) {
          console.error("❌ 𝖤𝗋𝗋𝗈𝗋 𝗐𝗋𝗂𝗍𝗂𝗇𝗀 𝗍𝖾𝗆𝗉𝗈𝗋𝖺𝗋𝗒 𝖿𝗂𝗅𝖾:", writeError);
          return reply("❌ 𝖥𝖺𝗂𝗅𝖾𝖽 𝗍𝗈 𝗌𝖺𝗏𝖾 𝗉𝗋𝖾𝗏𝗂𝖾𝗐 𝗂𝗆𝖺𝗀𝖾.");
        }

        await reply("✅ 𝖸𝗈𝗎𝗋 𝖼𝗎𝗌𝗍𝗈𝗆 𝗋𝖺𝗇𝗄 𝖼𝖺𝗋𝖽 𝗌𝖾𝗍𝗍𝗂𝗇𝗀𝗌 𝗁𝖺𝗏𝖾 𝖻𝖾𝖾𝗇 𝗌𝖺𝗏𝖾𝖽!\n\n🎉 𝖯𝗋𝖾𝗏𝗂𝖾𝗐:", fs.createReadStream(tmpPath));
        
        setTimeout(() => {
          try { 
            if (fs.existsSync(tmpPath)) {
              fs.unlinkSync(tmpPath);
            }
          } catch (cleanupError) {
            console.warn("❌ 𝖢𝗈𝗎𝗅𝖽 𝗇𝗈𝗍 𝖼𝗅𝖾𝖺𝗇 𝗎𝗉 𝗍𝖾𝗆𝗉 𝖿𝗂𝗅𝖾:", cleanupError.message);
          }
        }, 15000);

      } else if (["alphasubcolor", "alphasubcard"].includes(key)) {
        const alphaValue = parseFloat(value);
        if (isNaN(alphaValue) || alphaValue < 0 || alphaValue > 1)
          return reply("❌ 𝖯𝗅𝖾𝖺𝗌𝖾 𝖼𝗁𝗈𝗈𝗌𝖾 𝖺𝗇 𝗈𝗉𝖺𝖼𝗂𝗍𝗒 𝗏𝖺𝗅𝗎𝖾 𝖻𝖾𝗍𝗐𝖾𝖾𝗇 0 𝖺𝗇𝖽 1");
        customRankCard.alpha_subcard = alphaValue;
        
        try {
          await threadsData.set(threadID, { customRankCard }, "data");
        } catch (saveError) {
          console.error("❌ 𝖤𝗋𝗋𝗈𝗋 𝗌𝖺𝗏𝗂𝗇𝗀 𝖽𝖺𝗍𝖺:", saveError);
          return reply("❌ 𝖥𝖺𝗂𝗅𝖾𝖽 𝗍𝗈 𝗌𝖺𝗏𝖾 𝗌𝖾𝗍𝗍𝗂𝗇𝗀𝗌. 𝖯𝗅𝖾𝖺𝗌𝖾 𝗍𝗋𝗒 𝖺𝗀𝖺𝗂𝗇.");
        }

        let userData = {};
        try {
          userData = await usersData.get(senderID) || {};
        } catch (userError) {
          console.error("❌ 𝖤𝗋𝗋𝗈𝗋 𝗀𝖾𝗍𝗍𝗂𝗇𝗀 𝗎𝗌𝖾𝗋 𝖽𝖺𝗍𝖺:", userError);
        }

        let rankCardPreviewBuffer;
        try {
          rankCardPreviewBuffer = await generateRankCardPreview(userData, customRankCard);
        } catch (previewError) {
          console.error("❌ 𝖤𝗋𝗋𝗈𝗋 𝗀𝖾𝗇𝖾𝗋𝖺𝗍𝗂𝗇𝗀 𝗉𝗋𝖾𝗏𝗂𝖾𝗐:", previewError);
          return reply("❌ 𝖥𝖺𝗂𝗅𝖾𝖽 𝗍𝗈 𝗀𝖾𝗇𝖾𝗋𝖺𝗍𝖾 𝗉𝗋𝖾𝗏𝗂𝖾𝗐. 𝖯𝗅𝖾𝖺𝗌𝖾 𝗍𝗋𝗒 𝖺𝗀𝖺𝗂𝗇 𝗐𝗂𝗍𝗁 𝖽𝗂𝖿𝖿𝖾𝗋𝖾𝗇𝗍 𝗌𝖾𝗍𝗍𝗂𝗇𝗀𝗌.");
        }

        const cacheDir = path.join(__dirname, 'cache');
        try {
          fs.ensureDirSync(cacheDir);
        } catch (dirError) {
          console.error("❌ 𝖤𝗋𝗋𝗈𝗋 𝖼𝗋𝖾𝖺𝗍𝗂𝗇𝗀 𝖼𝖺𝖼𝗁𝖾 𝖽𝗂𝗋:", dirError);
          return reply("❌ 𝖥𝖺𝗂𝗅𝖾𝖽 𝗍𝗈 𝖼𝗋𝖾𝖺𝗍𝖾 𝖼𝖺𝖼𝗁𝖾 𝖽𝗂𝗋𝖾𝖼𝗍𝗈𝗋𝗒.");
        }

        const tmpPath = path.join(cacheDir, `crc_preview_${senderID}_${Date.now()}.png`);
        try {
          fs.writeFileSync(tmpPath, rankCardPreviewBuffer);
        } catch (writeError) {
          console.error("❌ 𝖤𝗋𝗋𝗈𝗋 𝗐𝗋𝗂𝗍𝗂𝗇𝗀 𝗍𝖾𝗆𝗉𝗈𝗋𝖺𝗋𝗒 𝖿𝗂𝗅𝖾:", writeError);
          return reply("❌ 𝖥𝖺𝗂𝗅𝖾𝖽 𝗍𝗈 𝗌𝖺𝗏𝖾 𝗉𝗋𝖾𝗏𝗂𝖾𝗐 𝗂𝗆𝖺𝗀𝖾.");
        }

        await reply("✅ 𝖸𝗈𝗎𝗋 𝖼𝗎𝗌𝗍𝗈𝗆 𝗋𝖺𝗇𝗄 𝖼𝖺𝗋𝖽 𝗌𝖾𝗍𝗍𝗂𝗇𝗀𝗌 𝗁𝖺𝗏𝖾 𝖻𝖾𝖾𝗇 𝗌𝖺𝗏𝖾𝖽!\n\n🎉 𝖯𝗋𝖾𝗏𝗂𝖾𝗐:", fs.createReadStream(tmpPath));
        
        setTimeout(() => {
          try { 
            if (fs.existsSync(tmpPath)) {
              fs.unlinkSync(tmpPath);
            }
          } catch (cleanupError) {
            console.warn("❌ 𝖢𝗈𝗎𝗅𝖽 𝗇𝗈𝗍 𝖼𝗅𝖾𝖺𝗇 𝗎𝗉 𝗍𝖾𝗆𝗉 𝖿𝗂𝗅𝖾:", cleanupError.message);
          }
        }, 15000);

      } else {
        return reply("⚠️ 𝖴𝗇𝗄𝗇𝗈𝗐𝗇 𝗈𝗉𝗍𝗂𝗈𝗇. 𝖴𝗌𝖾 `𝖼𝗎𝗌𝗍𝗈𝗆𝗋𝖺𝗇𝗄𝖼𝖺𝗋𝖽` 𝗍𝗈 𝗌𝖾𝖾 𝖺𝗏𝖺𝗂𝗅𝖺𝖻𝗅𝖾 𝗈𝗉𝗍𝗂𝗈𝗇𝗌.");
      }
    } catch (err) {
      console.error("💥 𝖢𝗎𝗌𝗍𝗈𝗆𝖱𝖺𝗇𝗄𝖢𝖺𝗋𝖽 𝖾𝗋𝗋𝗈𝗋:", err);
      // Don't send error message to avoid spam
    }
  }
};

async function generateRankCardPreview(userData = {}, customRankCard = {}) {
  const canvas = createCanvas(800, 300);
  const ctx = canvas.getContext('2d');

  try {
    if (customRankCard.main_color) {
      if (Array.isArray(customRankCard.main_color)) {
        const gradient = ctx.createLinearGradient(0, 0, canvas.width, canvas.height);
        customRankCard.main_color.forEach((color, i) => {
          gradient.addColorStop(i / (customRankCard.main_color.length - 1), color);
        });
        ctx.fillStyle = gradient;
        ctx.fillRect(0, 0, canvas.width, canvas.height);
      } else if (String(customRankCard.main_color).startsWith('http')) {
        try {
          const img = await loadImage(customRankCard.main_color);
          ctx.drawImage(img, 0, 0, canvas.width, canvas.height);
        } catch (e) {
          ctx.fillStyle = '#36393f';
          ctx.fillRect(0, 0, canvas.width, canvas.height);
        }
      } else {
        ctx.fillStyle = customRankCard.main_color;
        ctx.fillRect(0, 0, canvas.width, canvas.height);
      }
    } else {
      ctx.fillStyle = '#36393f';
      ctx.fillRect(0, 0, canvas.width, canvas.height);
    }

    const alpha = typeof customRankCard.alpha_subcard === 'number' ? customRankCard.alpha_subcard : 0.5;
    const subColor = customRankCard.sub_color ? adjustAlpha(customRankCard.sub_color, alpha) : `rgba(0, 0, 0, ${alpha})`;
    ctx.fillStyle = subColor;
    ctx.fillRect(20, 20, canvas.width - 40, canvas.height - 40);

    if (customRankCard.line_color) {
      ctx.strokeStyle = customRankCard.line_color;
      ctx.lineWidth = 2;
      ctx.beginPath();
      ctx.moveTo(20, 60);
      ctx.lineTo(canvas.width - 20, 60);
      ctx.stroke();
    }

    ctx.fillStyle = customRankCard.name_color || '#ffffff';
    ctx.font = 'bold 28px Arial';
    const displayName = userData.name || '𝖴𝗌𝖾𝗋';
    ctx.fillText(displayName, 150, 80);

    ctx.fillStyle = customRankCard.level_color || '#f1c40f';
    ctx.font = '20px Arial';
    ctx.fillText('𝖫𝖾𝗏𝖾𝗅: 25', 150, 120);

    ctx.fillStyle = customRankCard.rank_color || '#e74c3c';
    ctx.fillText('𝖱𝖺𝗇𝗄: #15', 300, 120);

    ctx.fillStyle = customRankCard.expNextLevel_color || '#2c3e50';
    ctx.fillRect(150, 160, 500, 20);

    ctx.fillStyle = customRankCard.exp_color || '#3498db';
    ctx.fillRect(150, 160, 350, 20);

    ctx.fillStyle = customRankCard.exp_text_color || '#ecf0f1';
    ctx.font = '16px Arial';
    ctx.fillText('3500/5000 𝖷𝖯', 150, 200);

    ctx.save();
    ctx.beginPath();
    ctx.arc(80, 150, 60, 0, Math.PI * 2);
    ctx.closePath();
    ctx.clip();
    
    if (userData.avatar) {
      try {
        const av = await loadImage(userData.avatar);
        ctx.drawImage(av, 20, 90, 120, 120);
      } catch (e) {
        ctx.fillStyle = '#7f8c8d';
        ctx.fillRect(20, 90, 120, 120);
      }
    } else {
      ctx.fillStyle = '#7f8c8d';
      ctx.fillRect(20, 90, 120, 120);
    }
    ctx.restore();

    return canvas.toBuffer();
  } catch (error) {
    console.error("❌ 𝖤𝗋𝗋𝗈𝗋 𝗀𝖾𝗇𝖾𝗋𝖺𝗍𝗂𝗇𝗀 𝗋𝖺𝗇𝗄 𝖼𝖺𝗋𝖽:", error);
    throw error;
  }
}

function adjustAlpha(color, alpha) {
  try {
    if (String(color).startsWith('#')) {
      const hex = color.replace('#', '');
      const r = parseInt(hex.slice(0, 2), 16);
      const g = parseInt(hex.slice(2, 4), 16);
      const b = parseInt(hex.slice(4, 6), 16);
      return `rgba(${r}, ${g}, ${b}, ${alpha})`;
    } else if (String(color).startsWith('rgb')) {
      const match = color.match(/(\d+),\s*(\d+),\s*(\d+)(,\s*[\d.]+)?/);
      if (match) {
        return `rgba(${match[1]}, ${match[2]}, ${match[3]}, ${alpha})`;
      }
    }
  } catch (e) {
    console.warn("❌ 𝖤𝗋𝗋𝗈𝗋 𝖺𝖽𝗃𝗎𝗌𝗍𝗂𝗇𝗀 𝖺𝗅𝗉𝗁𝖺:", e.message);
  }
  return color;
}
