module.exports.config = {
	name: "giveaway",
	version: "0.0.2",
	hasPermssion: 0,
	credits: "𝑨𝒔𝒊𝒇 𝑴𝒂𝒉𝒎𝒖𝒅",
	description: "🎉 Advanced giveaway management system",
	category: "economy",
	usages: "[create/details/join/roll/end] [IDGiveAway]",
	cooldowns: 5,
	envConfig: {
		maxGiveaways: 50
	}
};

module.exports.languages = {
	"en": {
		"createSuccess": "🎉 New Giveaway Created!",
		"detailsTitle": "📊 Giveaway Details",
		"joinSuccess": "✅ Joined Giveaway Successfully!",
		"winnerSelected": "🎁 Winner Selected!",
		"giveawayEnded": "🔚 Giveaway Ended!",
		"missingReward": "❌ Please specify the giveaway reward!",
		"missingID": "❌ Please provide giveaway ID!",
		"notFound": "❌ Giveaway not found!",
		"alreadyJoined": "❌ You've already joined this giveaway!",
		"notOwner": "❌ Only the giveaway creator can perform this action!",
		"noParticipants": "❌ No participants in this giveaway!"
	},
	"bn": {
		"createSuccess": "🎉 নতুন গিভঅ্যাওয়ে তৈরি হয়েছে!",
		"detailsTitle": "📊 গিভঅ্যাওয়ে বিস্তারিত",
		"joinSuccess": "✅ গিভঅ্যাওয়েতে যোগ দিলেন!",
		"winnerSelected": "🎁 বিজয়ী নির্বাচিত হয়েছে!",
		"giveawayEnded": "🔚 গিভঅ্যাওয়ে শেষ হয়েছে!",
		"missingReward": "❌ গিভঅ্যাওয়ে রিওয়ার্ড লিখুন!",
		"missingID": "❌ গিভঅ্যাওয়ে আইডি দিন!",
		"notFound": "❌ গিভঅ্যাওয়ে পাওয়া যায়নি!",
		"alreadyJoined": "❌ আপনি ইতিমধ্যে যোগ দিয়েছেন!",
		"notOwner": "❌ আপনি এই গিভঅ্যাওয়ের মালিক নন!",
		"noParticipants": "❌ কেউ যোগ দেয়নি!"
	}
};

module.exports.onLoad = function() {
	const { existsSync, readFileSync, writeFileSync } = global.nodemodule["fs-extra"];
	const path = __dirname + "/cache/giveaways.json";
	
	if (!existsSync(path)) {
		writeFileSync(path, JSON.stringify({}), "utf-8");
	}
	
	const data = JSON.parse(readFileSync(path, "utf-8"));
	global.data.GiveAway = new Map(Object.entries(data));
};

module.exports.handleReaction = async function({ api, event, handleReaction, Users }) {
	try {
		const data = global.data.GiveAway.get(handleReaction.ID);
		if (!data || data.status !== "open") return;

		const { userID, reaction } = event;
		const userInfo = await Users.getInfo(userID);
		const userName = userInfo.name || "User";

		if (!reaction) {
			data.joined = data.joined.filter(id => id !== userID);
			api.sendMessage(`❌ ${userName} left the giveaway (ID: #${handleReaction.ID})`, event.threadID);
		} else {
			if (!data.joined.includes(userID)) {
				data.joined.push(userID);
				api.sendMessage(`✅ ${userName} joined the giveaway (ID: #${handleReaction.ID})`, event.threadID);
			}
		}

		global.data.GiveAway.set(handleReaction.ID, data);
		const path = __dirname + "/cache/giveaways.json";
		global.nodemodule["fs-extra"].writeFileSync(
			path, 
			JSON.stringify(Object.fromEntries(global.data.GiveAway), null, 2)
		);
	} catch (error) {
		console.error("Giveaway reaction error:", error);
	}
};

