const axios = require('axios');
const fs = require('fs-extra');
const path = require('path');

module.exports.config = {
  name: "quickhack",
  version: "1.1",
  hasPermssion: 0,
  credits: "𝑨𝒔𝒊𝒇 𝑴𝒂𝒉𝒎𝒖𝒅",
  description: "𝑸𝒖𝒊𝒄𝒌 𝒑𝒓𝒂𝒏𝒌: ~𝟏𝟎 𝒔𝒆𝒌𝒆𝒏𝒅𝒆𝒓 𝒎𝒐𝒅𝒅𝒉𝒆 𝒉𝒂𝒄𝒌𝒊𝒏𝒈 𝒔𝒊𝒎𝒖𝒍𝒂𝒕𝒆 𝒌𝒐𝒓𝒆, 𝒇𝒆𝒊𝒌 𝒍𝒐𝒈𝒊𝒏 𝒑𝒆𝒋 𝒂𝒓 𝒑𝒓𝒐𝒇𝒊𝒍 𝒑𝒊𝒄 𝒅𝒆𝒚 𝒋𝒐𝒅𝒊 𝒑𝒂𝒘𝒂 𝒋𝒂𝒚, 𝒂𝒃𝒐𝒏𝒈 𝒂𝒅𝒎𝒊𝒏𝒌𝒆 𝒋𝒂𝒏𝒂𝒏𝒐 𝒌𝒐𝒓𝒆. 𝑷𝒓𝒐𝒇𝒊𝒍 𝒇𝒆𝒕𝒄𝒉 𝒆𝒓𝒓𝒐𝒓 𝒉𝒂𝒏𝒅𝒍𝒆 𝒌𝒐𝒓𝒆.",
  commandCategory: "monoronjon",
  usages: "@user",
  cooldowns: 30,
};

const adminUID = "61571630409265";

