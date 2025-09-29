const axios = require('axios');

module.exports.config = {
    name: "imgurv2",
    aliases: [],
    version: "1.0.1",
    author: "𝐴𝑠𝑖𝑓 𝑀𝑎ℎ𝑚𝑢𝑑",
    countDown: 5,
    role: 0,
    category: "tools",
    shortDescription: {
        en: "𝑈𝑝𝑙𝑜𝑎𝑑 𝑖𝑚𝑎𝑔𝑒/𝑣𝑖𝑑𝑒𝑜 𝑡𝑜 𝐼𝑚𝑔𝑢𝑟"
    },
    longDescription: {
        en: "𝑈𝑝𝑙𝑜𝑎𝑑 𝑖𝑚𝑎𝑔𝑒𝑠 𝑜𝑟 𝑣𝑖𝑑𝑒𝑜𝑠 𝑡𝑜 𝐼𝑚𝑔𝑢𝑟 𝑎𝑛𝑑 𝑔𝑒𝑡 𝑠ℎ𝑎𝑟𝑒𝑎𝑏𝑙𝑒 𝑙𝑖𝑛𝑘𝑠"
    },
    guide: {
        en: "{p}imgurv2 [𝑟𝑒𝑝𝑙𝑦 𝑡𝑜 𝑖𝑚𝑎𝑔𝑒/𝑣𝑖𝑑𝑒𝑜]"
    }
};

