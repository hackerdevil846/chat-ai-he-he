module.exports = {
    config: {
        name: "goiadmin",
        version: "1.0.0",
        role: 0,
        author: "𝐴𝑠𝑖𝑓 𝑀𝑎ℎ𝑚𝑢𝑑",
        countDown: 1,
        category: "⚙️ 𝑺𝒚𝒔𝒕𝒆𝒎",
        shortDescription: {
            en: "🦋 𝑴𝒂𝒍𝒊𝒌 𝒌𝒆 𝒕𝒂𝒈 𝒌𝒐𝒓𝒍𝒆 𝒃𝒐𝒕 𝒂𝒖𝒕𝒐 𝒓𝒆𝒑𝒍𝒚 𝒅𝒊𝒃𝒆 🌺"
        },
        longDescription: {
            en: "𝐴𝑢𝑡𝑜𝑚𝑎𝑡𝑖𝑐𝑎𝑙𝑙𝑦 𝑟𝑒𝑠𝑝𝑜𝑛𝑑𝑠 𝑤ℎ𝑒𝑛 𝑠𝑜𝑚𝑒𝑜𝑛𝑒 𝑚𝑒𝑛𝑡𝑖𝑜𝑛𝑠 𝑡ℎ𝑒 𝑎𝑑𝑚𝑖𝑛"
        },
        guide: {
            en: ""
        },
        envConfig: {
            adminUID: "61571630409265"
        }
    },

    onChat: async function({ event, message, envConfig }) {
        try {
            const { senderID, threadID, messageID, mentions } = event;
            const admin = envConfig.adminUID;
            
            // Check if someone mentions admin and it's not admin self
            if (senderID !== admin && mentions && mentions.hasOwnProperty(admin)) {
                const responses = [
                    "🌷 𝑴𝒂𝒍𝒊𝒌 𝒃𝒊𝒔𝒚 𝒂𝒄𝒉𝒆, 𝒂𝒎𝒂𝒌𝒆 𝒃𝒐𝒍𝒖𝒏 𝒌𝒊 𝒃𝒐𝒍𝒕𝒆 𝒄𝒂𝒐? 🤔",
                    "🌸 𝑲𝒊𝒆 𝒉𝒐𝒍𝒐? 𝑴𝒂𝒍𝒊𝒌 𝒌𝒆 𝒌𝒆𝒏 𝒅𝒂𝒌𝒂𝒕𝒆 𝒄𝒂𝒐? 😊",
                    "🌹 𝑼𝒏𝒂𝒓 𝒃𝒊𝒔𝒚 𝒕𝒉𝒂𝒌𝒕𝒆 𝒑𝒂𝒓𝒆𝒏, 𝒑𝒐𝒓𝒆 𝒅𝒂𝒌𝒂𝒃𝒆𝒏 😌",
                    "💐 𝑴𝒂𝒍𝒊𝒌 𝒆𝒌𝒉𝒐𝒏 𝒕𝒉𝒆𝒌𝒆 𝒏𝒆𝒊, 𝒑𝒐𝒓𝒆 𝒅𝒆𝒌𝒉𝒊 ⏳",
                    "🌺 𝑨𝒑𝒏𝒊 𝒌𝒐𝒕𝒉𝒂 𝒃𝒐𝒍𝒖𝒏, 𝒎𝒂𝒍𝒊𝒌 𝒌𝒆 𝒋𝒊𝒈𝒂𝒚 𝒅𝒂𝒌𝒉𝒂𝒃𝒐! 😇"
                ];
                
                const response = responses[Math.floor(Math.random() * responses.length)];
                
                await message.reply({
                    body: `╔════ஜ۩۞۩ஜ═══╗\n\n${response}\n\n╚════ஜ۩۞۩ஜ═══╝`,
                    mentions: [{
                        tag: "@Malik",
                        id: admin
                    }]
                });
            }
        } catch (error) {
            console.error("✨ 𝑬𝒓𝒓𝒐𝒓 𝒊𝒏 𝒈𝒐𝒊𝒂𝒅𝒎𝒊𝒏:", error);
        }
    },

    onStart: async function({}) {
        // Intentionally empty - this is an auto-response command
    }
};
