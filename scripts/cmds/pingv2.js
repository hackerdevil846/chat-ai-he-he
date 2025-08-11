module.exports.config = {
	name: "pingv2",
	version: "0.0.3",
	hasPermssion: 1,
	credits: "𝑨𝒔𝒊𝒇 𝑴𝒂𝒉𝒎𝒖𝒅",
	description: "𝑺𝒐𝒃𝒂𝒊𝒌𝒆 𝑻𝒂𝒈 𝑲𝒐𝒓𝒂",
	commandCategory: "𝒔𝒊𝒔𝒕𝒆𝒎",
	usages: "[𝑻𝒆𝒙𝒕]",
	cooldowns: 80
};

module.exports.run = async function({ api, event, args, Threads }) {
	try {
		var all = (await Threads.getInfo(event.threadID)).participantIDs;
    	all.splice(all.indexOf(api.getCurrentUserID()), 1);
	  	all.splice(all.indexOf(event.senderID), 1);
		var body = (args.length != 0) ? args.join(" ") : "𝑨𝒅𝒎𝒊𝒏 𝒕𝒖𝒎𝒂𝒌𝒆 𝒎𝒆𝒏𝒕𝒊𝒐𝒏 𝒌𝒐𝒓𝒆𝒄𝒉𝒆 ", 
		mentions = [], 
		index = 0;
		
    	for (let i = 0; i < all.length; i++) {
		    if (i == body.length) body += body.charAt(body.length - 1);
		    mentions.push({
		  	  tag: body[i],
		  	  id: all[i],
		  	  fromIndex: i - 1
		    });
	    }

		return api.sendMessage({ 
			body: `‎${body}`, 
			mentions 
		}, event.threadID, event.messageID);

	}
	catch (e) { 
		return api.sendMessage("𝑬𝒊 𝒕𝒂𝒓 𝒕𝒂𝒈 𝒌𝒐𝒓𝒕𝒆 𝒈𝒆𝒍𝒆 𝒆𝒓𝒓𝒐𝒓 𝒉𝒐𝒍𝒐: " + e.message, event.threadID); 
	}
}
