module.exports.config = {
	name: "dictionary",
	version: "1.0.0",
	hasPermssion: 0,
	credits: "𝑨𝒔𝒊𝒇 𝑴𝒂𝒉𝒎𝒖𝒅",
	description: "𝑬𝒏𝒈𝒍𝒊𝒔𝒉 𝒅𝒊𝒄𝒕𝒊𝒐𝒏𝒂𝒓𝒚 𝒄𝒉𝒆𝒄𝒌𝒆𝒓",
	category: "𝗨𝗧𝗜𝗟𝗜𝗧𝗬",
	usages: "[word]",
	cooldowns: 5,
	dependencies: {
		"axios": ""
	}
};

module.exports.onStart = async function({ api, event, args }) {
	const axios = global.nodemodule["axios"];
	const { threadID, messageID } = event;

	if (!args[0]) {
		return api.sendMessage("🔍 | Please provide a word to search!\nUsage: /dictionary [word]", threadID, messageID);
	}

	const word = args.join(" ").trim().toLowerCase();

	try {
		const response = await axios.get(`https://api.dictionaryapi.dev/api/v2/entries/en/${word}`);
		const data = response.data[0];
		
		const formatText = (text) => {
			const mapping = {
				a: '𝒂', b: '𝒃', c: '𝒄', d: '𝒅', e: '𝒆', f: '𝒇', g: '𝒈', h: '𝒉', i: '𝒊', j: '𝒋',
				k: '𝒌', l: '𝒍', m: '𝒎', n: '𝒏', o: '𝒐', p: '𝒑', q: '𝒒', r: '𝒓', s: '𝒔', t: '𝒕',
				u: '𝒖', v: '𝒗', w: '𝒘', x: '𝒙', y: '𝒚', z: '𝒛',
				A: '𝑨', B: '𝑩', C: '𝑪', D: '𝑫', E: '𝑬', F: '𝑭', G: '𝑮', H: '𝑯', I: '𝑰', J: '𝑱',
				K: '𝑲', L: '𝑳', M: '𝑴', N: '𝑵', O: '𝑶', P: '𝑷', Q: '𝑸', R: '𝑹', S: '𝑺', T: '𝑻',
				U: '𝑼', V: '𝑽', W: '𝑾', X: '𝑿', Y: '𝒀', Z: '𝒁'
			};
			return text.split('').map(char => mapping[char] || char).join('');
		};

		let message = `📚 𝗗𝗜𝗖𝗧𝗜𝗢𝗡𝗔𝗥𝗬 𝗥𝗘𝗦𝗨𝗟𝗧 📚\n\n`;
		message += `✨ 𝗪𝗼𝗿𝗱: ${formatText(data.word)}\n\n`;

		if (data.phonetics && data.phonetics.length > 0) {
			data.phonetics.forEach(phonetic => {
				if (phonetic.text) message += `🔊 𝗣𝗿𝗼𝗻𝘂𝗻𝗰𝗶𝗮𝘁𝗶𝗼𝗻: /${phonetic.text}/\n`;
				if (phonetic.audio) message += `🎵 𝗔𝘂𝗱𝗶𝗼: ${phonetic.audio}\n`;
			});
			message += `\n`;
		}

		data.meanings.forEach(meaning => {
			message += `📌 𝗣𝗮𝗿𝘁 𝗼𝗳 𝗦𝗽𝗲𝗲𝗰𝗵: ${formatText(meaning.partOfSpeech)}\n`;
			
			if (meaning.definitions && meaning.definitions.length > 0) {
				meaning.definitions.slice(0, 3).forEach((def, index) => {
					message += `\n${index + 1}⃣ 𝗗𝗲𝗳𝗶𝗻𝗶𝘁𝗶𝗼𝗻: ${def.definition}\n`;
					if (def.example) message += `✏️ 𝗘𝘅𝗮𝗺𝗽𝗹𝗲: ${def.example}\n`;
				});
			}
			message += `\n────────────────\n\n`;
		});

		message += `💖 𝗣𝗼𝘄𝗲𝗿𝗲𝗱 𝗯𝘆 ${formatText("Asif Mahmud")}`;

		return api.sendMessage(message, threadID, messageID);

	} catch (error) {
		if (error.response?.status === 404) {
			return api.sendMessage(`❌ | Word "${word}" not found in the dictionary!`, threadID, messageID);
		}
		return api.sendMessage("❌ | An error occurred while fetching the dictionary data.", threadID, messageID);
	}
};
