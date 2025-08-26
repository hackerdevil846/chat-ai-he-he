module.exports.config = {
	name: "outbox",
	version: "1.0.8",
	hasPermssion: 2,
	credits: "𝑨𝒔𝒊𝒇 𝑴𝒂𝒉𝒎𝒖𝒅",
	description: "নির্দিষ্ট সময়ে বটকে কোনো গ্রুপ থেকে বের করে দেয়।",
	category: "system",
	usages: "[]",
	cooldowns: 5,
	dependencies: {
		"moment-timezone": ""
	}
};

// Helper function to format the timestamp
module.exports.convertTime = (timestamp, separator) => {
	const pad = (input) => (input < 10 ? "0" + input : input);
	const date = timestamp ? new Date(timestamp * 1000) : new Date();
	return [
		pad(date.getHours()),
		pad(date.getMinutes()),
		pad(date.getSeconds())
	].join(typeof separator !== 'undefined' ? separator : ':');
};

// This function runs when a scheduled task is triggered
module.exports.handleSchedule = async function({ api, schedule }) {
	try {
		// Attempt to remove the bot from the target group
		await api.removeUserFromGroup(api.getCurrentUserID(), schedule.target);
		// Notify the admin of the successful departure
		api.sendMessage(`✅ | [𝒐𝒖𝒕𝒃𝒐𝒙]\n\nসফলভাবে গ্রুপ থেকে বের হয়েছি।\n🆔 গ্রুপ আইডি: ${schedule.target}`, global.config.ADMINBOT[0]);
	} catch (e) {
		console.error(`[OUTBOX ERROR] Failed to leave group ${schedule.target}: ${e}`);
		// Notify the admin if the bot fails to leave the group
		api.sendMessage(`❌ | [𝒐𝒖𝒕𝒃𝒐𝒙]\n\nগ্রুপ থেকে বের হতে পারিনি।\n🆔 গ্রুপ আইডি: ${schedule.target}!`, global.config.ADMINBOT[0]);
	}
};

// This function handles replies for the interactive setup
module.exports.handleReply = async function({ api, event, handleReply }) {
	const moment = global.nodemodule["moment-timezone"];

	// Ensure the reply is from the original command user
	if (handleReply.author != event.senderID) return;

	switch (handleReply.type) {
		case "inputThreadID": {
			if (isNaN(event.body)) {
				return api.sendMessage("❌ | [𝒐𝒖𝒕𝒃𝒐𝒙]\n\nদয়া করে একটি সঠিক গ্রুপ আইডি দিন।", event.threadID, event.messageID);
			}
			api.unsendMessage(handleReply.messageID);
			return api.sendMessage("⏰ | [𝒐𝒖𝒕𝒃𝒐𝒙]\n\nএখন দয়া করে সময় সেট করুন।\nফরম্যাট: (HH:mm)", event.threadID, (err, info) => {
				global.client.handleReply.push({
					type: "inputTime",
					name: this.config.name,
					author: event.senderID,
					messageID: info.messageID,
					target: event.body
				});
			});
		}

		case "inputTime": {
			const time = moment().tz("Asia/Dhaka");
			const regex = /^([01]?[0-9]|2[0-3]):[0-5][0-9]$/;

			if (!regex.test(event.body)) {
				return api.sendMessage("❌ | [𝒐𝒖𝒕𝒃𝒐𝒙]\n\nসময়ের ফরম্যাটটি ভুল। দয়া করে (HH:mm) ফরম্যাট ব্যবহার করুন।", event.threadID, event.messageID);
			}
			const [hour, minute] = event.body.split(":");

			// If the specified time is in the past for today, schedule it for the next day
			if (hour > time.hours() || (hour == time.hours() && minute > time.minutes())) {
				time.set({ hour, minute, second: 0 });
			} else {
				time.add(1, "days").set({ hour, minute, second: 0 });
			}

			api.unsendMessage(handleReply.messageID);
			return api.sendMessage("📝 | [𝒐𝒖𝒕𝒃𝒐𝒙]\n\nগ্রুপ থেকে বের হওয়ার একটি কারণ লিখুন।", event.threadID, (err, info) => {
				global.client.handleReply.push({
					type: "inputReason",
					name: this.config.name,
					author: event.senderID,
					messageID: info.messageID,
					target: handleReply.target,
					timeTarget: time.unix()
				});
			});
		}

		case "inputReason": {
			const reason = event.body || "কোনো কারণ উল্লেখ করা হয়নি।";
			api.unsendMessage(handleReply.messageID);

			// Send a confirmation message to the admin
			api.sendMessage(
				`🗓️ === [ 𝑶𝒖𝒕𝑩𝒐𝒙 𝑺𝒆𝒕 ] === 🗓️\n\n` +
				`🆔 গ্রুপ আইডি: ${handleReply.target}\n` +
				`⏰ সময়: ${this.convertTime(handleReply.timeTarget)}\n` +
				`📝 কারণ: ${reason}`,
				event.threadID,
				(err, info) => {
					// Send a notification to the target group
					api.sendMessage(
						`🔔 | [ 𝑶𝒖𝒕𝒃𝒐𝒙 𝑵𝒐𝒕𝒊𝒄𝒆 ] | 🔔\n\nএই বটটি ${this.convertTime(handleReply.timeTarget)} সময়ে এই গ্রুপ থেকে স্বয়ংক্রিয়ভাবে বের হয়ে যাবে।\n\n📝 কারণ: ${reason}\n\nএটি অ্যাডমিনের নির্দেশে করা হচ্ছে।`,
						handleReply.target,
						(error) => {
							if (error) {
								return api.sendMessage(`❌ | [𝒐𝒖𝒕𝒃𝒐𝒙]\n\nএই আইডি (${handleReply.target}) সহ গ্রুপটি খুঁজে পাওয়া যায়নি অথবা বট সেই গ্রুপে নেই।`, event.threadID);
							} else {
								// Push the task to the schedule handler
								global.client.handleSchedule.push({
									commandName: this.config.name,
									timestamp: handleReply.timeTarget,
									target: handleReply.target,
									reason: reason,
									event
								});
								return api.sendMessage(`✅ | [𝒐𝒖𝒕𝒃𝒐𝒙]\n\nসময় সফলভাবে সেট করা হয়েছে। বট নির্দিষ্ট সময়ে গ্রুপ থেকে বের হয়ে যাবে।`, event.threadID);
							}
						}
					);
				}
			);
			break;
		}
	}
};

// This is the main function that runs when the command is called
module.exports.onStart = function({ api, event }) {
	return api.sendMessage("🆔 | [𝒐𝒖𝒕𝒃𝒐𝒙]\n\nআপনি কোন গ্রুপ থেকে বটকে বের করতে চান তার আইডি দিন।", event.threadID, (err, info) => {
		global.client.handleReply.push({
			type: "inputThreadID",
			name: this.config.name,
			author: event.senderID,
			messageID: info.messageID
		});
	});
};
