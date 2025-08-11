module.exports.config = {
    name: "teach",
    version: "1.0.0",
    hasPermssion: 0,
    credits: "𝑨𝒔𝒊𝒇 𝑴𝒂𝒉𝒎𝒖𝒅",
    description: "𝙎𝙞𝙢𝙢𝙞𝙠𝙚 𝙨𝙞𝙠𝙝𝙖𝙣𝙤 𝙠𝙖𝙟 𝙩𝙚𝙖𝙘𝙝 𝙙𝙞𝙮𝙚",
    commandCategory: "𝙎𝙞𝙢",
    usages: "",
    cooldowns: 2,
    dependencies: {
        "axios": ""
    }
};

const API_KEY = "";

module.exports.run = ({ api, event, args }) => {
    const { threadID, messageID, senderID } = event;
    return api.sendMessage(
        "⸙͎ �𝙧𝙤𝙨𝙣𝙤 𝙡𝙞𝙠𝙝𝙤 𝙨𝙞𝙢𝙢𝙞𝙠𝙚 𝙨𝙞𝙠𝙝𝙖𝙣𝙤𝙧 𝙟𝙤𝙣𝙣𝙤 𝙚𝙞 𝙧𝙚𝙥𝙡𝙖𝙮 𝙠𝙤𝙧𝙪𝙣",
        threadID, 
        (err, info) => {
            global.client.handleReply.push({
                step: 1,
                name: this.config.name,
                messageID: info.messageID,
                content: {
                    id: senderID,
                    ask: "",
                    ans: ""
                }
            });
        }, 
        messageID
    );
};

module.exports.handleReply = async({ api, event, Users, handleReply }) => {
    const axios = require("axios");
    const moment = require("moment-timezone");
    const { threadID, messageID, senderID, body } = event;
    
    if (handleReply.content.id !== senderID) return;
    
    const input = body.trim();
    const timeZ = moment.tz("Asia/Dhaka").format("HH:mm:ss | DD/MM/YYYY");
    const by_name = (await Users.getData(senderID)).name;

    const sendNextStep = (msg, step, content) => {
        api.sendMessage(msg, threadID, (err, info) => {
            const index = global.client.handleReply.indexOf(handleReply);
            if (index > -1) {
                global.client.handleReply.splice(index, 1);
            }
            api.unsendMessage(handleReply.messageID);
            global.client.handleReply.push({
                step: step,
                name: this.config.name,
                messageID: info.messageID,
                content: content
            });
        }, messageID);
    };

    switch (handleReply.step) {
        case 1:
            handleReply.content.ask = input;
            sendNextStep(
                "⸙͎ 𝙐𝙩𝙩𝙤𝙧 𝙡𝙞𝙠𝙝𝙤 𝙚𝙞 𝙧𝙚𝙥𝙡𝙖𝙮 𝙠𝙤𝙧𝙪𝙣", 
                2, 
                handleReply.content
            );
            break;

        case 2:
            handleReply.content.ans = input;
            const content = handleReply.content;
            
            // Clean up previous messages
            const index = global.client.handleReply.indexOf(handleReply);
            if (index > -1) {
                global.client.handleReply.splice(index, 1);
            }
            api.unsendMessage(handleReply.messageID);
            
            try {
                const res = await axios.get(encodeURI(
                    `https://sim-api-by-priyansh.glitch.me/sim?type=teach&ask=${content.ask}&ans=${content.ans}&apikey=PriyanshVip`
                ));
                
                if (res.data.error) {
                    return api.sendMessage(
                        `❌ �𝙧𝙤𝙗𝙡𝙚𝙢: ${res.data.error}`,
                        threadID,
                        messageID
                    );
                }
                
                api.sendMessage(
                    `✅ 𝙎𝙖𝙛𝙖𝙡𝙡𝙮 𝙨𝙞𝙠𝙝𝙖𝙣𝙤 𝙝𝙤𝙮𝙚𝙘𝙝𝙚\n\n` +
                    `🤤 𝙋𝙧𝙤𝙨𝙣𝙤: ${content.ask}\n` +
                    `🤓 �𝙪𝙩𝙩𝙤𝙧: ${content.ans}\n\n` +
                    `⏱ 𝙎𝙤𝙢𝙤𝙮: ${timeZ}`,
                    threadID,
                    messageID
                );
            } catch (error) {
                console.error("❌ 𝙀𝙧𝙧𝙤𝙧:", error);
                api.sendMessage(
                    "❌ 𝙆𝙞𝙘𝙝𝙪 𝙚𝙠𝙩𝙖 𝙥𝙧𝙤𝙗𝙡𝙚𝙢 𝙝𝙤𝙮𝙚𝙘𝙝𝙚, 𝙥𝙪𝙣𝙤𝙧𝙖𝙮 𝙘𝙝𝙚𝙨𝙩𝙖 𝙠𝙤𝙧𝙪𝙣",
                    threadID,
                    messageID
                );
            }
            break;
            
        default:
            break;
    }
};
