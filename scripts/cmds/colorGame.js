module.exports = {
  config: {
    name: "colorGame",
    version: "1.0.2",
    role: 0,
    author: "Asif Mahmud",
    category: "game",
    shortDescription: {
      en: "Color betting game"
    },
    longDescription: {
      en: "Bet money on colors to win prizes"
    },
    guide: {
      en: "colorGame [color] - Choose from: blue, red, green, yellow, violet, black"
    },
    countDown: 0,
    dependencies: {}
  },

  onStart: async function ({ event, api, args, usersData }) {
    try {
      const { senderID, threadID, messageID } = event;
      const userData = await usersData.get(senderID);
      const moneyUser = userData.money;

      if (moneyUser < 100000) {
        return api.sendMessage("Not enough money! You need at least 100000$", threadID, messageID);
      }

      const colorArg = args[0]?.toLowerCase();
      let colorCode;

      if (colorArg === "e" || colorArg === "blue") colorCode = 0;
      else if (colorArg === "r" || colorArg === "red") colorCode = 1;
      else if (colorArg === "g" || colorArg === "green") colorCode = 2;
      else if (colorArg === "y" || colorArg === "yellow") colorCode = 3;
      else if (colorArg === "v" || colorArg === "violet") colorCode = 4;
      else if (colorArg === "b" || colorArg === "black") colorCode = 5;
      else {
        return api.sendMessage("Invalid bet! Choose from: blue [180], red [200], green [70], yellow [50], violet [150], black [100]", threadID, messageID);
      }

      const check = (num) => {
        if (num === 0) return '💙';
        if (num % 2 === 0 && num % 6 !== 0 && num % 10 !== 0) return '♥️';
        if (num % 3 === 0 && num % 6 !== 0) return '💚';
        if (num % 5 === 0 && num % 10 !== 0) return '💛';
        if (num % 10 === 0) return '💜';
        return '🖤️';
      };

      const random = Math.floor(Math.random() * 50);
      const resultColor = check(random);

      if (colorCode === 0 && resultColor === '💙') {
        await usersData.set(senderID, { money: moneyUser + 180000 });
        api.sendMessage(`You chose blue 💙, you won and received +180000$\nYour current money: ${moneyUser + 180000}$`, threadID, messageID);
      } else if (colorCode === 1 && resultColor === '♥️') {
        await usersData.set(senderID, { money: moneyUser + 200000 });
        api.sendMessage(`You chose red ♥️, you won and received +200000$\nYour current money: ${moneyUser + 200000}$`, threadID, messageID);
      } else if (colorCode === 2 && resultColor === '💚') {
        await usersData.set(senderID, { money: moneyUser + 700000 });
        api.sendMessage(`You chose green 💚, you won and received +700000$\nYour current money: ${moneyUser + 700000}$`, threadID, messageID);
      } else if (colorCode === 3 && resultColor === '💛') {
        await usersData.set(senderID, { money: moneyUser + 500000 });
        api.sendMessage(`You chose yellow 💛, you won and received +500000$\nYour current money: ${moneyUser + 500000}$`, threadID, messageID);
      } else if (colorCode === 4 && resultColor === '💜') {
        await usersData.set(senderID, { money: moneyUser + 1500000 });
        api.sendMessage(`You chose violet 💜, you won and received +1500000$\nYour current money: ${moneyUser + 1500000}$`, threadID, messageID);
      } else if (colorCode === 5 && resultColor === '🖤️') {
        await usersData.set(senderID, { money: moneyUser + 100000 });
        api.sendMessage(`You chose black 🖤️, you won and received +100000$\nYour current money: ${moneyUser + 100000}$`, threadID, messageID);
      } else {
        await usersData.set(senderID, { money: moneyUser - 100000 });
        api.sendMessage(`Color ${resultColor}\nYou lost and lost 100000$\nYour remaining money: ${moneyUser - 100000}$`, threadID, messageID);
      }
    } catch (error) {
      console.error(error);
      api.sendMessage("An error occurred while processing the command.", event.threadID, event.messageID);
    }
  }
};
