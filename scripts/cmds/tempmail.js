const axios = require('axios');

module.exports.config = {
  name: "tempmail",
  aliases: ["tm"],
  version: "1.1",
  role: 0,
  countdown: 5,
  author: "𝐴𝑠𝑖𝑓 𝑀𝑎ℎ𝑚𝑢𝑑",
  usePrefix: true,
  description: "𝐶𝑟𝑒𝑎𝑡𝑒 𝑎 𝑡𝑒𝑚𝑝𝑜𝑟𝑎𝑟𝑦 𝑒𝑚𝑎𝑖𝑙 𝑎𝑛𝑑 𝑐ℎ𝑒𝑐𝑘 𝑖𝑛𝑏𝑜𝑥",
  category: "𝑚𝑒𝑑𝑖𝑎",
};

const TEMP_MAIL_URL = 'https://tempmail-api.codersensui.repl.co/api/gen';

module.exports.onStart = async ({ api, event, args }) => {
  try {
    // 📥 Inbox checker
    if (args[0] === 'inbox') {
      if (!args[1]) {
        return api.sendMessage("❌ 𝑃𝑙𝑒𝑎𝑠𝑒 𝑔𝑖𝑣𝑒 𝑎𝑛 𝑒𝑚𝑎𝑖𝑙 𝑎𝑑𝑑𝑟𝑒𝑠𝑠 𝑡𝑜 𝑐ℎ𝑒𝑐𝑘.", event.threadID);
      }

      const email = args[1];
      const inboxRes = await axios.get(`https://tempmail-api.codersensui.repl.co/api/getmessage/${email}`);
      const msgs = inboxRes.data.messages;

      if (!msgs || msgs.length === 0) {
        return api.sendMessage(`📭 𝑁𝑜 𝑚𝑒𝑠𝑠𝑎𝑔𝑒𝑠 𝑓𝑜𝑢𝑛𝑑 𝑓𝑜𝑟: ${email}`, event.threadID);
      }

      let replyText = `📬 𝐼𝑛𝑏𝑜𝑥 𝑓𝑜𝑟: ${email}\n━━━━━━━━━━━━━━━\n`;

      msgs.slice(0, 5).forEach((m, i) => {
        replyText += `\n#${i + 1}\n`;
        replyText += `👤 𝐹𝑟𝑜𝑚: ${m.sender}\n`;
        replyText += `📌 𝑆𝑢𝑏𝑗𝑒𝑐𝑡: ${m.subject || '— 𝑁𝑜 𝑠𝑢𝑏𝑗𝑒𝑐𝑡'}\n`;
        replyText += `💬 𝑀𝑒𝑠𝑠𝑎𝑔𝑒: ${m.message.replace(/<[^>]+>/g, '').trim()}\n`;
      });

      if (msgs.length > 5) {
        replyText += `\n⚠️ 𝑂𝑛𝑙𝑦 𝑠ℎ𝑜𝑤𝑖𝑛𝑔 5/ ${msgs.length} 𝑚𝑒𝑠𝑠𝑎𝑔𝑒𝑠.`;
      }

      return api.sendMessage(replyText, event.threadID);
    }

    // 📧 Generate temp mail
    const genRes = await axios.get(TEMP_MAIL_URL);
    const genData = genRes.data;

    if (!genData.email) {
      return api.sendMessage("❌ 𝐹𝑎𝑖𝑙𝑒𝑑 𝑡𝑜 𝑔𝑒𝑛𝑒𝑟𝑎𝑡𝑒 𝑡𝑒𝑚𝑝 𝑒𝑚𝑎𝑖𝑙.", event.threadID);
    }

    api.sendMessage(`📩 𝐺𝑒𝑛𝑒𝑟𝑎𝑡𝑒𝑑 𝑡𝑒𝑚𝑝 𝑒𝑚𝑎𝑖𝑙:\n👉 ${genData.email}\n\nℹ️ 𝑈𝑠𝑒: tm inbox ${genData.email}`, event.threadID);

  } catch (err) {
    console.error("TempMail Error:", err);
    api.sendMessage("⚠️ 𝐸𝑟𝑟𝑜𝑟 𝑐ℎ𝑒𝑐𝑘𝑖𝑛𝑔 𝑡𝑒𝑚𝑝𝑚𝑎𝑖𝑙 𝑠𝑒𝑟𝑣𝑒𝑟.", event.threadID);
  }
};
