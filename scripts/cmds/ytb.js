module.exports = {
    config: {
        name: "ytb", // Changed from "video" to "ytb"
        version: "1.0.0",
        role: 0,
        author: "𝕬𝖘𝖎𝖋 𝕸𝖆𝖍𝖒𝖚𝖉",
        category: "media",
        shortDescription: {
            en: "𝖲𝖾𝖆𝗋𝖼𝗁 𝖺𝗇𝖽 𝖽𝗈𝗐𝗇𝗅𝗈𝖺𝖽 𝗏𝗂𝖽𝖾𝗈𝗌 𝖿𝗋𝗈𝗆 𝖸𝗈𝗎𝖳𝗎𝖻𝖾"
        },
        longDescription: {
            en: "𝖲𝖾𝖆𝗋𝖼𝗁 𝖺𝗇𝖽 𝖽𝗈𝗐𝗇𝗅𝗈𝖺𝖽 𝗏𝗂𝖽𝖾𝗈𝗌 𝖿𝗋𝗈𝗆 𝖸𝗈𝗎𝖳𝗎𝖻𝖾"
        },
        guide: {
            en: "{𝗉}𝗒𝗍𝖻 [𝗏𝗂𝖽𝖾𝗈 𝗇𝖺𝗆𝖾]" // Updated guide to reflect new command name
        },
        countDown: 10,
        dependencies: {
            "axios": "",
            "fs-extra": "",
            "path": ""
        }
    },

    onStart: async function({ api, event, args }) {
        const axios = require('axios');
        const fs = require('fs-extra');
        const path = require('path');

        try {
            const query = args.join(" ");

            if (!query) {
                return api.sendMessage("𝖯𝗅𝖾𝖆𝗌𝖾 𝗉𝗋𝗈𝗏𝗂𝖽𝖾 𝖺 𝗏𝗂𝖽𝖾𝗈 𝗇𝖺𝗆𝖾!\n\n𝖤𝗑𝖺𝗆𝗉𝗅𝖾: /𝗒𝗍𝖻 𝖲𝗉𝖾𝖼𝗍𝗋𝖾", event.threadID, event.messageID); // Updated example guide
            }

            // Send searching message
            const searchMsg = await api.sendMessage("🔍 𝖲𝖾𝖺𝗋𝖼𝗁𝗂𝗇𝗀 𝖿𝗈𝗋: " + query + "\n𝖯𝗅𝖾𝖆𝗌𝖾 𝗐𝖺𝗂𝗍...", event.threadID);

            // Define the 6 animation steps (limited to 6 edits due to Messenger restrictions)
            const progressBarLength = 20; // Length of the progress bar
            const animationSteps = [
                { message: "🔍 𝖲𝖾𝖆𝗋𝖼𝗁𝗂𝗇𝗀...", progress: 10, delay: 1000 },
                { message: "🎥 𝖵𝗂𝖽𝖾𝗈 𝖿𝗈𝗎𝗇𝖽!", progress: 30, delay: 1000 },
                { message: "🎥 𝖣𝗈𝗐𝗇𝗅𝗈𝖆𝖽𝗂𝗇𝗀...", progress: 50, delay: 1500 },
                { message: "🎥 𝖯𝗋𝗈𝖼𝖾𝗌𝗌𝗂𝗇𝗀...", progress: 70, delay: 1500 },
                { message: "🎥 𝖥𝗂𝗇𝖆𝖑𝗂𝗓𝗂𝗇𝗀...", progress: 90, delay: 1000 },
                { message: "🎥 𝖢𝗈𝗆𝗉𝗅𝖾𝗍𝖾! ✅", progress: 100, delay: 500 }
            ];

            // Function to update progress bar
            const updateProgress = async (step) => {
                const filled = Math.round((step.progress / 100) * progressBarLength);
                const empty = progressBarLength - filled;
                const progressBar = "█".repeat(filled) + "░".repeat(empty);
                const message = `${step.message}\n\n${progressBar} ${step.progress}%`;
                await api.editMessage(message, searchMsg.messageID);
            };

            // Search for the video
            api.setMessageReaction("⌛", event.messageID, () => {}, true);
            await updateProgress(animationSteps[0]); // Edit 1: Searching (10%)
            const searchUrl = `https://apis-keith.vercel.app/search/yts?query=${encodeURIComponent(query)}`;
            const searchResponse = await axios.get(searchUrl);
            await new Promise(resolve => setTimeout(resolve, animationSteps[0].delay));

            // Log the API response for debugging
            console.log("Search API Response:", JSON.stringify(searchResponse.data, null, 2));

            if (!searchResponse.data.status || !searchResponse.data.result || searchResponse.data.result.length === 0) {
                api.setMessageReaction("❌", event.messageID, () => {}, true);
                api.unsendMessage(searchMsg.messageID);
                return api.sendMessage("𝖭𝗈 𝗋𝖾𝗌𝗎𝗅𝗍𝗌 𝖿𝗈𝗎𝗇𝖽 𝖿𝗈𝗋 𝗒𝗈𝗎𝗋 𝗌𝖾𝖆𝗋𝖼𝗁!", event.threadID, event.messageID);
            }

            const firstResult = searchResponse.data.result[0];

            // Validate required fields
            if (!firstResult.title || !firstResult.url) {
                api.setMessageReaction("❌", event.messageID, () => {}, true);
                api.unsendMessage(searchMsg.messageID);
                return api.sendMessage("𝖨𝗇𝗏𝖆𝗅𝗂𝖽 𝗏𝗂𝖽𝖾𝗈 𝖽𝖆𝗍𝖆 𝗋𝖾𝖼𝖾𝗂𝗏𝖾𝖽 𝖿𝗋𝗈𝗆 𝗍𝗁𝖾 𝖠𝖯𝖨!", event.threadID, event.messageID);
            }

            // Handle duration safely
            const duration = firstResult.duration && typeof firstResult.duration === 'string' 
                ? firstResult.duration 
                : "𝖴𝗇𝗄𝗇𝗈𝗐𝗇 𝖽𝗎𝗋𝖆𝗍𝗂𝗈𝗇";

            // Video found
            await updateProgress(animationSteps[1]); // Edit 2: Video found (30%)
            await new Promise(resolve => setTimeout(resolve, animationSteps[1].delay));

            // Downloading
            await updateProgress(animationSteps[2]); // Edit 3: Downloading (50%)
            const downloadStartTime = Date.now();
            const downloadUrl = `https://apis-keith.vercel.app/download/video?url=${encodeURIComponent(firstResult.url)}`;
            const downloadResponse = await axios.get(downloadUrl);

            // Log the download API response for debugging
            console.log("Download API Response:", JSON.stringify(downloadResponse.data, null, 2));

            if (!downloadResponse.data.status || !downloadResponse.data.result) {
                api.setMessageReaction("❌", event.messageID, () => {}, true);
                api.unsendMessage(searchMsg.messageID);
                return api.sendMessage("𝖥𝖆𝗂𝗅𝖾𝖽 𝗍𝗈 𝖽𝗈𝗐𝗇𝗅𝗈𝖆𝖽 𝗍𝗁𝖾 𝗏𝗂𝖽𝖾𝗈!", event.threadID, event.messageID);
            }

            const videoUrl = downloadResponse.data.result;
            const filePath = path.join(__dirname, `cache/video_${Date.now()}.mp4`);

            // Adjust delay to match download time
            const downloadTime = Date.now() - downloadStartTime;
            const remainingDelay = Math.max(0, animationSteps[2].delay - downloadTime);
            await new Promise(resolve => setTimeout(resolve, remainingDelay));

            // Processing
            await updateProgress(animationSteps[3]); // Edit 4: Processing (70%)
            const videoData = await axios.get(videoUrl, { responseType: 'arraybuffer' });
            fs.writeFileSync(filePath, Buffer.from(videoData.data));
            await new Promise(resolve => setTimeout(resolve, animationSteps[3].delay));

            // Finalizing
            await updateProgress(animationSteps[4]); // Edit 5: Finalizing (90%)
            await new Promise(resolve => setTimeout(resolve, animationSteps[4].delay));

            // Complete
            await updateProgress(animationSteps[5]); // Edit 6: Complete (100%)
            api.setMessageReaction("✅", event.messageID, () => {}, true);

            // Send the video file
            await new Promise(resolve => setTimeout(resolve, animationSteps[5].delay));
            await api.sendMessage({
                body: `${firstResult.title}\n𝖣𝗎𝗋𝖆𝗍𝗂𝗈𝗇: ${duration}\n𝖵𝗂𝖾𝗐𝗌: ${firstResult.views ? parseInt(firstResult.views).toLocaleString() : "𝖴𝗇𝗄𝗇𝗈𝗐𝗇"}\n𝖯𝗎𝖻𝗅𝗂𝗌𝗁𝖾𝖽: ${firstResult.published || "𝖴𝗇𝗄𝗇𝗈𝗐𝗇"}`,
                attachment: fs.createReadStream(filePath)
            }, event.threadID, event.messageID);

            // Delete file and unsend progress message after sending
            setTimeout(() => {
                try {
                    if (fs.existsSync(filePath)) fs.unlinkSync(filePath);
                    api.unsendMessage(searchMsg.messageID);
                } catch (cleanupError) {
                    console.log("𝖢𝗅𝖾𝖆𝗇𝗎𝗉 𝖾𝗋𝗋𝗈𝗋:", cleanupError);
                }
            }, 3000);

        } catch (error) {
            console.error("𝖤𝗋𝗋𝗈𝗋:", error);
            api.setMessageReaction("❌", event.messageID, () => {}, true);
            return api.sendMessage("𝖤𝗋𝗋𝗈𝗋: " + error.message + "\n\n𝖯𝗅𝖾𝖆𝗌𝖾 𝗍𝗋𝗒 𝖆𝗀𝖆𝗂𝗇 𝖑𝖆𝗍𝖾𝗋!", event.threadID, event.messageID);
        }
    }
};
