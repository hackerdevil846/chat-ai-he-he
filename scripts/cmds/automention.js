module.exports = {
  config: {
    name: "automention",
    version: "1.0.0",
    author: "𝑨𝒔𝒊𝒇 𝑴𝒂𝒉𝒎𝒖𝒅",
    role: 0,
    category: "𝒐𝒕𝒉𝒆𝒓",
    shortDescription: {
      en: "𝒂𝒖𝒕𝒐𝒎𝒂𝒕𝒊𝒄𝒂𝒍𝒍𝒚 𝒎𝒆𝒏𝒕𝒊𝒐𝒏 𝒖𝒔𝒆𝒓𝒔"
    },
    longDescription: {
      en: "𝑨𝒖𝒕𝒐𝒎𝒂𝒕𝒊𝒄𝒂𝒍𝒍𝒚 𝒎𝒆𝒏𝒕𝒊𝒐𝒏𝒔 𝒖𝒔𝒆𝒓𝒔 𝒊𝒏 𝒕𝒉𝒆 𝒄𝒉𝒂𝒕"
    },
    guide: {
      en: "{𝒑}𝒂𝒖𝒕𝒐𝒎𝒆𝒏𝒕𝒊𝒐𝒏"
    }
  },

  onStart: async function({ message, event, api }) {
    try {
      if (Object.keys(event.mentions).length === 0) {
        await message.reply(`𝑨𝒑𝒏𝒂𝒌𝒆 𝒎𝒆𝒏𝒕𝒊𝒐𝒏: @[${event.senderID}:0]`);
      } else {
        for (let i = 0; i < Object.keys(event.mentions).length; i++) {
          const name = Object.values(event.mentions)[i].replace('@', '');
          const uid = Object.keys(event.mentions)[i];
          await message.reply(`𝑴𝒆𝒏𝒕𝒊𝒐𝒏𝒊𝒏𝒈: ${name}\n➺ @[${uid}:0]`);
        }
      }
    } catch (error) {
      console.error("𝑨𝒖𝒕𝒐𝒎𝒆𝒏𝒕𝒊𝒐𝒏 𝑬𝒓𝒓𝒐𝒓:", error);
      await message.reply("❌ 𝑺𝒐𝒎𝒆𝒕𝒉𝒊𝒏𝒈 𝒘𝒆𝒏𝒕 𝒘𝒓𝒐𝒏𝒈!");
    }
  }
};
