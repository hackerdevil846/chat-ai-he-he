const fs = require('fs-extra');
const pathFile = __dirname + '/cache/autoseen.txt';

if (!fs.existsSync(pathFile)) {
  fs.writeFileSync(pathFile, 'false');
}

module.exports.config = {
  name: 'autoseen',
  version: '1.0.0',
  hasPermssion: 2,
  credits: '𝑨𝒔𝒊𝒇 𝑴𝒂𝒉𝒎𝒖𝒅',
  description: '𝑨𝒖𝒕𝒐𝒎𝒂𝒕𝒊𝒄𝒂𝒍𝒍𝒚 𝒎𝒂𝒓𝒌 𝒎𝒆𝒔𝒔𝒂𝒈𝒆𝒔 𝒂𝒔 𝒔𝒆𝒆𝒏',
  category: '𝒕𝒐𝒐𝒍𝒔',
  usages: 'on/off',
  cooldowns: 5
};

module.exports.handleEvent = async ({ api, event }) => {
  const content = fs.readFileSync(pathFile, 'utf-8');
  if (content === 'true') {
    api.markAsReadAll(() => {});
  }
};

module.exports.onStart = async ({ api, event, args }) => {
  try {
    const [arg] = args;
    
    if (arg === 'on') {
      fs.writeFileSync(pathFile, 'true');
      api.sendMessage('✅ 𝑨𝒖𝒕𝒐 𝒔𝒆𝒆𝒏 𝒕𝒖𝒓𝒏𝒆𝒅 𝒐𝒏 𝒔𝒖𝒄𝒄𝒆𝒔𝒔𝒇𝒖𝒍𝒍𝒚', event.threadID, event.messageID);
    } 
    else if (arg === 'off') {
      fs.writeFileSync(pathFile, 'false');
      api.sendMessage('✅ 𝑨𝒖𝒕𝒐 𝒔𝒆𝒆𝒏 𝒕𝒖𝒓𝒏𝒆𝒅 𝒐𝒇𝒇 𝒔𝒖𝒄𝒄𝒆𝒔𝒔𝒇𝒖𝒍𝒍𝒚', event.threadID, event.messageID);
    } 
    else {
      const helpMessage = `❌ 𝑰𝒏𝒄𝒐𝒓𝒓𝒆𝒄𝒕 𝒔𝒚𝒏𝒕𝒂𝒙!\n💡 𝑼𝒔𝒆: ${global.config.PREFIX}${this.config.name} [on|off]`;
      api.sendMessage(helpMessage, event.threadID, event.messageID);
    }
  } 
  catch (error) {
    console.error('🔴 𝑬𝒓𝒓𝒐𝒓:', error);
    api.sendMessage('❌ 𝑨𝒏 𝒆𝒓𝒓𝒐𝒓 𝒐𝒄𝒄𝒖𝒓𝒆𝒅 𝒘𝒉𝒊𝒍𝒆 𝒑𝒓𝒐𝒄𝒆𝒔𝒔𝒊𝒏𝒈 𝒚𝒐𝒖𝒓 𝒓𝒆𝒒𝒖𝒆𝒔𝒕', event.threadID, event.messageID);
  }
};
