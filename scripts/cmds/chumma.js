const fs = require("fs");
module.exports.config = {
	name: "chumma",
  version: "1.0.1",
	hasPermssion: 0,
	credits: "𝑨𝒔𝒊𝒇 𝑴𝒂𝒉𝒎𝒖𝒅", 
	description: "𝒎𝒐𝒋𝒂𝒓 𝒋𝒐𝒏𝒏𝒐 𝒄𝒉𝒖𝒎𝒎𝒂 𝒅𝒆𝒘𝒂",
	commandCategory: "𝒏𝒐 𝒑𝒓𝒆𝒇𝒊𝒙",
	usages: "🙂",
  cooldowns: 5, 
};

function toMathBoldItalic(text) {
  const map = {
    'A': '𝑨', 'B': '𝑩', 'C': '𝑪', 'D': '𝑫', 'E': '𝑬', 'F': '𝑭', 'G': '𝑮', 'H': '𝑯', 'I': '𝑰', 'J': '𝑱', 'K': '𝑲', 'L': '𝑳', 'M': '𝑴',
    'N': '𝑵', 'O': '𝑶', 'P': '𝑷', 'Q': '𝑸', 'R': '𝑹', 'S': '𝑺', 'T': '𝑻', 'U': '𝑼', 'V': '𝑽', 'W': '𝑾', 'X': '𝑿', 'Y': '𝒀', 'Z': '𝒁',
    'a': '𝒂', 'b': '𝒃', 'c': '𝒄', 'd': '𝒅', 'e': '𝒆', 'f': '𝒇', 'g': '𝒈', 'h': '𝒉', 'i': '𝒊', 'j': '𝒋', 'k': '𝒌', 'l': '𝒍', 'm': '𝒎',
    'n': '𝒏', 'o': '𝒐', 'p': '𝒑', 'q': '𝒒', 'r': '𝒓', 's': '𝒔', 't': '𝒕', 'u': '𝒖', 'v': '𝒗', 'w': '𝒘', 'x': '𝒙', 'y': '𝒚', 'z': '𝒛',
    ' ': ' ', '!': '!', '?': '?', '.': '.', ',': ',', "'": "'", '"': '"', ':': ':', ';': ';', '-': '-', '_': '_'
  };
  return text.split('').map(char => map[char] || char).join('');
}

module.exports.handleEvent = function({ api, event }) {
  const { threadID, messageID, body } = event;
  const triggers = ["😘", "kiss", "chumma", "chumu", "চুমা", "চুমু"];
  
  if (triggers.some(trigger => 
      body.toLowerCase().includes(trigger.toLowerCase()) ||
      body.includes("😘"))) {
    
    const responses = [
      "𝑼𝒎𝒎𝒎𝒎𝒎𝒎𝒎𝒂𝒂𝒂𝒂𝒂𝒂𝒉𝒉𝒉𝒉𝒉𝒉😘😘 𝑺𝒉𝒐𝒏𝒂 😘",
      "𝑴𝒖𝒂𝒂𝒂𝒂𝒂𝒉𝒉𝒉𝒉𝒉𝒉𝒉😘😘 𝑩𝒂𝒄𝒉𝒂 😘",
      "𝑪𝒉𝒖𝒎𝒎𝒂 𝒅𝒊𝒍𝒂𝒎 𝒕𝒐𝒎𝒂𝒌𝒆 😘😘",
      "𝑲𝒊𝒔𝒔 𝒌𝒐𝒓𝒆 𝒅𝒊𝒍𝒂𝒎 😘😘"
    ];
    
    const randomResponse = responses[Math.floor(Math.random() * responses.length)];
    const formattedResponse = toMathBoldItalic(randomResponse);
    
    api.sendMessage(formattedResponse, threadID, messageID);
    api.setMessageReaction("😘", messageID, (err) => {}, true);
  }
};

module.exports.run = function() {};
