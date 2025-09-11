const axios = require("axios");

async function baseApiUrl() {
  const base = await axios.get(
    `https://raw.githubusercontent.com/Blankid018/D1PT0/main/baseApiUrl.json`,
  );
  return base.data.api;
}

async function getAvatarUrls(userIDs) {
  let avatarURLs = [];

  for (let userID of userIDs) {
    try {
      const shortUrl = `https://graph.facebook.com/${userID}/picture?height=1500&width=1500&access_token=6628568379%7Cc1e620fa708a1d5696fb991c1bde5662`;
      const d = await axios.get(shortUrl);
      let url = d.request.res.responseUrl;
      avatarURLs.push(url);
    } catch (error) {
      avatarURLs.push(
        "https://i.ibb.co/qk0bnY8/363492156-824459359287620-3125820102191295474-n-png-nc-cat-1-ccb-1-7-nc-sid-5f2048-nc-eui2-Ae-HIhi-I.png"
      );
    }
  }
  return avatarURLs;
}

module.exports.config = {
  name: "groupcollage",
  aliases: ["grpcollage", "groupimage"],
  version: "1.0",
  author: "𝐴𝑠𝑖𝑓 𝑀𝑎ℎ𝑚𝑢𝑑",
  countDown: 5,
  role: 0,
  shortDescription: {
    en: "𝐺𝑒𝑛𝑒𝑟𝑎𝑡𝑒 𝑔𝑟𝑜𝑢𝑝 𝑚𝑒𝑚𝑏𝑒𝑟 𝑐𝑜𝑙𝑙𝑎𝑔𝑒 𝑖𝑚𝑎𝑔𝑒"
  },
  longDescription: {
    en: "𝐶𝑟𝑒𝑎𝑡𝑒𝑠 𝑎 𝑐𝑜𝑙𝑙𝑎𝑔𝑒 𝑖𝑚𝑎𝑔𝑒 𝑤𝑖𝑡ℎ 𝑔𝑟𝑜𝑢𝑝 𝑚𝑒𝑚𝑏𝑒𝑟 𝑝𝑟𝑜𝑓𝑖𝑙𝑒 𝑝𝑖𝑐𝑡𝑢𝑟𝑒𝑠"
  },
  category: "𝑚𝑒𝑑𝑖𝑎",
  guide: {
    en: "{p}groupcollage --color [𝑐𝑜𝑙𝑜𝑟] --bgcolor [𝑐𝑜𝑙𝑜𝑟] --admincolor [𝑐𝑜𝑙𝑜𝑟] --membercolor [𝑐𝑜𝑙𝑜𝑟]"
  },
  dependencies: {
    "axios": ""
  }
};

module.exports.onStart = async function ({ message, args, event, api }) {
  try {
    // Check dependencies
    if (!axios) throw new Error("𝑎𝑥𝑖𝑜𝑠 𝑚𝑜𝑑𝑢𝑙𝑒 𝑛𝑜𝑡 𝑓𝑜𝑢𝑛𝑑");

    let color = "red";
    let bgColor = "https://telegra.ph/file/404fd6686c995d8db9ebf.jpg";
    let adminColor = "yellow";
    let memberColor = "";

    for (let i = 0; i < args.length; i++) {
      switch (args[i]) {
        case "--color":
          color = args[i + 1];
          args.splice(i, 2);
          break;
        case "--bgcolor":
          bgColor = args[i + 1];
          args.splice(i, 2);
          break;
        case "--admincolor":
          adminColor = args[i + 1];
          args.splice(i, 2);
          break;
        case "--membercolor":
          memberColor = args[i + 1];
          args.splice(i, 2);
          break;
      }
    }

    let threadInfo = await api.getThreadInfo(event.threadID);
    let participantIDs = threadInfo.participantIDs;
    let adminIDs = threadInfo.adminIDs.map((admin) => admin.id);
    let memberURLs = await getAvatarUrls(participantIDs);
    let adminURLs = await getAvatarUrls(adminIDs);

    const data2 = {
      memberURLs: memberURLs,
      groupPhotoURL: threadInfo.imageSrc,
      adminURLs: adminURLs,
      groupName: threadInfo.threadName,
      bgcolor: bgColor,
      admincolor: adminColor,
      membercolor: memberColor,
      color: color,
    };

    if (data2) {
      var waitingMsg = await message.reply("⏳ 𝑃𝑙𝑒𝑎𝑠𝑒 𝑤𝑎𝑖𝑡 𝑎 𝑤ℎ𝑖𝑙𝑒.");
      api.setMessageReaction(
        "⏳",
        event.messageID,
        (err) => {},
        true,
      );
    }
    
    const { data } = await axios.post(
      `${await baseApiUrl()}/groupPhoto`,
      data2,
    );

    if (data.img) {
      api.setMessageReaction(
        "✅",
        event.messageID,
        (err) => {},
        true
      );
      message.unsend(waitingMsg.messageID);
      await message.reply({
        body: `𝐻𝑒𝑟𝑒 𝑖𝑠 𝑦𝑜𝑢𝑟 𝑔𝑟𝑜𝑢𝑝 𝑐𝑜𝑙𝑙𝑎𝑔𝑒 𝑖𝑚𝑎𝑔𝑒 ✨`,
        attachment: await global.utils.getStreamFromURL(data.img),
      });
    }
  } catch (error) {
    console.log(error);
    message.reply(`❌ 𝐸𝑟𝑟𝑜𝑟: ${error.message}`);
  }
};
