module.exports.config = {
	name: "package",
	version: "1.0.2", 
	hasPermssion: 0,
	credits: "𝑨𝒔𝒊𝒇 𝑴𝒂𝒉𝒎𝒖𝒅", 
	description: "𝒑𝒓𝒐𝒋𝒆𝒄𝒕 𝒑𝒂𝒄𝒌𝒂𝒈𝒆 𝒋𝒂𝒏𝒌𝒂𝒓𝒊",
	commandCategory: "𝒔𝒚𝒔𝒕𝒆𝒎",
	cooldowns: 1,
	dependencies: {
    "request":"",
    "fs-extra":"",
    "axios":""
  }
};

module.exports.run = async function({ api, event }) {
  const axios = global.nodemodule["axios"];
  const request = global.nodemodule["request"];
  const fs = global.nodemodule["fs-extra"];
  
  const link = ["https://i.imgur.com/6UxTLqh.png"];
  
  const callback = () => api.sendMessage({
    body: `{
  "name": "𝑨𝒔𝒊𝒇𝑩𝒐𝒕",
  "version": "30.0.0",
  "description": "𝑭𝒂𝒄𝒆𝒃𝒐𝒐𝒌 𝑴𝒆𝒔𝒔𝒆𝒏𝒈𝒆𝒓 𝑩𝒐𝒕 𝒃𝒚 𝑨𝒔𝒊𝒇 𝑴𝒂𝒉𝒎𝒖𝒅",
  "main": "𝑨𝒔𝒊𝒇𝑩𝒐𝒕.𝒋𝒔",
  "scripts": {
    "start": "node index.js",
    "login": "node login",
    "test": "node --trace-warnings --use_strict --async-stack-traces mirai"
  },
  "repository": {
    "type": "git",
    "url": "https://github.com/𝑨𝒔𝒊𝒇-𝑴𝒂𝒉𝒎𝒖𝒅/𝒇𝒃-𝒃𝒐𝒕"
  },
  "keywords": [
    "bot",
    "facebook",
    "asifmahmud",
    "messenger",
    "javascript",
    "asif",
    "mahmud",
    "ai"
  ],
  "author": "𝑨𝒔𝒊𝒇 𝑴𝒂𝒉𝒎𝒖𝒅",
  "license": "GPL-3.0",
  "bugs": {
    "url": "https://github.com/𝑨𝒔𝒊𝒇-𝑴𝒂𝒉𝒎𝒖𝒅/𝒇𝒃-𝒃𝒐𝒕/issues"
  },
  "homepage": "https://github.com/𝑨𝒔𝒊𝒇-𝑴𝒂𝒉𝒎𝒖𝒅/𝒇𝒃-𝒃𝒐𝒕#readme",
  "dependencies": {
    "@asifmahmud/assets": "",
    "@replit/database": "^2.0.1",
    "axios": "^0.26.1",
    "canvas": "^2.7.0",
    "chalk": "^4.1.2",
    "fca-unofficial": "^1.3.13-2",
    "fs-extra": "^10.0.1",
    "jimp": "",
    "moment-timezone": "^0.5.34",
    "request": "^2.88.2",
    "ytdl-core": "^4.11.0"
  }
}`,
    attachment: fs.createReadStream(__dirname + "/cache/package.png")
  }, event.threadID, () => fs.unlinkSync(__dirname + "/cache/package.png")); 
  
  return request(encodeURI(link[Math.floor(Math.random() * link.length)]))
    .pipe(fs.createWriteStream(__dirname + "/cache/package.png"))
    .on("close", () => callback());
};
