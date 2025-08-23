module.exports.config = {
	name: "chart",
	version: "1.0.0",
	hasPermssion: 0,
	credits: "𝑨𝒔𝒊𝒇 𝑴𝒂𝒉𝒎𝒖𝒅",
	description: "𝑻𝒐𝒑 8 𝒈𝒓𝒐𝒖𝒑𝒔 𝒊𝒏𝒕𝒆𝒓𝒂𝒄𝒕𝒊𝒗𝒆 𝒅𝒊𝒂𝒈𝒓𝒂𝒎 𝒄𝒓𝒆𝒂𝒕𝒆 𝒌𝒐𝒓𝒕𝒆",
	category: "group",
	usages: "",
	cooldowns: 5,
	dependencies: {
		"fs-extra": "",
		"axios": ""
	}
};

module.exports.run = async function({ api, event, args, Users, Threads, Currencies }) {
    const KMath = (data) => data.reduce((a, b) => a + b, 0);
    const fs = global.nodemodule["fs-extra"];
    const axios = global.nodemodule["axios"];
    
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

    const successMessage = toMathBoldItalic("✨ 𝗧𝗼𝗽 𝟴 𝗠𝗼𝘀𝘁 𝗔𝗰𝘁𝗶𝘃𝗲 𝗚𝗿𝗼𝘂𝗽𝘀 𝗖𝗵𝗮𝗿𝘁\n━━━━━━━━━━━━━━━━━━\n✅ 𝗖𝗵𝗮𝗿𝘁 𝘀𝘂𝗰𝗰𝗲𝘀𝘀𝗳𝘂𝗹𝗹𝘆 𝗴𝗲𝗻𝗲𝗿𝗮𝘁𝗲𝗱!");
    const path = __dirname + '/cache/chart.png';
    
    try {
        const inbox = await api.getThreadList(100, null, ['INBOX']);
        const filteredGroups = [...inbox].filter(group => group.isSubscribed && group.isGroup);
        
        const groupData = [];
        for (const group of filteredGroups) {
            groupData.push({
                name: group.name,
                exp: group.messageCount || 0
            });
        }
        
        groupData.sort((a, b) => b.exp - a.exp);
        const topGroups = groupData.slice(0, 8);
        
        const chartUrl = `https://quickchart.io/chart?c={
            type: 'doughnut',
            data: {
                labels: [${topGroups.map(group => `'${group.name.replace(/'/g, "\\'")}'`).join(',')}],
                datasets: [{
                    label: '${toMathBoldItalic('Interaction')}',
                    data: [${topGroups.map(group => group.exp).join(',')}],
                    backgroundColor: [
                        '#ff6b6b', '#4ecdc4', '#45b7d1', '#f9c74f', 
                        '#ffa726', '#7e57c2', '#ef5350', '#29b6f6'
                    ]
                }]
            },
            options: {
                plugins: {
                    doughnutlabel: {
                        labels: [
                            { text: '${KMath(topGroups.map(g => g.exp))}', font: { size: 26 } },
                            { text: '${toMathBoldItalic('Total')}' }
                        ]
                    },
                    legend: { position: 'right' }
                }
            }
        }`;
        
        const { data: chartBuffer } = await axios.get(chartUrl, {
            method: 'GET',
            responseType: 'arraybuffer'
        });
        
        fs.writeFileSync(path, Buffer.from(chartBuffer));
        
        return api.sendMessage({
            body: successMessage,
            attachment: fs.createReadStream(path)
        }, event.threadID, () => fs.unlinkSync(path), event.messageID);
        
    } catch (error) {
        console.error(error);
        const errorMessage = toMathBoldItalic("❌ 𝗖𝗵𝗮𝗿𝘁 𝗰𝗿𝗲𝗮𝘁𝗶𝗼𝗻 𝗳𝗮𝗶𝗹𝗲𝗱!\n━━━━━━━━━━━━━━━━━━\n𝗣𝗹𝗲𝗮𝘀𝗲 𝘁𝗿𝘆 𝗮𝗴𝗮𝗶𝗻 𝗹𝗮𝘁𝗲𝗿");
        return api.sendMessage(errorMessage, event.threadID, event.messageID);
    }
};
