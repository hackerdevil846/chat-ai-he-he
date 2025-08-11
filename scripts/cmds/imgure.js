const axios = require('axios');

module.exports.config = {
    name: "imgur",
    usePrefix: false,
    version: "1.0",
    credits: "𝑨𝒔𝒊𝒇 𝑴𝒂𝒉𝒎𝒖𝒅",
    cooldowns: 5,
    hasPermission: 0,
    description: "𝑰𝒎𝒂𝒈𝒆 𝒃𝒂 𝒗𝒊𝒅𝒆𝒐 𝑰𝒎𝒈𝒖𝒓 𝒆 𝒖𝒑𝒍𝒐𝒂𝒅 𝒌𝒐𝒓𝒖𝒏",
    commandCategory: "𝑻𝒐𝒐𝒍𝒔",
    usages: "𝒊𝒎𝒈𝒖𝒓 [𝒊𝒎𝒂𝒈𝒆, 𝒗𝒊𝒅𝒆𝒐]"
};

module.exports.run = async function ({ api, event }) {
    const link = event.messageReply?.attachments[0]?.url || event.attachments[0]?.url;

    if (!link) {
        return api.sendMessage('𝑫𝒂𝒚𝒂 𝒌𝒐𝒓𝒆 𝒆𝒌𝒕𝒊 𝒊𝒎𝒂𝒈𝒆 𝒃𝒂 𝒗𝒊𝒅𝒆𝒐 𝒓𝒆𝒑𝒍𝒚 𝒌𝒐𝒓𝒖𝒏!', event.threadID, event.messageID);
    }

    try {
        api.sendMessage('🔄 𝑰𝒎𝒈𝒖𝒓 𝒆 𝒖𝒑𝒍𝒐𝒂𝒅 𝒉𝒐𝒄𝒄𝒉𝒆...', event.threadID, event.messageID);
        
        const res = await axios.get(`https://raw.githubusercontent.com/nazrul4x/Noobs/main/Apis.json`);
        const apiUrl = res.data.csb;

        const uploadRes = await axios.get(`${apiUrl}/nazrul/imgur?link=${encodeURIComponent(link)}`);
        const uploaded = uploadRes.data.uploaded;

        if (uploaded.image) {
            return api.sendMessage(`✅ 𝑺𝒖𝒄𝒄𝒆𝒔𝒔𝒇𝒖𝒍𝒍𝒚 𝑼𝒑𝒍𝒐𝒂𝒅𝒆𝒅!\n\n🔗 𝑳𝒊𝒏𝒌: ${uploaded.image}`, event.threadID, event.messageID);
        } else {
            return api.sendMessage('❌ 𝑰𝒎𝒂𝒈𝒆 𝒃𝒂 𝒗𝒊𝒅𝒆𝒐 𝑰𝒎𝒈𝒖𝒓 𝒆 𝒖𝒑𝒍𝒐𝒂𝒅 𝒌𝒐𝒓𝒕𝒆 𝒑𝒂𝒓𝒄𝒉𝒊𝒏𝒊', event.threadID, event.messageID);
        }
    } catch (error) {
        console.error("𝑰𝒎𝒈𝒖𝒓 𝑬𝒓𝒓𝒐𝒓:", error);
        return api.sendMessage('⚠️ 𝑰𝒎𝒂𝒈𝒆 𝒃𝒂 𝒗𝒊𝒅𝒆𝒐 𝑰𝒎𝒈𝒖𝒓 𝒆 𝒖𝒑𝒍𝒐𝒂𝒅 𝒌𝒐𝒓𝒂𝒓 𝒔𝒐𝒎𝒐𝒚 𝒉𝒐𝒍𝒐', event.threadID, event.messageID);
    }
};
