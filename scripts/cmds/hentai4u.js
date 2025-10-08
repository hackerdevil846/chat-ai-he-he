const axios = require('axios');
const cheerio = require('cheerio');

module.exports = {
    config: {
        name: "hentai4u",
        aliases: [],
        version: "1.0.0",
        author: "𝐴𝑠𝑖𝑓 𝑀𝑎ℎ𝑚𝑢𝑑",
        countDown: 10,
        role: 0,
        category: "adult",
        shortDescription: {
            en: "𝖦𝖾𝗍 𝗋𝖺𝗇𝖽𝗈𝗆 𝗁𝖾𝗇𝗍𝖺𝗂 𝗏𝗂𝖽𝖾𝗈𝗌"
        },
        longDescription: {
            en: "𝖥𝖾𝗍𝖼𝗁𝖾𝗌 𝗋𝖺𝗇𝖽𝗈𝗆 𝗁𝖾𝗇𝗍𝖺𝗂 𝗏𝗂𝖽𝖾𝗈𝗌 𝖿𝗋𝗈𝗆 𝖲𝖥𝖬𝖢𝗈𝗆𝗉𝗂𝗅𝖾"
        },
        guide: {
            en: "{p}hentai4u"
        },
        dependencies: {
            "axios": "",
            "cheerio": ""
        }
    },

    onStart: async function({ message, event }) {
        try {
            // Dependency check
            let dependenciesAvailable = true;
            try {
                require("axios");
                require("cheerio");
            } catch (e) {
                dependenciesAvailable = false;
            }

            if (!dependenciesAvailable) {
                return message.reply("❌ 𝖬𝗂𝗌𝗌𝗂𝗇𝗀 𝖽𝖾𝗉𝖾𝗇𝖽𝖾𝗇𝖼𝗂𝖾𝗌. 𝖯𝗅𝖾𝖺𝗌𝖾 𝗂𝗇𝗌𝗍𝖺𝗅𝗅 𝖺𝗑𝗂𝗈𝗌 𝖺𝗇𝖽 𝖼𝗁𝖾𝖾𝗋𝗂𝗈.");
            }

            const processingMsg = await message.reply("🔄 𝖥𝖾𝗍𝖼𝗁𝗂𝗇𝗀 𝗁𝖾𝗇𝗍𝖺𝗂 𝗏𝗂𝖽𝖾𝗈𝗌...");

            async function getHentaiVideos() {	
                return new Promise((resolve, reject) => {	
                    const page = Math.floor(Math.random() * 1153) + 1; // Ensure page is at least 1
                    console.log(`🔍 𝖲𝖼𝗋𝖺𝗉𝗂𝗇𝗀 𝗉𝖺𝗀𝖾 ${page}...`);
                    
                    axios.get('https://sfmcompile.club/page/' + page, {
                        timeout: 30000,
                        headers: {
                            'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36',
                            'Accept': 'text/html,application/xhtml+xml,application/xml;q=0.9,image/webp,*/*;q=0.8',
                            'Accept-Language': 'en-US,en;q=0.5',
                            'Referer': 'https://sfmcompile.club/'
                        }
                    })
                    .then((response) => {
                        if (!response.data) {
                            reject(new Error("𝖭𝗈 𝖽𝖺𝗍𝖺 𝗋𝖾𝖼𝖾𝗂𝗏𝖾𝖽 𝖿𝗋𝗈𝗆 𝗌𝖾𝗋𝗏𝖾𝗋"));
                            return;
                        }

                        const $ = cheerio.load(response.data);	
                        const hasil = [];	
                        
                        $('#primary > div > div > ul > li > article').each(function (a, b) {	
                            const title = $(b).find('header > h2').text().trim();
                            const link = $(b).find('header > h2 > a').attr('href');
                            const category = $(b).find('header > div.entry-before-title > span > span').text().replace('in ', '').trim();
                            const share_count = $(b).find('header > div.entry-after-title > p > span.entry-shares').text().trim();
                            const views_count = $(b).find('header > div.entry-after-title > p > span.entry-views').text().trim();
                            const type = $(b).find('source').attr('type') || 'image/jpeg';
                            const video_1 = $(b).find('source').attr('src') || $(b).find('img').attr('data-src');
                            const video_2 = $(b).find('video > a').attr('href') || '';

                            // Only add if we have valid video URL
                            if (video_1 && (video_1.includes('.mp4') || video_1.includes('.webm') || video_1.includes('video'))) {
                                hasil.push({	
                                    title: title || '𝖴𝗇𝗍𝗂𝗍𝗅𝖾𝖽',
                                    link: link || '',
                                    category: category || '𝖴𝗇𝖼𝖺𝗍𝖾𝗀𝗈𝗋𝗂𝗓𝖾𝖽',
                                    share_count: share_count || '0',
                                    views_count: views_count || '0',
                                    type: type,
                                    video_1: video_1,
                                    video_2: video_2	
                                });
                            }
                        });

                        console.log(`✅ 𝖥𝗈𝗎𝗇𝖽 ${hasil.length} 𝗏𝗂𝖽𝖾𝗈𝗌 𝗈𝗇 𝗉𝖺𝗀𝖾 ${page}`);
                        resolve(hasil);	
                    }).catch(error => {
                        console.error(`❌ 𝖤𝗋𝗋𝗈𝗋 𝗌𝖼𝗋𝖺𝗉𝗂𝗇𝗀 𝗉𝖺𝗀𝖾 ${page}:`, error.message);
                        reject(error);
                    });	
                });	
            }

            let videos = [];
            let attempts = 0;
            const maxAttempts = 3;

            // Try multiple times to get videos
            while (videos.length === 0 && attempts < maxAttempts) {
                attempts++;
                console.log(`🔄 𝖠𝗍𝗍𝖾𝗆𝗉𝗍 ${attempts} 𝗍𝗈 𝖿𝖾𝗍𝖼𝗁 𝗏𝗂𝖽𝖾𝗈𝗌...`);
                
                try {
                    videos = await getHentaiVideos();
                } catch (scrapeError) {
                    console.error(`❌ 𝖲𝖼𝗋𝖺𝗉𝗂𝗇𝗀 𝖺𝗍𝗍𝖾𝗆𝗉𝗍 ${attempts} 𝖿𝖺𝗂𝗅𝖾𝖽:`, scrapeError.message);
                    
                    if (attempts === maxAttempts) {
                        await message.unsendMessage(processingMsg.messageID);
                        return message.reply("❌ 𝖥𝖺𝗂𝗅𝖾𝖽 𝗍𝗈 𝖿𝖾𝗍𝖼𝗁 𝗏𝗂𝖽𝖾𝗈𝗌. 𝖯𝗅𝖾𝖺𝗌𝖾 𝗍𝗋𝗒 𝖺𝗀𝖺𝗂𝗇 𝗅𝖺𝗍𝖾𝗋.");
                    }
                    
                    // Wait before retry
                    await new Promise(resolve => setTimeout(resolve, 2000));
                }
            }

            if (!videos || videos.length === 0) {
                await message.unsendMessage(processingMsg.messageID);
                return message.reply("❌ 𝖭𝗈 𝗏𝗂𝖽𝖾𝗈𝗌 𝖿𝗈𝗎𝗇𝖽. 𝖯𝗅𝖾𝖺𝗌𝖾 𝗍𝗋𝗒 𝖺𝗀𝖺𝗂𝗇 𝗅𝖺𝗍𝖾𝗋.");
            }

            let length = videos.length > 10 ? 10 : videos.length;
            let i = Math.floor(Math.random() * length);

            const selectedVideo = videos[i];
            
            if (!selectedVideo.video_1) {
                await message.unsendMessage(processingMsg.messageID);
                return message.reply("❌ 𝖭𝗈 𝗏𝖺𝗅𝗂𝖽 𝗏𝗂𝖽𝖾𝗈 𝖴𝖱𝖫 𝖿𝗈𝗎𝗇𝖽.");
            }

            console.log(`🎬 𝖲𝖾𝗅𝖾𝖼𝗍𝖾𝖽 𝗏𝗂𝖽𝖾𝗈: ${selectedVideo.title}`);
            console.log(`🔗 𝖵𝗂𝖽𝖾𝗈 𝖴𝖱𝖫: ${selectedVideo.video_1}`);

            // Get video stream with error handling
            try {
                const videoStream = await global.utils.getStreamFromURL(selectedVideo.video_1);
                
                if (!videoStream) {
                    throw new Error("𝖥𝖺𝗂𝗅𝖾𝖽 𝗍𝗈 𝖼𝗋𝖾𝖺𝗍𝖾 𝗏𝗂𝖽𝖾𝗈 𝗌𝗍𝗋𝖾𝖺𝗆");
                }

                await message.reply({
                    body: `🎬 𝖳𝗂𝗍𝗅𝖾: ${selectedVideo.title}\n📁 𝖢𝖺𝗍𝖾𝗀𝗈𝗋𝗒: ${selectedVideo.category}\n👁️ 𝖵𝗂𝖾𝗐𝗌: ${selectedVideo.views_count}\n🔄 𝖲𝗁𝖺𝗋𝖾𝗌: ${selectedVideo.share_count}`,
                    attachment: videoStream
                });

                await message.unsendMessage(processingMsg.messageID);

            } catch (streamError) {
                console.error("❌ 𝖵𝗂𝖽𝖾𝗈 𝗌𝗍𝗋𝖾𝖺𝗆 𝖾𝗋𝗋𝗈𝗋:", streamError);
                await message.unsendMessage(processingMsg.messageID);
                
                // Try alternative video URL if available
                if (selectedVideo.video_2) {
                    console.log("🔄 𝖳𝗋𝗒𝗂𝗇𝗀 𝖺𝗅𝗍𝖾𝗋𝗇𝖺𝗍𝗂𝗏𝖾 𝗏𝗂𝖽𝖾𝗈 𝖴𝖱𝖫...");
                    try {
                        const altVideoStream = await global.utils.getStreamFromURL(selectedVideo.video_2);
                        await message.reply({
                            body: `🎬 𝖳𝗂𝗍𝗅𝖾: ${selectedVideo.title}\n📁 𝖢𝖺𝗍𝖾𝗀𝗈𝗋𝗒: ${selectedVideo.category}\n👁️ 𝖵𝗂𝖾𝗐𝗌: ${selectedVideo.views_count}\n🔄 𝖲𝗁𝖺𝗋𝖾𝗌: ${selectedVideo.share_count}`,
                            attachment: altVideoStream
                        });
                        return;
                    } catch (altError) {
                        console.error("❌ 𝖠𝗅𝗍𝖾𝗋𝗇𝖺𝗍𝗂𝗏𝖾 𝗏𝗂𝖽𝖾𝗈 𝖿𝖺𝗂𝗅𝖾𝖽:", altError);
                    }
                }
                
                return message.reply("❌ 𝖥𝖺𝗂𝗅𝖾𝖽 𝗍𝗈 𝗅𝗈𝖺𝖽 𝗏𝗂𝖽𝖾𝗈. 𝖯𝗅𝖾𝖺𝗌𝖾 𝗍𝗋𝗒 𝖺𝗀𝖺𝗂𝗇 𝗅𝖺𝗍𝖾𝗋.");
            }

        } catch (error) {
            console.error("💥 𝖧𝖾𝗇𝗍𝖺𝗂 𝖤𝗋𝗋𝗈𝗋:", error);
            
            let errorMessage = "❌ 𝖤𝗋𝗋𝗈𝗋 𝖿𝖾𝗍𝖼𝗁𝗂𝗇𝗀 𝗁𝖾𝗇𝗍𝖺𝗂 𝗏𝗂𝖽𝖾𝗈𝗌. 𝖯𝗅𝖾𝖺𝗌𝖾 𝗍𝗋𝗒 𝖺𝗀𝖺𝗂𝗇 𝗅𝖺𝗍𝖾𝗋.";
            
            if (error.code === 'ECONNREFUSED') {
                errorMessage = "❌ 𝖭𝖾𝗍𝗐𝗈𝗋𝗄 𝖾𝗋𝗋𝗈𝗋. 𝖯𝗅𝖾𝖺𝗌𝖾 𝖼𝗁𝖾𝖼𝗄 𝗒𝗈𝗎𝗋 𝗂𝗇𝗍𝖾𝗋𝗇𝖾𝗍 𝖼𝗈𝗇𝗇𝖾𝖼𝗍𝗂𝗈𝗇.";
            } else if (error.code === 'ETIMEDOUT') {
                errorMessage = "❌ 𝖱𝖾𝗊𝗎𝖾𝗌𝗍 𝗍𝗂𝗆𝖾𝖽 𝗈𝗎𝗍. 𝖯𝗅𝖾𝖺𝗌𝖾 𝗍𝗋𝗒 𝖺𝗀𝖺𝗂𝗇.";
            } else if (error.message.includes('404')) {
                errorMessage = "❌ 𝖯𝖺𝗀𝖾 𝗇𝗈𝗍 𝖿𝗈𝗎𝗇𝖽. 𝖯𝗅𝖾𝖺𝗌𝖾 𝗍𝗋𝗒 𝖺𝗀𝖺𝗂𝗇 𝗅𝖺𝗍𝖾𝗋.";
            }
            
            await message.reply(errorMessage);
        }
    }
};
