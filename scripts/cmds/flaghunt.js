const axios = require("axios");

const baseApiUrl = async () => {
  const base = await axios.get(
    `https://raw.githubusercontent.com/ARYAN-AROHI-STORE/A4YA9-A40H1/refs/heads/main/APIRUL.json`,
  );
  return base.data.api;
};

// Bold Italic Math Font Mapping
function transformText(input) {
  const fontMap = {
    " ": " ",
    a: "𝑎", b: "𝑏", c: "𝑐", d: "𝑑", e: "𝑒", f: "𝑓", g: "𝑔", h: "ℎ", i: "𝑖",
    j: "𝑗", k: "𝑘", l: "𝑙", m: "𝑚", n: "𝑛", o: "𝑜", p: "𝑝", q: "𝑞", r: "𝑟",
    s: "𝑠", t: "𝑡", u: "𝑢", v: "𝑣", w: "𝑤", x: "𝑥", y: "𝑦", z: "𝑧",
    A: "𝐴", B: "𝐵", C: "𝐶", D: "𝐷", E: "𝐸", F: "𝐹", G: "𝐺", H: "𝐻", I: "𝐼",
    J: "𝐽", K: "𝐾", L: "𝐿", M: "𝑀", N: "𝑁", O: "𝑂", P: "𝑃", Q: "𝑄", R: "𝑅",
    S: "𝑆", T: "𝑇", U: "𝑈", V: "𝑉", W: "𝑊", X: "𝑋", Y: "𝑌", Z: "𝑍"
  };
  return input.split("").map(c => fontMap[c] || c).join("");
}

module.exports.config = {
    name: "flaghunt",
    aliases: ["flagGame", "flag"],
    version: "3.0",
    author: "𝐴𝑠𝑖𝑓 𝑀𝑎ℎ𝑚𝑢𝑑",
    countDown: 0,
    role: 0,
    shortDescription: {
        en: transformText("🎌 Guess the flag and win rewards!")
    },
    longDescription: {
        en: transformText("🎌 Guess the flag and win rewards!")
    },
    category: "game",
    guide: {
        en: transformText("{pn} - reply to the flag image with the country name\nExample: {pn} - reply with 'france' for French flag")
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
            transformText("🚫 | Oops! You've reached the max attempts (5). Try again later!"),
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
                transformText(`✅ | Yay! You got it right!\n💰 Earned: ${coinReward} coins 💎\n✨ Level up: +${expReward} EXP`),
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
            transformText(`❌ | Nope! That's not it! You have ${maxAttempts - Reply.attempts} tries left.\n💖 Try again baby~`),
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
                body: transformText("🎌 | Guess this flag! Reply with the country name to win! 💖"),
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
            transformText(`⚠️ | Sorry, something went wrong... 💔`)
        );
    }
};
