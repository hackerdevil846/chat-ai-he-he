module.exports = {
  config: {
    name: "top",
    aliases: ["leaderboard"],
    version: "1.0.0",
    author: "𝐴𝑠𝑖𝑓 𝑀𝑎ℎ𝑚𝑢𝑑",
    role: 0,
    category: "group",
    shortDescription: {
      en: "🏆 𝑺𝒆𝒓𝒗𝒆𝒓 𝒕𝒐𝒑 𝒄𝒉𝒂𝒓𝒕!"
    },
    longDescription: {
      en: "𝑺𝒉𝒐𝒘𝒔 𝒕𝒐𝒑 𝒖𝒔𝒆𝒓𝒔 𝒂𝒏𝒅 𝒈𝒓𝒐𝒖𝒑𝒔 𝒃𝒂𝒔𝒆𝒅 𝒐𝒏 𝒗𝒂𝒓𝒊𝒐𝒖𝒔 𝒄𝒓𝒊𝒕𝒆𝒓𝒊𝒂"
    },
    guide: {
      en: "{p}top [𝒕𝒉𝒓𝒆𝒂𝒅/𝒖𝒔𝒆𝒓/𝒎𝒐𝒏𝒆𝒚/𝒍𝒆𝒗𝒆𝒍] [𝒏𝒖𝒎𝒃𝒆𝒓]"
    },
    countDown: 5
  },

  onStart: async function({ api, event, args, message, usersData, threadsData, currenciesData }) {
    const { threadID, messageID } = event;

    if ((args[1] && isNaN(args[1])) || parseInt(args[1]) <= 0) {
      return message.reply("❌ 𝑷𝒍𝒆𝒂𝒔𝒆 𝒆𝒏𝒕𝒆𝒓 𝒂 𝒗𝒂𝒍𝒊𝒅 𝒏𝒖𝒎𝒃𝒆𝒓 𝒈𝒓𝒆𝒂𝒕𝒆𝒓 𝒕𝒉𝒂𝒏 0");
    }

    const option = parseInt(args[1] || 10);

    const expToLevel = (point) => {
      return point < 0 ? 0 : Math.floor((Math.sqrt(1 + (4 * point) / 3) + 1) / 2);
    };

    switch (args[0]) {
      case "user":
      case "level":
        try {
          const allUsers = await usersData.getAll();
          const usersWithExp = allUsers.filter(user => user.exp !== undefined);
          usersWithExp.sort((a, b) => b.exp - a.exp);
          
          let levelMsg = "╔════════════════════╗\n";
          levelMsg +=     "║    🏆 𝐓𝐎𝐏 𝐋𝐄𝐕𝐄𝐋𝐒 🏆    ║\n";
          levelMsg +=     "╚════════════════════╝\n\n";
          
          for (let i = 0; i < Math.min(option, usersWithExp.length); i++) {
            try {
              const userInfo = await api.getUserInfo(usersWithExp[i].id);
              const userName = userInfo[usersWithExp[i].id]?.name || "𝑨𝒏𝒐𝒏𝒚𝒎𝒐𝒖𝒔";
              const level = expToLevel(usersWithExp[i].exp);
              
              const progressBarLength = 15;
              const progress = Math.min(1, (usersWithExp[i].exp % 100) / 100);
              const filledBar = '█'.repeat(Math.floor(progress * progressBarLength));
              const emptyBar = '░'.repeat(progressBarLength - filledBar.length);
              
              levelMsg += `【${i + 1}】✦ ${userName}\n`;
              levelMsg += `   ╭─ Level: ${level} ✨\n`;
              levelMsg += `   ╰─ Exp: ${usersWithExp[i].exp} [${filledBar}${emptyBar}]\n\n`;
            } catch {
              levelMsg += `【${i + 1}】✦ 𝑼𝒏𝒌𝒏𝒐𝒘𝒏 𝑼𝒔𝒆𝒓\n`;
              levelMsg += `   ╰─ Level: ${expToLevel(usersWithExp[i].exp)} ✨\n\n`;
            }
          }
          
          levelMsg += "✦✦✦ 𝑪𝒐𝒏𝒈𝒓𝒂𝒕𝒖𝒍𝒂𝒕𝒊𝒐𝒏𝒔 𝒕𝒐 𝒂𝒍𝒍 𝒕𝒉𝒆 𝒕𝒐𝒑 𝒖𝒔𝒆𝒓𝒔! ✦✦✦";
          message.reply(levelMsg);
        } catch (error) {
          console.error(error);
          message.reply("❌ 𝑭𝒂𝒊𝒍𝒆𝒅 𝒕𝒐 𝒓𝒆𝒕𝒓𝒊𝒆𝒗𝒆 𝒖𝒔𝒆𝒓 𝒅𝒂𝒕𝒂");
        }
        break;

      case "thread":
        try {
          const threadList = (await api.getThreadList(option + 10, null, ["INBOX"]))
            .filter(t => t.isGroup)
            .sort((a, b) => b.messageCount - a.messageCount)
            .slice(0, option);

          let threadMsg = "╔══════════════════════════╗\n";
          threadMsg +=     "║    📊 𝐓𝐎𝐏 𝐀𝐂𝐓𝐈𝐕𝐄 𝐆𝐑𝐎𝐔𝐏𝐒 📊    ║\n";
          threadMsg +=     "╚══════════════════════════╝\n\n";
          
          threadList.forEach((t, i) => {
            const medal = i === 0 ? "🥇" : i === 1 ? "🥈" : i === 2 ? "🥉" : "🔹";
            threadMsg += `${medal} 【${i + 1}】${t.name || "𝑼𝒏𝒏𝒂𝒎𝒆𝒅 𝑮𝒓𝒐𝒖𝒑"}\n`;
            threadMsg += `   ╭─ 📝 Messages: ${t.messageCount.toLocaleString()}\n`;
            threadMsg += `   ╰─ 🆔 Thread ID: ${t.threadID}\n\n`;
          });
          
          threadMsg += "✦ 𝑻𝒉𝒆𝒔𝒆 𝒂𝒓𝒆 𝒕𝒉𝒆 𝒎𝒐𝒔𝒕 𝒂𝒄𝒕𝒊𝒗𝒆 𝒈𝒓𝒐𝒖𝒑𝒔 𝒊𝒏 𝒕𝒉𝒆 𝒔𝒆𝒓𝒗𝒆𝒓! ✦";
          message.reply(threadMsg);
        } catch {
          message.reply("❌ 𝑭𝒂𝒊𝒍𝒆𝒅 𝒕𝒐 𝒓𝒆𝒕𝒓𝒊𝒆𝒗𝒆 𝒈𝒓𝒐𝒖𝒑 𝒍𝒊𝒔𝒕");
        }
        break;

      case "money":
        try {
          const allUsers = await usersData.getAll();
          const usersWithMoney = allUsers.filter(user => user.money !== undefined);
          usersWithMoney.sort((a, b) => b.money - a.money);
          
          let moneyMsg = "╔════════════════════════╗\n";
          moneyMsg +=     "║    💰 𝐓𝐎𝐏 𝐑𝐈𝐂𝐇𝐄𝐒𝐓 💰    ║\n";
          moneyMsg +=     "╚════════════════════════╝\n\n";
          
          for (let i = 0; i < Math.min(option, usersWithMoney.length); i++) {
            try {
              const userInfo = await api.getUserInfo(usersWithMoney[i].id);
              const userName = userInfo[usersWithMoney[i].id]?.name || "𝑨𝒏𝒐𝒏𝒚𝒎𝒐𝒖𝒔";
              const money = usersWithMoney[i].money.toLocaleString();
              
              const crown = i === 0 ? "👑" : i === 1 ? "💎" : i === 2 ? "⭐" : "🔸";
              
              moneyMsg += `${crown} 【${i + 1}】✦ ${userName}\n`;
              moneyMsg += `   ╰─ 💵 ${money} 𝑷𝒐𝒆𝒔𝒐\n\n`;
            } catch {
              moneyMsg += `🔸 【${i + 1}】✦ 𝑼𝒏𝒌𝒏𝒐𝒘𝒏 𝑼𝒔𝒆𝒓\n`;
              moneyMsg += `   ╰─ 💵 ${usersWithMoney[i].money.toLocaleString()} 𝑷𝒐𝒆𝒔𝒐\n\n`;
            }
          }
          
          moneyMsg += "✦ 𝑴𝒐𝒏𝒆𝒚 𝒊𝒔𝒏'𝒕 𝒆𝒗𝒆𝒓𝒚𝒕𝒉𝒊𝒏𝒈, 𝒃𝒖𝒕 𝒊𝒕'𝒔 𝒂 𝒈𝒐𝒐𝒅 𝒔𝒕𝒂𝒓𝒕! ✦";
          message.reply(moneyMsg);
        } catch (error) {
          console.error(error);
          message.reply("❌ 𝑭𝒂𝒊𝒍𝒆𝒅 𝒕𝒐 𝒓𝒆𝒕𝒓𝒊𝒆𝒗𝒆 𝒎𝒐𝒏𝒆𝒚 𝒅𝒂𝒕𝒂");
        }
        break;

      default:
        const helpMsg = "╔══════════════════════════╗\n";
        helpMsg +=     "║    📖 𝐓𝐎𝐏 𝐂𝐎𝐌𝐌𝐀𝐍𝐃 𝐇𝐄𝐋𝐏 📖    ║\n";
        helpMsg +=     "╚══════════════════════════╝\n\n";
        helpMsg +=     "✨ 𝐀𝐯𝐚𝐢𝐥𝐚𝐛𝐥𝐞 𝐎𝐩𝐭𝐢𝐨𝐧𝐬:\n\n";
        helpMsg +=     "▸ top thread [number] - 𝐒𝐡𝐨𝐰𝐬 𝐭𝐨𝐩 𝐚𝐜𝐭𝐢𝐯𝐞 𝐠𝐫𝐨𝐮𝐩𝐬\n";
        helpMsg +=     "   ↳ 𝐄𝐱: top thread 5\n\n";
        helpMsg +=     "▸ top money - 𝐒𝐡𝐨𝐰𝐬 𝐭𝐨𝐩 𝟏𝟎 𝐫𝐢𝐜𝐡𝐞𝐬𝐭 𝐮𝐬𝐞𝐫𝐬\n";
        helpMsg +=     "   ↳ 𝐄𝐱: top money\n\n";
        helpMsg +=     "▸ top level - 𝐒𝐡𝐨𝐰𝐬 𝐭𝐨𝐩 𝟏𝟎 𝐡𝐢𝐠𝐡𝐞𝐬𝐭 𝐥𝐞𝐯𝐞𝐥 𝐮𝐬𝐞𝐫𝐬\n";
        helpMsg +=     "   ↳ 𝐄𝐱: top level\n\n";
        helpMsg +=     "▸ top user - 𝐀𝐥𝐢𝐚𝐬 𝐟𝐨𝐫 'top level'\n";
        helpMsg +=     "   ↳ 𝐄𝐱: top user\n\n";
        helpMsg +=     "✦ 𝑻𝒓𝒚 𝒕𝒉𝒆𝒔𝒆 𝒄𝒐𝒎𝒎𝒂𝒏𝒅𝒔 𝒕𝒐 𝒔𝒆𝒆 𝒘𝒉𝒐'𝒔 𝒐𝒏 𝒕𝒐𝒑! ✦";
        
        message.reply(helpMsg);
    }
  }
};
