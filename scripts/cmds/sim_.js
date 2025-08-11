module.exports.config = {
    name: "sim",
    version: "4.3.7",
    hasPermssion: 0,
    credits: "𝑨𝒔𝒊𝒇 𝑴𝒂𝒉𝒎𝒖𝒅",
    description: "𝙎𝙞𝙢𝙨𝙞𝙢𝙞 𝘼𝙄 𝙨𝙖𝙩𝙝𝙚 𝙘𝙝𝙖𝙩 𝙠𝙤𝙧𝙪𝙣. 𝙁𝙞𝙭𝙚𝙙 𝙗𝙮 𝑨𝒔𝒊𝒇 𝑴𝒂𝒉𝒎𝒖𝒅",
    commandCategory: "𝙎𝙞𝙢𝙨𝙞𝙢𝙞 𝘾𝙝𝙖𝙩",
    usages: "[args]",
    cooldowns: 5,
    dependencies: {
        axios: ""
    },
    envConfig: {
        APIKEY: "Priyansh_1234567890"
    }
}

async function simsimi(a, b, c) {
    const axios = require("axios"),
        { APIKEY } = global.configModule.sim,
        g = (a) => encodeURIComponent(a);
    try {
        var { data: j } = await axios({ 
            url: `https://sim-api-by-priyansh.glitch.me/sim?type=ask&ask=${g(a)}&apikey=PriyanshVip`, 
            method: "GET" 
        });
        return { error: !1, data: j }
    } catch (p) {
        return { error: !0, data: {} }
    }
}

module.exports.onLoad = async function() {
    if ("undefined" == typeof global.manhG) global.manhG = {};
    if ("undefined" == typeof global.manhG.simsimi) global.manhG.simsimi = new Map;
};

module.exports.handleEvent = async function({ api, event }) {
    const { threadID, messageID, senderID, body } = event;
    const g = (msg) => api.sendMessage(msg, threadID, messageID);
    
    if (global.manhG.simsimi.has(threadID)) {
        if (senderID === api.getCurrentUserID() || !body || messageID === global.manhG.simsimi.get(threadID)) return;
        
        const { data, error } = await simsimi(body, api, event);
        if (error) return;
        if (!data.answer) return g(data.error);
        return g(data.answer);
    }
}

module.exports.run = async function({ api, event, args }) {
    const { threadID, messageID } = event;
    const body = (msg) => api.sendMessage(msg, threadID, messageID);
    
    if (0 === args.length) return body("[ 𝑺𝑰𝑴 ] - 𝘼𝙥𝙣𝙞 𝙠𝙤𝙣𝙤 𝙢𝙚𝙨𝙨𝙖𝙜𝙚 𝙚𝙣𝙩𝙚𝙧 𝙠𝙤𝙧𝙚𝙣 𝙣𝙞");
    
    switch (args[0]) {
        case "on":
            if (global.manhG.simsimi.has(threadID)) {
                return body("[ 𝑺𝑰𝑴 ] - 𝟮 𝙗𝙖𝙧 𝙤𝙣 𝙠𝙤𝙧𝙡𝙚 𝙠𝙞 𝙝𝙤𝙮?");
            }
            global.manhG.simsimi.set(threadID, messageID);
            return body("[ 𝑺𝑰𝑴 ] - 𝙊𝙣 𝙠𝙤𝙧𝙖 𝙨𝙖𝙥𝙝𝙖𝙡 𝙝𝙤𝙡𝙤");
            
        case "off":
            if (global.manhG.simsimi.has(threadID)) {
                global.manhG.simsimi.delete(threadID);
                return body("[ 𝑺𝑰𝑴 ] - 𝙊𝙛𝙛 𝙠𝙤𝙧𝙖 𝙨𝙖𝙥𝙝𝙖𝙡 𝙝𝙤𝙡𝙤");
            }
            return body("[ 𝑺𝑰𝑴 ] - 𝙏𝙖𝙤 𝙤𝙛𝙛 𝙠𝙤𝙧𝙖 𝙨𝙪𝙧𝙪 𝙝𝙤𝙮𝙚𝙘𝙝𝙚");
            
        default:
            const { data, error } = await simsimi(args.join(" "), api, event);
            if (error) return;
            if (!data.answer) return body(data.error);
            return body(data.answer);
    }
};
