module.exports.config = {
  name: "mix",
  version: "1.0.2",
  hasPermssion: 0,
  credits: "𝑨𝒔𝒊𝒇 𝑴𝒂𝒉𝒎𝒖𝒅",
  description: "✨ Combine two emojis into a single image",
  category: "image",
  usages: "[emoji1] [emoji2]",
  cooldowns: 5,
  dependencies: {
    "fs-extra": "",
    "request": ""
  }
};

module.exports.onStart = async function({ api, event, args }) {
  const fs = global.nodemodule["fs-extra"];
  const request = global.nodemodule["request"];
  const { threadID, messageID } = event;

  if (!args[0] || !args[1]) {
    return api.sendMessage(
      `🌸 𝗣𝗹𝗲𝗮𝘀𝗲 𝗽𝗿𝗼𝘃𝗶𝗱𝗲 � 𝗲𝗺𝗼𝗷𝗶𝘀 𝘁𝗼 𝗰𝗼𝗺𝗯𝗶𝗻𝗲!\n━━━━━━━━━━━━━━━━━━\n💡 𝗨𝘀𝗮𝗴𝗲: ${global.config.PREFIX}${this.config.name} ${this.config.usages}\n📌 𝗘𝘅𝗮𝗺𝗽𝗹𝗲: ${global.config.PREFIX}mix 😂 🥰`,
      threadID,
      messageID
    );
  }

  const emoji1 = encodeURIComponent(args[0]);
  const emoji2 = encodeURIComponent(args[1]);
  const savePath = __dirname + `/cache/mix_${emoji1}_${emoji2}.png`;

  const primaryApiUrl = `https://www.api.vyturex.com/emojimix?emoji1=${emoji1}&emoji2=${emoji2}`;
  const backupApiUrl = `https://emojik.vercel.app/s/${emoji1}_${emoji2}?size=128`;

  const tryFetch = (url, isRetry = false) => {
    return request(url)
      .on('error', () => {
        if (!isRetry) {
          tryFetch(backupApiUrl, true);
        } else {
          api.sendMessage(
            `❌ 𝗙𝗮𝗶𝗹𝗲𝗱 𝘁𝗼 𝗰𝗼𝗺𝗯𝗶𝗻𝗲 "${args[0]}" 𝗮𝗻𝗱 "${args[1]}"!\n━━━━━━━━━━━━━━━━━━\n💠 𝗧𝗿𝘆 𝘂𝘀𝗶𝗻𝗴 𝗱𝗶𝗳𝗳𝗲𝗿𝗲𝗻𝘁 𝗲𝗺𝗼𝗷𝗶𝘀 𝗼𝗿 𝗰𝗵𝗲𝗰𝗸 𝗮𝗽𝗶 𝘀𝘁𝗮𝘁𝘂𝘀!`,
            threadID,
            messageID
          );
        }
      })
      .pipe(fs.createWriteStream(savePath))
      .on('close', () => {
        api.sendMessage(
          {
            body: `✨ 𝗦𝘂𝗰𝗰𝗲𝘀𝘀𝗳𝘂𝗹𝗹𝘆 𝗰𝗼𝗺𝗯𝗶𝗻𝗲𝗱:\n━━━━━━━━━━━━━━━━━━\n${args[0]} + ${args[1]} = 🎉`,
            attachment: fs.createReadStream(savePath)
          },
          threadID,
          () => fs.unlinkSync(savePath),
          messageID
        );
      });
  };

  try {
    tryFetch(primaryApiUrl);
  } catch (error) {
    console.error(error);
    api.sendMessage(
      "⚠️ 𝗔𝗻 𝘂𝗻𝗲𝘅𝗽𝗲𝗰𝘁𝗲𝗱 𝗲𝗿𝗿𝗼𝗿 𝗼𝗰𝗰𝘂𝗿𝗿𝗲𝗱. 𝗣𝗹𝗲𝗮𝘀𝗲 𝘁𝗿𝘆 𝗮𝗴𝗮𝗶𝗻 𝗹𝗮𝘁𝗲𝗿!",
      threadID,
      messageID
    );
    if (fs.existsSync(savePath)) fs.unlinkSync(savePath);
  }
};
