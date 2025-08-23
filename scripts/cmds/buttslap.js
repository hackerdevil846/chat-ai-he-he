const DIG = require("discord-image-generation");
const fs = require("fs-extra");
const path = require("path");

module.exports.config = {
  name: "buttslap",
  version: "1.1",
  hasPermssion: 0,
  credits: "𝑨𝒔𝒊𝒇 𝑴𝒂𝒉𝒎𝒖𝒅",
  description: "Generate a funny buttslap image with a tagged user 🖐️🍑",
  category: "fun",
  usages: "@tag [optional text]",
  cooldowns: 5,
  dependencies: {
    "discord-image-generation": ""
  }
};

module.exports.languages = {
  en: {
    noTag: "⚠️ | Please tag someone to slap! (Use: {pn} @tag)",
    error: "❌ | Failed to generate image. Please try again later.",
    successFallback: "💢 *slaps* 💥"
  },
  bn: { // optional Bangla fallback
    noTag: "⚠️ | দয়া করে কাউকে ট্যাগ করুন!",
    error: "❌ | ইমেজ বানানো গেল না। পরে চেষ্টা করুন।",
    successFallback: "💢 *slaps* 💥"
  }
};

/**
 * onStart - some GoatBot loaders expect an onStart/onLoad handler.
 * Ensure tmp folder exists to avoid runtime errors and to fix the "onStart undefined" loader issue.
 */
module.exports.onStart = function () {
  try {
    const tmpDir = path.join(__dirname, "tmp");
    fs.ensureDirSync(tmpDir);
    // silent success
  } catch (err) {
    // If folder cannot be created, log so debugging is easier
    console.error("buttslap onStart error:", err);
  }
};

// Also include onLoad for compatibility with variants that call onLoad
module.exports.onLoad = function () {
  return module.exports.onStart();
};

/**
 * Helper: robust avatar URL getter with fallbacks so this file works across GoatBot variants.
 * Tries a few common methods, then falls back to Facebook graph endpoint.
 */
async function resolveAvatarUrl(uid, context = {}) {
  try {
    // Preferred API: usersData.getAvatarUrl (used in some setups)
    if (context.usersData && typeof context.usersData.getAvatarUrl === "function") {
      const url = await context.usersData.getAvatarUrl(uid);
      if (url) return url;
    }

    // Alternative: Users model with getAvatarUrl
    if (context.Users && typeof context.Users.getAvatarUrl === "function") {
      const url = await context.Users.getAvatarUrl(uid);
      if (url) return url;
    }

    // Fallback to platform API: api.getUserInfo (returns object keyed by uid)
    if (context.api && typeof context.api.getUserInfo === "function") {
      try {
        const info = await context.api.getUserInfo(uid);
        if (info && info[uid]) {
          // try common fields
          return info[uid].profileUrl || info[uid].avatar || info[uid].profile_pic || info[uid].photoURL;
        }
      } catch (e) {
        // ignore and fallback
      }
    }

    // Last resort: Facebook Graph API profile picture (works for FB UIDs)
    return `https://graph.facebook.com/${uid}/picture?type=large`;
  } catch (e) {
    return `https://graph.facebook.com/${uid}/picture?type=large`;
  }
}

/**
 * Main command runner.
 * Accepts multiple GoatBot signatures by destructuring a generic context object.
 */
