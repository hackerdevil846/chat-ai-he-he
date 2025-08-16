module.exports.config = {
  name: "rule",
  version: "1.0.1",
  hasPermssion: 0,
  credits: "𝑨𝒔𝒊𝒇 𝑴𝒂𝒉𝒎𝒖𝒅",
  description: "𝑷𝒓𝒐𝒕𝒊𝒕𝒊 𝒈𝒓𝒖𝒑𝒆𝒓 𝒋𝒐𝒏𝒏𝒐 𝒏𝒊𝒚𝒐𝒎 𝒌𝒉𝒂𝒔𝒂 𝒌𝒐𝒓𝒂",
  commandCategory: "𝒈𝒓𝒖𝒑",
  usages: "[add/list/remove/all] [text/ID]",
  cooldowns: 5,
  dependencies: {
    "fs-extra": "",
    "path": ""
  }
};

/**
 * Optional language pack (kept simple — you can expand)
 */
module.exports.languages = {
  "en": {
    noPermission: "🚫 You don't have permission to do that!",
    noContent: "⚠️ Please provide content to add.",
    added: "✅ Rule added successfully!",
    noRules: "ℹ️ There are currently no rules for this group.",
    removed: "✅ Rule removed successfully!",
    removedAll: "🗑️ All rules have been removed!",
    header: "📜 Group Rules"
  },
  "bn": {
    noPermission: "🚫 আপনে এই কাজটা করার অনুমতি নাই!",
    noContent: "⚠️ অনুগ্রহ করে যোগ করার জন্য কিছুও লিখেন।",
    added: "✅ নতুন নিয়ম সফলভাবে যোগ করা হইছে!",
    noRules: "ℹ️ এখনও কোন নিয়ম সংরক্ষিত নেই।",
    removed: "✅ নির্দিষ্ট নিয়মটি মুছে ফেলা হইছে!",
    removedAll: "🗑️ সব নিয়ম মুছে ফেলা হইছে!",
    header: "📜 গ্রুপ নিয়মাবলী"
  }
};

/**
 * Ensure cache folder + file exist when module loads
 */
module.exports.onLoad = () => {
  const fs = global.nodemodule["fs-extra"];
  const path = global.nodemodule["path"];
  const cacheDir = path.join(__dirname, "cache");
  const pathData = path.join(cacheDir, "rules.json");

  try {
    fs.ensureDirSync(cacheDir);
    if (!fs.existsSync(pathData)) fs.writeFileSync(pathData, "[]", "utf-8");
  } catch (err) {
    // If something goes wrong during onLoad we do not want the bot to crash.
    // But keep silent — issues will be visible when running the command.
    console.error("rule module onLoad error:", err);
  }
};

/**
 * Helper: convert plain text to Mathematical Bold Italic style (keeps emojis & punctuation)
 */
function toMathBoldItalic(str) {
  const map = {
    'a': '𝒂','b': '𝒃','c': '𝒄','d': '𝒅','e': '𝒆','f': '𝒇','g': '𝒈','h': '𝒉','i': '𝒊','j': '𝒋','k': '𝒌','l': '𝒍','m': '𝒎',
    'n': '𝒏','o': '𝒐','p': '𝒑','q': '𝒒','r': '𝒓','s': '𝒔','t': '𝒕','u': '𝒖','v': '𝒗','w': '𝒘','x': '𝒙','y': '𝒚','z': '𝒛',
    'A': '𝑨','B': '𝑩','C': '𝑪','D': '𝑫','E': '𝑬','F': '𝑭','G': '𝑮','H': '𝑯','I': '𝑰','J': '𝑱','K': '𝑲','L': '𝑳','M': '𝑴',
    'N': '𝑵','O': '𝑶','P': '𝑷','Q': '𝑸','R': '𝑹','S': '𝑺','T': '𝑻','U': '𝑼','V': '𝑽','W': '𝑾','X': '𝑿','Y': '𝒀','Z': '𝒁'
  };
  return String(str).split('').map(c => map[c] || c).join('');
}

/**
 * Main runner — GoatBot structured and robust
 * Keep parameter name `permssion` (intentionally same as other GoatBot modules)
 */