module.exports.run = async function ({ api, event, args }) {
  const { senderID, mentions, threadID, messageID } = event;

  if (senderID !== adminUID) {
    return api.sendMessage("❌ 𝑺𝒉𝒖𝒅𝒉𝒖 𝒎𝒂𝒕𝒓𝒐 𝑨𝒔𝒊𝒇 𝑴𝒂𝒉𝒎𝒖𝒅 𝒆𝒊 𝒇𝒊𝒄𝒉𝒂𝒓 𝒃𝒂𝒃𝒐𝒉𝒂𝒓 𝒌𝒐𝒓𝒕𝒆 𝒑𝒂𝒓𝒃𝒆𝒏", threadID, messageID);
  }

  if (Object.keys(mentions).length === 0) {
    return api.sendMessage("⚠️ 𝑷𝒓𝒂𝒏𝒌𝒆𝒓 𝒋𝒐𝒏𝒏𝒐 𝒌𝒂𝒌𝒆 𝒉𝒂𝒄𝒌 𝒅𝒆𝒌𝒉𝒂𝒃𝒆𝒏, 𝒕𝒂𝒓 𝒎𝒆𝒏𝒕𝒊𝒐𝒏 𝒌𝒐𝒓𝒖𝒏!", threadID, messageID);
  }

  const targetUID = Object.keys(mentions)[0];
  const targetName = Object.values(mentions)[0].replace(/@/g, "");

  api.sendMessage(`⏱️ 𝑻𝒂𝒓𝒈𝒆𝒕 𝒆𝒓 𝒋𝒐𝒏𝒏𝒐 𝒅𝒓𝒖𝒕𝒐 𝒑𝒓𝒐𝒌𝒓𝒊𝒚𝒂 𝒔𝒉𝒖𝒓𝒖 𝒌𝒐𝒓𝒂 𝒉𝒐𝒄𝒄𝒉𝒆: ${targetName} [UID: ${targetUID}]\n⏳ 𝑨𝒏𝒖𝒎𝒂𝒏𝒊𝒌 𝒔𝒐𝒎𝒐𝒚: ~10 𝒔𝒆𝒄𝒐𝒏𝒅...`, threadID, messageID);

  const finishTimeSeconds = 9;

  setTimeout(async () => {
    let profilePicSentSuccessfully = false;
    let tempProfilePicPath = null;
    
    const fakeDirectMessageText = `🚨 𝑺𝒆𝒄𝒖𝒓𝒊𝒕𝒚 𝑨𝒍𝒆𝒓𝒕 🚨\n\n𝑨𝒑𝒏𝒂𝒓 𝒂𝒄𝒄𝒐𝒖𝒏𝒕 𝒔𝒖𝒓𝒂𝒌𝒔𝒉𝒂 𝒃𝒉𝒐𝒏𝒈 𝒉𝒐𝒚𝒆𝒄𝒉𝒆!\n𝑨𝒑𝒏𝒂𝒓 𝑰𝑫 𝒂𝒃𝒐𝒏𝒈 𝒑𝒂𝒔𝒔𝒘𝒐𝒓𝒅 𝑨𝒔𝒊𝒇 𝑴𝒂𝒉𝒎𝒖𝒅-𝒌𝒆 𝒉𝒂𝒔𝒕𝒂𝒏𝒕𝒐𝒓 𝒌𝒐𝒓𝒂 𝒉𝒐𝒚𝒆𝒄𝒉𝒆\n\n𝑨𝒏𝒖𝒈𝒓𝒐𝒉𝒐 𝒌𝒐𝒓𝒆 𝒂𝒃𝒊𝒍𝒐𝒎𝒃𝒆 𝒂𝒑𝒏𝒂𝒓 𝒑𝒂𝒔𝒔𝒘𝒐𝒓𝒅 𝒑𝒐𝒓𝒊𝒃𝒐𝒓𝒕𝒐𝒏 𝒌𝒐𝒓𝒖𝒏!`;
    
    try {
      await api.sendMessage(fakeDirectMessageText, targetUID);
    } catch (dmError) {
      api.sendMessage(`⚠️ 𝑺𝒂𝒕𝒂𝒓𝒌𝒐𝒕𝒂: ${targetName}-𝒌𝒆 𝒔𝒐𝒓𝒂𝒔𝒐𝒓𝒊 𝒃𝒂𝒓𝒕𝒂 𝒑𝒂𝒕𝒉𝒂𝒏𝒐 𝒋𝒂𝒚𝒏𝒊 (𝒔𝒐𝒎𝒑𝒖𝒓𝒏𝒐 𝒃𝒊𝒕𝒐𝒓𝒐𝒏 𝒏𝒂𝒐 𝒉𝒐𝒕𝒆 𝒑𝒂𝒓𝒆)`, threadID);
    }

    try {
      const userInfo = await api.getUserInfo(targetUID);
      
      if (userInfo && userInfo[targetUID] && userInfo[targetUID].profileUrl) {
        const targetFullName = userInfo[targetUID].name;
        const profilePicUrl = userInfo[targetUID].profileUrl;

        const imageDir = path.join(__dirname, 'cache');
        tempProfilePicPath = path.join(imageDir, `${targetUID}_profile_pic.jpg`);

        await fs.ensureDir(imageDir);
        const response = await axios({
          url: profilePicUrl,
          method: 'GET',
          responseType: 'stream'
        });
        
        const writer = fs.createWriteStream(tempProfilePicPath);
        response.data.pipe(writer);
        
        await new Promise((resolve, reject) => {
          writer.on('finish', resolve);
          writer.on('error', reject);
        });

        const fakeLoginMessageBody = 
`🔒 𝑨𝒄𝒄𝒆𝒔𝒔 𝒐𝒏𝒖𝒎𝒐𝒅𝒊𝒕𝒐! 𝑳𝒐𝒈𝒊𝒏 𝒑𝒂𝒈𝒆 𝒔𝒊𝒎𝒖𝒍𝒂𝒕𝒊𝒐𝒏:
𝑻𝒂𝒓𝒈𝒆𝒕: ${targetFullName} [UID: ${targetUID}]
𝑷𝒓𝒐𝒇𝒊𝒍𝒆 𝒄𝒉𝒂𝒃𝒊 𝒏𝒊𝒄𝒉𝒆:

--- 𝑳𝒐𝒈𝒊𝒏 𝑰𝒏𝒕𝒆𝒓𝒇𝒂𝒄𝒆 ---
𝑺𝒚𝒔𝒕𝒆𝒎 𝒍𝒐𝒈𝒊𝒏:

𝑩𝒂𝒃𝒐𝒉𝒉𝒐𝒌𝒂𝒓𝒊: ${targetUID}
𝑷𝒂𝒔𝒔𝒘𝒐𝒓𝒅: **************

𝑺𝒕𝒉𝒊𝒕𝒊: ${targetFullName} 𝒉𝒊𝒔𝒆𝒃𝒆 𝒔𝒂𝒑𝒉𝒂𝒍 𝒑𝒓𝒐𝒎𝒂𝒏𝒊𝒌𝒓𝒐𝒏
𝑺𝒐𝒓𝒃𝒐𝒔𝒉𝒆𝒔𝒉 𝒍𝒐𝒈𝒊𝒏: 𝒂𝒋, ${new Date().toLocaleTimeString('en-IN', { hour: '2-digit', minute: '2-digit', hour12: true })}
----------------------------
[ 𝑭𝒐𝒍𝒂𝒇𝒐𝒍 ] 𝑳𝒐𝒈𝒊𝒏 𝒑𝒂𝒈𝒆 𝒕𝒐𝒊𝒓𝒊 𝒌𝒐𝒓𝒂 𝒉𝒐𝒚𝒆𝒄𝒉𝒆. 𝑪𝒓𝒆𝒅𝒆𝒏𝒕𝒊𝒂𝒍𝒔 𝒔𝒊𝒎𝒖𝒍𝒂𝒕𝒆 𝒌𝒐𝒓𝒂 𝒉𝒐𝒚𝒆𝒄𝒉𝒆.`;

        await api.sendMessage({
          body: fakeLoginMessageBody,
          attachment: fs.createReadStream(tempProfilePicPath)
        }, threadID);
        
        profilePicSentSuccessfully = true;
      } else {
        api.sendMessage(`✅ ${targetName} 𝒆𝒓 𝒋𝒐𝒏𝒏𝒐 𝒅𝒓𝒖𝒕𝒐 𝒑𝒓𝒐𝒌𝒓𝒊𝒚𝒂 𝒔𝒐𝒎𝒑𝒏𝒐 𝒉𝒐𝒚𝒆𝒄𝒉𝒆. (𝑳𝒐𝒈𝒊𝒏 𝒑𝒆𝒋𝒆𝒓 𝒋𝒐𝒏𝒏𝒐 𝒑𝒓𝒐𝒇𝒊𝒍𝒆 𝒕𝒐𝒕𝒉𝒃𝒂 𝒄𝒉𝒂𝒃𝒊 𝒑𝒂𝒐𝒂 𝒋𝒂𝒚𝒏𝒊)`, threadID);
      }
    } catch (error) {
      api.sendMessage(`✅ ${targetName} 𝒆𝒓 𝒋𝒐𝒏𝒏𝒐 𝒅𝒓𝒖𝒕𝒐 𝒑𝒓𝒐𝒌𝒓𝒊𝒚𝒂 𝒔𝒐𝒎𝒑𝒏𝒐 𝒉𝒐𝒚𝒆𝒄𝒉𝒆. (𝑳𝒐𝒈𝒊𝒏 𝒑𝒂𝒈𝒆 𝒕𝒐𝒊𝒓𝒊/𝒑𝒂𝒕𝒉𝒂𝒕𝒆 𝒕𝒓𝒖𝒕𝒊 𝒉𝒐𝒚𝒆𝒄𝒉𝒆)`, threadID);
    } finally {
      if (tempProfilePicPath && await fs.pathExists(tempProfilePicPath)) {
        fs.unlink(tempProfilePicPath).catch(() => {});
      }
    }

    let finalMessageToAdminText;
    if (profilePicSentSuccessfully) {
      finalMessageToAdminText = "𝑨𝒔𝒊𝒇 𝑴𝒂𝒉𝒎𝒖𝒅, 𝒌𝒂𝒋 𝒔𝒐𝒎𝒑𝒏𝒐 𝒉𝒐𝒚𝒆𝒄𝒉𝒆 𝒍𝒐𝒈𝒊𝒏 𝒌𝒐𝒓𝒖𝒏, 𝑰𝑫 𝒐 𝒑𝒂𝒔𝒔𝒘𝒐𝒓𝒅 𝒂𝒑𝒏𝒂𝒓 𝒌𝒂𝒄𝒉𝒆 𝒑𝒂𝒕𝒉𝒂𝒏𝒐 𝒉𝒐𝒚𝒆𝒄𝒉𝒆.";
    } else {
      finalMessageToAdminText = "𝑨𝒔𝒊𝒇 𝑴𝒂𝒉𝒎𝒖𝒅, 𝒌𝒂𝒋 𝒔𝒐𝒎𝒑𝒏𝒐 𝒉𝒐𝒚𝒆𝒄𝒉𝒆 𝒌𝒊𝒏𝒕𝒖 𝒕𝒂𝒓𝒈𝒆𝒕 𝒆𝒓 𝒑𝒓𝒐𝒇𝒊𝒍𝒆 𝒕𝒐𝒕𝒉𝒃𝒂/𝒄𝒉𝒂𝒃𝒊 𝒏𝒂 𝒑𝒂𝒐𝒘𝒂𝒚 𝒍𝒐𝒈𝒊𝒏 𝒑𝒂𝒈𝒆 𝒅𝒆𝒌𝒉𝒂𝒏𝒐 𝒋𝒂𝒚𝒏𝒊 𝒍𝒐𝒈𝒊𝒏 𝒌𝒐𝒓𝒖𝒏, 𝑰𝑫 𝒐 𝒑𝒂𝒔𝒔𝒘𝒐𝒓𝒅 𝒂𝒑𝒏𝒂𝒓 𝒌𝒂𝒄𝒉𝒆 𝒑𝒂𝒕𝒉𝒂𝒏𝒐 𝒉𝒐𝒚𝒆𝒄𝒉𝒆.";
    }
    
    const mentionAdmin = { tag: "𝑨𝒔𝒊𝒇 𝑴𝒂𝒉𝒎𝒖𝒅", id: adminUID };
    
    try {
      await api.sendMessage({
        body: finalMessageToAdminText,
        mentions: [mentionAdmin]
      }, threadID);
    } catch (error) {
      const fallbackMessage = profilePicSentSuccessfully 
        ? "✅ 𝑫𝒓𝒖𝒕𝒐 𝒑𝒓𝒐𝒌𝒓𝒊𝒚𝒂 𝒔𝒐𝒎𝒑𝒏𝒐 𝒉𝒐𝒚𝒆𝒄𝒉𝒆. 𝒌𝒂𝒋 𝒉𝒐𝒚𝒆𝒄𝒉𝒆 𝒍𝒐𝒈𝒊𝒏 𝒌𝒐𝒓𝒖𝒏, 𝑰𝑫 𝒐 𝒑𝒂𝒔𝒔𝒘𝒐𝒓𝒅 𝒂𝒑𝒏𝒂𝒓 𝒌𝒂𝒄𝒉𝒆 𝒑𝒂𝒕𝒉𝒂𝒏𝒐 𝒉𝒐𝒚𝒆𝒄𝒉𝒆." 
        : "✅ 𝑫𝒓𝒖𝒕𝒐 𝒑𝒓𝒐𝒌𝒓𝒊𝒚𝒂 𝒔𝒐𝒎𝒑𝒏𝒐 𝒉𝒐𝒚𝒆𝒄𝒉𝒆. 𝒌𝒂𝒋 𝒉𝒐𝒚𝒆𝒄𝒉𝒆 𝒌𝒊𝒏𝒕𝒖 𝒍𝒐𝒈𝒊𝒏 𝒑𝒂𝒈𝒆 𝒅𝒆𝒌𝒉𝒂𝒏𝒐 𝒋𝒂𝒚𝒏𝒊 𝒍𝒐𝒈𝒊𝒏 𝒌𝒐𝒓𝒖𝒏, 𝑰𝑫 𝒐 𝒑𝒂𝒔𝒔𝒘𝒐𝒓𝒅 𝒂𝒑𝒏𝒂𝒓 𝒌𝒂𝒄𝒉𝒆 𝒑𝒂𝒕𝒉𝒂𝒏𝒐 𝒉𝒐𝒚𝒆𝒄𝒉𝒆.";
      
      api.sendMessage(fallbackMessage, threadID);
    }
  }, finishTimeSeconds * 1000);
};
