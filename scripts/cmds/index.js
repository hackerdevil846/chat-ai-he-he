const { Innertube } = require('youtubei.js');
const https = require('https');
const http = require('http');

module.exports = {
    config: {
        name: "shairi",
        aliases: ["ytvideo", "video"],
        version: "3.1.1",
        author: "Asif Mahmud",
        countDown: 10,
        role: 0,
        category: "media",
        shortDescription: {
            en: "Send beautiful Shairi video from YouTube"
        },
        longDescription: {
            en: "Download and send Shairi videos from YouTube or custom links"
        },
        guide: {
            en: "{p}shairi [YouTube Link]"
        },
        dependencies: {
            "youtubei.js": "",
            "https": "",
            "http": ""
        }
    },

    onStart: async function({ api, event, args }) {
        try {
            // Check dependencies
            try {
                require("youtubei.js");
                require("https");
                require("http");
            } catch (e) {
                return api.sendMessage("❌ Missing dependencies: youtubei.js, https, and http", event.threadID, event.messageID);
            }

            const DEFAULT_URL = "https://youtu.be/v7v3TTWaaWU";
            
            // Use user-provided URL if available, else default
            const inputUrl = args[0] ? args[0] : DEFAULT_URL;
            
            // Extract video ID with better regex
            const extractVideoId = (url) => {
                const regex = /(?:youtube\.com\/watch\?v=|youtu\.be\/|youtube\.com\/embed\/|youtube\.com\/v\/|youtube\.com\/watch\?.*v=)([^&\n?#]+)/;
                const match = url.match(regex);
                return match ? match[1] : null;
            };

            const videoId = extractVideoId(inputUrl);

            if (!videoId) {
                return api.sendMessage("❌ Invalid YouTube link! Please provide a valid YouTube URL.", event.threadID, event.messageID);
            }

            // Send downloading message
            const processingMsg = await api.sendMessage("📥 Downloading video... Please wait!", event.threadID, event.messageID);

            // Initialize YouTube client with error handling
            let youtube;
            try {
                youtube = await Innertube.create();
            } catch (err) {
                console.error('Failed to initialize YouTube client:', err);
                await api.sendMessage("❌ Failed to connect to YouTube service. Please try again later.", event.threadID, event.messageID);
                return;
            }

            // Fetch video info with timeout
            try {
                const info = await youtube.getInfo(videoId);
                
                if (!info || !info.basic_info) {
                    throw new Error("Could not fetch video information");
                }

                const formats = info.streaming_data?.formats || [];
                const adaptive = info.streaming_data?.adaptive_formats || [];
                const allFormats = [...formats, ...adaptive];

                // Filter for video formats with audio
                const videoFormats = allFormats.filter(f =>
                    f.mime_type?.includes('video/mp4') && f.has_audio !== false
                );

                if (!videoFormats.length) {
                    await api.sendMessage("❌ No downloadable video format found. The video might be restricted.", event.threadID, event.messageID);
                    return;
                }

                // Sort by quality (highest first)
                videoFormats.sort((a, b) => (b.bitrate || 0) - (a.bitrate || 0));
                const selected = videoFormats[0];
                
                if (!selected.decipher) {
                    throw new Error("Video format not supported for download");
                }

                const downloadUrl = await selected.decipher(youtube.session.player);

                if (!downloadUrl) {
                    throw new Error("Could not generate download URL");
                }

                const protocol = downloadUrl.startsWith('https:') ? https : http;

                // Download and send video
                protocol.get(downloadUrl, (response) => {
                    if (response.statusCode !== 200) {
                        api.sendMessage(`❌ Video download failed (HTTP ${response.statusCode})`, event.threadID, event.messageID);
                        return;
                    }

                    // Clean up processing message
                    try {
                        if (processingMsg && processingMsg.messageID) {
                            api.unsendMessage(processingMsg.messageID);
                        }
                    } catch (unsendError) {
                        console.error("Failed to unsend processing message:", unsendError);
                    }

                    // Format duration
                    const duration = info.basic_info.duration?.seconds_total;
                    const durationText = duration ? 
                        `${Math.floor(duration / 60)}:${(duration % 60).toString().padStart(2, '0')}` : 
                        'Unknown';

                    // Send video as attachment
                    api.sendMessage({
                        body: `🎬《 VIDEO READY 》\n\n📹 Title: ${info.basic_info.title || 'Unknown'}\n⏱️ Duration: ${durationText}\n👤 Author: ${info.basic_info.author || 'Unknown'}\n\nEnjoy the video! 🌹`,
                        attachment: response
                    }, event.threadID, (err) => {
                        if (err) {
                            console.error('Send message error:', err);
                            api.sendMessage("❌ Failed to send video. The file might be too large.", event.threadID, event.messageID);
                        }
                    });

                }).on('error', (err) => {
                    console.error('Video download error:', err);
                    api.sendMessage(`❌ Video download failed: ${err.message}`, event.threadID, event.messageID);
                }).setTimeout(60000, () => {
                    api.sendMessage("❌ Video download timeout. Please try again.", event.threadID, event.messageID);
                });

            } catch (error) {
                console.error('Error getting video info:', error);
                
                let errorMessage = "❌ Error fetching video information";
                
                if (error.message.includes("private") || error.message.includes("restricted")) {
                    errorMessage = "❌ This video is private or restricted and cannot be downloaded.";
                } else if (error.message.includes("not found")) {
                    errorMessage = "❌ Video not found. The link might be invalid or the video was removed.";
                } else if (error.message.includes("format")) {
                    errorMessage = "❌ Video format not supported for download.";
                }
                
                await api.sendMessage(errorMessage, event.threadID, event.messageID);
            }

        } catch (error) {
            console.error('Shairi command error:', error);
            
            let errorMessage = "❌ An unexpected error occurred. Please try again later!";
            
            if (error.message.includes("timeout")) {
                errorMessage = "❌ Request timeout. Please try again.";
            } else if (error.message.includes("network")) {
                errorMessage = "❌ Network error. Please check your connection.";
            }
            
            await api.sendMessage(errorMessage, event.threadID, event.messageID);
        }
    }
};
