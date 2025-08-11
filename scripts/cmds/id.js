module.exports.config = {
	name: "id",
	version: "1.0.0",
	hasPermssion: 0,
	credits: "𝑨𝒔𝒊𝒇 𝑴𝒂𝒉𝒎𝒖𝒅",
	description: "𝑼𝒔𝒆𝒓 𝒆𝒓 𝑰𝑫 𝒊𝒏𝒇𝒐 𝒃𝒆𝒓 𝒌𝒐𝒓𝒆 𝒅𝒆𝒌𝒉𝒂𝒏𝒐",
	commandCategory: "𝒖𝒕𝒊𝒍𝒊𝒕𝒚",
	cooldowns: 0
};

module.exports.run = async function({ event, api, args, client, Currencies, Users, utils, __GLOBAL, reminder }) {
    const fs = global.nodemodule["fs-extra"];
    const request = global.nodemodule["request"];
    const axios = global.nodemodule['axios']; 
    
    let uid, name;
    
    // 𝑹𝒆𝒑𝒍𝒊𝒆𝒅 𝒎𝒆𝒔𝒔𝒂𝒈𝒆 𝒄𝒂𝒔𝒆
    if (event.type == "message_reply") { 
        uid = event.messageReply.senderID;
        name = await Users.getNameUser(uid);
    } 
    // 𝑵𝒐 𝒂𝒓𝒈𝒖𝒎𝒆𝒏𝒕𝒔 - 𝒄𝒖𝒓𝒓𝒆𝒏𝒕 𝒖𝒔𝒆𝒓
    else if (!args[0]) {
        uid = event.senderID;
        const res = await axios.get(`https://www.nguyenmanh.name.vn/api/fbInfo?id=${uid}&apikey=LV7LWgAp`);
        name = res.data.result.name || await Users.getNameUser(uid);
    }
    // 𝑼𝑹𝑳 𝒄𝒂𝒔𝒆
    else if (args[0].indexOf(".com/") !== -1) {
        uid = await api.getUID(args[0]);
        const data = await api.getUserInfoV2(uid);
        name = data.name;
    }
    // 𝑴𝒆𝒏𝒕𝒊𝒐𝒏 𝒄𝒂𝒔𝒆
    else if (args.join().indexOf('@') !== -1) {
        uid = Object.keys(event.mentions)[0];
        name = await Users.getNameUser(uid);
    }
    // 𝑫𝒊𝒓𝒆𝒄𝒕 𝑼𝑰𝑫 𝒄𝒂𝒔𝒆
    else {
        uid = args[0];
        name = await Users.getNameUser(uid) || "𝑵𝒂𝒎𝒆 𝒏𝒐𝒕 𝒇𝒐𝒖𝒏𝒅";
    }

    // 𝑫𝒐𝒘𝒏𝒍𝒐𝒂𝒅 𝒑𝒓𝒐𝒇𝒊𝒍𝒆 𝒑𝒊𝒄𝒕𝒖𝒓𝒆
    const callback = () => {
        api.sendMessage({
            body: `=== [ 𝑼𝑰𝑫 𝑰𝑵𝑭𝑶 ] ===\n━━━━━━━━━━━━━━━━━━\n[⚜️]➜ 𝑵𝑨𝑴𝑬 : ${name}\n[⚜️]➜ 𝑰𝑫: ${uid}\n[⚜️]➜ 𝑰𝑵𝑩𝑶𝑿: m.me/${uid}\n[⚜️]➜ 𝑭𝑩 𝑳𝑰𝑵𝑲: https://www.facebook.com/profile.php?id=${uid}\n━━━━━━━━━━━━━━━━━━`,
            attachment: fs.createReadStream(__dirname + "/cache/1.png")
        }, event.threadID, () => fs.unlinkSync(__dirname + "/cache/1.png"), event.messageID);
    };

    return request(encodeURI(`https://graph.facebook.com/${uid}/picture?height=1500&width=1500&access_token=6628568379%7Cc1e620fa708a1d5696fb991c1bde5662`))
        .pipe(fs.createWriteStream(__dirname + '/cache/1.png'))
        .on('close', callback);
};
