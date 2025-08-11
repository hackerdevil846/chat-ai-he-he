module.exports.config = {
  name: "rainbow",
  version: "1.0.0",
  hasPermssion: 0,
  credits: "𝑨𝒔𝒊𝒇 𝑴𝒂𝒉𝒎𝒖𝒅",
  description: "𝑪𝒐𝒏𝒗𝒆𝒓𝒔𝒂𝒕𝒊𝒐𝒏 𝒆𝒓 𝒓𝒐𝒏𝒈 𝒑𝒂𝒓𝒊𝒃𝒂𝒓𝒕𝒂𝒏 𝒌𝒐𝒓𝒖𝒏 𝒏𝒊𝒔𝒄𝒉𝒐𝒚 𝒔𝒂𝒏𝒌𝒉𝒚𝒂𝒏𝒖𝒔𝒂𝒓𝒆",
  commandCategory: "𝑺𝒚𝒔𝒕𝒆𝒎",
  usages: "𝒓𝒂𝒊𝒏𝒃𝒐𝒘 [𝒑𝒂𝒓𝒊𝒃𝒂𝒓𝒕𝒂𝒏]",
  cooldowns: 0,
  dependencies: []
};

module.exports.run = async({
  api,
  event,
  args,
  client,
  __GLOBAL
})=> {
  var value = args.join();
  if (isNaN(value)) return api.sendMessage(`𝑬𝒕𝒂 𝒆𝒌𝒕𝒊 𝒔𝒂𝒏𝒌𝒉𝒚𝒂 𝒏𝒐𝒚! 😒`, event.threadID, event.messageID);
  if (value > 10000) return api.sendMessage(`𝑬𝒓 𝒕𝒂𝒌𝒂 𝒏𝒊𝒕𝒆 𝒉𝒐𝒃𝒆 10000 𝒆𝒓 𝒄𝒉𝒆𝒚𝒆 𝒌𝒐𝒎! 🙄`, event.threadID, event.messageID);
  var color = ['196241301102133', '169463077092846', '2442142322678320', '234137870477637', '980963458735625', '175615189761153', '2136751179887052', '2058653964378557', '2129984390566328', '174636906462322', '1928399724138152', '417639218648241', '930060997172551', '164535220883264', '370940413392601', '205488546921017', '809305022860427'];
  
  api.sendMessage(`🌈 𝑹𝒂𝒊𝒏𝒃𝒐𝒘 𝒄𝒐𝒍𝒐𝒓 𝒔𝒕𝒂𝒓𝒕𝒆𝒅! 𝑻𝒐𝒕𝒂𝒍 𝒑𝒂𝒓𝒊𝒃𝒂𝒓𝒕𝒂𝒏: ${value} 𝒃𝒂𝒓`, event.threadID);
  
  for (var i = 0; i < value; i++) {
    api.changeThreadColor(color[Math.floor(Math.random() * color.length)], event.threadID)
    await new Promise(resolve => setTimeout(resolve, 1000));
  }
  
  return api.sendMessage(`🎉 𝑺𝒂𝒑𝒉𝒂𝒍𝒃𝒉𝒂𝒃𝒆 ${value} 𝒃𝒂𝒓 𝒓𝒐𝒏𝒈 𝒑𝒂𝒓𝒊𝒃𝒂𝒓𝒕𝒂𝒏 𝒉𝒐𝒍𝒐!`, event.threadID);
}
