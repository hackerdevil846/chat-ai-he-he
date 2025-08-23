import { createWriteStream } from "fs";
import fsExtra from "fs-extra";
import axios from "axios";
import tempy from "tempy";
import { downloadVideo } from "priyansh-all-dl";

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
        "priyansh-all-dl": "",
        "axios": "",
        "fs-extra": "",
        "tempy": ""
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
        try {
            api.sendMessage("⬇️ | Downloading your video...", event.threadID, event.messageID);

            const videoInfo = await downloadVideo(url);
            const hdLink = videoInfo.video;

            const response = await axios.get(hdLink, { responseType: "stream" });
            const tempFilePath = tempy.file({ extension: "mp4" });

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

            fsExtra.unlinkSync(tempFilePath);
        } catch (error) {
            console.error("Error:", error);
            api.sendMessage(
                "❌ | Download failed! Please try again later.",
                event.threadID,
                event.messageID
            );
        }
    }
}
