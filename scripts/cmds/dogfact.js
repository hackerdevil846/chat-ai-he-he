const axios = require("axios");
const fs = require("fs-extra");

module.exports.config = {
    name: "dogfact",
    aliases: ["dog", "puppyfact"],
    version: "1.0.0",
    author: "Asif Mahmud",
    countDown: 5,
    role: 0,
    category: "fun",
    shortDescription: {
        en: "Random dog images with interesting facts"
    },
    longDescription: {
        en: "Get random dog images with interesting facts about dogs"
    },
    guide: {
        en: "{p}dogfact"
    },
    dependencies: {
        "axios": "",
        "fs-extra": ""
    }
};

module.exports.onStart = async function({ message, event }) {
    try {
        const { threadID, messageID } = event;

        const res = await axios.get(`https://some-random-api.com/animal/dog`);
        const data = res.data;

        const imageResponse = await axios.get(data.image, { 
            responseType: 'arraybuffer' 
        });
        
        const imagePath = __dirname + '/cache/dog_image.png';
        await fs.writeFileSync(imagePath, Buffer.from(imageResponse.data, 'binary'));

        await message.reply({
            body: `🐶 | Dog Fact:\n${data.fact}`,
            attachment: fs.createReadStream(imagePath)
        });

        fs.unlinkSync(imagePath);
            
    } catch (error) {
        console.error("DogFact Error:", error);
        await message.reply("❌ | Failed to fetch dog fact. Please try again later.");
    }
};
