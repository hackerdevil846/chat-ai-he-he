const fs = require("fs-extra");
const axios = require("axios");

module.exports.config = {
    name: "chart",
    aliases: ["groupchart", "activitychart"],
    version: "1.0.0",
    author: "𝐴𝑠𝑖𝑓 𝑀𝑎ℎ𝑚𝑢𝑑",
    countDown: 5,
    role: 0,
    category: "group",
    shortDescription: {
        en: "𝑇𝑜𝑝 8 𝑔𝑟𝑜𝑢𝑝𝑠 𝑖𝑛𝑡𝑒𝑟𝑎𝑐𝑡𝑖𝑣𝑒 𝑑𝑖𝑎𝑔𝑟𝑎𝑚 𝑐𝑟𝑒𝑎𝑡𝑒"
    },
    longDescription: {
        en: "𝐶𝑟𝑒𝑎𝑡𝑒𝑠 𝑎𝑛 𝑖𝑛𝑡𝑒𝑟𝑎𝑐𝑡𝑖𝑣𝑒 𝑑𝑜𝑢𝑔ℎ𝑛𝑢𝑡 𝑐ℎ𝑎𝑟𝑡 𝑜𝑓 𝑡𝑜𝑝 8 𝑚𝑜𝑠𝑡 𝑎𝑐𝑡𝑖𝑣𝑒 𝑔𝑟𝑜𝑢𝑝𝑠"
    },
    guide: {
        en: "{p}chart"
    },
    dependencies: {
        "fs-extra": "",
        "axios": ""
    }
};

module.exports.onStart = async function({ api, event }) {
    try {
        const KMath = (data) => data.reduce((a, b) => a + b, 0);
        
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

        const successMessage = toMathBoldItalic("✨ 𝑇𝑜𝑝 8 𝑀𝑜𝑠𝑡 𝐴𝑐𝑡𝑖𝑣𝑒 𝐺𝑟𝑜𝑢𝑝𝑠 𝐶ℎ𝑎𝑟𝑡\n━━━━━━━━━━━━━━━━━━\n✅ 𝐶ℎ𝑎𝑟𝑡 𝑠𝑢𝑐𝑐𝑒𝑠𝑠𝑓𝑢𝑙𝑙𝑦 𝑔𝑒𝑛𝑒𝑟𝑎𝑡𝑒𝑑!");
        const path = __dirname + '/cache/chart.png';
        
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
        
        if (topGroups.length === 0) {
            return api.sendMessage(toMathBoldItalic("❌ 𝑁𝑜 𝑔𝑟𝑜𝑢𝑝 𝑑𝑎𝑡𝑎 𝑓𝑜𝑢𝑛𝑑 𝑡𝑜 𝑐𝑟𝑒𝑎𝑡𝑒 𝑐ℎ𝑎𝑟𝑡"), event.threadID, event.messageID);
        }
        
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
        
        await fs.writeFileSync(path, Buffer.from(chartBuffer));
        
        await api.sendMessage({
            body: successMessage,
            attachment: fs.createReadStream(path)
        }, event.threadID, () => fs.unlinkSync(path), event.messageID);
        
    } catch (error) {
        console.error("𝐶ℎ𝑎𝑟𝑡 𝐸𝑟𝑟𝑜𝑟:", error);
        const errorMessage = "❌ 𝐶ℎ𝑎𝑟𝑡 𝑐𝑟𝑒𝑎𝑡𝑖𝑜𝑛 𝑓𝑎𝑖𝑙𝑒𝑑!\n━━━━━━━━━━━━━━━━━━\n𝑃𝑙𝑒𝑎𝑠𝑒 𝑡𝑟𝑦 𝑎𝑔𝑎𝑖𝑛 𝑙𝑎𝑡𝑒𝑟";
        await api.sendMessage(errorMessage, event.threadID, event.messageID);
    }
};
