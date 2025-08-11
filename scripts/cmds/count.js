var limit = 20; //𝒏𝒖𝒎𝒃𝒆𝒓 𝒐𝒇 𝒎𝒆𝒎𝒃𝒆𝒓𝒔 𝒑𝒆𝒓 𝒄𝒉𝒆𝒄𝒌
module.exports.config = {
	name: "count",
	version: "1.8.0",
	hasPermssion: 0,
	credits: "𝑨𝒔𝒊𝒇 𝑴𝒂𝒉𝒎𝒖𝒅",
	description: "𝑪𝒉𝒆𝒄𝒌 𝒈𝒓𝒐𝒖𝒑 𝒊𝒏𝒕𝒆𝒓𝒂𝒄𝒕𝒊𝒐𝒏𝒔",
	commandCategory: "𝑮𝒓𝒐𝒖𝒑",
	usages: "[𝒂𝒍𝒍/𝒕𝒂𝒈]",
	cooldowns: 5
};

module.exports.run = async function ({ args, Users, Threads, api, event, Currencies, getText }) {
    var mention = Object.keys(event.mentions);
    if (args[0] == "all") {
        var { participantIDs } = (await Threads.getData(event.threadID)).threadInfo;
        const listUserID = event.participantIDs;
        var exp = [];

        for (const idUser of listUserID) {
            const countMess = await Currencies.getData(idUser);
            exp.push({
                "name": (typeof ((await Users.getData(idUser)).name) == "undefined" ? "𝑼𝒏𝒌𝒏𝒐𝒘𝒏 𝑼𝒔𝒆𝒓" : (await Users.getData(idUser)).name,
                "exp": (typeof countMess.exp == "undefined") ? 0 : countMess.exp,
                "uid": idUser
            });
        }
        exp.sort(function (a, b) { return b.exp - a.exp });

        var page = parseInt(args[1]) || 1;
        page = page < 1 ? 1 : page;
        var numPage = Math.ceil(exp.length / limit);
        page = page > numPage ? numPage : page;

        var msg = "📊 𝑮𝒓𝒐𝒖𝒑 𝑰𝒏𝒕𝒆𝒓𝒂𝒄𝒕𝒊𝒐𝒏 𝑹𝒂𝒏𝒌𝒊𝒏𝒈𝒔:\n\n";
        var startIndex = limit * (page - 1);
        var endIndex = Math.min(startIndex + limit, exp.length);

        for (var i = startIndex; i < endIndex; i++) {
            let dataInfo = exp[i];
            msg += `${i + 1}. ${dataInfo.name}: ${dataInfo.exp} 𝒎𝒆𝒔𝒔𝒂𝒈𝒆𝒔\n`;
        }

        msg += `\n📑 𝑷𝒂𝒈𝒆 ${page}/${numPage}`;
        msg += `\n🔍 𝑼𝒔𝒆 ${global.config.PREFIX}𝒄𝒐𝒖𝒏𝒕 𝒂𝒍𝒍 <𝒑𝒂𝒈𝒆 𝒏𝒖𝒎𝒃𝒆𝒓>`;
        return api.sendMessage(msg, event.threadID);
    } else if (event.type == "message_reply") {
        mention[0] = event.messageReply.senderID;
    }
    
    if (mention[0]) {
        var { participantIDs } = (await Threads.getData(event.threadID)).threadInfo;
        const listUserID = event.participantIDs;
        var exp = [];
        
        for (const idUser of listUserID) {
            const countMess = await Currencies.getData(idUser);
            exp.push({
                "name": (await Users.getData(idUser)).name,
                "exp": (typeof countMess.exp == "undefined") ? 0 : countMess.exp,
                "uid": idUser
            });
        }
        exp.sort(function (a, b) { return b.exp - a.exp });
        
        const rank = exp.findIndex(info => parseInt(info.uid) == parseInt(mention[0])) + 1;
        const infoUser = exp[rank - 1];
        const userName = (await Users.getData(mention[0])).name;
        
        return api.sendMessage(
            `👤 ${userName} 𝒊𝒔 𝒄𝒖𝒓𝒓𝒆𝒏𝒕𝒍𝒚 𝒓𝒂𝒏𝒌𝒆𝒅 #${rank}\n💬 𝑴𝒆𝒔𝒔𝒂𝒈𝒆 𝒄𝒐𝒖𝒏𝒕: ${infoUser.exp} 𝒎𝒆𝒔𝒔𝒂𝒈𝒆𝒔`, 
            event.threadID, 
            event.messageID
        );
    } else {
        var { participantIDs } = (await Threads.getData(event.threadID)).threadInfo;
        const listUserID = event.participantIDs;
        var exp = [];
        
        for (const idUser of listUserID) {
            const countMess = await Currencies.getData(idUser);
            exp.push({
                "name": (await Users.getData(idUser)).name,
                "exp": (typeof countMess.exp == "undefined") ? 0 : countMess.exp,
                "uid": idUser
            });
        }
        exp.sort(function (a, b) { return b.exp - a.exp });
        
        const rank = exp.findIndex(info => parseInt(info.uid) == parseInt(event.senderID)) + 1;
        const infoUser = exp[rank - 1];
        
        return api.sendMessage(
            `👤 𝒀𝒐𝒖 𝒂𝒓𝒆 𝒄𝒖𝒓𝒓𝒆𝒏𝒕𝒍𝒚 𝒓𝒂𝒏𝒌𝒆𝒅 #${rank}\n💬 𝑴𝒆𝒔𝒔𝒂𝒈𝒆 𝒄𝒐𝒖𝒏𝒕: ${infoUser.exp} 𝒎𝒆𝒔𝒔𝒂𝒈𝒆𝒔`, 
            event.threadID, 
            event.messageID
        );
    }
}
