import axios from "axios";
import fs from "fs-extra";
import path from "path";
import os from "os";

export const config = {
    name: "fbautodownload",
    version: "1.0.0",
    hasPermssion: 0,
    credits: "𝑨𝒔𝒊𝒇 𝑴𝒂𝒉𝒎𝒖𝒅",
    description: "✨ Automatically download Facebook videos from shared links",
    category: "utility",
    usages: "[fb_video_url]",
    cooldowns: 5,
    dependencies: {
        "priyansh-all-dl": "",
        "axios": "",
        "fs-extra": ""
    }
};

export async function onStart({ api, event }) {
    return api.sendMessage(
        `🎭 | Ei command directly use korte hobe na!\n✦ Just ekta Facebook video link pathao, ar ami automatically download kore pathai dibo ✨`,
        event.threadID,
        event.messageID
    );
}

export async function handleEvent({ api, event }) {
    if (event.type !== "message" || !event.body) return;
    const fbRegex = /^(https?:\/\/)?(www\.)?facebook\.com\/(share|reel|watch)\/.+/i;
    if (!fbRegex.test(event.body)) return;
    
    try {
        api.sendMessage("🔄 | Download suru hocche, please wait...", event.threadID, event.messageID);
        
        // Dynamic import for ESM compatibility
        const { downloadVideo } = await import("priyansh-all-dl");
        const videoInfo = await downloadVideo(event.body);
        
        const qualityPriority = ["720p", "480p", "360p", "240p"];
        const selectedQuality = qualityPriority.find(q => videoInfo[q] && videoInfo[q] !== "Not found");
        
        if (!selectedQuality) {
            return api.sendMessage(
                "❌ | Downloadable kono video quality paowa jaini!",
                event.threadID,
                event.messageID
            );
        }
        
        const response = await axios.get(videoInfo[selectedQuality], {
            responseType: "stream",
            headers: {
                "User-Agent":
                    "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/91.0.4472.124 Safari/537.36"
            }
        });
        
        const tempPath = path.join(os.tmpdir(), `fb_video_${Date.now()}.mp4`);
        const writer = fs.createWriteStream(tempPath);
        response.data.pipe(writer);
        
        await new Promise((resolve, reject) => {
            writer.on("finish", resolve);
            writer.on("error", reject);
        });
        
        await api.sendMessage(
            {
                body: `✅ | Successfully downloaded your video!\n🎥 Quality: ${selectedQuality}`,
                attachment: fs.createReadStream(tempPath)
            },
            event.threadID
        );
        
        fs.unlinkSync(tempPath);
    } catch (error) {
        console.error("Download Error:", error);
        api.sendMessage(
            `❌ | Download failed!\n⚠ Error: ${error.message}`,
            event.threadID,
            event.messageID
        );
    }
}
