import { createWriteStream } from "fs";
import fsExtra from "fs-extra";
import axios from "axios";
import { tmpdir } from "os";
import { join } from "path";
import { randomBytes } from "crypto";
import igdl from "@sasmeee/igdl";

export const config = {
    name: "igautodownload",
    version: "1.0.0",
    hasPermssion: 0,
    credits: "𝑨𝒔𝒊𝒇 𝑴𝒂𝒉𝒎𝒖𝒅",
    description: "🟦 | Automatically download Instagram videos",
    commandCategory: "𝗨𝗧𝗜𝗟𝗜𝗧𝗬",
    usages: "[instagram-link]",
    cooldowns: 5,
    dependencies: {
        "@sasmeee/igdl": "",
        "axios": "",
        "fs-extra": ""
    }
};

export async function run({ api, event }) {
    return api.sendMessage(
        "✨ | This command doesn't need a prefix!\nJust send an Instagram video link in the chat 💙",
        event.threadID,
        event.messageID
    );
}

export async function handleEvent({ api, event }) {
    if (event.type !== "message" || !event.body) return;

    const instaRegex = /https?:\/\/(?:www\.)?instagram\.com\/(?:reel|p)\/([^\/\s?]+)/gi;
    const instaMatch = event.body.match(instaRegex);

    if (!instaMatch) return;

    for (const url of instaMatch) {
        let tempFilePath = null;
        try {
            api.sendMessage("⬇️ | Downloading your video...", event.threadID, event.messageID);

            let results;
            try {
                results = await igdl(url);
            } catch (libError) {
                console.error("igdl library failed:", libError);
                return api.sendMessage(
                    "⚠️ | Instagram downloader library error. Try again later.",
                    event.threadID,
                    event.messageID
                );
            }

            if (!results || results.length === 0) {
                return api.sendMessage(
                    "❌ | No video found at this link!",
                    event.threadID,
                    event.messageID
                );
            }

            const hdLink = results[0].url;

            const response = await axios.get(hdLink, { responseType: "stream" });
            
            // Create temporary file path using Node.js built-in modules
            const randomName = randomBytes(16).toString('hex');
            tempFilePath = join(tmpdir(), `ig_video_${randomName}.mp4`);

            const writer = createWriteStream(tempFilePath);
            response.data.pipe(writer);

            await new Promise((resolve, reject) => {
                writer.on("finish", resolve);
                writer.on("error", reject);
            });

            await api.sendMessage(
                {
                    body: "✅ | Successfully downloaded your video!\nCredits: 𝑨𝒔𝒊𝒇 𝑴𝒂𝒉𝒎𝒖𝒅",
                    attachment: fsExtra.createReadStream(tempFilePath)
                },
                event.threadID
            );
        } catch (error) {
            console.error("Error:", error);
            api.sendMessage(
                "❌ | Download failed! Please try again later.",
                event.threadID,
                event.messageID
            );
        } finally {
            if (tempFilePath && fsExtra.existsSync(tempFilePath)) {
                try {
                    fsExtra.unlinkSync(tempFilePath);
                } catch (cleanupError) {
                    console.error("Cleanup failed:", cleanupError);
                }
            }
        }
    }
}
