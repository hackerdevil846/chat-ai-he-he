module.exports.config = {
    name: "rps",
    version: "2.0",
    hasPermssion: 0,
    credits: "𝑨𝒔𝒊𝒇 𝑴𝒂𝒉𝒎𝒖𝒅",
    description: "Rock-paper-scissors game (supports text & emoji)",
    category: "fun",
    usages: "[rock|paper|scissors] or [✊|✋|✌️]",
    cooldowns: 5,
    dependencies: {}
};

module.exports.languages = {
    "en": {},
    "bn": {}
};

module.exports.onLoad = function () {
    // Nothing required on load
};

module.exports.onStart = async function({ api, event, args }) {
    const textChoices = ["rock", "paper", "scissors"];
    const emojiChoices = ["✊", "✋", "✌️"];

    const fullMap = {
        "rock": "✊",
        "paper": "✋",
        "scissors": "✌️",
        "✊": "rock",
        "✋": "paper",
        "✌️": "scissors"
    };

    const userInput = args[0]?.toLowerCase();
    if (!userInput || (!textChoices.includes(userInput) && !emojiChoices.includes(userInput))) {
        return api.sendMessage("❌ Please choose: rock, paper, scissors or ✊, ✋, ✌️", event.threadID, event.messageID);
    }

    const userChoice = fullMap[userInput];
    const botChoice = textChoices[Math.floor(Math.random() * 3)];

    const userEmoji = fullMap[userChoice];
    const botEmoji = fullMap[botChoice];

    let result;
    if (userChoice === botChoice) {
        result = "⚖️ It's a tie!";
    } else if (
        (userChoice === "rock" && botChoice === "scissors") ||
        (userChoice === "paper" && botChoice === "rock") ||
        (userChoice === "scissors" && botChoice === "paper")
    ) {
        result = "🎉 You win! Besh bhalo khelsi!";
    } else {
        result = "😎 I win! Next bar try koro!";
    }

    const replyMessage = 
`🫵 You chose: ${userEmoji} (${userChoice})
🤖 I chose: ${botEmoji} (${botChoice})

✨ Result: ${result}`;

    return api.sendMessage(replyMessage, event.threadID, event.messageID);
};
