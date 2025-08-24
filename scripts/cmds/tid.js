"use strict";

/**
 * Command: tid
 * Description: Sends the current group's/thread's ID.
 * Credits: 𝑨𝒔𝒊𝒇 𝑴𝒂𝒉𝒎𝒖𝒅
 */

module.exports.config = {
  name: "tid",
  version: "1.0.0",
  hasPermssion: 0,
  credits: "𝑨𝒔𝒊𝒇 𝑴𝒂𝒉𝒎𝒖𝒅",
  description: "𝙂𝙧𝙪𝙥𝙚𝙧 𝙞𝙙 𝙟𝙖𝙣𝙩𝙚 𝙘𝙝𝙖𝙞",
  category: "𝙂𝙧𝙪𝙥",
  usages: "tid",
  cooldowns: 5,
  dependencies: ""
};

module.exports.run = async function({ api, event }) {
  return api.sendMessage(
    `𝙀𝙞 𝙜𝙧𝙪𝙥𝙚𝙧 𝙞𝙙: ${event.threadID}`,
    event.threadID,
    event.messageID
  );
};
