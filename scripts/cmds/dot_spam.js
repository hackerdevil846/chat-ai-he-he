module.exports.config = {
    name: "dot",
    version: "1.0.0",
    hasPermssion: 2,
    credits: "𝑨𝒔𝒊𝒇 𝑴𝒂𝒉𝒎𝒖𝒅",
    description: "💫 War In Chatbox Animation",
    commandCategory: "wargroup",
    usages: "[mention]",
    cooldowns: 7,
    dependencies: {
        "fs-extra": "",
        "axios": ""
    }
};

module.exports.run = async function({ api, event }) {
    try {
        const a = (message) => api.sendMessage(message, event.threadID);
        
        // ✨ Animation sequence
        const animation = [
            { delay: 1000, text: "." },
            { delay: 2000, text: "." },
            { delay: 3000, text: "#" },
            { delay: 4000, text: "/" },
            { delay: 5000, text: "/" },
            { delay: 6000, text: "/" },
            { delay: 7000, text: "#" },
            { delay: 8000, text: "." },
            { delay: 9000, text: "." },
            { delay: 10000, text: "😘" },
            { delay: 12000, text: "." },
            { delay: 14000, text: "." },
            { delay: 16000, text: "." },
            { delay: 18000, text: "." },
            { delay: 20000, text: "." },
            { delay: 22000, text: "." },
            { delay: 25000, text: "." },
            { delay: 27000, text: "." },
            { delay: 30000, text: "." },
            { delay: 34000, text: "." },
            { delay: 36000, text: "." },
            { delay: 38000, text: "." },
            { delay: 40000, text: "." },
            { delay: 43000, text: "." },
            { delay: 46000, text: "." },
            { delay: 48000, text: "." },
            { delay: 49900, text: "." },
            { delay: 50500, text: "." },
            { delay: 51000, text: "." }
        ];

        // 🚀 Execute animation
        animation.forEach(({ delay, text }) => {
            setTimeout(() => a(text), delay);
        });

    } catch (error) {
        console.error("✨ Error in dot command:", error);
        api.sendMessage("❌ An error occurred while executing the animation.", event.threadID);
    }
};
