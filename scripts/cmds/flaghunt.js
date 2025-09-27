const axios = require("axios");

const baseApiUrl = async () => {
  const base = await axios.get(
    `https://raw.githubusercontent.com/ARYAN-AROHI-STORE/A4YA9-A40H1/refs/heads/main/APIRUL.json`,
  );
  return base.data.api;
};

// Bold Capital Anime Style Font Mapping
function transformText(input) {
  const fontMap = {
    " ": " ",
    a: "𝗔", b: "𝗕", c: "𝗖", d: "𝗗", e: "𝗘", f: "𝗙", g: "𝗚", h: "𝗛", i: "𝗜",
    j: "𝗝", k: "𝗞", l: "𝗟", m: "𝗠", n: "𝗡", o: "𝗢", p: "𝗣", q: "𝗤", r: "𝗥",
    s: "𝗦", t: "𝗧", u: "𝗨", v: "𝗩", w: "𝗪", x: "𝗫", y: "𝗬", z: "𝗭",
    A: "𝗔", B: "𝗕", C: "𝗖", D: "𝗗", E: "𝗘", F: "𝗙", G: "𝗚", H: "𝗛", I: "𝗜",
    J: "𝗝", K: "𝗞", L: "𝗟", M: "𝗠", N: "𝗡", O: "𝗢", P: "𝗣", Q: "𝗤", R: "𝗥",
    S: "𝗦", T: "𝗧", U: "𝗨", V: "𝗩", W: "𝗪", X: "𝗫", Y: "𝗬", Z: "𝗭"
  };
  return input.split("").map(c => fontMap[c] || c).join("");
}

module.exports.config = {
    name: "flaghunt",
    aliases: ["flagGame", "flag"],
    version: "3.0",
    author: "𝗔𝗦𝗜𝗙 𝗠𝗔𝗛𝗠𝗨𝗗",
    countDown: 0,
    role: 0,
    shortDescription: {
        en: transformText("🎌 GUESS THE FLAG AND WIN REWARDS!")
    },
    longDescription: {
        en: transformText("🎌 GUESS THE FLAG AND WIN REWARDS!")
    },
    category: "GAME",
    guide: {
        en: transformText("{PN} - REPLY TO THE FLAG IMAGE WITH THE COUNTRY NAME\nEXAMPLE: {PN} - REPLY WITH 'FRANCE' FOR FRENCH FLAG")
    },
    dependencies: {
        "axios": ""
    }
};

module.exports.onReply = async function ({ api, event, Reply, usersData }) {
    const { country, attempts, messageID } = Reply;
    const maxAttempts = 5;
    
    if (event.type !== "message_reply") return;

    const reply = event.body.toLowerCase();
    const coinReward = 241;
    const expReward = 121;

    const userData = await usersData.get(event.senderID);

    if (attempts >= maxAttempts) {
        return api.sendMessage(
            transformText("🚫 | OOPS! YOU'VE REACHED THE MAX ATTEMPTS (5). TRY AGAIN LATER!"),
            event.threadID,
            event.messageID
        );
    }

    if (reply === country.toLowerCase()) {
        try {
            await api.unsendMessage(messageID);

            await usersData.set(event.senderID, {
                money: userData.money + coinReward,
                exp: userData.exp + expReward,
                data: userData.data,
            });

            await api.sendMessage(
                transformText(`✅ | YAY! YOU GOT IT RIGHT!\n💰 EARNED: ${coinReward} COINS 💎\n✨ LEVEL UP: +${expReward} EXP`),
                event.threadID,
                event.messageID
            );
        } catch (err) {
            console.log("Error:", err.message);
        }
    } else {
        Reply.attempts += 1;
        global.client.handleReply.set(messageID, Reply);
        await api.sendMessage(
            transformText(`❌ | NOPE! THAT'S NOT IT! YOU HAVE ${maxAttempts - Reply.attempts} TRIES LEFT.\n💖 TRY AGAIN BABY~`),
            event.threadID,
            event.messageID
        );
    }
};

module.exports.onStart = async function ({ api, args, event, message }) {
    try {
        if (!args[0]) {
            const response = await axios.get(
                `${await baseApiUrl()}/flagGame?randomFlag=random`,
            );
            const { link, country } = response.data;

            await message.reply({
                body: transformText("🎌 | GUESS THIS FLAG! REPLY WITH THE COUNTRY NAME TO WIN! 💖"),
                attachment: await global.utils.getStreamFromURL(link)
            }, (error, info) => {
                global.client.handleReply.set(info.messageID, {
                    commandName: this.config.name,
                    type: "reply",
                    messageID: info.messageID,
                    author: event.senderID,
                    link,
                    country,
                    attempts: 0,
                });
            });
        }
    } catch (error) {
        console.error(`Error: ${error.message}`);
        await message.reply(
            transformText(`⚠️ | SORRY, SOMETHING WENT WRONG... 💔`)
        );
    }
};