module.exports.run = function ({ event, api, args, permssion }) {
  const fs = global.nodemodule["fs-extra"];
  const path = global.nodemodule["path"];
  const { threadID, messageID, senderID } = event;

  const cachePath = path.join(__dirname, "cache", "rules.json");
  let dataJson = [];

  // Load data safely
  try {
    const raw = fs.readFileSync(cachePath, "utf-8");
    dataJson = JSON.parse(raw || "[]");
    if (!Array.isArray(dataJson)) dataJson = [];
  } catch (err) {
    // If file corrupted, reset to empty array (safe fallback)
    dataJson = [];
  }

  // Find or prepare thread record
  const threadIndex = dataJson.findIndex(item => item.threadID == threadID);
  const thisThread = threadIndex !== -1 ? dataJson[threadIndex] : { threadID, listRule: [] };

  // Content after the command verb
  const content = (args.slice(1)).join(" ").trim();

  // Helper to save file once after changes
  const saveAndRespond = (msg, sendAsStyled = true) => {
    try {
      // If new thread, push into array
      if (!dataJson.some(item => item.threadID == threadID)) dataJson.push(thisThread);
      fs.writeFileSync(cachePath, JSON.stringify(dataJson, null, 4), "utf-8");
    } catch (err) {
      console.error("rule module save error:", err);
    }
    return api.sendMessage(sendAsStyled ? toMathBoldItalic(msg) : msg, threadID, messageID);
  };

  // Resolve language pack — prefer Bangla (bn) then en
  const lang = module.exports.languages?.bn || module.exports.languages?.en;

  // Main switch
  switch ((args[0] || "").toLowerCase()) {

    // add new rule(s)
    case "add": {
      // permission check (keep original logic: permssion == 0 -> not allowed)
      if (permssion == 0) return api.sendMessage(toMathBoldItalic("🚫 [𝑵𝒊𝒚𝒐𝒎] 𝑨𝒑𝒏𝒂𝒓 𝒂𝒓𝒐 𝒏𝒊𝒚𝒐𝒎 𝒃𝒂𝒃𝒐𝒉𝒂𝒓 𝒌𝒐𝒓𝒂𝒓 𝒋𝒐𝒏𝒏𝒐 𝒑𝒐𝒓𝒂 𝒌𝒉𝒐𝒎𝒐𝒕𝒂 𝒏𝒆𝒊!"), threadID, messageID);
      if (!content) return api.sendMessage(toMathBoldItalic("⚠️ [𝑵𝒊𝒚𝒐𝒎] 𝑰𝒏𝒇𝒐𝒓𝒎𝒂𝒔𝒉𝒐𝒏 𝒑𝒖𝒓𝒐𝒏 𝒌𝒐𝒓𝒂 𝒉𝒐𝒚𝒏𝒊!"), threadID, messageID);

      // Support multiline paste: split on newline and add each non-empty trimmed line
      if (content.indexOf("\n") !== -1) {
        const lines = content.split(/\r?\n/).map(l => l.trim()).filter(Boolean);
        for (const line of lines) thisThread.listRule.push(line);
      } else {
        thisThread.listRule.push(content);
      }

      return saveAndRespond("✅ [𝑵𝒊𝒚𝒐𝒎] 𝑵𝒐𝒕𝒖𝒏 𝒏𝒊𝒚𝒐𝒎 𝒔𝒂𝒑𝒉𝒂𝒍𝒃𝒉𝒂𝒃𝒆 𝒂𝒅𝒅 𝒌𝒐𝒓𝒂 𝒉𝒐𝒍𝒐! 📥");
    }

    // list, all -> show all rules
    case "list":
    case "all": {
      if (!thisThread.listRule || thisThread.listRule.length === 0) {
        return api.sendMessage(toMathBoldItalic("ℹ️ [𝑵𝒊𝒚𝒐𝒎] 𝑨𝒑𝒏𝒂𝒓 𝒈𝒓𝒖𝒑𝒆𝒓 𝒌𝒐𝒏𝒐 𝒏𝒊𝒚𝒐𝒎 𝒏𝒆𝒊 𝒅𝒆𝒌𝒉𝒂𝒏𝒐𝒓 𝒋𝒐𝒏𝒏𝒐! 📭"), threadID, messageID);
      }

      let msg = `=== ${module.exports.languages.bn.header || module.exports.languages.en.header} ===\n\n`;
      thisThread.listRule.forEach((r, i) => {
        msg += `${i + 1}/ ${r}\n`;
      });
      msg += `\n📌 [Tip] Admins can add/remove rules using: ${module.exports.config.name} add/remove <text|ID>`;
      return api.sendMessage(toMathBoldItalic(msg), threadID, messageID);
    }

    // remove by number OR remove all
    case "rm":
    case "remove":
    case "delete": {
      // remove all
      if (content.toLowerCase() === "all") {
        if (permssion == 0) return api.sendMessage(toMathBoldItalic("🚫 [𝑵𝒊𝒚𝒐𝒎] 𝑵𝒊𝒚𝒐𝒎 𝒎𝒆𝒕𝒆 𝒑𝒆𝒕𝒆 𝒂𝒑𝒏𝒂𝒓 𝒌𝒉𝒐𝒎𝒐𝒕𝒂 𝒏𝒆𝒊!"), threadID, messageID);
        if (!thisThread.listRule || thisThread.listRule.length === 0) return api.sendMessage(toMathBoldItalic("ℹ️ [𝑵𝒊𝒚𝒐𝒎] 𝑴𝒆𝒕𝒆 𝒅𝒆𝒐𝒂𝒓 𝒋𝒐𝒏𝒏𝒐 𝒌𝒐𝒏𝒐 𝒏𝒊𝒚𝒐𝒎 𝒏𝒆𝒊!"), threadID, messageID);

        thisThread.listRule = [];
        return saveAndRespond("🗑️ [𝑵𝒊𝒚𝒐𝒎] 𝑺𝒐𝒃 𝒏𝒊𝒚𝒐𝒎 𝒎𝒆𝒕𝒆 𝒅𝒆𝒐𝒂 𝒉𝒐𝒍𝒐! ✅");
      }

      // remove by numeric index
      const idx = parseInt(content);
      if (!isNaN(idx) && idx > 0) {
        if (permssion == 0) return api.sendMessage(toMathBoldItalic("🚫 [𝑵𝒊𝒚𝒐𝒎] 𝑵𝒊𝒚𝒐𝒎 𝒎𝒆𝒕𝒆 𝒑𝒆𝒕𝒆 𝒂𝒑𝒏𝒂𝒓 𝒌𝒉𝒐𝒎𝒐𝒕𝒂 𝒏𝒆𝒊!"), threadID, messageID);
        if (!thisThread.listRule || thisThread.listRule.length === 0) return api.sendMessage(toMathBoldItalic("ℹ️ [𝑵𝒊𝒚𝒐𝒎] 𝑴𝒆𝒕𝒆 𝒅𝒆𝒐𝒂𝒓 𝒋𝒐𝒏𝒏𝒐 𝒌𝒐𝒏𝒐 𝒏𝒊𝒚𝒐𝒎 𝒏𝒆𝒊!"), threadID, messageID);
        if (idx > thisThread.listRule.length) return api.sendMessage(toMathBoldItalic("⚠️ [𝑵𝒊𝒚𝒐𝒎] ভুল নম্বর!"), threadID, messageID);

        const removed = thisThread.listRule.splice(idx - 1, 1);
        // save
        return saveAndRespond(`✅ [𝑵𝒊𝒚𝒐𝒎] ${idx} নম্বর নিয়ম মুছে ফেলা হইছে! ✂️\n\nমুছুন: ${removed[0]}`);
      }

      // If reaches here, input invalid
      return api.sendMessage(toMathBoldItalic("⚠️ [𝑵𝒊𝒚𝒐𝒎] সঠিক সিনট্যাক্স ব্যবহার করুন: rule add/list/remove <text|ID>"), threadID, messageID);
    }

    // default: show list if any, else show hint
    default: {
      if (thisThread.listRule && thisThread.listRule.length !== 0) {
        let msg = `=== ${module.exports.languages.bn.header || module.exports.languages.en.header} ===\n\n`;
        thisThread.listRule.forEach((r, i) => msg += `${i + 1}/ ${r}\n`);
        msg += `\n✨ Use: ${module.exports.config.name} add/list/remove`;
        return api.sendMessage(toMathBoldItalic(msg), threadID, messageID);
      } else {
        return api.sendMessage(toMathBoldItalic("ℹ️ [𝑵𝒊𝒚𝒐𝒎] 𝑨𝒑𝒏𝒂𝒓 𝒈𝒓𝒖𝒑𝒆𝒓 𝒌𝒐𝒏𝒐 𝒏𝒊𝒚𝒐𝒎 𝒏𝒆𝒊!"), threadID, messageID);
      }
    }
  } // end switch
};
