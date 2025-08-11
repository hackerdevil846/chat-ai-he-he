module.exports.config = {
  name: "sourchvideo",
  version: "1.0.0",
  permission: 0,
  credits: "Asif",
  description: "example",
  prefix: false,
  category: "Media",
  usages: "user",
  cooldowns: 5,
  dependencies: {
    "ytdl-core": "",
    "simple-youtube-api": ""
  }
};

module.exports.onStart = function() {
    // This empty function is required to prevent the undefined error
    // You can add initialization code here if needed
    console.log("Video command started");
};

module.exports.handleReply = async function({api, event, handleReply}) {
    const axios = global.nodemodule.axios,
          fs = global.nodemodule["fs-extra"],
          response = await axios.get("https://raw.githubusercontent.com/quyenkaneki/data/main/video.json");

    const videoListLength = response.data.keyVideo.length,
          randomVideo = response.data.keyVideo[Math.floor(Math.random() * videoListLength)],
          {createReadStream, unlinkSync, statSync} = fs,
          replyBody = parseInt(event.body);

    // Validate the reply choice
    if (isNaN(replyBody) || replyBody < 1 || replyBody > 12) {
        return api.sendMessage("choose from 1 -> 12 baby.uwu ❤️", event.threadID, event.messageID);
    }

    // Remove the original help message
    api.unsendMessage(handleReply.messageID);

    try {
        const requestParams = {
            method: "GET",
            url: "https://ytstream-download-youtube-videos.p.rapidapi.com/dl",
            params: { id: handleReply.link[replyBody - 1] },
            headers: {
                "x-rapidapi-host": "ytstream-download-youtube-videos.p.rapidapi.com",
                "x-rapidapi-key": `${randomVideo.API_KEY}`
            }
        };

        const videoDetails = (await axios.request(requestParams)).data;

        if ("fail" === videoDetails.status) {
            return api.sendMessage("", event.threadID);
        }

        const streamQuality = Object.keys(videoDetails.link)[1],
              videoStreamUrl = videoDetails.link[streamQuality][0],
              videoPath = __dirname + "/cache/1.mp4",
              videoData = (await axios.get(videoStreamUrl, {responseType: "arraybuffer"})).data;

        // Save the video file
        fs.writeFileSync(videoPath, Buffer.from(videoData, "utf-8"));

        if (fs.statSync(videoPath).size > 26 * 1024 * 1024) {
            // Video too large to send
            return api.sendMessage(
                "Can't send the file because of the larger size 25MB.",
                event.threadID,
                () => unlinkSync(videoPath),
                event.messageID
            );
        }

        // Send the video file
        return api.sendMessage(
            {
                body: `✅ ${videoDetails.title}`,
                attachment: createReadStream(videoPath)
            },
            event.threadID,
            () => fs.unlinkSync(videoPath),
            event.messageID
        );

    } catch (error) {
        return api.sendMessage("Không thể gửi file này!", event.threadID, event.messageID);
    }
};

