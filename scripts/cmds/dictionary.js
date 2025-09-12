const axios = require("axios");

module.exports.config = {
    name: "dictionary",
    aliases: ["dict", "define"],
    version: "1.0.0",
    author: "𝐴𝑠𝑖𝑓 𝑀𝑎ℎ𝑚𝑢𝑑",
    countDown: 5,
    role: 0,
    category: "𝑢𝑡𝑖𝑙𝑖𝑡𝑦",
    shortDescription: {
        en: "𝐸𝑛𝑔𝑙𝑖𝑠ℎ 𝑑𝑖𝑐𝑡𝑖𝑜𝑛𝑎𝑟𝑦 𝑐ℎ𝑒𝑐𝑘𝑒𝑟"
    },
    longDescription: {
        en: "𝐶ℎ𝑒𝑐𝑘𝑠 𝑤𝑜𝑟𝑑 𝑑𝑒𝑓𝑖𝑛𝑖𝑡𝑖𝑜𝑛𝑠 𝑎𝑛𝑑 𝑚𝑒𝑎𝑛𝑖𝑛𝑔𝑠 𝑓𝑟𝑜𝑚 𝑡ℎ𝑒 𝑑𝑖𝑐𝑡𝑖𝑜𝑛𝑎𝑟𝑦"
    },
    guide: {
        en: "{p}dictionary [𝑤𝑜𝑟𝑑]"
    },
    dependencies: {
        "axios": ""
    }
};

module.exports.onStart = async function({ message, args }) {
    try {
        if (!args[0]) {
            return message.reply("🔍 | 𝑃𝑙𝑒𝑎𝑠𝑒 𝑝𝑟𝑜𝑣𝑖𝑑𝑒 𝑎 𝑤𝑜𝑟𝑑 𝑡𝑜 𝑠𝑒𝑎𝑟𝑐ℎ!\n𝑈𝑠𝑎𝑔𝑒: {p}𝑑𝑖𝑐𝑡𝑖𝑜𝑛𝑎𝑟𝑦 [𝑤𝑜𝑟𝑑]");
        }

        const word = args.join(" ").trim().toLowerCase();

        const response = await axios.get(`https://api.dictionaryapi.dev/api/v2/entries/en/${word}`);
        const data = response.data[0];
        
        const formatText = (text) => {
            const mapping = {
                a: '𝒂', b: '𝒃', c: '𝒄', d: '𝒅', e: '𝒆', f: '𝒇', g: '𝒈', h: '𝒉', i: '𝒊', j: '𝒋',
                k: '𝒌', l: '𝒍', m: '𝒎', n: '𝒏', o: '𝒐', p: '𝒑', q: '𝒒', r: '𝒓', s: '𝒔', t: '𝒕',
                u: '𝒖', v: '𝒗', w: '𝒘', x: '𝒙', y: '𝒚', z: '𝒛',
                A: '𝑨', B: '𝑩', C: '𝑪', D: '𝑫', E: '𝑬', F: '𝑭', G: '𝑮', H: '𝑯', I: '𝑰', J: '𝑱',
                K: '𝑲', L: '𝑳', M: '𝑴', N: '𝑵', O: '𝑶', P: '𝑷', Q: '𝑸', R: '𝑹', S: '𝑺', T: '𝑻',
                U: '𝑼', V: '𝑽', W: '𝑾', X: '𝑿', Y: '𝒀', Z: '𝒁'
            };
            return text.split('').map(char => mapping[char] || char).join('');
        };

        let messageText = `📚 𝐷𝐼𝐶𝑇𝐼𝑂𝑁𝐴𝑅𝑌 𝑅𝐸𝑆𝑈𝐿𝑇𝑆 📚\n\n`;
        messageText += `✨ 𝑊𝑜𝑟𝑑: ${formatText(data.word)}\n\n`;

        if (data.phonetics && data.phonetics.length > 0) {
            data.phonetics.forEach(phonetic => {
                if (phonetic.text) messageText += `🔊 𝑃𝑟𝑜𝑛𝑢𝑛𝑐𝑖𝑎𝑡𝑖𝑜𝑛: /${phonetic.text}/\n`;
                if (phonetic.audio) messageText += `🎵 𝐴𝑢𝑑𝑖𝑜: ${phonetic.audio}\n`;
            });
            messageText += `\n`;
        }

        data.meanings.forEach(meaning => {
            messageText += `📌 𝑃𝑎𝑟𝑡 𝑜𝑓 𝑆𝑝𝑒𝑒𝑐ℎ: ${formatText(meaning.partOfSpeech)}\n`;
            
            if (meaning.definitions && meaning.definitions.length > 0) {
                meaning.definitions.slice(0, 3).forEach((def, index) => {
                    messageText += `\n${index + 1}⃣ 𝐷𝑒𝑓𝑖𝑛𝑖𝑡𝑖𝑜𝑛: ${def.definition}\n`;
                    if (def.example) messageText += `✏️ 𝐸𝑥𝑎𝑚𝑝𝑙𝑒: ${def.example}\n`;
                });
            }
            messageText += `\n────────────────\n\n`;
        });

        messageText += `💖 𝑃𝑜𝑤𝑒𝑟𝑒𝑑 𝑏𝑦 ${formatText("𝐴𝑠𝑖𝑓 𝑀𝑎ℎ𝑚𝑢𝑑")}`;

        return message.reply(messageText);

    } catch (error) {
        if (error.response?.status === 404) {
            return message.reply(`❌ | 𝑊𝑜𝑟𝑑 "${args.join(" ")}" 𝑛𝑜𝑡 𝑓𝑜𝑢𝑛𝑑 𝑖𝑛 𝑡ℎ𝑒 𝑑𝑖𝑐𝑡𝑖𝑜𝑛𝑎𝑟𝑦!`);
        }
        console.error("𝐷𝑖𝑐𝑡𝑖𝑜𝑛𝑎𝑟𝑦 𝐸𝑟𝑟𝑜𝑟:", error);
        return message.reply("❌ | 𝐴𝑛 𝑒𝑟𝑟𝑜𝑟 𝑜𝑐𝑐𝑢𝑟𝑟𝑒𝑑 𝑤ℎ𝑖𝑙𝑒 𝑓𝑒𝑡𝑐ℎ𝑖𝑛𝑔 𝑡ℎ𝑒 𝑑𝑖𝑐𝑡𝑖𝑜𝑛𝑎𝑟𝑦 𝑑𝑎𝑡𝑎.");
    }
};
