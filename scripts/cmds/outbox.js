module.exports.config = {
	name: "outbox",
	version: "1.0.7",
	hasPermssion: 2,
	credits: "𝑨𝒔𝒊𝒇 𝑴𝒂𝒉𝒎𝒖𝒅",
	description: "𝒃𝒆𝒍𝒂 𝒎𝒂𝒕𝒆 𝒃𝒐𝒕 𝒈𝒓𝒖𝒑 𝒕𝒉𝒆𝒌𝒆 𝒃𝒂𝒉𝒊𝒓 𝒉𝒐𝒃𝒆",
	commandCategory: "𝒔𝒚𝒔𝒕𝒆𝒎",
    dependencies: {
        "moment-timezone": ""
    },
	cooldowns: 5
};

module.exports.convertTime = (timestamp, separator) => {
    var pad = function(input) {return input < 10 ? "0" + input : input;};
    var date = timestamp ? new Date(timestamp * 1000) : new Date();
    return [
        pad(date.getHours()),
        pad(date.getMinutes()),
        pad(date.getSeconds())
    ].join(typeof separator !== 'undefined' ?  separator : ':' );
}

module.exports.handleSchedule = async ({ api, schedule }) => {
    try {
        await api.removeUserFromGroup(api.getCurrentUserID(), schedule.target);
        return api.sendMessage(`[𝒐𝒖𝒕𝒃𝒐𝒙] 𝒈𝒓𝒖𝒑 𝒕𝒉𝒆𝒌𝒆 𝒃𝒂𝒉𝒊𝒓 𝒉𝒐𝒍𝒂 𝒊𝒅: ${schedule.target}`, __GLOBAL.settings.ADMINBOT[0], (error, info) => {
            if (error) require(process.cwd() + "/utils/log")(`𝒈𝒓𝒖𝒑 𝒕𝒉𝒆𝒌𝒆 𝒃𝒂𝒉𝒊𝒓 𝒉𝒐𝒍𝒂 𝒊𝒅: ${schedule.target}`, "[ 𝒐𝒖𝒕𝒃𝒐𝒙 ]");
        });
    }
    catch {
        return api.sendMessage(`𝒈𝒓𝒖𝒑 𝒕𝒉𝒆𝒌𝒆 𝒃𝒂𝒉𝒊𝒓 𝒉𝒐𝒕𝒆 𝒑𝒂𝒓𝒂𝒏𝒊 𝒊𝒅: ${schedule.target}!`, __GLOBAL.settings.ADMINBOT[0], (error, info) => {
            if (error) require(process.cwd() + "/utils/log")(`𝒈𝒓𝒖𝒑 𝒕𝒉𝒆𝒌𝒆 𝒃𝒂𝒉𝒊𝒓 𝒉𝒐𝒕𝒆 𝒑𝒂𝒓𝒂𝒏𝒊 𝒊𝒅: ${schedule.target}!`, "error");
        });
    }
} 

