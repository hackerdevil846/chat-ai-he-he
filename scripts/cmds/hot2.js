const axios = require('axios');
const fs = require('fs-extra');
const path = require('path');

module.exports.config = {
	name: "hot2", // Command name
	version: "1.0.0", // Version
	hasPermssion: 0, // 0 = everyone
	credits: "𝑨𝒔𝒊𝒇 𝑴𝒂𝒉𝒎𝒖𝒅", // <-- updated credits as requested
	description: "Random Islamic video",
	category: "islamic",
	usages: "hot2",
	cooldowns: 2,
	dependencies: {
		"axios": "",
		"fs-extra": ""
	},
	envConfig: {}
};

module.exports.languages = {
	"en": {},
	"bn": {}
};

// Ensure cache folder exists when the module loads
module.exports.onLoad = async function () {
	try {
		const cacheDir = path.join(__dirname, "cache");
		await fs.ensureDir(cacheDir);
		console.log(`[hot2] cache dir ready: ${cacheDir}`);
	} catch (err) {
		console.error("[hot2] onLoad error:", err);
	}
};

// Note: Framework expects onStart export (user changed this). Keep same behavior as original run.
module.exports.onStart = async function ({ api, event }) {
	const { threadID, messageID } = event;
	const cacheDir = path.join(__dirname, "cache");

	// List of video URLs - DO NOT CHANGE THESE LINKS (user requested)
	const islamicVideos = [
        "https://i.imgur.com/bFd7QRW.mp4",
        "https://i.imgur.com/4uhuwAA.mp4",
        "https://i.imgur.com/vfYOmHS.mp4",
        "https://i.imgur.com/wzR3OP7.mp4",
        "https://i.imgur.com/ka0pxxO.mp4",
        "https://i.imgur.com/zeqzgYJ.mp4",
        "https://i.imgur.com/uVBK5gc.mp4",
        "https://i.imgur.com/zSse6lu.mp4",
        "https://i.imgur.com/oBcryzJ.mp4",
        "https://i.imgur.com/yIViust.mp4",
        "https://i.imgur.com/vLcyKJ2.mp4",
        "https://i.imgur.com/6vGHjRM.mp4",
        "https://i.imgur.com/Nu5DcgN.mp4",
        "https://i.imgur.com/MwiTEUL.mp4",
        "https://i.imgur.com/tfePTdM.mp4",
        "https://i.imgur.com/HOSrfId.mp4",
        "https://i.imgur.com/GTxZZfN.mp4",
        "https://i.imgur.com/AaPoSEo.mp4",
        "https://i.imgur.com/08yfKpb.mp4",
        "https://i.imgur.com/xIi5ZjB.mp4",
        "https://i.imgur.com/FVtCcS4.mp4"
      ];

	// Inspirational message (kept functionality & spirit)
	const islamicMessage =
		"🌿 Islamic Video 🌿\n\n" +
		"💫 When darkness falls on the human heart,\n" +
		"Only Allah's light shows the way.\n\n" +
		"✨ We seek tawfiq to stay away from haram,\n" +
		"May Allah grant us all a halal life.\n\n" +
		"🌙 Whoever forgets Allah,\n" +
		"Forgets themselves.\n\n" +
		"🕋 Those who forget Allah in the name of love,\n" +
		"Never find true peace.\n\n" +
		"📖 Let's decorate life with the light of Quran,\n" +
		"Find peace with Allah's mercy.\n\n" +
		"🤲 Let us all return to the path of Allah,\n" +
		"And attain His mercy and forgiveness.";

	// Ensure cache directory exists before downloading
	try {
		await fs.ensureDir(cacheDir);
	} catch (err) {
		console.error("[hot2] ensureDir error:", err);
		// If cache dir cannot be prepared, still attempt to run but will throw later on write
	}

	try {
		// Send the inspirational message first
		await api.sendMessage(islamicMessage, threadID, messageID);

		// Inform about download attempt
		await api.sendMessage("📥 Downloading Islamic video... Please wait.", threadID, messageID);

		let videoSent = false;
		let attempts = 0;

		while (attempts < 3 && !videoSent) {
			attempts++;
			const randomIndex = Math.floor(Math.random() * islamicVideos.length);
			const randomVideo = islamicVideos[randomIndex];
			const filename = `islamic_video_${Date.now()}_${attempts}.mp4`;
			const videoPath = path.join(cacheDir, filename);

			try {
				// Download video as arraybuffer then write to disk
				const response = await axios({
					method: 'GET',
					url: randomVideo,
					responseType: 'arraybuffer',
					timeout: 30000
				});

				// Save video to file
				await fs.writeFile(videoPath, Buffer.from(response.data, 'binary'));

				// Validate file
				const stats = await fs.stat(videoPath);
				if (!stats || stats.size <= 0) {
					throw new Error("Downloaded file is empty");
				}

				// Send the video with a nice caption
				const caption =
					"▬▬▬▬▬▬▬▬▬▬▬▬\n" +
					"   Random Islamic Video\n" +
					"▬▬▬▬▬▬▬▬▬▬▬▬\n\n" +
					"🌟 May this reminder bring peace and guidance. 🤲";

				await api.sendMessage(
					{
						body: caption,
						attachment: fs.createReadStream(videoPath)
					},
					threadID,
					messageID
				);

				videoSent = true;

				// Clean up file after sending
				try {
					await fs.unlink(videoPath);
				} catch (cleanupErr) {
					// If cleanup fails, log but don't break flow
					console.warn(`[hot2] cleanup failed for ${videoPath}:`, cleanupErr);
				}

			} catch (innerErr) {
				console.error(`[hot2] Attempt ${attempts} failed for ${randomVideo}:`, innerErr && innerErr.message ? innerErr.message : innerErr);
				// try next attempt unless this was the 3rd
				if (attempts >= 3) {
					// All attempts failed -> notify user
					await api.sendMessage("❌ Sorry, I couldn't download a video right now. Please try again later.", threadID, messageID);
				} else {
					// Try again - optionally inform user (kept minimal to avoid spamming)
					await api.sendMessage(`⚠️ Attempt ${attempts} failed, retrying...`, threadID, messageID);
				}
				// Ensure any partial file is removed
				try {
					if (await fs.pathExists(videoPath)) await fs.unlink(videoPath);
				} catch (rmErr) {
					console.warn(`[hot2] failed to remove partial file ${videoPath}:`, rmErr);
				}
			}
		}
	} catch (err) {
		console.error("[hot2] command error:", err);
		try {
			return api.sendMessage("❌ Failed to process Islamic video. Please try again later.", threadID, messageID);
		} catch (sendErr) {
			console.error("[hot2] failed to send error message:", sendErr);
		}
	}
};