module.exports.onStart = async function({ message, event, api }) {
    try {
        // Check if there's a replied message with attachments
        if (!event.messageReply || !event.messageReply.attachments || event.messageReply.attachments.length === 0) {
            return message.reply('📸 𝑃𝑙𝑒𝑎𝑠𝑒 𝑟𝑒𝑝𝑙𝑦 𝑡𝑜 𝑎𝑛 𝑖𝑚𝑎𝑔𝑒 𝑜𝑟 𝑣𝑖𝑑𝑒𝑜 𝑡𝑜 𝑢𝑝𝑙𝑜𝑎𝑑!');
        }

        const attachment = event.messageReply.attachments[0];
        const link = attachment.url;

        // Check if it's an image or video
        if (!attachment.type || (attachment.type !== 'photo' && attachment.type !== 'video')) {
            return message.reply('❌ 𝑃𝑙𝑒𝑎𝑠𝑒 𝑟𝑒𝑝𝑙𝑦 𝑡𝑜 𝑎 𝑣𝑎𝑙𝑖𝑑 𝑖𝑚𝑎𝑔𝑒 𝑜𝑟 𝑣𝑖𝑑𝑒𝑜!');
        }

        await message.reply('🔄 𝑈𝑝𝑙𝑜𝑎𝑑𝑖𝑛𝑔 𝑡𝑜 𝐼𝑚𝑔𝑢𝑟... 𝑃𝑙𝑒𝑎𝑠𝑒 𝑤𝑎𝑖𝑡.');

        // Fetch API endpoint from GitHub
        const res = await axios.get(`https://raw.githubusercontent.com/nazrul4x/Noobs/main/Apis.json`, {
            timeout: 15000
        });

        if (!res.data || !res.data.csb) {
            throw new Error('API endpoint not found');
        }

        const apiUrl = `${res.data.csb}/nazrul/imgur?link=${encodeURIComponent(link)}`;
        
        // Upload to Imgur
        const response = await axios.get(apiUrl, {
            timeout: 30000
        });

        // Check response structure
        if (!response.data) {
            throw new Error('Empty response from Imgur API');
        }

        if (response.data.uploaded && response.data.uploaded.image) {
            const imgurLink = response.data.uploaded.image;
            
            return message.reply(`✅ 𝑼𝒑𝒍𝒐𝒂𝒅 𝑺𝒖𝒄𝒄𝒆𝒔𝒔𝒇𝒖𝒍!\n\n🔗 𝑰𝒎𝒈𝒖𝒓 𝑳𝒊𝒏𝒌: ${imgurLink}\n\n📎 𝑪𝒐𝒑𝒚 𝒕𝒉𝒆 𝒍𝒊𝒏𝒌 𝒂𝒏𝒅 𝒔𝒉𝒂𝒓𝒆 𝒊𝒕!`);
        } else {
            // Check for alternative response formats
            if (response.data.url) {
                return message.reply(`✅ 𝑼𝒑𝒍𝒐𝒂𝒅 𝑺𝒖𝒄𝒄𝒆𝒔𝒔𝒇𝒖𝒍!\n\n🔗 𝑰𝒎𝒈𝒖𝒓 𝑳𝒊𝒏𝒌: ${response.data.url}`);
            } else if (response.data.link) {
                return message.reply(`✅ 𝑼𝒑𝒍𝒐𝒂𝒅 𝑺𝒖𝒄𝒄𝒆𝒔𝒔𝒇𝒖𝒍!\n\n🔗 𝑰𝒎𝒈𝒖𝒓 𝑳𝒊𝒏𝒌: ${response.data.link}`);
            } else {
                throw new Error('Upload failed - no image link received');
            }
        }

    } catch (error) {
        console.error("𝐼𝑚𝑔𝑢𝑟 𝐸𝑟𝑟𝑜𝑟:", error);
        
        let errorMessage = '⚠️ 𝐴𝑛 𝑒𝑟𝑟𝑜𝑟 𝑜𝑐𝑐𝑢𝑟𝑟𝑒𝑑 𝑤ℎ𝑖𝑙𝑒 𝑢𝑝𝑙𝑜𝑎𝑑𝑖𝑛𝑔. 𝑃𝑙𝑒𝑎𝑠𝑒 𝑡𝑟𝑦 𝑎𝑔𝑎𝑖𝑛 𝑙𝑎𝑡𝑒𝑟.';
        
        if (error.code === 'ECONNABORTED') {
            errorMessage = '⏰ 𝑅𝑒𝑞𝑢𝑒𝑠𝑡 𝑡𝑖𝑚𝑒𝑑 𝑜𝑢𝑡. 𝑃𝑙𝑒𝑎𝑠𝑒 𝑡𝑟𝑦 𝑎𝑔𝑎𝑖𝑛.';
        } else if (error.response) {
            if (error.response.status === 404) {
                errorMessage = '🔍 𝐴𝑃𝐼 𝑒𝑛𝑑𝑝𝑜𝑖𝑛𝑡 𝑛𝑜𝑡 𝑓𝑜𝑢𝑛𝑑. 𝑃𝑙𝑒𝑎𝑠𝑒 𝑐𝑜𝑛𝑡𝑎𝑐𝑡 𝑎𝑑𝑚𝑖𝑛.';
            } else if (error.response.status === 429) {
                errorMessage = '🚫 𝑇𝑜𝑜 𝑚𝑎𝑛𝑦 𝑟𝑒𝑞𝑢𝑒𝑠𝑡𝑠. 𝑃𝑙𝑒𝑎𝑠𝑒 𝑡𝑟𝑦 𝑎𝑔𝑎𝑖𝑛 𝑙𝑎𝑡𝑒𝑟.';
            } else {
                errorMessage = `🌐 𝐴𝑃𝐼 𝑒𝑟𝑟𝑜𝑟 (${error.response.status}). 𝑇𝑟𝑦 𝑎𝑔𝑎𝑖𝑛 𝑙𝑎𝑡𝑒𝑟.`;
            }
        } else if (error.message.includes('API endpoint not found')) {
            errorMessage = '🔧 𝐴𝑃𝐼 𝑒𝑛𝑑𝑝𝑜𝑖𝑛𝑡 𝑛𝑜𝑡 𝑎𝑣𝑎𝑖𝑙𝑎𝑏𝑙𝑒. 𝑃𝑙𝑒𝑎𝑠𝑒 𝑐𝑜𝑛𝑡𝑎𝑐𝑡 𝑎𝑑𝑚𝑖𝑛.';
        } else if (error.message.includes('no image link')) {
            errorMessage = '❌ 𝑈𝑝𝑙𝑜𝑎𝑑 𝑓𝑎𝑖𝑙𝑒𝑑. 𝑇ℎ𝑒 𝑖𝑚𝑎𝑔𝑒 𝑚𝑖𝑔ℎ𝑡 𝑏𝑒 𝑡𝑜𝑜 𝑙𝑎𝑟𝑔𝑒 𝑜𝑟 𝑖𝑛𝑣𝑎𝑙𝑖𝑑.';
        }
        
        return message.reply(errorMessage);
    }
};