module.exports.handleReply = ({ event, api, handleReply }) => {
    const moment = global.nodemodule["moment-timezone"];
    
    if (handleReply.author != event.senderID) return;

    switch (handleReply.type) {
        case "inputThreadID": {
            if (isNaN(event.body)) return api.sendMessage("[𝒐𝒖𝒕𝒃𝒐𝒙] 𝒈𝒓𝒖𝒑 𝒊𝒅 𝒔𝒐𝒕𝒉𝒊𝒌 𝒏𝒐𝒚!", event.threadID, event.messageID);
            api.unsendMessage(handleReply.messageID);
            return api.sendMessage(`[𝒐𝒖𝒕𝒃𝒐𝒙] 𝒃𝒆𝒍𝒂 𝒅𝒆𝒌𝒂𝒏 𝒑𝒍𝒆𝒂𝒔𝒆 (𝒇𝒐𝒓𝒎𝒂𝒕: 𝑯𝑯:𝒎𝒎):`, event.threadID, (error, info) => {
                global.client.handleReply.push({
                    type: "inputTime",
                    name: this.config.name,
                    author: event.senderID,
                    messageID: info.messageID,
                    target: event.body
                })
            })
        }

        case "inputTime": {
            const time = moment().tz("Asia/Dhaka");
            const regex = /([0-9]|0[0-9]|1[0-9]|2[0-3]):([0-9]|[0-5][0-9])$/;

            if (!regex.test(event.body)) return api.sendMessage(`[𝒐𝒖𝒕𝒃𝒐𝒙] 𝒔𝒐𝒕𝒉𝒊𝒌 𝒇𝒐𝒓𝒎𝒂𝒕 𝒏𝒐𝒚!`, event.threadID, event.messageID);
            const timeSplited = event.body.split(":"),
                    hour = timeSplited[0],
                    minute = timeSplited[1];
                
            if (hour > time.hours()) time.add(1, "days");

            time.set({ hour, minute });

            api.unsendMessage(handleReply.messageID);
            return api.sendMessage(`[𝒐𝒖𝒕𝒃𝒐𝒙] 𝒃𝒂𝒉𝒊𝒓 𝒉𝒐𝒘𝒂𝒓 𝒌𝒂𝒓𝒐𝒏 𝒍𝒊𝒌𝒉𝒖𝒏:`, event.threadID, (error, info) => {
                global.client.handleReply.push({
                    type: "inputReason",
                    name: this.config.name,
                    author: event.senderID,
                    messageID: info.messageID,
                    target: handleReply.target,
                    timeTarget: time.unix()
                })
            })
        }

        case "inputReason": {
            api.unsendMessage(handleReply.messageID);
            return api.sendMessage(
                "=== 𝑶𝒖𝒕𝑩𝒐𝒙 ===" +
                "\n\n» 𝒈𝒓𝒖𝒑 𝒊𝒅: " + handleReply.target +
                "\n» 𝒃𝒆𝒍𝒂: " + this.convertTime(handleReply.timeTarget) +
                "\n» 𝒌𝒂𝒓𝒐𝒏: " + event.body,
                event.threadID, (error, info) => {
                    return api.sendMessage(
                        `[𝒐𝒖𝒕𝒃𝒐𝒙] 𝒃𝒆𝒍𝒂 ${this.convertTime(handleReply.timeTarget)} 𝒆𝒊 𝒈𝒓𝒖𝒑 𝒕𝒉𝒆𝒌𝒆 𝒃𝒂𝒉𝒊𝒓 𝒉𝒐𝒃𝒐\n» 𝒌𝒂𝒓𝒐𝒏: ${event.body}`, 
                        handleReply.target, 
                        (error, info) => {
                            if (error) return api.sendMessage(`[𝒐𝒖𝒕𝒃𝒐𝒙] 𝒈𝒓𝒖𝒑 𝒑𝒂𝒘𝒂 𝒋𝒂𝒄𝒄𝒉𝒆 𝒏𝒂`, event.threadID);
                            else {
                                global.client.handleSchedule.push({
                                    commandName: this.config.name, 
                                    timestamp: handleReply.timeTarget, 
                                    target: handleReply.target, 
                                    reason: event.body,
                                    event
                                });
                                return api.sendMessage(`✅ 𝒃𝒆𝒍𝒂 𝒔𝒆𝒕 𝒉𝒐𝒍𝒂 𝒈𝒆𝒄𝒉𝒆!`, event.threadID);
                            }
                        }
                    )
                }
            )
        }
    }
}

module.exports.run = ({  event, api }) => {
    return api.sendMessage(`[𝒐𝒖𝒕𝒃𝒐𝒙] 𝒈𝒓𝒖𝒑 𝒊𝒅 𝒅𝒆𝒌𝒂𝒏:`, event.threadID, (error, info) => {
        global.client.handleReply.push({
            type: "inputThreadID",
            name: this.config.name,
            author: event.senderID,
            messageID: info.messageID
        })
    })
}
