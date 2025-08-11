module.exports.config = {
    name: "vtuber_wiki",
    version: "2.0.0",
    hasPermssion: 0,
    credits: "𝑨𝒔𝒊𝒇 𝑴𝒂𝒉𝒎𝒖𝒅",
    description: "𝙃𝙤𝙡𝙤𝙙𝙚𝙭 𝘼𝙋𝙄 𝙙𝙞𝙮𝙚 𝙑𝙏𝙪𝙗𝙚𝙧 𝙠𝙝𝙪𝙣𝙟𝙪𝙣",
    commandCategory: "𝙑𝙏𝙪𝙗𝙚𝙧",
    usages: "vtuber_wiki [𝙑𝙏𝙪𝙗𝙚𝙧𝙚𝙧 𝙣𝙖𝙢]",
    cooldowns: 5,
};

module.exports.run = async ({ api, event, args }) => {
    const axios = require("axios");
    const fs = require("fs");
    const request = require("request");

    const API_KEY = "5ab098dd-7c70-4cdb-be66-a069ce996f7c";
    const HOLODEX_API_BASE_URL = "https://holodex.net/api/v2";

    if (!args[0]) {
        return api.sendMessage("❌ 𝘼𝙣𝙪𝙨𝙖𝙣𝙙𝙝𝙖𝙣 𝙠𝙝𝙖𝙡𝙞 𝙧𝙖𝙠𝙝𝙖 𝙟𝙖𝙗𝙚 𝙣𝙖!", event.threadID, event.messageID);
    }

    const query = args.join(" ");
    api.sendMessage(`🔎 "${query}" 𝙚𝙧 𝙟𝙤𝙣𝙣𝙤 𝙖𝙣𝙪𝙨𝙖𝙣𝙙𝙝𝙖𝙣 𝙠𝙤𝙧𝙘𝙝𝙞...`, event.threadID, event.messageID);

    try {
        const searchResponse = await axios.get(`${HOLODEX_API_BASE_URL}/channels`, {
            headers: {
                'X-APIKEY': API_KEY
            },
            params: {
                name: query,
                limit: 1
            }
        });

        const channels = searchResponse.data;

        if (!channels || channels.length === 0) {
            return api.sendMessage(`⚠️ "${query}" 𝙠𝙝𝙪𝙟𝙚 𝙥𝙖𝙤𝙖 𝙟𝙖𝙮𝙣𝙞.`, event.threadID, event.messageID);
        }

        const vtuber = channels[0];
        const cacheDir = __dirname + '/cache';
        
        if (!fs.existsSync(cacheDir)) {
            fs.mkdirSync(cacheDir);
        }

        const imageUrl = vtuber.photo;
        const imagePath = `${cacheDir}/vtuber_${event.senderID}.png`;

        if (imageUrl) {
            request(imageUrl).pipe(fs.createWriteStream(imagePath)).on("close", () => {
                const messageBody = `
✨ 𝑽𝑻𝒖𝒃𝒆𝒓 𝑰𝒏𝒇𝒐𝒓𝒎𝒂𝒕𝒊𝒐𝒏 ✨

𝑵𝒂𝒎𝒆: ${vtuber.name || '𝙐𝙥𝙖𝙡𝙖𝙗𝙙𝙝𝙖 𝙣𝙤𝙮'}
𝑪𝒉𝒂𝒏𝒏𝒆𝒍 𝑰𝑫: ${vtuber.id || '𝙐𝙥𝙖𝙡𝙖𝙗𝙙𝙝𝙖 𝙣𝙤𝙮'}
𝑺𝒖𝒃𝒔𝒄𝒓𝒊𝒃𝒆𝒓𝒔: ${vtuber.subscriber_count ? vtuber.subscriber_count.toLocaleString() : '𝙐𝙥𝙖𝙡𝙖𝙗𝙙𝙝𝙖 𝙣𝙤𝙮'}
𝑽𝒊𝒆𝒘𝒔: ${vtuber.view_count ? vtuber.view_count.toLocaleString() : '𝙐𝙥𝙖𝙡𝙖𝙗𝙙𝙝𝙖 𝙣𝙤𝙮'}
𝑽𝒊𝒅𝒆𝒐𝒔: ${vtuber.video_count || '𝙐𝙥𝙖𝙡𝙖𝙗𝙙𝙝𝙖 𝙣𝙤𝙮'}
𝑻𝒘𝒊𝒕𝒕𝒆𝒓: ${vtuber.twitter_link || '𝙐𝙥𝙖𝙡𝙖𝙗𝙙𝙝𝙖 𝙣𝙤𝙮'}
𝒀𝒐𝒖𝑻𝒖𝒃𝒆: ${vtuber.youtube_link || '𝙐𝙥𝙖𝙡𝙖𝙗𝙙𝙝𝙖 𝙣𝙤𝙮'}

${vtuber.description ? `𝑫𝒆𝒔𝒄𝒓𝒊𝒑𝒕𝒊𝒐𝒏: ${vtuber.description}` : ''}
                `;

                api.sendMessage({
                    body: messageBody,
                    attachment: fs.createReadStream(imagePath)
                }, event.threadID, () => fs.unlinkSync(imagePath), event.messageID);
            });
        } else {
            const messageBody = `
✨ 𝑽𝑻𝒖𝒃𝒆𝒓 𝑰𝒏𝒇𝒐𝒓𝒎𝒂𝒕𝒊𝒐𝒏 ✨

𝑵𝒂𝒎𝒆: ${vtuber.name || '𝙐𝙥𝙖𝙡𝙖𝙗𝙙𝙝𝙖 𝙣𝙤𝙮'}
𝑪𝒉𝒂𝒏𝒏𝒆𝒍 𝑰𝑫: ${vtuber.id || '𝙐𝙥𝙖𝙡𝙖𝙗𝙙𝙝𝙖 𝙣𝙤𝙮'}
𝑺𝒖𝒃𝒔𝒄𝒓𝒊𝒃𝒆𝒓𝒔: ${vtuber.subscriber_count ? vtuber.subscriber_count.toLocaleString() : '𝙐𝙥𝙖𝙡𝙖𝙗𝙙𝙝𝙖 𝙣𝙤𝙮'}
𝑽𝒊𝒆𝒘𝒔: ${vtuber.view_count ? vtuber.view_count.toLocaleString() : '𝙐𝙥𝙖𝙡𝙖𝙗𝙙𝙝𝙖 𝙣𝙤𝙮'}
𝑽𝒊𝒅𝒆𝒐𝒔: ${vtuber.video_count || '𝙐𝙥𝙖𝙡𝙖𝙗𝙙𝙝𝙖 𝙣𝙤𝙮'}
𝑻𝒘𝒊𝒕𝒕𝒆𝒓: ${vtuber.twitter_link || '𝙐𝙥𝙖𝙡𝙖𝙗𝙙𝙝𝙖 𝙣𝙤𝙮'}
𝒀𝒐𝒖𝑻𝒖𝒃𝒆: ${vtuber.youtube_link || '𝙐𝙥𝙖𝙡𝙖𝙗𝙙𝙝𝙖 𝙣𝙤𝙮'}

${vtuber.description ? `𝑫𝒆𝒔𝒄𝒓𝒊𝒑𝒕𝒊𝒐𝒏: ${vtuber.description}` : ''}
            `;
            api.sendMessage(messageBody, event.threadID, event.messageID);
        }

    } catch (error) {
        console.error("𝙀𝙧𝙧𝙤𝙧:", error);
        api.sendMessage(`❌ 𝙀𝙠𝙩𝙖 𝙩𝙧𝙪𝙩𝙞 𝙝𝙤𝙮𝙚𝙘𝙝𝙚: ${error.message}`, event.threadID, event.messageID);
    }
};