module.exports.run = async function({ api, event, args }) {
    const axios = global.nodemodule.axios,
          fs = global.nodemodule["fs-extra"],
          response = await axios.get("https://raw.githubusercontent.com/quyenkaneki/data/main/video.json"),
          videoListLength = response.data.keyVideo.length,
          randomVideoConfig = response.data.keyVideo[Math.floor(Math.random() * videoListLength)],
          { createReadStream, unlinkSync, statSync } = fs,
          youtubeApiKeys = [
              "AIzaSyB5A3Lum6u5p2Ki2btkGdzvEqtZ8KNLeXo",
              "AIzaSyAyjwkjc0w61LpOErHY_vFo6Di5LEyfLK0",
              "AIzaSyBY5jfFyaTNtiTSBNCvmyJKpMIGlpCSB4w",
              "AIzaSyCYCg9qpFmJJsEcr61ZLV5KsmgT1RE5aI4"
          ],
          SimpleYouTubeApi = global.nodemodule["simple-youtube-api"];

    // Get random API key
    const apiKey = youtubeApiKeys[Math.floor(Math.random() * youtubeApiKeys.length)],
          youtube = new SimpleYouTubeApi(apiKey);

    if (!args.length || !args[0]) {
        return api.sendMessage("» The search section can't be done. Blank! ", event.threadID, event.messageID);
    }

    const searchQuery = args.join(" ");

    // Check if URL is provided
    if (searchQuery.indexOf("https://") === 0) {
        handleUrlRequest(api, event, youtube, response.data.keyVideo);
        return;
    }

    try {
        // Prepare video result objects for attachment and numbers
        let videoIds = [],
            messageText = "",
            counter = 0,
            imageCounter = 0,
            attachments = [];

        const searchResults = await youtube.searchVideos(searchQuery, 12);

        for (const video of searchResults) {
            if (!video.id) continue;

            videoIds.push(video.id);
            const imagePath = __dirname + `/cache/${imageCounter += 1}.png`,
                  imageUrl = `https://img.youtube.com/vi/${video.id}/hqdefault.jpg`,
                  duration = await getDuration(apiKey, video.id),
                  channelTitle = await getChannelTitle(apiKey, video.id);

            // Download and save video thumbnail
            const imageData = (await axios.get(imageUrl, {responseType: "arraybuffer"})).data;
            fs.writeFileSync(imagePath, Buffer.from(imageData, "utf-8"));
            attachments.push(createReadStream(imagePath));

            // Add number prefix based on position
            let numberPrefix;
            if (counter === 0) numberPrefix = "⓵";
            else if (counter === 1) numberPrefix = "⓶";
            else if (counter === 2) numberPrefix = "⓷";
            else if (counter === 3) numberPrefix = "⓸";
            else if (counter === 4) numberPrefix = "⓹";
            else if (counter === 5) numberPrefix = "⓺";
            else if (counter === 6) numberPrefix = "➐";
            else if (counter === 7) numberPrefix = "➑";
            else if (counter === 8) numberPrefix = "➒";
            else if (counter === 9) numberPrefix = "❿";
            else if (counter === 10) numberPrefix = "⓫";
            else if (counter === 11) numberPrefix = "⓬";
            else numberPrefix = "⓭";

            messageText += `${numberPrefix} 《${duration}》 ${video.title}\n\n`;
            counter++;
        }

        // Create help message
        const helpMessage = `»🔎 There's ${videoIds.length} list that coincides with your search keyword:\n\n\n${messageText}» Reply(reply in order number) select one of the searches above`;

        // Send message with attachments
        api.sendMessage(
            { attachment: attachments, body: helpMessage },
            event.threadID,
            ((api, message) => {
                global.client.handleReply.push({
                    name: this.config.name,
                    messageID: message.messageID,
                    author: event.senderID,
                    link: videoIds
                })
            }),
            event.messageID
        );

    } catch (error) {
        api.sendMessage("Không thể xử lý request do đã phát sinh lỗi modul: " + error.message, event.threadID, event.messageID);
    }
};

// Helper function to get video duration
async function getDuration(apiKey, videoId) {
    const axios = global.nodemodule.axios;
    const response = await axios.get(`https://www.googleapis.com/youtube/v3/videos?part=contentDetails&id=${videoId}&key=${apiKey}`);
    const durationStr = response.data.items[0].contentDetails.duration.slice(2)
        .replace("S", "")
        .replace("M", ":");
    return durationStr;
}

// Helper function to get channel title
async function getChannelTitle(apiKey, videoId) {
    const axios = global.nodemodule.axios;
    const response = await axios.get(`https://www.googleapis.com/youtube/v3/videos?part=snippet&id=${videoId}&key=${apiKey}`);
    return response.data.items[0].snippet.channelTitle;
}

// Helper function to handle URL requests
async function handleUrlRequest(api, event, youtube, randomVideoConfig) {
    const axios = global.nodemodule.axios,
          fs = global.nodemodule["fs-extra"],
          videoUrl = event.args[0];

    // Extract video ID from URL
    const videoId = videoUrl.match(/^.*(youtu.be\/|v\/|embed\/|watch\?|youtube.com\/user\/[^#]*#([^\/]*?\/)*)\??v=?([^#\&\?]*).*/)[3];

    const requestParams = {
        method: "GET",
        url: "https://ytstream-download-youtube-videos.p.rapidapi.com/dl",
        params: { id: videoId },
        headers: {
            "x-rapidapi-host": "ytstream-download-youtube-videos.p.rapidapi.com",
            "x-rapidapi-key": `${randomVideoConfig.API_KEY}`
        }
    };

    try {
        const videoDetails = (await axios.request(requestParams)).data;

        if ("fail" === videoDetails.status) {
            return api.sendMessage("This file could not be sent..", event.threadID);
        }

        const streamQuality = Object.keys(videoDetails.link)[1],
              videoStreamUrl = videoDetails.link[streamQuality][0],
              videoPath = __dirname + "/cache/1.mp4",
              videoData = (await axios.get(videoStreamUrl, {responseType: "arraybuffer"})).data;

        // Save the video file
        fs.writeFileSync(videoPath, Buffer.from(videoData, "utf-8"));

        if (fs.statSync(videoPath).size > 26 * 1024 * 1024) {
            // Video too large to send
            api.sendMessage(
                "Can't send the file because of the larger size 25MB.",
                event.threadID,
                () => fs.unlinkSync(videoPath),
                event.messageID
            );
        } else {
            // Send the video file
            api.sendMessage(
                {
                    body: `» ${videoDetails.title}`,
                    attachment: fs.createReadStream(videoPath)
                },
                event.threadID,
                () => fs.unlinkSync(videoPath),
                event.messageID
            );
        }
    } catch (error) {
        api.sendMessage("Không thể gửi file này!", event.threadID, event.messageID);
    }
}