module.exports.run = async function({ api, event, args, Users, Threads, Currencies, permssion, getText }) {
	const { threadID, messageID, senderID } = event;
	const { existsSync, writeFileSync } = global.nodemodule["fs-extra"];
	const path = __dirname + "/cache/giveaways.json";

	const getLang = (key) => {
		const language = global.config.language || "en";
		return module.exports.languages[language][key] || key;
	};

	const saveData = () => {
		writeFileSync(path, JSON.stringify(Object.fromEntries(global.data.GiveAway), null, 2));
	};

	switch (args[0]) {
		case "create": {
			const reward = args.slice(1).join(" ");
			if (!reward) return api.sendMessage(getText("missingReward"), threadID, messageID);

			const giveawayID = Math.floor(10000 + Math.random() * 90000);
			const userInfo = await Users.getInfo(senderID);
			const userName = userInfo.name || "User";

			const message = await api.sendMessage({
				body: `🎉====== 𝐆𝐈𝐕𝐄𝐀𝐖𝐀𝐘 ======🎉\n` +
					`👤 Creator: ${userName}\n` +
					`🎁 Reward: ${reward}\n` +
					`🆔 ID: #${giveawayID}\n` +
					`📊 Status: 🟢 OPEN\n\n` +
					`💬 React to this message to join!`,
				mentions: [{
					tag: userName,
					id: senderID
				}]
			}, threadID);

			const giveawayData = {
				ID: giveawayID,
				author: userName,
				authorID: senderID,
				messageID: message.messageID,
				reward: reward,
				joined: [],
				status: "open",
				createdAt: Date.now()
			};

			global.data.GiveAway.set(giveawayID.toString(), giveawayData);
			saveData();

			global.client.handleReaction.push({
				name: this.config.name,
				messageID: message.messageID,
				author: senderID,
				ID: giveawayID.toString()
			});

			return api.sendMessage(getText("createSuccess"), threadID, messageID);
		}

		case "details": {
			if (!args[1]) return api.sendMessage(getText("missingID"), threadID, messageID);
			
			const giveawayID = args[1].replace("#", "");
			const data = global.data.GiveAway.get(giveawayID);
			
			if (!data) return api.sendMessage(getText("notFound"), threadID, messageID);

			return api.sendMessage({
				body: `📊====== ${getText("detailsTitle")} ======📊\n` +
					`👤 Creator: ${data.author}\n` +
					`🎁 Reward: ${data.reward}\n` +
					`🆔 ID: #${data.ID}\n` +
					`👥 Participants: ${data.joined.length}\n` +
					`📅 Created: ${new Date(data.createdAt).toLocaleString()}\n` +
					`📌 Status: ${data.status === "open" ? "🟢 OPEN" : "🔴 CLOSED"}`
			}, threadID, data.messageID);
		}

		case "join": {
			if (!args[1]) return api.sendMessage(getText("missingID"), threadID, messageID);
			
			const giveawayID = args[1].replace("#", "");
			const data = global.data.GiveAway.get(giveawayID);
			
			if (!data) return api.sendMessage(getText("notFound"), threadID, messageID);
			if (data.joined.includes(senderID)) return api.sendMessage(getText("alreadyJoined"), threadID, messageID);

			data.joined.push(senderID);
			global.data.GiveAway.set(giveawayID, data);
			saveData();

			const userInfo = await Users.getInfo(senderID);
			return api.sendMessage(`✅ ${userInfo.name} ${getText("joinSuccess")}`, threadID);
		}

		case "roll": {
			if (!args[1]) return api.sendMessage(getText("missingID"), threadID, messageID);
			
			const giveawayID = args[1].replace("#", "");
			const data = global.data.GiveAway.get(giveawayID);
			
			if (!data) return api.sendMessage(getText("notFound"), threadID, messageID);
			if (data.authorID !== senderID) return api.sendMessage(getText("notOwner"), threadID, messageID);
			if (data.joined.length === 0) return api.sendMessage(getText("noParticipants"), threadID, messageID);

			const winnerID = data.joined[Math.floor(Math.random() * data.joined.length)];
			const userInfo = await Users.getInfo(winnerID);

			return api.sendMessage({
				body: `🎉 Congratulations ${userInfo.name}!\n` +
					`You won the giveaway: ${data.reward}\n` +
					`🏆 Giveaway ID: #${data.ID}\n\n` +
					`📩 Please contact ${data.author} to claim your prize!`,
				mentions: [{
					tag: userInfo.name,
					id: winnerID
				}]
			}, threadID, messageID);
		}

		case "end": {
			if (!args[1]) return api.sendMessage(getText("missingID"), threadID, messageID);
			
			const giveawayID = args[1].replace("#", "");
			const data = global.data.GiveAway.get(giveawayID);
			
			if (!data) return api.sendMessage(getText("notFound"), threadID, messageID);
			if (data.authorID !== senderID) return api.sendMessage(getText("notOwner"), threadID, messageID);

			data.status = "ended";
			global.data.GiveAway.set(giveawayID, data);
			saveData();

			api.unsendMessage(data.messageID);
			return api.sendMessage(
				`🔚 Giveaway #${data.ID} has been ended by ${data.author}!`, 
				threadID, 
				messageID
			);
		}

		default: {
			return api.sendMessage({
				body: `🎉 𝐆𝐈𝐕𝐄𝐀𝐖𝐀𝐘 𝐒𝐘𝐒𝐓𝐄𝐌 🎉\n\n` +
					`📌 create [reward] - Create new giveaway\n` +
					`📌 details [id] - Show giveaway details\n` +
					`📌 join [id] - Join a giveaway\n` +
					`📌 roll [id] - Roll winner\n` +
					`📌 end [id] - End giveaway\n\n` +
					`🔮 Example: giveaway create $5 PayPal`
			}, threadID, messageID);
		}
	}
};
