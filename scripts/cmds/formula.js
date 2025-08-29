module.exports = {
  config: {
    name: "formula",
    aliases: ["formulas", "mathformula", "physicsformula"],
    version: "2.0.0",
    author: "𝐴𝑠𝑖𝑓 𝑀𝑎ℎ𝑚𝑢𝑑",
    countDown: 5,
    role: 0,
    shortDescription: {
      en: "𝑀𝑎𝑡ℎ𝑒𝑚𝑎𝑡𝑖𝑐𝑠 𝑎𝑛𝑑 𝑃ℎ𝑦𝑠𝑖𝑐𝑠 𝑓𝑜𝑟𝑚𝑢𝑙𝑎𝑠 𝑐𝑜𝑙𝑙𝑒𝑐𝑡𝑖𝑜𝑛"
    },
    longDescription: {
      en: "𝐶𝑜𝑚𝑝𝑙𝑒𝑡𝑒 𝑐𝑜𝑙𝑙𝑒𝑐𝑡𝑖𝑜𝑛 𝑜𝑓 𝑚𝑎𝑡ℎ𝑒𝑚𝑎𝑡𝑖𝑐𝑠 𝑎𝑛𝑑 𝑝ℎ𝑦𝑠𝑖𝑐𝑠 𝑓𝑜𝑟𝑚𝑢𝑙𝑎𝑠"
    },
    category: "𝑠𝑡𝑢𝑑𝑦",
    guide: {
      en: "{𝑝}𝑓𝑜𝑟𝑚𝑢𝑙𝑎 𝑚𝑎𝑡ℎ/𝑝ℎ𝑦𝑠𝑖𝑐𝑠"
    }
  },

  onStart: async function ({ api, event, args, client }) {
    try {
      if (!args[0]) {
        return api.sendMessage(
          "𝑃𝑙𝑒𝑎𝑠𝑒 𝑠𝑝𝑒𝑐𝑖𝑓𝑦 𝑤ℎ𝑖𝑐ℎ 𝑠𝑢𝑏𝑗𝑒𝑐𝑡 𝑦𝑜𝑢 𝑤𝑎𝑛𝑡 𝑡𝑜 𝑠𝑒𝑒 𝑓𝑜𝑟𝑚𝑢𝑙𝑎𝑠 𝑓𝑜𝑟:\n" +
          "➝ {𝑝}𝑓𝑜𝑟𝑚𝑢𝑙𝑎 𝑚𝑎𝑡ℎ - 𝑉𝑖𝑒𝑤 𝑚𝑎𝑡ℎ𝑒𝑚𝑎𝑡𝑖𝑐𝑠 𝑓𝑜𝑟𝑚𝑢𝑙𝑎𝑠\n" +
          "➝ {𝑝}𝑓𝑜𝑟𝑚𝑢𝑙𝑎 𝑝ℎ𝑦𝑠𝑖𝑐𝑠 - 𝑉𝑖𝑒𝑤 𝑝ℎ𝑦𝑠𝑖𝑐𝑠 𝑓𝑜𝑟𝑚𝑢𝑙𝑎𝑠", 
          event.threadID, 
          event.messageID
        );
      }

      const subject = args[0].toLowerCase();
      
      switch(subject) {
        case "math":
        case "mathematics":
        case "maths": {
          return api.sendMessage(
            "🔢 === 𝑴𝑨𝑻𝑯𝑬𝑴𝑨𝑻𝑰𝑪𝑺 𝑭𝑶𝑹𝑴𝑼𝑳𝑨𝑺 ===" +
            "\n» 𝑃𝑙𝑒𝑎𝑠𝑒 𝑐ℎ𝑜𝑜𝑠𝑒 𝑎𝑛 𝑜𝑝𝑡𝑖𝑜𝑛 «" +
            "\n\n1. 𝐷𝑒𝑟𝑖𝑣𝑎𝑡𝑖𝑣𝑒𝑠" +
            "\n2. 𝐼𝑛𝑡𝑒𝑔𝑟𝑎𝑙𝑠" +
            "\n3. 𝐿𝑜𝑔𝑎𝑟𝑖𝑡ℎ𝑚𝑠" +
            "\n4. 𝐴𝑟𝑒𝑎" +
            "\n5. 𝑉𝑜𝑙𝑢𝑚𝑒" +
            "\n6. 𝑇𝑟𝑖𝑔𝑜𝑛𝑜𝑚𝑒𝑡𝑟𝑦" +
            "\n7. 𝐸𝑥𝑝𝑜𝑛𝑒𝑛𝑡𝑠" +
            "\n8. 𝐶𝑜𝑜𝑟𝑑𝑖𝑛𝑎𝑡𝑒𝑠" +
            "\n\n» 𝑅𝑒𝑝𝑙𝑦 𝑡𝑜 𝑡ℎ𝑖𝑠 𝑚𝑒𝑠𝑠𝑎𝑔𝑒 𝑤𝑖𝑡ℎ 𝑦𝑜𝑢𝑟 𝑐ℎ𝑜𝑖𝑐𝑒 «"
          , event.threadID, (error, info) => {
            client.handleReply.push({
              name: this.config.name,
              messageID: info.messageID,
              author: event.senderID,
              type: "math"
            });
          }, event.messageID);
        }

        case "physics":
        case "phys": {
          return api.sendMessage(
            "⚡ === 𝑷𝑯𝒀𝑺𝑰𝑪𝑺 𝑭𝑶𝑹𝑴𝑼𝑳𝑨𝑺 ===" +
            "\n» 𝑃𝑙𝑒𝑎𝑠𝑒 𝑐ℎ𝑜𝑜𝑠𝑒 𝑎 𝑔𝑟𝑎𝑑𝑒 𝑙𝑒𝑣𝑒𝑙 «" +
            "\n\n1. 𝐺𝑟𝑎𝑑𝑒 10" +
            "\n2. 𝐺𝑟𝑎𝑑𝑒 11" + 
            "\n3. 𝐺𝑟𝑎𝑑𝑒 12" +
            "\n\n» 𝑅𝑒𝑝𝑙𝑦 𝑡𝑜 𝑡ℎ𝑖𝑠 𝑚𝑒𝑠𝑠𝑎𝑔𝑒 𝑤𝑖𝑡ℎ 𝑦𝑜𝑢𝑟 𝑐ℎ𝑜𝑖𝑐𝑒 «"
          , event.threadID, (error, info) => {
            client.handleReply.push({
              name: this.config.name,
              messageID: info.messageID,
              author: event.senderID,
              type: "physics"
            });
          }, event.messageID);
        }

        default: {
          return api.sendMessage(
            "❌ 𝐼𝑛𝑣𝑎𝑙𝑖𝑑 𝑠𝑢𝑏𝑗𝑒𝑐𝑡! 𝑃𝑙𝑒𝑎𝑠𝑒 𝑐ℎ𝑜𝑜𝑠𝑒:\n" +
            "➝ 𝑚𝑎𝑡ℎ - 𝑀𝑎𝑡ℎ𝑒𝑚𝑎𝑡𝑖𝑐𝑠 𝑓𝑜𝑟𝑚𝑢𝑙𝑎𝑠\n" +
            "➝ 𝑝ℎ𝑦𝑠𝑖𝑐𝑠 - 𝑃ℎ𝑦𝑠𝑖𝑐𝑠 𝑓𝑜𝑟𝑚𝑢𝑙𝑎𝑠", 
            event.threadID, 
            event.messageID
          );
        }
      }
    } catch (error) {
      console.error("𝐸𝑟𝑟𝑜𝑟:", error);
      api.sendMessage("❌ 𝐴𝑛 𝑒𝑟𝑟𝑜𝑟 𝑜𝑐𝑐𝑢𝑟𝑟𝑒𝑑 𝑤ℎ𝑖𝑙𝑒 𝑒𝑥𝑒𝑐𝑢𝑡𝑖𝑛𝑔 𝑡ℎ𝑒 𝑐𝑜𝑚𝑚𝑎𝑛𝑑!", event.threadID, event.messageID);
    }
  },

  handleReply: async function({ api, event, handleReply, client }) {
    try {
      const request = global.nodemodule["request"];
      const { createWriteStream, createReadStream, unlinkSync } = global.nodemodule["fs-extra"];
      
      let link = "";
      let msg = "";
      let fileName = "";

      switch(handleReply.type) {
        case "math": {
          const mathFormulas = {
            "1": { link: "https://i.imgur.com/kQmVXlL.jpg", msg: "𝑑𝑒𝑟𝑖𝑣𝑎𝑡𝑖𝑣𝑒𝑠 𝑎𝑟𝑒 ℎ𝑒𝑟𝑒! 📈" },
            "2": { link: "https://i.imgur.com/2jyh72H.jpg", msg: "𝑖𝑛𝑡𝑒𝑔𝑟𝑎𝑙𝑠 𝑎𝑟𝑒 ℎ𝑒𝑟𝑒! ∫" },
            "3": { link: "https://i.imgur.com/WkxOvVZ.jpg", msg: "𝑙𝑜𝑔𝑎𝑟𝑖𝑡ℎ𝑚𝑠 𝑎𝑟𝑒 ℎ𝑒𝑟𝑒! 📊" },
            "4": { link: "https://i.imgur.com/AODxsFO.jpg", msg: "𝑎𝑟𝑒𝑎 𝑓𝑜𝑟𝑚𝑢𝑙𝑎𝑠 𝑎𝑟𝑒 ℎ𝑒𝑟𝑒! 📐" },
            "5": { link: "https://i.imgur.com/ubmnDFT.jpg", msg: "𝑣𝑜𝑙𝑢𝑚𝑒 𝑓𝑜𝑟𝑚𝑢𝑙𝑎𝑠 𝑎𝑟𝑒 ℎ𝑒𝑟𝑒! 🧊" },
            "6": { link: "https://i.imgur.com/Jypelyv.png", msg: "𝑡𝑟𝑖𝑔𝑜𝑛𝑜𝑚𝑒𝑡𝑟𝑦 𝑓𝑜𝑟𝑚𝑢𝑙𝑎𝑠 𝑎𝑟𝑒 ℎ𝑒𝑟𝑒! 🔺" },
            "7": { link: "https://i.imgur.com/rgXzcRO.jpg", msg: "𝑒𝑥𝑝𝑜𝑛𝑒𝑛𝑡𝑠 𝑎𝑟𝑒 ℎ𝑒𝑟𝑒! ⚡" },
            "8": { link: "https://i.imgur.com/PTPOLrx.jpg", msg: "𝑐𝑜𝑜𝑟𝑑𝑖𝑛𝑎𝑡𝑒𝑠 𝑎𝑟𝑒 ℎ𝑒𝑟𝑒! 🧭" }
          };

          const choice = event.body;
          const formula = mathFormulas[choice];
          
          if (!formula) {
            return api.sendMessage("❌ 𝐼𝑛𝑣𝑎𝑙𝑖𝑑 𝑐ℎ𝑜𝑖𝑐𝑒! 𝑃𝑙𝑒𝑎𝑠𝑒 𝑐ℎ𝑜𝑜𝑠𝑒 𝑏𝑒𝑡𝑤𝑒𝑒𝑛 1-8", event.threadID, event.messageID);
          }

          link = formula.link;
          msg = formula.msg;
          fileName = "math.jpg";
          break;
        }

        case "physics": {
          const physicsLevels = {
            "1": { type: "Grade 10", title: "=== 𝑷𝑯𝒀𝑺𝑰𝑪𝑺 𝑮𝑹𝑨𝑫𝑬 10 ===" },
            "2": { type: "Grade 11", title: "=== 𝑷𝑯𝒀𝑺𝑰𝑪𝑺 𝑮𝑹𝑨𝑫𝑬 11 ===" },
            "3": { type: "Grade 12", title: "=== 𝑷𝑯𝒀𝑺𝑰𝑪𝑺 𝑮𝑹𝑨𝑫𝑬 12 ===" }
          };

          const choice = event.body;
          const level = physicsLevels[choice];
          
          if (!level) {
            return api.sendMessage("❌ 𝐼𝑛𝑣𝑎𝑙𝑖𝑑 𝑐ℎ𝑜𝑖𝑐𝑒! 𝑃𝑙𝑒𝑎𝑠𝑒 𝑐ℎ𝑜𝑜𝑠𝑒 𝑏𝑒𝑡𝑤𝑒𝑒𝑛 1-3", event.threadID, event.messageID);
          }

          return api.sendMessage(
            level.title +
            "\n» 𝑃𝑙𝑒𝑎𝑠𝑒 𝑐ℎ𝑜𝑜𝑠𝑒 𝑎 𝑐ℎ𝑎𝑝𝑡𝑒𝑟 «" +
            "\n\n1. 𝐶ℎ𝑎𝑝𝑡𝑒𝑟 1" +
            "\n2. 𝐶ℎ𝑎𝑝𝑡𝑒𝑟 2" +
            "\n3. 𝐶ℎ𝑎𝑝𝑡𝑒𝑟 3" +
            "\n4. 𝐶ℎ𝑎𝑝𝑡𝑒𝑟 4" +
            "\n5. 𝐶ℎ𝑎𝑝𝑡𝑒𝑟 5" +
            "\n6. 𝐶ℎ𝑎𝑝𝑡𝑒𝑟 6" +
            "\n7. 𝐶ℎ𝑎𝑝𝑡𝑒𝑟 7" +
            "\n\n» 𝑅𝑒𝑝𝑙𝑦 𝑡𝑜 𝑡ℎ𝑖𝑠 𝑚𝑒𝑠𝑠𝑎𝑔𝑒 𝑤𝑖𝑡ℎ 𝑦𝑜𝑢𝑟 𝑐ℎ𝑜𝑖𝑐𝑒 «"
          , event.threadID, (error, info) => {
            client.handleReply.push({
              name: this.config.name,
              messageID: info.messageID,
              author: event.senderID,
              type: level.type
            });
          }, event.messageID);
        }

        case "Grade 10": {
          const formulas = {
            "1": { link: "https://i.imgur.com/vHFSC50.jpg", msg: "𝑘𝑖𝑛𝑒𝑚𝑎𝑡𝑖𝑐𝑠 𝑜𝑓 𝑝𝑜𝑖𝑛𝑡 𝑚𝑎𝑠𝑠! 🚀" },
            "2": { link: "https://i.imgur.com/XvLwGoz.jpg", msg: "𝑑𝑦𝑛𝑎𝑚𝑖𝑐𝑠 𝑜𝑓 𝑝𝑜𝑖𝑛𝑡 𝑚𝑎𝑠𝑠! ⚖️" },
            "3": { link: "", msg: "𝑏𝑎𝑙𝑎𝑛𝑐𝑒 𝑎𝑛𝑑 𝑚𝑜𝑡𝑖𝑜𝑛 𝑜𝑓 𝑟𝑖𝑔𝑖𝑑 𝑏𝑜𝑑𝑖𝑒𝑠! ⚖️" },
            "4": { link: "", msg: "𝑐𝑜𝑛𝑠𝑒𝑟𝑣𝑎𝑡𝑖𝑜𝑛 𝑙𝑎𝑤𝑠! 🔄" },
            "5": { link: "", msg: "𝑔𝑎𝑠𝑒𝑠! 💨" },
            "6": { link: "", msg: "𝑏𝑎𝑠𝑖𝑐𝑠 𝑜𝑓 𝑡ℎ𝑒𝑟𝑚𝑜𝑑𝑦𝑛𝑎𝑚𝑖𝑐𝑠! 🔥" },
            "7": { link: "", msg: "𝑠𝑜𝑙𝑖𝑑𝑠 𝑎𝑛𝑑 𝑙𝑖𝑞𝑢𝑖𝑑𝑠. 𝑃ℎ𝑎𝑠𝑒 𝑡𝑟𝑎𝑛𝑠𝑖𝑡𝑖𝑜𝑛𝑠! 💧" }
          };

          const choice = event.body;
          const formula = formulas[choice];
          
          if (!formula) {
            return api.sendMessage("❌ 𝐼𝑛𝑣𝑎𝑙𝑖𝑑 𝑐ℎ𝑜𝑖𝑐𝑒! 𝑃𝑙𝑒𝑎𝑠𝑒 𝑐ℎ𝑜𝑜𝑠𝑒 𝑏𝑒𝑡𝑤𝑒𝑒𝑛 1-7", event.threadID, event.messageID);
          }

          link = formula.link;
          msg = formula.msg;
          fileName = "physics.jpg";
          break;
        }

        case "Grade 11": {
          const formulas = {
            "1": { link: "https://i.imgur.com/S6lSsum.jpg", msg: "𝑒𝑙𝑒𝑐𝑡𝑟𝑖𝑐 𝑐ℎ𝑎𝑟𝑔𝑒 𝑎𝑛𝑑 𝑒𝑙𝑒𝑐𝑡𝑟𝑖𝑐 𝑓𝑖𝑒𝑙𝑑! ⚡" },
            "2": { link: "https://i.imgur.com/vgrUOSd.jpg", msg: "𝑑𝑖𝑟𝑒𝑐𝑡 𝑐𝑢𝑟𝑟𝑒𝑛𝑡! 🔌" },
            "3": { link: "", msg: "𝑐𝑢𝑟𝑟𝑒𝑛𝑡 𝑖𝑛 𝑑𝑖𝑓𝑓𝑒𝑟𝑒𝑛𝑡 𝑚𝑒𝑑𝑖𝑎! 🔋" },
            "4": { link: "", msg: "𝑚𝑎𝑔𝑛𝑒𝑡𝑖𝑐 𝑓𝑖𝑒𝑙𝑑! 🧲" },
            "5": { link: "", msg: "𝑒𝑙𝑒𝑐𝑡𝑟𝑜𝑚𝑎𝑔𝑛𝑒𝑡𝑖𝑐 𝑖𝑛𝑑𝑢𝑐𝑡𝑖𝑜𝑛! 🔁" },
            "6": { link: "", msg: "𝑙𝑖𝑔ℎ𝑡 𝑟𝑒𝑓𝑟𝑎𝑐𝑡𝑖𝑜𝑛! 🌈" },
            "7": { link: "", msg: "𝑜𝑝𝑡𝑖𝑐𝑎𝑙 𝑖𝑛𝑠𝑡𝑟𝑢𝑚𝑒𝑛𝑡𝑠 𝑎𝑛𝑑 𝑡ℎ𝑒 𝑒𝑦𝑒! 👁️" }
          };

          const choice = event.body;
          const formula = formulas[choice];
          
          if (!formula) {
            return api.sendMessage("❌ 𝐼𝑛𝑣𝑎𝑙𝑖𝑑 𝑐ℎ𝑜𝑖𝑐𝑒! 𝑃𝑙𝑒𝑎𝑠𝑒 𝑐ℎ𝑜𝑜𝑠𝑒 𝑏𝑒𝑡𝑤𝑒𝑒𝑛 1-7", event.threadID, event.messageID);
          }

          link = formula.link;
          msg = formula.msg;
          fileName = "physics.jpg";
          break;
        }

        case "Grade 12": {
          const formulas = {
            "1": { link: "", msg: "𝑚𝑒𝑐ℎ𝑎𝑛𝑖𝑐𝑎𝑙 𝑜𝑠𝑐𝑖𝑙𝑙𝑎𝑡𝑖𝑜𝑛𝑠! 🎯" },
            "2": { link: "", msg: "𝑚𝑒𝑐ℎ𝑎𝑛𝑖𝑐𝑎𝑙 𝑤𝑎𝑣𝑒𝑠! 🌊" },
            "3": { link: "", msg: "𝑎𝑙𝑡𝑒𝑟𝑛𝑎𝑡𝑖𝑛𝑔 𝑐𝑢𝑟𝑟𝑒𝑛𝑡! 🔄" },
            "4": { link: "", msg: "𝑒𝑙𝑒𝑐𝑡𝑟𝑜𝑚𝑎𝑔𝑛𝑒𝑡𝑖𝑐 𝑜𝑠𝑐𝑖𝑙𝑙𝑎𝑡𝑖𝑜𝑛𝑠 𝑎𝑛𝑑 𝑤𝑎𝑣𝑒𝑠! 📡" },
            "5": { link: "", msg: "𝑙𝑖𝑔ℎ𝑡 𝑤𝑎𝑣𝑒𝑠! 💡" },
            "6": { link: "", msg: "𝑞𝑢𝑎𝑛𝑡𝑢𝑚 𝑜𝑓 𝑙𝑖𝑔ℎ𝑡! ⚛️" },
            "7": { link: "", msg: "𝑎𝑡𝑜𝑚𝑖𝑐 𝑛𝑢𝑐𝑙𝑒𝑢𝑠! ⚛️" }
          };

          const choice = event.body;
          const formula = formulas[choice];
          
          if (!formula) {
            return api.sendMessage("❌ 𝐼𝑛𝑣𝑎𝑙𝑖𝑑 𝑐ℎ𝑜𝑖𝑐𝑒! 𝑃𝑙𝑒𝑎𝑠𝑒 𝑐ℎ𝑜𝑜𝑠𝑒 𝑏𝑒𝑡𝑤𝑒𝑒𝑛 1-7", event.threadID, event.messageID);
          }

          link = formula.link;
          msg = formula.msg;
          fileName = "physics.jpg";
          break;
        }
      }

      // Handle image display
      if (link && msg && fileName) {
        if (link === "") {
          return api.sendMessage(
            "📝 " + msg + 
            "\n❌ 𝑊𝑖𝑙𝑙 𝑏𝑒 𝑢𝑝𝑑𝑎𝑡𝑒𝑑 𝑠𝑜𝑜𝑛!", 
            event.threadID, 
            event.messageID
          );
        }

        const filePath = __dirname + `/cache/${fileName}`;
        
        return request(encodeURI(link))
          .pipe(createWriteStream(filePath))
          .on("close", () => {
            api.sendMessage('🔄 𝐿𝑜𝑎𝑑𝑖𝑛𝑔 𝑑𝑎𝑡𝑎...', event.threadID, event.messageID)
              .then(() => {
                api.sendMessage({
                  body: `📚 ${msg}`,
                  attachment: createReadStream(filePath)
                }, event.threadID, () => unlinkSync(filePath));
              });
          });
      }
    } catch (error) {
      console.error("𝐸𝑟𝑟𝑜𝑟:", error);
      api.sendMessage("❌ 𝐴𝑛 𝑒𝑟𝑟𝑜𝑟 𝑜𝑐𝑐𝑢𝑟𝑟𝑒𝑑 𝑤ℎ𝑖𝑙𝑒 𝑝𝑟𝑜𝑐𝑒𝑠𝑠𝑖𝑛𝑔 𝑦𝑜𝑢𝑟 𝑟𝑒𝑞𝑢𝑒𝑠𝑡!", event.threadID, event.messageID);
    }
  }
};
