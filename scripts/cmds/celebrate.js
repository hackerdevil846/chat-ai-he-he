module.exports.config = {
  name: "celebrate",
  version: "1.4.0",
  hasPermssion: 0,
  credits: "𝑨𝒔𝒊𝒇 𝑴𝒂𝒉𝒎𝒖𝒅",
  description: "Start a joyful celebration in chat with interactive messages and emojis",
  category: "fun",
  usages: "[@mention or name]",
  cooldowns: 60
};

module.exports.languages = {
  "en": {}
};

module.exports.onLoad = function () {
  // No special loading needed for this command
};

module.exports.run = async function({ api, event, args }) {
  try {
    const { threadID, messageID, mentions } = event;

    // Determine who to celebrate
    let name = "everyone";
    let isMentioned = false;

    if (Object.keys(mentions).length > 0) {
      const mentionedID = Object.keys(mentions)[0];
      name = mentions[mentionedID];
      isMentioned = true;
    } else if (args.length > 0) {
      name = args.join(" ");
    }

    // Initial message
    await api.sendMessage(
      `🎉 LET'S CELEBRATE ${name.toUpperCase()}! 🎉\n` +
      "━━━━━━━━━━━━━━\n" +
      `Get ready for an 80-second celebration ${isMentioned ? 'with special mentions!' : 'full of joy!'}\n` +
      "🎈 Messages will appear every 3 seconds...",
      threadID
    );

    // Celebration messages with delays
    const celebrationMessages = [
      {delay: 3, msg: "🎇 Let the celebration begin! 🎇"},
      {delay: 6, msg: `🌟 ${name} is the star of the show! 🌟`},
      {delay: 9, msg: "✨ Positive vibes only! ✨"},
      {delay: 12, msg: "🥳 Time to dance! 🕺💃"},
      {delay: 15, msg: "🎈 Let's spread joy and happiness! 🎈"},
      {delay: 18, msg: "🌈 Life is beautiful! 🌈"},
      {delay: 21, msg: `💖 You're amazing, ${name}! 💖`},
      {delay: 24, msg: "🎊 Celebration time! 🎊"},
      {delay: 27, msg: "🥂 Cheers to good times! 🥂"},
      {delay: 30, msg: "🌠 Make a wish! 🌠"},
      {delay: 33, msg: "🎵 Music makes everything better! 🎵"},
      {delay: 36, msg: "😊 Smile - it's contagious! 😊"},
      {delay: 39, msg: `🌟 Shine bright like a diamond, ${name}! 🌟`},
      {delay: 42, msg: "🕊️ Peace and love to all! 🕊️"},
      {delay: 45, msg: "🙌 Group hug time! 🤗"},
      {delay: 48, msg: "🎁 Surprise! You're awesome! 🎁"},
      {delay: 51, msg: "💫 Magical moments with friends! 💫"},
      {delay: 54, msg: "🎤 Let's sing together! 🎶"},
      {delay: 57, msg: "🌻 Spread kindness like sunshine! 🌻"},
      {delay: 60, msg: `🏆 You're a winner, ${name}! 🏆`},
      {delay: 63, msg: "🎨 Life is your canvas - paint it bright! 🎨"},
      {delay: 66, msg: "🤝 Together we're stronger! 🤝"},
      {delay: 69, msg: "🌍 Make the world a better place! 🌍"},
      {delay: 72, msg: "🎉 The celebration continues! 🎉"},
      {delay: 75, msg: "❤️ Thank you for this joyful moment! ❤️"},
      {delay: 78, msg: "🎆 Final fireworks! What an amazing celebration! 🎆"}
    ];

    for (const {delay, msg} of celebrationMessages) {
      await new Promise(resolve => setTimeout(resolve, delay * 1000));
      await api.sendMessage(msg, threadID);
    }

    // Final message
    await new Promise(resolve => setTimeout(resolve, 2000));
    await api.sendMessage(
      `🎊 CELEBRATION COMPLETE! 🎊\n` +
      "━━━━━━━━━━━━━━\n" +
      `Thanks for celebrating with us, ${name}! ❤️\n` +
      "You made this moment special! 🥰",
      threadID,
      messageID
    );

  } catch (error) {
    console.error("🎈 Celebration Error:", error);
    api.sendMessage(
      "🎭 The celebration couldn't continue due to an unexpected error.\n" +
      "Please try again later or celebrate someone else!",
      event.threadID,
      event.messageID
    );
  }
};
