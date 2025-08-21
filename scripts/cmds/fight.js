const TIMEOUT_SECONDS = 120;
const ongoingFights = new Map();
const gameInstances = new Map();

module.exports.config = {
	name: "fight",
	version: "1.1",
	author: "𝑨𝒔𝒊𝒇 𝑴𝒂𝒉𝒎𝒖𝒅",
	countDown: 10,
	role: 0,
	shortDescription: {
		en: "⚔️ Fight with friends",
		bn: "⚔️ বন্ধুর সাথে ফাইট করো!"
	},
	longDescription: {
		en: "💥 Challenge your friend to an epic battle",
		bn: "💥 বন্ধুকে ফাইটের চ্যালেঞ্জ দাও এবং জয়ী হও"
	},
	category: "🎮 Game",
	guide: {
		en: "{pn} @mention",
		bn: "{pn} @mention"
	}
};

module.exports.onStart = async function ({ event, message, usersData }) {
	const threadID = event.threadID;
	if (ongoingFights.has(threadID)) {
		return message.reply("⚔️ | Already a fight ongoing in this group!");
	}

	const mention = Object.keys(event.mentions);
	if (mention.length !== 1) {
		return message.reply("❓ | Mention one person to fight with!");
	}

	const challengerID = event.senderID;
	const opponentID = mention[0];
	
	if (challengerID === opponentID) {
		return message.reply("⚠️ | You cannot fight yourself!");
	}

	const challenger = await usersData.getName(challengerID);
	const opponent = await usersData.getName(opponentID);

	const fight = {
		participants: [
			{ id: challengerID, name: challenger, hp: 100 },
			{ id: opponentID, name: opponent, hp: 100 }
		],
		currentPlayer: Math.random() < 0.5 ? challengerID : opponentID,
		threadID
	};

	const gameInstance = {
		fight,
		lastAttack: null,
		lastPlayer: null,
		timeoutID: null,
		turnMessageSent: false
	};

	gameInstances.set(threadID, gameInstance);
	startFight(message, fight);
	startTimeout(threadID, message);
};

module.exports.onChat = async function ({ event, message }) {
	const threadID = event.threadID;
	const gameInstance = gameInstances.get(threadID);
	if (!gameInstance) return;

	const currentPlayerID = gameInstance.fight.currentPlayer;
	const currentPlayer = gameInstance.fight.participants.find(p => p.id === currentPlayerID);
	const attack = event.body.trim().toLowerCase();

	if (event.senderID !== currentPlayerID) {
		if (!gameInstance.turnMessageSent) {
			gameInstance.turnMessageSent = true;
			return message.reply(`⏳ | It's ${currentPlayer.name}'s turn!`);
		}
		return;
	}

	const opponent = gameInstance.fight.participants.find(p => p.id !== currentPlayerID);

	if (attack === "forfeit") {
		message.reply(`🏃 | ${currentPlayer.name} forfeited! ${opponent.name} wins! 🏆`);
		return endFight(threadID);
	}

	if (["kick", "punch", "slap"].includes(attack)) {
		const damage = Math.random() < 0.1 ? 0 : Math.floor(Math.random() * 20 + 10);
		opponent.hp -= damage;

		const attackEmojis = {
			kick: "🦶",
			punch: "👊",
			slap: "✋"
		};

		await message.reply(
			`${attackEmojis[attack]} | ${currentPlayer.name} uses ${attack} on ${opponent.name}\n` +
			`💥 Damage: ${damage} HP\n` +
			`❤️ ${opponent.name}: ${opponent.hp} HP | ${currentPlayer.name}: ${currentPlayer.hp} HP`
		);

		if (opponent.hp <= 0) {
			await message.reply(
				`🏁 | ${opponent.name} is defeated! ${currentPlayer.name} wins the battle! 🎉`
			);
			return endFight(threadID);
		}

		gameInstance.fight.currentPlayer = opponent.id;
		gameInstance.lastAttack = attack;
		gameInstance.lastPlayer = currentPlayer;
		gameInstance.turnMessageSent = false;

		message.reply(`🎯 | Now it's ${opponent.name}'s turn!`);
	} else {
		message.reply("❌ | Invalid attack! Use 'kick', 'punch', 'slap', or 'forfeit'");
	}
};

function startFight(message, fight) {
	ongoingFights.set(fight.threadID, fight);
	const [p1, p2] = fight.participants;
	const starter = fight.participants.find(p => p.id === fight.currentPlayer);
	message.reply(
		`⚔️ | ${p1.name} challenged ${p2.name} to a fight!\n` +
		`❤️ Both have 100 HP\n` +
		`🎲 ${starter.name} goes first!\n` +
		`📝 Available commands: kick, punch, slap, forfeit`
	);
}

function startTimeout(threadID, message) {
	const timeoutID = setTimeout(() => {
		const gameInstance = gameInstances.get(threadID);
		if (!gameInstance) return;

		const { participants } = gameInstance.fight;
		const winner = participants[0].hp > participants[1].hp ? participants[0] : participants[1];
		const loser = participants[0].hp > participants[1].hp ? participants[1] : participants[0];

		message.reply(
			`⏰ | Time's up! ${winner.name} wins with ${winner.hp} HP! 🏆\n` +
			`💔 ${loser.name} lost with ${loser.hp} HP`
		);
		endFight(threadID);
	}, TIMEOUT_SECONDS * 1000);

	gameInstances.get(threadID).timeoutID = timeoutID;
}

function endFight(threadID) {
	const gameInstance = gameInstances.get(threadID);
	if (gameInstance?.timeoutID) {
		clearTimeout(gameInstance.timeoutID);
	}
	gameInstances.delete(threadID);
	ongoingFights.delete(threadID);
}