module.exports.run = async function (context = {}) {
  // Support both styles: run({ api, event, args, ... }) or run({ event, message, usersData, args, getLang })
  const {
    api,
    event,
    args = [],
    message,
    usersData,
    Users,
    getLang,
    permssion,
  } = context;

  // getLang fallback
  const _getLang = (key) => {
    try {
      if (typeof getLang === "function") return getLang(key);
    } catch (e) {}
    // fallback to module languages (english)
    return module.exports.languages.en[key] || module.exports.languages.bn[key] || "";
  };

  try {
    if (!event) {
      // If event not present, try to find from message object
      return (message && typeof message.reply === "function")
        ? message.reply(_getLang("noTag"))
        : api && api.sendMessage ? api.sendMessage(_getLang("noTag"), context.threadID || event.threadID) : null;
    }

    // Identify sender and mentioned user
    const uid1 = event.senderID || event.senderId || (event.author && event.author.id);
    // event.mentions can be an object keyed by uid (Facebook) or a Map-like; keep robust:
    let uid2 = null;
    if (event.mentions && typeof event.mentions === "object") {
      // If it's an object with keys as IDs
      const mentionKeys = Object.keys(event.mentions);
      if (mentionKeys.length > 0) uid2 = mentionKeys[0];
    }
    // Some platforms use event.messageReply or args that include @mention string; keep uid2 fallback:
    if (!uid2 && args.length > 0) {
      // try to parse a raw UID from first arg if numeric
      const possible = args[0].replace(/[^0-9]/g, "");
      if (possible && possible.length >= 5) uid2 = possible;
    }

    if (!uid2) {
      // no mention -> reply with localized noTag message
      const noTagMsg = _getLang("noTag");
      if (message && typeof message.reply === "function") return message.reply(noTagMsg);
      if (api && typeof api.sendMessage === "function") return api.sendMessage(noTagMsg, event.threadID || event.threadID);
      return;
    }

    // Resolve avatar URLs (robust)
    const avatarURL1 = await resolveAvatarUrl(uid1, { usersData, Users, api });
    const avatarURL2 = await resolveAvatarUrl(uid2, { usersData, Users, api });

    // Generate image using discord-image-generation Spank (same as original)
    const imgBuffer = await new DIG.Spank().getImage(avatarURL1, avatarURL2);

    // Save to the exact path requested (do not change)
    const pathSave = `${__dirname}/tmp/${uid1}_${uid2}spank.png`;
    fs.writeFileSync(pathSave, Buffer.from(imgBuffer));

    // Prepare message body: try to remove mention string from args (best-effort)
    let content = "";
    try {
      if (event.mentions && typeof event.mentions === "object") {
        // Remove mention text tokens (best-effort)
        const mentionKeys = Object.keys(event.mentions);
        const mentionRegexes = mentionKeys.map(k => new RegExp(k, "g"));
        content = args.join(" ");
        mentionRegexes.forEach(r => content = content.replace(r, ""));
        content = content.replace(/@/g, "").trim();
      } else {
        content = args.join(" ").trim();
      }
    } catch (e) {
      content = args.join(" ").trim();
    }

    if (!content) content = _getLang("successFallback");

    // Sending the message: support both message.reply and api.sendMessage signatures
    const sendPayload = {
      body: content,
      attachment: fs.createReadStream(pathSave)
    };

    if (message && typeof message.reply === "function") {
      // If message.reply exists (some GoatBot variants)
      message.reply(sendPayload, () => {
        try { fs.unlinkSync(pathSave); } catch (e) {}
      });
    } else if (api && typeof api.sendMessage === "function") {
      // api.sendMessage(message, threadID, callback, messageID)
      const threadID = event.threadID || event.threadId || (context.threadID);
      const messageID = event.messageID || event.messageId || null;
      api.sendMessage(sendPayload, threadID, (err, info) => {
        try { fs.unlinkSync(pathSave); } catch (e) {}
      }, messageID);
    } else {
      // As a last resort, attempt to reply with console log and cleanup
      try { fs.unlinkSync(pathSave); } catch (e) {}
      console.warn("buttslap: no send method available to deliver the image.");
    }

  } catch (error) {
    console.error("buttslap error:", error);
    const errMsg = _getLang("error");
    if (message && typeof message.reply === "function") return message.reply(errMsg);
    if (api && typeof api.sendMessage === "function") return api.sendMessage(errMsg, (context && (context.threadID || context.threadId)) || (context.event && context.event.threadID));
  }
};
