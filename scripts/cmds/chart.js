module.exports.config = {
	name: "chart",
	version: "1.0",
	hasPermssion: 0,
	credits: "𝑨𝒔𝒊𝒇 𝑴𝒂𝒉𝒎𝒖𝒅",
	description: "𝑻𝒐𝒑 8 𝒈𝒓𝒐𝒖𝒑𝒔 𝒊𝒏𝒕𝒆𝒓𝒂𝒄𝒕𝒊𝒗𝒆 𝒅𝒊𝒂𝒈𝒓𝒂𝒎 𝒄𝒓𝒆𝒂𝒕𝒆 𝒌𝒐𝒓𝒕𝒆",
	commandCategory: "𝑩𝒐𝒙 𝑪𝒉𝒂𝒕",
	usages: "",
	cooldowns: 5
};

function toMathBoldItalic(text) {
    const map = {
        'A': '𝑨', 'B': '𝑩', 'C': '𝑪', 'D': '𝑫', 'E': '𝑬', 'F': '𝑭', 'G': '𝑮', 'H': '𝑯', 'I': '𝑰', 'J': '𝑱', 'K': '𝑲', 'L': '𝑳', 'M': '𝑴',
        'N': '𝑵', 'O': '𝑶', 'P': '𝑷', 'Q': '𝑸', 'R': '𝑹', 'S': '𝑺', 'T': '𝑻', 'U': '𝑼', 'V': '𝑽', 'W': '𝑾', 'X': '𝑿', 'Y': '𝒀', 'Z': '𝒁',
        'a': '𝒂', 'b': '𝒃', 'c': '𝒄', 'd': '𝒅', 'e': '𝒆', 'f': '𝒇', 'g': '𝒈', 'h': '𝒉', 'i': '𝒊', 'j': '𝒋', 'k': '𝒌', 'l': '𝒍', 'm': '𝒎',
        'n': '𝒏', 'o': '𝒐', 'p': '𝒑', 'q': '𝒒', 'r': '𝒓', 's': '𝒔', 't': '𝒕', 'u': '𝒖', 'v': '𝒗', 'w': '𝒘', 'x': '𝒙', 'y': '𝒚', 'z': '𝒛',
        '0': '𝟎', '1': '𝟏', '2': '𝟐', '3': '𝟑', '4': '𝟒', '5': '𝟓', '6': '𝟔', '7': '𝟕', '8': '𝟖', '9': '𝟗',
        ' ': ' ', ':': ':', '>': '>', '<': '<', '(': '(', ')': ')', '[': '[', ']': ']', '{': '{', '}': '}', ',': ',', '.': '.', ';': ';', 
        '!': '!', '?': '?', "'": "'", '"': '"', '-': '-', '_': '_', '=': '=', '+': '+', '*': '*', '/': '/', '\\': '\\', '|': '|', '&': '&', 
        '^': '^', '%': '%', '$': '$', '#': '#', '@': '@'
    };
    return text.split('').map(char => map[char] || char).join('');
}

module.exports.run = async function({ api, event }) {
    const KMath = (data) => data.reduce((a, b) => a + b, 0);
    const fs = require("fs-extra");
    const axios = require('axios');
    
    const successMessage = toMathBoldItalic("✅ 𝑻𝒐𝒑 8 𝑰𝒏𝒕𝒆𝒓𝒂𝒄𝒕𝒊𝒗𝒆 𝑮𝒓𝒐𝒖𝒑𝒔 𝑪𝒉𝒂𝒓𝒕 𝑷𝒓𝒐𝒔𝒕𝒖𝒕 𝑯𝒐𝒚𝒆𝒄𝒉𝒆!");
    const path = __dirname + '/cache/chart.png';
    
    try {
        const inbox = await api.getThreadList(100, null, ['INBOX']);
        const xx = [...inbox].filter(group => group.isSubscribed && group.isGroup);
        
        const kho = [];
        for (const n of xx) {
            kho.push({
                name: n.name,
                exp: n.messageCount || 0
            });
        }
        
        kho.sort((a, b) => b.exp - a.exp);
        
        const topGroups = kho.slice(0, 8);
        const groupNames = topGroups.map(group => `'${group.name}'`);
        const messageCounts = topGroups.map(group => group.exp);
        
        const total = KMath(messageCounts);
        const chartUrl = `https://quickchart.io/chart?c={
            type: 'doughnut',
            data: {
                labels: [${groupNames.map(name => encodeURIComponent(name)).join(',')}],
                datasets: [{
                    label: '${encodeURIComponent(toMathBoldItalic('Interaction'))}',
                    data: [${messageCounts.join(',')}]
                }]
            },
            options: {
                plugins: {
                    doughnutlabel: {
                        labels: [
                            { text: '${total}', font: { size: 26 } },
                            { text: '${encodeURIComponent(toMathBoldItalic('Total'))}' }
                        ]
                    }
                }
            }
        }`;
        
        const { data: stream } = await axios.get(chartUrl, {
            method: 'GET',
            responseType: 'arraybuffer'
        });
        
        fs.writeFileSync(path, Buffer.from(stream));
        return api.sendMessage({
            body: successMessage,
            attachment: fs.createReadStream(path)
        }, event.threadID, () => fs.unlinkSync(path), event.messageID);
        
    } catch (error) {
        console.error(error);
        const errorMessage = toMathBoldItalic("❌ 𝑪𝒉𝒂𝒓𝒕 𝒄𝒓𝒆𝒂𝒕𝒆 𝒌𝒐𝒓𝒕𝒆 𝒑𝒂𝒓𝒄𝒉𝒊 𝒏𝒊. 𝑷𝒖𝒏𝒐𝒓𝒐𝒚 𝒄𝒉𝒆𝒔𝒕𝒂 𝒌𝒐𝒓𝒖𝒏!");
        return api.sendMessage(errorMessage, event.threadID, event.messageID);
    }
};
