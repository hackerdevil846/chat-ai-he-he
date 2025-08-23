module.exports.config = {
  name: "hotvid",
  version: "2.0.0",
  hasPermssion: 2, // Only bot admins/owners
  credits: "𝑨𝒔𝒊𝒇 𝑴𝒂𝒉𝒎𝒖𝒅",
  description: "🔥 Random NSFW video from premium sources",
  category: "nsfw",
  usages: "[no options]",
  cooldowns: 5,
  dependencies: {},
  envConfig: {}
};

module.exports.languages = {
  "en": {
    replyText: "🔥 Enjoy this premium content!",
    errorText: "❌ Sorry, couldn't load the content. Please try again later."
  },
  "bn": {
    replyText: "🔥 এই প্রিমিয়াম কন্টেন্ট উপভোগ করুন!",
    errorText: "❌ দুঃখিত, কন্টেন্ট লোড করা সম্ভব হয়নি। পরে আবার চেষ্টা করুন।"
  }
};

module.exports.run = async function ({ message, args, api }) {
  try {
    const videoSources = [
        "https://i.imgur.com/FbnZI40.mp4",
        "https://i.imgur.com/E9gbTEZ.mp4",
        "https://i.imgur.com/17nXn9K.mp4",
        "https://i.imgur.com/nj23cCe.mp4",
        "https://i.imgur.com/lMpmBFb.mp4",
        "https://i.imgur.com/85iuBp2.mp4",
        "https://i.imgur.com/R3XHTby.mp4",
        "https://i.imgur.com/qX2HUXp.mp4",
        "https://i.imgur.com/MYn0ese.mp4",
        "https://i.imgur.com/yipoKec.mp4",
        "https://i.imgur.com/0tFSIWT.mp4",
        "https://i.imgur.com/BzP6eD8.mp4",
        "https://i.imgur.com/aDlwRWy.mp4",
        "https://i.imgur.com/l3c86M3.mp4",
        "https://i.imgur.com/lfjT7bx.mp4",
        "https://i.imgur.com/Zp5sci1.mp4",
        "https://i.imgur.com/S6rHOc1.mp4",
        "https://i.imgur.com/cAHRfq3.mp4",
        "https://i.imgur.com/zzqEWkN.mp4",
        "https://i.imgur.com/fL1igWD.mp4",
        "https://i.imgur.com/ZRt0bGT.mp4",
        "https://i.imgur.com/fAKWP0W.mp4",
        "https://i.imgur.com/A1d4F7X.mp4",
        "https://i.imgur.com/9jJgLhV.mp4",
        "https://i.imgur.com/W3qK5bR.mp4"
      ];

    const randomIndex = Math.floor(Math.random() * videoSources.length);
    const videoUrl = videoSources[randomIndex];

    return message.reply({
      body: message.language.replyText,
      attachment: await global.utils.getStreamFromURL(videoUrl)
    });

  } catch (err) {
    console.error("[HOTVID CMD ERROR]", err);
    return message.reply(message.language.errorText);
  }
};
