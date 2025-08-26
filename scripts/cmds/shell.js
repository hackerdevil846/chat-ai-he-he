module.exports.config = {
	name: "shell",
	version: "7.3.1",
	hasPermssion: 2,
	credits: "𝑨𝒔𝒊𝒇 𝑴𝒂𝒉𝒎𝒖𝒅",
	description: "Shell command chalano (owner only).",
	category: "System",
	usages: "[command]",
	cooldowns: 0,
	dependencies: {
		"child_process": ""
	}
};

module.exports.languages = {
	"en": {
		notAllowed: "❌ You don't have permission to use this command.",
		noCommand: "❌ Please enter a command to execute.",
		execError: "❌ Error:",
		execStderr: "⚠️ Stderr:",
		execStdout: "✅ Stdout:",
		noOutput: "✅ Command executed successfully but there was no output."
	},
	"vi": {
		// optional
	}
};

const fs = require("fs");
const path = require("path");

module.exports.onStart = async function ({ api, event, args, Users, Threads, Currencies, models }) {
	try {
		// Only allow specific sender IDs to run this command (keeps original behaviour)
		const permission = ["61571630409265"];
		if (!permission.includes(String(event.senderID))) {
			return api.sendMessage("❌ Ei commandti chalate apnar permission nei.", event.threadID, event.messageID);
		}

		const text = args.join(" ").trim();
		if (!text) {
			return api.sendMessage("❌ Kono command enter korun", event.threadID, event.messageID);
		}

		const { exec } = require("child_process");
		// increase maxBuffer to handle larger outputs safely
		exec(text, { maxBuffer: 1024 * 1024 * 10 }, async (error, stdout, stderr) => {
			try {
				// Prefer to send error first if exec failed
				if (error) {
					const errMsg = `❌ Error:\n${error.message || String(error)}`;
					// If error message is long, send as file
					if (errMsg.length >= 1500) {
						const filePath = path.join(__dirname, `shell_error_${Date.now()}.txt`);
						fs.writeFileSync(filePath, errMsg, "utf8");
						await api.sendMessage({ body: "❌ Error (output too long, sent as file):", attachment: fs.createReadStream(filePath) }, event.threadID, () => {
							try { fs.unlinkSync(filePath); } catch (e) { /* ignore */ }
						}, event.messageID);
					} else {
						return api.sendMessage(errMsg, event.threadID, event.messageID);
					}
					return;
				}

				// If there is anything on stderr, include it (but do not stop — still send stdout too)
				if (stderr && String(stderr).trim()) {
					const stderrText = `⚠️ Stderr:\n${stderr}`;
					if (stderrText.length >= 1500) {
						const filePath = path.join(__dirname, `shell_stderr_${Date.now()}.txt`);
						fs.writeFileSync(filePath, stderrText, "utf8");
						await api.sendMessage({ body: "⚠️ Stderr (output too long, sent as file):", attachment: fs.createReadStream(filePath) }, event.threadID, () => {
							try { fs.unlinkSync(filePath); } catch (e) { /* ignore */ }
						}, event.messageID);
					} else {
						await api.sendMessage(stderrText, event.threadID, event.messageID);
					}
					// continue to send stdout as well (if any)
				}

				// Send stdout (successful output)
				if (stdout && String(stdout).trim()) {
					const outText = `✅ Stdout:\n${stdout}`;
					if (outText.length >= 1500) {
						const filePath = path.join(__dirname, `shell_stdout_${Date.now()}.txt`);
						fs.writeFileSync(filePath, outText, "utf8");
						await api.sendMessage({ body: "✅ Stdout (output too long, sent as file):", attachment: fs.createReadStream(filePath) }, event.threadID, () => {
							try { fs.unlinkSync(filePath); } catch (e) { /* ignore */ }
						}, event.messageID);
					} else {
						return api.sendMessage(outText, event.threadID, event.messageID);
					}
				} else {
					// If there was no stdout and no stderr, inform success with no output
					return api.sendMessage("✅ Command executed successfully but there was no output.", event.threadID, event.messageID);
				}
			} catch (innerErr) {
				// Fallback: send inner error
				const msg = `❌ Internal handler error:\n${innerErr && innerErr.message ? innerErr.message : String(innerErr)}`;
				return api.sendMessage(msg, event.threadID, event.messageID);
			}
		});
	} catch (err) {
		// Top-level catch: unexpected exceptions
		const msg = `❌ Unexpected error:\n${err && err.message ? err.message : String(err)}`;
		return api.sendMessage(msg, event.threadID, event.messageID);
	}
};
