const { removeHomeDir, log } = global.utils;

module.exports.config = {
	name: "eval",
	version: "1.6",
	hasPermssion: 2,
	credits: "𝑨𝒔𝒊𝒇 𝑴𝒂𝒉𝒎𝒖𝒅",
	description: "Test code quickly with beautiful output 📝",
	category: "owner",
	usages: "{pn} <code_to_test>",
	cooldowns: 5
};

module.exports.languages = {
	"en": {
		"error": "❌ An error occurred while executing the code:",
		"success": "✨ Code executed successfully!"
	}
};

module.exports.onStart = async function ({ api, event, args, getLang }) {
	try {
		// Helper for output
		function output(msg) {
			const formattedMsg = formatOutput(msg);
			api.sendMessage(`📊 Output:\n${formattedMsg}`, event.threadID, event.messageID);
		}

		function out(msg) {
			output(msg);
		}

		// Format nicely with emojis
		function formatOutput(msg) {
			if (typeof msg === "number" || typeof msg === "boolean" || typeof msg === "function")
				return `🔢 ${msg.toString()}`;
			else if (msg instanceof Map) {
				let text = `🗺️ Map(${msg.size}) `;
				text += JSON.stringify(mapToObj(msg), null, 2);
				return text;
			}
			else if (typeof msg === "object" && msg !== null)
				return `📦 ${JSON.stringify(msg, null, 2)}`;
			else if (typeof msg === "undefined")
				return "❓ undefined";
			else
				return `📝 ${msg}`;
		}

		// Convert Map to Object
		function mapToObj(map) {
			const obj = {};
			map.forEach((v, k) => obj[k] = v);
			return obj;
		}

		// Eval wrapped
		const evalCode = `
		(async () => {
			try {
				${args.join(" ")}
			} catch(err) {
				log.err("eval command", err);
				output(
					"${getLang("error")}\\n" +
					(err.stack ?
						removeHomeDir(err.stack) :
						removeHomeDir(JSON.stringify(err, null, 2) || "")
					)
				);
			}
		})()`;
		
		eval(evalCode);
		api.sendMessage(getLang("success"), event.threadID, event.messageID);
	} 
	catch (error) {
		log.error("Eval command error", error);
		api.sendMessage(`❌ Error: ${error.message}`, event.threadID, event.messageID);
	}
};
