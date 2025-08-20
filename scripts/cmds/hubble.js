const axios = require('axios');
const fs = require('fs-extra');
const { getStreamFromURL } = global.utils;

const pathData = __dirname + '/assets/hubble/nasa.json';

module.exports = {
	config: {
		name: "hubble",
		version: "1.3",
		author: "𝑨𝒔𝒊𝒇 𝑴𝒂𝒉𝒎𝒖𝒅",
		countDown: 5,
		role: 0,
		description: {
			vi: "Xem ảnh từ Hubble",
			en: "View Hubble images"
		},
		category: "group",
		guide: {
			en: "{pn} <date (mm-dd)>"
		}
	},

	langs: {
		en: {
			invalidDate: "❌ Invalid date format! Please use mm-dd format",
			noImage: "🌌 No Hubble image found for this date"
		}
	},

	onLoad: async function () {
		if (!fs.existsSync(__dirname + '/assets/hubble')) {
			fs.mkdirSync(__dirname + '/assets/hubble', { recursive: true });
		}
		
		if (!fs.existsSync(pathData)) {
			try {
				const res = await axios.get('https://raw.githubusercontent.com/ntkhang03/Goat-Bot-V2/main/scripts/cmds/assets/hubble/nasa.json');
				fs.writeFileSync(pathData, JSON.stringify(res.data, null, 2));
			} catch (error) {
				console.error('Failed to download NASA data:', error);
			}
		}
	},

	onStart: async function ({ message, args, getLang }) {
		try {
			const date = args[0] || "";
			const dateText = checkValidDate(date);
			
			if (!date || !dateText) {
				return message.reply(getLang('invalidDate'));
			}

			if (!fs.existsSync(pathData)) {
				return message.reply("🔴 Data not available. Please try again later");
			}

			const hubbleData = JSON.parse(fs.readFileSync(pathData));
			const data = hubbleData.find(e => e.date.startsWith(dateText));
			
			if (!data) {
				return message.reply(getLang('noImage'));
			}

			const { image, name, caption, url } = data;
			const getImage = await getStreamFromURL('https://imagine.gsfc.nasa.gov/hst_bday/images/' + image);
			
			const msg = `✨𝗛𝗨𝗕𝗕𝗟𝗘 𝗧𝗘𝗟𝗘𝗦𝗖𝗢𝗣𝗘 𝗜𝗠𝗔𝗚𝗘✨\n
📅 𝗗𝗮𝘁𝗲: ${dateText}
🌠 𝗡𝗮𝗺𝗲: ${name}
📝 𝗖𝗮𝗽𝘁𝗶𝗼𝗻: ${caption}
🔗 𝗦𝗼𝘂𝗿𝗰𝗲: ${url}`;

			message.reply({
				body: msg,
				attachment: getImage
			});
		} catch (error) {
			console.error(error);
			message.reply("❌ An error occurred while processing your request");
		}
	}
};

const monthText = ['January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December'];

function checkValidDate(date) {
	const dateArr = date.split(/[-/]/);
	if (dateArr.length !== 2) return false;
	
	let [month, day] = dateArr.map(Number);
	
	if (month > 12) {
		[day, month] = [month, day];
	}
	
	if (month < 1 || month > 12 || day < 1 || day > 31) return false;
	if (month === 2 && day > 29) return false;
	if ([4, 6, 9, 11].includes(month) && day > 30) return false;
	
	return `${monthText[month - 1]} ${day}`;
}
