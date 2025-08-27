module.exports = {
  config: {
    name: "job",
    version: "1.0.2",
    author: "𝑨𝒔𝒊𝒇 𝑴𝒂𝒉𝒎𝒖𝒅",
    role: 0,
    category: "economy",
    shortDescription: {
      en: "𝑬𝒂𝒓𝒏 𝒄𝒐𝒊𝒏𝒔 𝒃𝒚 𝒘𝒐𝒓𝒌𝒊𝒏𝒈"
    },
    longDescription: {
      en: "𝑾𝒐𝒓𝒌 𝒕𝒐 𝒆𝒂𝒓𝒏 𝒎𝒐𝒏𝒆𝒚 𝒊𝒏 𝒕𝒉𝒆 𝒆𝒄𝒐𝒏𝒐𝒎𝒚 𝒔𝒚𝒔𝒕𝒆𝒎"
    },
    guide: {
      en: "{p}job"
    },
    cooldowns: 5
  },

  langs: {
    en: {
      cooldown: "𝑻𝒖𝒎𝒊 𝒌𝒂𝒋 𝒔𝒉𝒆𝒔𝒉 𝒌𝒐𝒓𝒆𝒄𝒉𝒉𝒐, 𝒂𝒃𝒂𝒓 𝒂𝒔𝒉𝒐: %1 𝒎𝒊𝒏𝒖𝒕𝒆(𝒔) %2 𝒔𝒆𝒄𝒐𝒏𝒅(𝒔)."
    }
  },

  onStart: async function({ event, message, Currencies, getLang }) {
    const cooldownTime = 5 * 60 * 1000; // 5 minutes cooldown
    let data = (await Currencies.getData(event.senderID)).data || {};
    
    if (data.work2Time && (Date.now() - data.work2Time) < cooldownTime) {
      const timeLeft = cooldownTime - (Date.now() - data.work2Time);
      const minutes = Math.floor(timeLeft / 60000);
      const seconds = Math.floor((timeLeft % 60000) / 1000);
      
      return message.reply(getLang("cooldown", minutes, seconds));
    }

    const menu = `𝑪𝒐𝒊𝒏 𝑬𝒂𝒓𝒏 𝑱𝒐𝒃 𝑪𝒆𝒏𝒕𝒆𝒓

1. 𝑰𝒏𝒅𝒖𝒔𝒕𝒓𝒊𝒂𝒍 𝒛𝒐𝒏𝒆 𝒌𝒂𝒋
2. 𝑺𝒆𝒓𝒗𝒊𝒄𝒆 𝒂𝒓𝒆𝒂 𝒌𝒂𝒋
3. 𝑶𝒊𝒍 𝒇𝒊𝒆𝒍𝒅 𝒌𝒂𝒋
4. 𝑴𝒊𝒏𝒊𝒏𝒈 𝒌𝒂𝒋
5. 𝑫𝒊𝒈𝒈𝒊𝒏𝒈 𝒌𝒂𝒋
6. 𝑺𝒑𝒆𝒄𝒊𝒂𝒍 𝒋𝒐𝒃
7. 𝑼𝒑𝒅𝒂𝒕𝒆 𝒔𝒐𝒐𝒏...

⚡️𝑫𝒐𝒚𝒂 𝒌𝒐𝒓𝒆 𝒓𝒆𝒑𝒍𝒚 𝒌𝒐𝒓𝒆 𝒏𝒖𝒎𝒃𝒆𝒓 𝒄𝒉𝒐𝒐𝒔𝒆 𝒌𝒐𝒓𝒖𝒏`;

    await message.reply(menu);
    
    // Store the cooldown time
    data.work2Time = Date.now();
    await Currencies.setData(event.senderID, { data });
  },

  onChat: async function({ event, message, Currencies, reply }) {
    if (event.type === "message_reply") {
      const userData = (await Currencies.getData(event.senderID)).data || {};
      
      if (!userData.work2Time) return;
      
      // Job arrays with Bengali translations
      const rdcn = [
        '𝒔𝒕𝒂𝒇𝒇 𝒉𝒊𝒓𝒆 𝒌𝒐𝒓𝒕𝒆𝒄𝒉𝒊',
        '𝒉𝒐𝒕𝒆𝒍 𝒂𝒅𝒎𝒊𝒏𝒊𝒔𝒕𝒓𝒂𝒕𝒐𝒓',
        '𝒑𝒐𝒘𝒆𝒓 𝒑𝒍𝒂𝒏𝒕 𝒂 𝒌𝒂𝒋 𝒌𝒐𝒓𝒕𝒆𝒄𝒉𝒊',
        '𝒓𝒆𝒔𝒕𝒂𝒖𝒓𝒂𝒏𝒕 𝒄𝒉𝒆𝒇',
        '𝒘𝒐𝒓𝒌𝒆𝒓'
      ];
      
      const rddv = [
        '𝒑𝒍𝒖𝒎𝒃𝒆𝒓',
        '𝒏𝒆𝒊𝒈𝒉𝒃𝒐𝒓 𝒆𝒓 𝑨𝑪 𝒓𝒆𝒑𝒂𝒊𝒓',
        '𝒎𝒖𝒍𝒕𝒊-𝒍𝒆𝒗𝒆𝒍 𝒔𝒂𝒍𝒆 𝒌𝒐𝒓𝒕𝒆𝒄𝒉𝒊',
        '𝒇𝒍𝒚𝒆𝒓 𝒅𝒊𝒔𝒕𝒓𝒊𝒃𝒖𝒕𝒊𝒐𝒏 𝒌𝒐𝒓𝒕𝒆𝒄𝒉𝒊',
        '𝒔𝒉𝒊𝒑𝒑𝒆𝒓',
        '𝒄𝒐𝒎𝒑𝒖𝒕𝒆𝒓 𝒓𝒆𝒑𝒂𝒊𝒓 𝒌𝒐𝒓𝒕𝒆𝒄𝒉𝒊',
        '𝒕𝒐𝒖𝒓 𝒈𝒖𝒊𝒅𝒆',
        '𝒃𝒖𝒂 𝒆𝒓 𝒌𝒂𝒋'
      ];
      
      const rdmd = [
        '13 𝒃𝒂𝒓𝒓𝒆𝒍 𝒐𝒊𝒍 𝒆𝒂𝒓𝒏 𝒌𝒐𝒓𝒆𝒄𝒉𝒉𝒊',
        '8 𝒃𝒂𝒓𝒓𝒆𝒍 𝒐𝒊𝒍 𝒆𝒂𝒓𝒏 𝒌𝒐𝒓𝒆𝒄𝒉𝒉𝒊',
        '9 𝒃𝒂𝒓𝒓𝒆𝒍 𝒐𝒊𝒍 𝒆𝒂𝒓𝒏 𝒌𝒐𝒓𝒆𝒄𝒉𝒉𝒊',
        '𝒐𝒊𝒍 𝒄𝒉𝒖𝒓𝒊 𝒌𝒐𝒓𝒕𝒆𝒄𝒉𝒊',
        '𝒐𝒊𝒍 𝒆 𝒑𝒂𝒏𝒊 𝒎𝒊𝒍𝒊𝒚𝒆 𝒔𝒆𝒍𝒍 𝒌𝒐𝒓𝒆𝒄𝒉𝒉𝒊'
      ];
      
      const rdq = [
        '𝒊𝒓𝒐𝒏 𝒐𝒓𝒆',
        '𝒈𝒐𝒍𝒅 𝒐𝒓𝒆',
        '𝒄𝒐𝒂𝒍 𝒐𝒓𝒆',
        '𝒍𝒆𝒂𝒅 𝒐𝒓𝒆',
        '𝒄𝒐𝒑𝒑𝒆𝒓 𝒐𝒓𝒆',
        '𝒐𝒊𝒍 𝒐𝒓𝒆'
      ];
      
      const rddd = [
        '𝒅𝒊𝒂𝒎𝒐𝒏𝒅',
        '𝒈𝒐𝒍𝒅',
        '𝒄𝒐𝒂𝒍',
        '𝒆𝒎𝒆𝒓𝒂𝒍𝒅',
        '𝒊𝒓𝒐𝒏',
        '𝒐𝒓𝒅𝒊𝒏𝒂𝒓𝒚 𝒔𝒕𝒐𝒏𝒆',
        '𝒍𝒂𝒛𝒚',
        '𝒃𝒍𝒖𝒆𝒔𝒕𝒐𝒏𝒆'
      ];
      
      const rddd1 = [
        '𝒗𝒊𝒑 𝒂𝒕𝒊𝒕𝒉𝒊',
        '𝒑𝒂𝒕𝒆𝒏𝒕',
        '𝒐𝒔𝒕𝒓𝒊𝒄𝒉',
        '23 𝒃𝒐𝒄𝒉𝒐𝒓𝒆𝒓 𝒇𝒐𝒐𝒍',
        '𝒑𝒂𝒕𝒓𝒐𝒏',
        '92 𝒃𝒐𝒄𝒉𝒐𝒓𝒆𝒓 𝒕𝒚𝒄𝒐𝒐𝒏',
        '12 𝒃𝒐𝒄𝒉𝒐𝒓𝒆𝒓 𝒃𝒐𝒚𝒊'
      ];

      const work1 = rdcn[Math.floor(Math.random() * rdcn.length)];
      const work2 = rddv[Math.floor(Math.random() * rddv.length)];
      const work3 = rdmd[Math.floor(Math.random() * rdmd.length)];
      const work4 = rdq[Math.floor(Math.random() * rdq.length)];
      const work5 = rddd[Math.floor(Math.random() * rddd.length)];
      const work6 = rddd1[Math.floor(Math.random() * rddd1.length)];

      // Random coin amounts
      const coinscn = Math.floor(Math.random() * 401) + 200;
      const coinsdv = Math.floor(Math.random() * 801) + 200;
      const coinsmd = Math.floor(Math.random() * 401) + 200;
      const coinsq = Math.floor(Math.random() * 601) + 200;
      const coinsdd = Math.floor(Math.random() * 201) + 200;
      const coinsdd1 = Math.floor(Math.random() * 801) + 200;

      let msg = "";
      let coinsEarned = 0;

      switch(event.body) {
        case "1": 
          msg = `⚡️𝑻𝒖𝒎𝒊 𝒊𝒏𝒅𝒖𝒔𝒕𝒓𝒊𝒂𝒍 𝒛𝒐𝒏𝒆 𝒆 ${work1} 𝒌𝒂𝒋 𝒌𝒐𝒓𝒆 ${coinscn}$ 𝒆𝒂𝒓𝒏 𝒌𝒐𝒓𝒄𝒉𝒐.`;
          coinsEarned = coinscn;
          break;
        case "2": 
          msg = `⚡️𝑻𝒖𝒎𝒊 𝒔𝒆𝒓𝒗𝒊𝒄𝒆 𝒂𝒓𝒆𝒂 𝒕𝒆 ${work2} 𝒌𝒂𝒋 𝒌𝒐𝒓𝒆 ${coinsdv}$ 𝒆𝒂𝒓𝒏 𝒌𝒐𝒓𝒄𝒉𝒐.`;
          coinsEarned = coinsdv;
          break;
        case "3": 
          msg = `⚡️𝑻𝒖𝒎𝒊 𝒐𝒑𝒆𝒏 𝒐𝒊𝒍 𝒆 ${work3} 𝒌𝒐𝒓𝒆 ${coinsmd}$ 𝒆𝒂𝒓𝒏 𝒌𝒐𝒓𝒄𝒉𝒐.`;
          coinsEarned = coinsmd;
          break;
        case "4": 
          msg = `⚡️𝑻𝒖𝒎𝒊 ${work4} 𝒎𝒊𝒏𝒆 𝒌𝒐𝒓𝒆 ${coinsq}$ 𝒆𝒂𝒓𝒏 𝒌𝒐𝒓𝒄𝒉𝒐.`;
          coinsEarned = coinsq;
          break;
        case "5": 
          msg = `⚡️𝑻𝒖𝒎𝒊 ${work5} 𝒅𝒊𝒈 𝒌𝒐𝒓𝒆 ${coinsdd}$ 𝒆𝒂𝒓𝒏 𝒌𝒐𝒓𝒄𝒉𝒐.`;
          coinsEarned = coinsdd;
          break;
        case "6": 
          msg = `⚡️𝑻𝒖𝒎𝒊 ${work6} 𝒌𝒆 𝒄𝒉𝒐𝒐𝒔𝒆 𝒌𝒐𝒓𝒍𝒆 𝒂𝒏𝒅 ${coinsdd1}$ 𝒅𝒆𝒘𝒂 𝒉𝒐𝒍𝒐, 𝒋𝒐𝒅𝒊 𝒙𝒙𝒙 1 𝒏𝒊𝒈𝒉𝒕, 𝒕𝒂𝒉𝒐𝒍𝒆 𝒕𝒖𝒎𝒊 𝒓𝒊𝒈𝒉𝒕 𝒂𝒘𝒂𝒚 𝒂𝒈𝒓𝒆𝒆 𝒌𝒐𝒓𝒍𝒆 :)))`;
          coinsEarned = coinsdd1;
          break;
        case "7": 
          msg = "⚡️ 𝑼𝒑𝒅𝒂𝒕𝒆 𝒔𝒐𝒐𝒏..."; 
          break;
        default: 
          return;
      };

      if (coinsEarned > 0) {
        await Currencies.increaseMoney(event.senderID, coinsEarned);
      }
      
      await message.reply(msg);
    }
  }
};
