const axios = require('axios');
const fs = require('fs-extra');
const path = require('path');

module.exports = {
  config: {
    name: "owner",
    author: "Asif",
    role: 0,
    shortDescription: "Premium Owner Profile ✨",
    longDescription: "Displays owner's information in premium atomic design style with video attachment.",
    category: "admin",
    guide: "{pn}"
  },

  onStart: async function ({ api, event }) {
    try {
      // --- Owner Information ---
      const ownerInfo = {
        name: '𝑨𝒔𝒊𝒇 𝑴𝒂𝒉𝒎𝒖𝒅',
        preference: '🕋 𝑰𝒔𝒍𝒂𝒎𝒊𝒄 𝑳𝒊𝒇𝒆𝒔𝒕𝒚𝒍𝒆',
        hobbies: '🎧 𝑴𝒖𝒔𝒊𝒄, 🎮 𝑮𝒂𝒎𝒊𝒏𝒈, 📚 𝑳𝒆𝒂𝒓𝒏𝒊𝒏𝒈',
        gender: '𝑴𝒂𝒍𝒆',
        age: '𝟭𝟴+',
        height: '𝟱𝒇𝒕+',
        facebookLink: '🌐 https://www.facebook.com/share/1HPjorq8ce/',
        nick: '𝑱𝒂𝒎𝒂𝒊'
      };

      // --- Video and File Handling ---
      const videoUrl = 'https://files.catbox.moe/op5iay.mp4';
      const cacheFolderPath = path.join(__dirname, '..', 'cache');
      const videoPath = path.join(cacheFolderPath, 'owner_video.mp4');

      // Create cache directory if it doesn't exist
      await fs.ensureDir(cacheFolderPath);

      // Download the video
      const videoResponse = await axios.get(videoUrl, { responseType: 'arraybuffer' });
      await fs.writeFile(videoPath, Buffer.from(videoResponse.data));

      // --- Beautiful Knight Design with Mathematical Bold Italic ---
      const response = `
╭───────『 ✧  𝑶𝑾𝑵𝑬𝑹 𝑷𝑹𝑶𝑭𝑰𝑳𝑬  ✧ 』───────╮
┃
┃  ❄️ 𝑩𝑨𝑺𝑰𝑪 𝑰𝑵𝑭𝑶
┠────────────────────────────────────
┃  ✦ 𝑵𝒂𝒎𝒆      ➠ ${ownerInfo.name}
┃  ✦ 𝑵𝒊𝒄𝒌𝒏𝒂𝒎𝒆  ➠ ${ownerInfo.nick}
┃  ✦ 𝑨𝒈𝒆        ➠ ${ownerInfo.age}
┃  ✦ 𝑮𝒆𝒏𝒅𝒆𝒓   ➠ ${ownerInfo.gender}
┃  ✦ 𝑯𝒆𝒊𝒈𝒉𝒕    ➠ ${ownerInfo.height}
┠────────────────────────────────────
┃  ❄️ 𝑳𝑰𝑭𝑬𝑺𝑻𝒀𝑳𝑬
┠────────────────────────────────────
┃  ✦ 𝑷𝒓𝒆𝒇𝒆𝒓𝒆𝒏𝒄𝒆 ➠ ${ownerInfo.preference}
┃  ✦ 𝑯𝒐𝒃𝒃𝒊𝒆𝒔      ➠ ${ownerInfo.hobbies}
┠────────────────────────────────────
┃  ❄️ 𝑪𝑶𝑵𝑻𝑨𝑪𝑻
┠────────────────────────────────────
┃  ✦ 𝑭𝒂𝒄𝒆𝒃𝒐𝒐𝒌 ➠ ${ownerInfo.facebookLink}
┃
╰───────『 ✧  𝑨𝑻𝑶𝑴𝑰𝑪 𝑩𝒀 𝑨𝑺𝑰𝑭  ✧ 』───────╯`;

      // --- Sending the Message ---
      await api.sendMessage({
        body: response,
        attachment: fs.createReadStream(videoPath)
      }, event.threadID, () => {
        // Clean up the video file after sending
        fs.unlinkSync(videoPath);
      }, event.messageID);

    } catch (error) {
      console.error('❌ Error in "owner" command:', error);
      return api.sendMessage('❌ An error occurred while executing the command. Please try again later.', event.threadID);
    }
  }
};
