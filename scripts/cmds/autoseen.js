const fs = require('fs-extra');
const pathFile = __dirname + '/cache/autoseen.txt';

if (!fs.existsSync(pathFile)) {
  fs.writeFileSync(pathFile, 'false');
}

module.exports = {
  config: {
    name: "autoseen",
    aliases: ["autoread"],
    version: "1.0.0",
    author: "𝑨𝒔𝒊𝒇 𝑴𝒂𝒉𝒎𝒖𝒅",
    countDown: 5,
    role: 2,
    category: "𝒕𝒐𝒐𝒍𝒔",
    shortDescription: {
      en: "𝑨𝒖𝒕𝒐𝒎𝒂𝒕𝒊𝒄𝒂𝒍𝒍𝒚 𝒎𝒂𝒓𝒌 𝒎𝒆𝒔𝒔𝒂𝒈𝒆𝒔 𝒂𝒔 𝒔𝒆𝒆𝒏"
    },
    longDescription: {
      en: "𝑻𝒖𝒓𝒏 𝒐𝒏/𝒐𝒇𝒇 𝒂𝒖𝒕𝒐𝒎𝒂𝒕𝒊𝒄 𝒎𝒂𝒓𝒌𝒊𝒏𝒈 𝒎𝒆𝒔𝒔𝒂𝒈𝒆𝒔 𝒂𝒔 𝒔𝒆𝒆𝒏"
    },
    guide: {
      en: "{p}autoseen [on|off]"
    }
  },

  onStart: async function({ message, event, args }) {
    try {
      const [arg] = args;
      
      if (arg === 'on') {
        fs.writeFileSync(pathFile, 'true');
        await message.reply('✅ 𝑨𝒖𝒕𝒐 𝒔𝒆𝒆𝒏 𝒕𝒖𝒓𝒏𝒆𝒅 𝒐𝒏 𝒔𝒖𝒄𝒄𝒆𝒔𝒔𝒇𝒖𝒍𝒍𝒚');
      } 
      else if (arg === 'off') {
        fs.writeFileSync(pathFile, 'false');
        await message.reply('✅ 𝑨𝒖𝒕𝒐 𝒔𝒆𝒆𝒏 𝒕𝒖𝒓𝒏𝒆𝒅 𝒐𝒇𝒇 𝒔𝒖𝒄𝒄𝒆𝒔𝒔𝒇𝒖𝒍𝒍𝒚');
      } 
      else {
        const helpMessage = `❌ 𝑰𝒏𝒄𝒐𝒓𝒓𝒆𝒄𝒕 𝒔𝒚𝒏𝒕𝒂𝒙!\n💡 𝑼𝒔𝒆: ${global.GoatBot.config.prefix}${this.config.name} [on|off]`;
        await message.reply(helpMessage);
      }
    } 
    catch (error) {
      console.error('🔴 𝑬𝒓𝒓𝒐𝒓:', error);
      await message.reply('❌ 𝑨𝒏 𝒆𝒓𝒓𝒐𝒓 𝒐𝒄𝒄𝒖𝒓𝒆𝒅 𝒘𝒉𝒊𝒍𝒆 𝒑𝒓𝒐𝒄𝒆𝒔𝒔𝒊𝒏𝒈 𝒚𝒐𝒖𝒓 𝒓𝒆𝒒𝒖𝒆𝒔𝒕');
    }
  },

  onChat: async function({ api, event }) {
    const content = fs.readFileSync(pathFile, 'utf-8');
    if (content === 'true') {
      api.markAsReadAll(() => {});
    }
  }
};
