const axios = require('axios');

module.exports.config = {
    name: "dance",
    aliases: ["anidance", "dancegif"],
    version: "1.0.0",
    author: "𝐴𝑠𝑖𝑓 𝑀𝑎ℎ𝑚𝑢𝑑",
    countDown: 5,
    role: 0,
    category: "anime",
    shortDescription: {
        en: "💃 𝐴𝑛𝑖𝑚𝑒 𝑑𝑎𝑛𝑐𝑒 𝑔𝑖𝑓/𝑣𝑖𝑑𝑒𝑜"
    },
    longDescription: {
        en: "𝑆𝑒𝑛𝑑𝑠 𝑎 𝑟𝑎𝑛𝑑𝑜𝑚 𝑎𝑛𝑖𝑚𝑒 𝑑𝑎𝑛𝑐𝑒 𝑔𝑖𝑓 𝑜𝑟 𝑠ℎ𝑜𝑟𝑡 𝑣𝑖𝑑𝑒𝑜 𝑓𝑟𝑜𝑚 𝑚𝑢𝑙𝑡𝑖𝑝𝑙𝑒 𝑠𝑜𝑢𝑟𝑐𝑒𝑠"
    },
    guide: {
        en: "{p}dance"
    },
    dependencies: {
        "axios": ""
    }
};

module.exports.onStart = async function ({ message }) {
    try {
        // Check if axios is available
        if (typeof axios === 'undefined') {
            throw new Error('𝑎𝑥𝑖𝑜𝑠 𝑚𝑜𝑑𝑢𝑙𝑒 𝑛𝑜𝑡 𝑓𝑜𝑢𝑛𝑑');
        }

        const fallbackDances = [
            "https://i.waifu.pics/PCTp3I3.gif",
            "https://media.tenor.com/WNVZq-4Z1JAAAAAd/anime-dance-dancer-girl.gif",
            "https://media.tenor.com/2W1xuNxH0QwAAAAC/pocketmine-chika.gif",
            "https://media.tenor.com/3f4nB0ZQ9YQAAAAd/zero-two-dance.gif",
            "https://media.tenor.com/6zFqRw6eBvQAAAAC/anime-dance.gif",
            "https://media.tenor.com/4UJ5y7Zjw4kAAAAd/miku-hatsune-dance.gif",
            "https://media.tenor.com/rJd6rQY0Q5kAAAAC/kakashi-dance.gif",
            "https://media.tenor.com/9fYg1L0X1lUAAAAC/anime-dance.gif",
            "https://media.tenor.com/7Xb3h3j3J3IAAAAC/madoka-magica.gif",
            "https://media.tenor.com/5j7zWzWZw9AAAAAC/dance-anime.gif",
            "https://media2.giphy.com/media/v1.Y2lkPTc5MGI3NjExaWw0aWQxaWdweW82NHU0Ymg2c2ppMGU3OTU0cnhiZmsxZndjaXlxaCZlcD12MV9pbnRlcm5hbF9naWZfYnl𝑎WQmY3Q9Zw/a6pzK009rlCak/giphy.gif",
            "https://tenor.com/bKLpp.gif",
            "https://media.giphy.com/media/v1.Y2lkPTc5MGI3NjExeHYxMzNvcHd5OTA1dm5yZmVrZnA3dG50djFoMTJ6cjBxZ2EwaHBmNyZlcD12MV9naWZzX3NlYXJjaCZjdD1n/FRxHnTUBxQysLAV2eA/giphy.gif",
            "https://media.giphy.com/media/v1.Y2lkPWVjZjA1ZTQ3enhoMWk0ODRhcGd3aDV2amphOGJhbjExaDZsdGF4OWQ3emtjeTNzZyZlcD12MV9naWZzX3NlYXJjaCZjdD1n/VP4BM5r8ZdQfrxIZX2/giphy.gif",
            "https://media.giphy.com/media/v1.Y2lkPWVjZjA1ZTQ3enhoMWk0ODRhcGd3aDV2amphOGJhbjExaDZsdGF4OWQ3emtjeTNzZyZlcD12MV9naWZzX3NlYXJjaCZjdD1n/v0kDG3nsYWnbz4mTWN/giphy.gif"
        ];

        try {
            const apiResponse = await axios.get('https://api.waifu.pics/sfw/dance', {
                timeout: 10000
            });
            
            if (apiResponse.data && apiResponse.data.url) {
                const danceUrl = apiResponse.data.url;
                
                const form = {
                    body: `✨💃 𝐷𝐴𝑁𝐶𝐸 𝑇𝐼𝑀𝐸! 🕺✨\n\n» 𝐶𝑟𝑒𝑎𝑡𝑒𝑑 𝑏𝑦: 𝐴𝑠𝑖𝑓 𝑀𝑎ℎ𝑚𝑢𝑑 «`,
                    attachment: await global.utils.getStreamFromURL(danceUrl)
                };

                return message.reply(form);
            } else {
                throw new Error('𝑁𝑜 𝑈𝑅𝐿 𝑓𝑟𝑜𝑚 𝐴𝑃𝐼');
            }
        } 
        catch (apiError) {
            console.error("𝐷𝑎𝑛𝑐𝑒 𝐴𝑃𝐼 𝐸𝑟𝑟𝑜𝑟:", apiError);
            
            const randomDance = fallbackDances[Math.floor(Math.random() * fallbackDances.length)];
            const fallbackForm = {
                body: `✨💃 𝐷𝐴𝑁𝐶𝐸 𝑇𝐼𝑀𝐸! 🕺✨\n\n» 𝐹𝑎𝑙𝑙𝑏𝑎𝑐𝑘 𝐺𝐼𝐹 «\n» 𝐶𝑟𝑒𝑎𝑡𝑒𝑑 𝑏𝑦: 𝐴𝑠𝑖𝑓 𝑀𝑎ℎ𝑚𝑢𝑑 «`,
                attachment: await global.utils.getStreamFromURL(randomDance)
            };

            return message.reply(fallbackForm);
        }

    } catch (error) {
        console.error("𝑀𝑎𝑖𝑛 𝐷𝑎𝑛𝑐𝑒 𝐸𝑟𝑟𝑜𝑟:", error);
        
        const emergencyDance = "https://media.tenor.com/WNVZq-4Z1JAAAAAd/anime-dance-dancer-girl.gif";
        const emergencyForm = {
            body: `✨💃 𝐷𝐴𝑁𝐶𝐸 𝑇𝐼𝑀𝐸! 🕺✨\n\n» 𝐸𝑚𝑒𝑟𝑔𝑒𝑛𝑐𝑦 𝐺𝐼𝐹 «\n» 𝐶𝑟𝑒𝑎𝑡𝑒𝑑 𝑏𝑦: 𝐴𝑠𝑖𝑓 𝑀𝑎ℎ𝑚𝑢𝑑 «`,
            attachment: await global.utils.getStreamFromURL(emergencyDance)
        };

        return message.reply(emergencyForm);
    }
};
