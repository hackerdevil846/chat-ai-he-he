module.exports.config = {
	name: "dictionary",
	version: "1.0.0",
	hasPermssion: 0,
	credits: "𝑨𝒔𝒊𝒇 𝑴𝒂𝒉𝒎𝒖𝒅",
	description: "𝑬𝒏𝒈𝒍𝒊𝒔𝒉 𝒅𝒊𝒄𝒕𝒊𝒐𝒏𝒂𝒓𝒚 𝒄𝒉𝒆𝒄𝒌 𝒌𝒐𝒓𝒂𝒓 𝒋𝒐𝒏𝒏𝒐",
  	usage: "[𝒕𝒆𝒙𝒕]",
	commandCategory: "𝑼𝒕𝒊𝒍𝒊𝒕𝒊𝒆𝒔",
  	cooldowns: 5
}

module.exports.run = function({api,event,args}) {
  const { threadID, messageID } = event;
  const fs = require('fs');
  
  // Function to convert text to Mathematical Bold Italic
  const toMathBoldItalic = (text) => {
    const mapping = {
      a: '𝒂', b: '𝒃', c: '𝒄', d: '𝒅', e: '𝒆', f: '𝒇', g: '𝒈', h: '𝒉', i: '𝒊', j: '𝒋',
      k: '𝒌', l: '𝒍', m: '𝒎', n: '𝒏', o: '𝒐', p: '𝒑', q: '𝒒', r: '𝒓', s: '𝒔', t: '𝒕',
      u: '𝒖', v: '𝒗', w: '𝒘', x: '𝒙', y: '𝒚', z: '𝒛',
      A: '𝑨', B: '𝑩', C: '𝑪', D: '𝑫', E: '𝑬', F: '𝑭', G: '𝑮', H: '𝑯', I: '𝑰', J: '𝑱',
      K: '𝑲', L: '𝑳', M: '𝑴', N: '𝑵', O: '𝑶', P: '𝑷', Q: '𝑸', R: '𝑹', S: '𝑺', T: '𝑻',
      U: '𝑼', V: '𝑽', W: '𝑾', X: '𝑿', Y: '𝒀', Z: '𝒁',
      ' ': ' ', "'": "'", '"': '"', ',': ',', '.': '.', '!': '!', '?': '?', ':': ':', ';': ';', 
      '-': '-', '(': '(', ')': ')', '[': '[', ']': ']', '{': '{', '}': '}', '/': '/', '\\': '\\'
    };
    
    return text.split('').map(char => mapping[char] || char).join('');
  };

  if (args[0]) {
    return require('axios').get(encodeURI(`https://api.dictionaryapi.dev/api/v2/entries/en/${args.join(" ").trim().toLowerCase()}`)).then(res => {
      let data = res.data[0];
      let meanings = data.meanings;
      let phonetics = data.phonetics;
      
      let msg_meanings = "";
      meanings.forEach(items => {
        let definition = items.definitions[0].definition;
        let example = items.definitions[0].example ? 
                     `\n   𝑬𝒙𝒂𝒎𝒑𝒍𝒆: \"${items.definitions[0].example.charAt(0).toUpperCase() + items.definitions[0].example.slice(1)}\"` : 
                     '';
        
        msg_meanings += `\n• ${toMathBoldItalic(items.partOfSpeech)}\n   ${definition.charAt(0).toUpperCase() + definition.slice(1)}${example}`;
      });
      
      let msg_phonetics = '';
      phonetics.forEach(items => {
        if (items.text) {
          msg_phonetics += `\n   /${items.text}/`;
        }
      });
      
      let msg = `❰ ❝ ${toMathBoldItalic(data.word)} ❞ ❱` +
                msg_phonetics +
                msg_meanings +
                `\n\n💖 𝑷𝒐𝒘𝒆𝒓𝒆𝒅 𝒃𝒚 𝑨𝒔𝒊𝒇 𝑴𝒂𝒉𝒎𝒖𝒅`;
                
      return api.sendMessage(msg, threadID, messageID);
    }).catch(err => {
      if (err.response && err.response.status === 404) {
        return api.sendMessage('𝑵𝒐 𝒅𝒆𝒇𝒊𝒏𝒊𝒕𝒊𝒐𝒏𝒔 𝒇𝒐𝒖𝒏𝒅. 𝑷𝒍𝒆𝒂𝒔𝒆 𝒕𝒓𝒚 𝒂𝒈𝒂𝒊𝒏.', threadID, messageID);
      }
      return api.sendMessage('𝑨𝒏 𝒆𝒓𝒓𝒐𝒓 𝒐𝒄𝒄𝒖𝒓𝒆𝒅. 𝑷𝒍𝒆𝒂𝒔𝒆 𝒕𝒓𝒚 𝒂𝒈𝒂𝒊𝒏 𝒍𝒂𝒕𝒆𝒓.', threadID, messageID);
    })
  } else {
    return api.sendMessage('𝑴𝒊𝒔𝒔𝒊𝒏𝒈 𝒊𝒏𝒑𝒖𝒕! 𝑷𝒍𝒆𝒂𝒔𝒆 𝒕𝒚𝒑𝒆 𝒂 𝒘𝒐𝒓𝒅 𝒕𝒐 𝒄𝒉𝒆𝒄𝒌.', threadID, messageID);
  }
}
