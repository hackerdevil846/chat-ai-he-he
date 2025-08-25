const axios = require("axios");

module.exports.config = {
	name: "flux",
	version: "2.5",
	hasPermssion: 0,
	credits: "𝑨𝒔𝒊𝒇 𝑴𝒂𝒉𝒎𝒖𝒅",
	description: "🎨 Generate stunning AI-powered images with Flux technology",
	category: "image",
	usages: "[prompt] --ratio [width:height]",
	cooldowns: 20,
	dependencies: {
		"axios": ""
	},
	envConfig: {
		maxPromptLength: 500
	}
};

module.exports.onStart = async function ({ api, event, args }) {
	const apiUrl = "https://www.noobs-api.rf.gd/dipto/flux";
	const { maxPromptLength } = module.exports.config.envConfig;
	
	try {
		if (args.length === 0) {
			return api.sendMessage(
				`✨ 𝗙𝗟𝗨𝗫 𝗔𝗜 𝗜𝗠𝗔𝗚𝗘 𝗚𝗘𝗡𝗘𝗥𝗔𝗧𝗢𝗥 ✨

📝 𝗨𝘀𝗮𝗴𝗲: 
   flux [prompt] --ratio [dimensions]
   
🎯 𝗘𝘅𝗮𝗺𝗽𝗹𝗲𝘀:
   • flux cyberpunk city at night --ratio 16:9
   • flux beautiful waterfall --ratio 9:16
   • flux portrait of a warrior --ratio 1:1

📋 𝗔𝘃𝗮𝗶𝗹𝗮𝗯𝗹𝗲 𝗥𝗮𝘁𝗶𝗼𝘀:
   ▫️ 1:1  ▫️ 16:9  ▫️ 9:16
   ▫️ 4:3  ▫️ 3:4   ▫️ 2:3
   ▫️ 3:2  ▫️ 4:5   ▫️ 5:4

💡 𝗧𝗶𝗽: Be descriptive for better results!
🔮 𝗖𝗿𝗲𝗱𝗶𝘁𝘀: 𝑨𝒔𝒊𝒇 𝑴𝒂𝒉𝒎𝒖𝒅`, 
				event.threadID, 
				event.messageID
			);
		}

		const fullPrompt = args.join(" ");
		
		if (fullPrompt.length > maxPromptLength) {
			return api.sendMessage(
				`⚠️ 𝗣𝗿𝗼𝗺𝗽𝘁 𝗧𝗼𝗼 𝗟𝗼𝗻𝗴!\n\nYour prompt exceeds the maximum length of ${maxPromptLength} characters.\n\nCurrent length: ${fullPrompt.length} characters\n\nPlease shorten your prompt and try again.`,
				event.threadID,
				event.messageID
			);
		}

		let prompt, ratio = "1:1";

		if (fullPrompt.includes("--ratio")) {
			const parts = fullPrompt.split("--ratio");
			prompt = parts[0].trim();
			ratio = parts[1] ? parts[1].trim() : "1:1";
		} else {
			prompt = fullPrompt;
		}

		if (!ratio.match(/^\d+:\d+$/)) {
			return api.sendMessage(
				`⚠️ 𝗜𝗻𝘃𝗮𝗹𝗶𝗱 𝗥𝗮𝘁𝗶𝗼 𝗙𝗼𝗿𝗺𝗮𝘁!

Please use one of these formats:
▫️ 16:9    ▫️ 1:1    ▫️ 4:3
▫️ 9:16    ▫️ 3:4    ▫️ 2:3

Your input: "${ratio}"

💡 𝗧𝗶𝗽: Use --ratio after your prompt to specify dimensions`,
				event.threadID, 
				event.messageID
			);
		}

		const waitMsg = await api.sendMessage(
			`🔄 𝗚𝗲𝗻𝗲𝗿𝗮𝘁𝗶𝗻𝗴 𝗬𝗼𝘂𝗿 𝗙𝗹𝘂𝘅 𝗜𝗺𝗮𝗴𝗲...

⏳ 𝗣𝗹𝗲𝗮𝘀𝗲 𝘄𝗮𝗶𝘁 𝟭𝟬-𝟮𝟬 𝘀𝗲𝗰𝗼𝗻𝗱𝘀

📝 𝗣𝗿𝗼𝗺𝗽𝘁: ${prompt}
📐 𝗥𝗮𝘁𝗶𝗼: ${ratio}

🌟 𝗖𝗿𝗲𝗮𝘁𝗶𝘃𝗶𝘁𝘆 𝗶𝗻 𝗽𝗿𝗼𝗴𝗿𝗲𝘀𝘀...`,
			event.threadID
		);

		const startTime = Date.now();
		
		const response = await axios.get(`${apiUrl}?prompt=${encodeURIComponent(prompt)}&ratio=${ratio}`, {
			responseType: "stream",
			timeout: 120000
		});

		const generationTime = ((Date.now() - startTime) / 1000).toFixed(2);
		await api.unsendMessage(waitMsg.messageID);

		return api.sendMessage(
			{
				body: `✨ 𝗙𝗟𝗨𝗫 𝗜𝗠𝗔𝗚𝗘 𝗚𝗘𝗡𝗘𝗥𝗔𝗧𝗘𝗗 𝗦𝗨𝗖𝗖𝗘𝗦𝗦𝗙𝗨𝗟𝗟𝗬!

⏱️ 𝗚𝗲𝗻𝗲𝗿𝗮𝘁𝗶𝗼𝗻 𝗧𝗶𝗺𝗲: ${generationTime} seconds
📝 𝗣𝗿𝗼𝗺𝗽𝘁: "${prompt}"
📐 𝗔𝘀𝗽𝗲𝗰𝘁 𝗥𝗮𝘁𝗶𝗼: ${ratio}

🎨 𝗣𝗼𝘄𝗲𝗿𝗲𝗱 𝗯𝘆 𝗙𝗹𝘂𝘅 𝗔𝗜 𝗧𝗲𝗰𝗵𝗻𝗼𝗹𝗼𝗴𝘆
🔮 𝗖𝗿𝗲𝗱𝗶𝘁𝘀: 𝑨𝒔𝒊𝒇 𝑴𝒂𝒉𝒎𝒖𝒅

💡 𝗧𝗶𝗽: Use descriptive prompts for even better results!`,
				attachment: response.data
			},
			event.threadID,
			event.messageID
		);

	} catch (error) {
		console.error("Flux Command Error:", error);
		
		let errorMessage = `⚠️ 𝗜𝗠𝗔𝗚𝗘 𝗚𝗘𝗡𝗘𝗥𝗔𝗧𝗜𝗢𝗡 𝗙𝗔𝗜𝗟𝗘𝗗!

🔸 𝗥𝗲𝗮𝘀𝗼𝗻: `;
		
		if (error.response?.status === 503) {
			errorMessage += "Server is busy or overloaded";
		} else if (error.code === "ECONNABORTED" || error.message.includes("timeout")) {
			errorMessage += "Request timeout - try a simpler prompt";
		} else if (error.response?.status === 429) {
			errorMessage += "Too many requests - please wait before trying again";
		} else if (error.response?.status === 400) {
			errorMessage += "Invalid prompt or parameters";
		} else {
			errorMessage += "Unexpected error occurred";
		}
		
		errorMessage += `

💡 𝗧𝗿𝘆 𝗧𝗵𝗲𝘀𝗲 𝗙𝗶𝘅𝗲𝘀:
▫️ Use a simpler or shorter prompt
▫️ Try a different aspect ratio
▫️ Wait a minute before trying again
▫️ Check your prompt for inappropriate content

🔮 𝗖𝗿𝗲𝗱𝗶𝘁𝘀: 𝑨𝒔𝒊𝒇 𝑴𝒂𝒉𝒎𝒖𝒅`;
		
		return api.sendMessage(errorMessage, event.threadID, event.messageID);
	}
};
