module.exports.config = {
    name: "fyt",
    version: "2.0.0",
    hasPermssion: 2,
    credits: "𝑨𝒔𝒊𝒇 𝑴𝒂𝒉𝒎𝒖𝒅",
    description: "𝑪𝒉𝒂𝒕𝒃𝒐𝒙𝒆 𝑾𝒂𝒓 - Fun interactive fight simulation with emojis and humor 🥊",
    category: "war-group",
    usages: "[@mention]",
    cooldowns: 15,
    dependencies: {
        "fs-extra": "",
        "axios": ""
    },
    envConfig: {
        fightDuration: 90000
    }
};

module.exports.onStart = async function({ api, event, args, Users, Threads, Currencies }) {
    try {
        const targetID = Object.keys(event.mentions)[0];
        if (!targetID) {
            return api.sendMessage("⚠️ | Please mention someone to fight with! Example: !fyt @username", event.threadID);
        }

        const fighter1 = await Users.getNameUser(event.senderID);
        const fighter2 = await Users.getNameUser(targetID);
        
        // Send initial challenge message
        api.sendMessage(`🥊 | ${fighter1} has challenged ${fighter2} to a chatbox war! 🥊\n\nGet ready for an epic battle! 💥`, event.threadID);
        
        // Array of fight messages with emojis
        const fightMessages = [
            { text: `💥 ${fighter1}: "73R! 83H4N K4 9HUD4 M4RO9! G4NDU K4 BACHA 😝😝😝❤️😂"`, delay: 2000 },
            { text: `🔥 ${fighter2}: "777333RRR111 BAAHN KKK111 LLLLAAALLL GGGGAAANNNDDD VVVIICHHH M3RRR444 LLLLOOORRRAAAA 😂😂😂😂"`, delay: 4000 },
            { text: `🤜 ${fighter1}: "RRRRRRAAAAANNNNNDDDIIIIIII KKKKKKKKKAAAAAAAA BBBBBAAACCCCHHHAAAAA❤️❤️❤️ 😂😂😂"`, delay: 6000 },
            { text: `🤯 ${fighter2}: "MMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMAAAAAAADDDDDDEEEEERRRRRRRRRRRRRR CCCCCCHHHHHHOOOOOOOOODDDDDDDD KI OLAD😝😝❤️❤️😂😂😂😂"`, delay: 8000 },
            { text: `💣 ${fighter1}: "TTTTTTTTTEEEEERRRRRRIIIIIIIIIIIII BBBBBBBBBBBAAAAAAHHHHHHHAAAAAAAAANNNNNNNNNNNNNNNNNNN KKKKKKKKKAAAAAAAA PPPPPPPPUUUUUUUDDDDAAAAAA MNMMAAAAAARRRRROOOOOUUUUUUUUU 😂😂😂😂🤔🤔😝😝😝😝❤️😂😂😂❤️"`, delay: 10000 },
            { text: `🎯 ${fighter2}: "BBBBBBBBBBBAAAAAAHHHHHHHAAAAAAAAANNNNNNNNNNNNNNNNNNN 😂😂😂😂CCCCCCHHHHHHOOOOOOOOODDDDDDDD GGGGGGGGGGGGGGGGGAAAAAAAAAAAAAAAAAAAAAAAAAANNNNNNNNNNNNNNNNNNNNNNDDDDDDDDDDDDDDDUUUUUUUUUUUUUU❤️❤️❤️❤️😂😂😂 ❤️❤️❤️"`, delay: 12000 },
            { text: `⚡ ${fighter1}: "777333RRR111 BAAHN KKK111 LLLLAAALLL GGGGAAANNNDDD VVVIICHHH M3RRR444 LLLLOOORRRAAAA 😂😂😂😂"`, delay: 14000 },
            { text: `🌪️ ${fighter2}: "TTTTEEEXXXXXIIIII KKKKKKKKKAAAAAAAA BBBBBAAACCCCHHHAAAAA 😂😂😂😂 TTTTTTTTTEEEEERRRRRRIIIIIIIIIIIII BBBBBBBBBBBAAAAAAHHHHHHHAAAAAAAAANNNNNNNNNNNNNNNNNNN KKKKKKKKKAAAAAAAA BBBBOOOOBSSS CCCCCCCCCCHHHHHHHUUUUUUUUUSSSSSSSUUUUUUUU 😂😂😂😂❤️❤️❤️😂😂😂"`, delay: 16000 },
            { text: `💫 ${fighter1}: "GGGGGGGGGGGGGGGHHHHHHAAAAAASSSSSSHHHHHHHTTTTTTTTTTIIIIIIIIIIIIIIIIIIIIIIIIIII KKKKKKKKKAAAAAAAA BBBBBAAACCCCHHHAAAAA 😂😂😂😂😂😝😝😝😝😝❤️"`, delay: 18000 },
            { text: `🌟 ${fighter2}: "MMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMAAAAAAADDDDDDEEEEERRRRRRRRRRRRRR CCCCCCHHHHHHOOOOOOOOODDDDDDDD ☹️☹️☹️☹️☹️😝😝😝☹️❤️❤️"`, delay: 20000 },
            { text: `👊 ${fighter1}: "TTTTTTTTTEEEEERRRRRRIIIIIIIIIIIII AAAAAAMMMMMMMAAAAAAAA KKKKKKKKKAAAAAAAA PPPPPPPPUUUUUUUDDDDAAAAAA MMMMMMMMMMAAAAAA TTTTTTTTAAAAAAIIIIIILLLLLLLL LLLLLLGGGGGGGAAAAAA KKKKKKKKKAAAAAAAA LLLLAAAAND DDDDDDOIUUUUUUU 😝😝😝😂😂😂😂❤️❤️❤️❤️❤️"`, delay: 22000 },
            { text: `🥷 ${fighter2}: ":p :p :p :p :p :p :p :p🖕🏻🖕🏻🖕🏻🖕🏻 TTTTTTTTTEEEEERRRRRRIIIIIIIIIIIII BBBBBBBBBBBAAAAAAHHHHHHHAAAAAAAAANNNNNNNNNNNNNNNNNNN KKKKKKKKKAAAAAAAA PPPPPPPPUUUUUUUDDDDAAAAAA MMMMMMAAA UUUUUUNNNNNGGGGGLLLLLIIIIIII DDDDDDOIUUUUUUU 😂😂😂😂❤️❤️❤️🖕🏻🖕🏻🖕🏻"`, delay: 24000 },
            { text: `🤺 ${fighter1}: "HHHHHHHHHHHHHAAAAAAAARRRRRRRRRRAAAAAAAMMMMMMMMMMM KKKKKKKIIIIIIIIIIIIIIII OOOOOOOOOOOLLLLLLLLAAAAAAAAADDDDDD TTTTT333333RRRRRRRR111111 BBBBB33333HHHHHHHAAAAAANNNNNN KKKKKKKKKAAAAAAAA PPPPPPPPUUUUUUUDDDDAAAAAA PPPPPPUUUUUUUSSSHHHHH KEERRROOOOUUUU 😂😂😂😂❤️❤️❤️❤️"`, delay: 26000 },
            { text: `🦸 ${fighter2}: "TTTTTTTTTEEEEERRRRRRIIIIIIIIIIIII BBBBBBBBBBBAAAAAAHHHHHHHAAAAAAAAANNNNNNNNNNNNNNNNNNN KKKKKKKIIIIIIIIIIIIIIII LAAAALLLL GGGGGGGGGAAAAAAAANNNNNNNNDDDDD MAROU 😂😂😂😂❤️❤️❤️❤️❤️"`, delay: 28000 },
            { text: `🦹 ${fighter1}: "TTTTEEEXXXXXIIIII KKKKKKKKKAAAAAAAA BBBBBAAACCCCHHHAAAAA GGGGGGGGGGGGGGGGGAAAAAAAAAAAAAAAAAAAAAAAAAANNNNNNNNNNNNNNNNNNNNNNDDDDDDDDDDDDDDDUUUUUUUUUUUUUU NNNNAASSAAAALLLL KKKKKKKIIIIIIIIIIIIIIII OOOOOOOOOOOOLLLLLLLLLLLAAAAAAAADDDDDD 😂😂😂😂😂❤️❤️❤️❤️😝"`, delay: 30000 },
            { text: `🧨 ${fighter2}: "TTTTTTTTTEEEEERRRRRRIIIIIIIIIIIII AAAAAAMMMMMMMAAAAAAAA KKKKKKKKKAAAAAAAA PPPPPPPPUUUUUUUDDDDAAAAAA MMMMMMMMMMAAAAAA TTTTTTTTAAAAAAIIIIIILLLLLLLL LLLLLLGGGGGGGAAAAAA KKKKKKKKKAAAAAAAA LLLLAAAAND DDDDDDOIUUUUUUU 😝😝😝😂😂😂😂❤️❤️❤️❤️❤️"`, delay: 32000 },
            { text: `💣 ${fighter1}: "🖕🏻🖕🏻🖕🏻🖕🏻 TTTTTTTTTEEEEERRRRRRIIIIIIIIIIIII BBBBBBBBBBBAAAAAAHHHHHHHAAAAAAAAANNNNNNNNNNNNNNNNNNN KKKKKKKKKAAAAAAAA PPPPPPPPUUUUUUUDDDDAAAAAA MMMMMMAAA UUUUUUNNNNNGGGGGLLLLLIIIIIII DDDDDDOIUUUUUUU 😂😂😂😂❤️❤️❤️🖕🏻🖕🏻🖕🏻"`, delay: 34000 },
            { text: `🎆 ${fighter2}: "GGGGGGGGGGGGGGGHHHHHHAAAAAASSSSSSHHHHHHHTTTTTTTTTTIIIIIIIIIIIIIIIIIIIIIIIIIIIJ KKKKKKKKKAAAAAAAA BBBBBAAACCCCHHHAAAAA TTTTTTTTTEEEEERRRRRRIIIIIIIIIIIII BBBBBBBBBBBAAAAAAHHHHHHHAAAAAAAAANNNNNNNNNNNNNNNNNNN KOOOOOOO LLLLAAAAND DDDDDDOIUUUUUUU GGGGGGGGGGGGGGGGGAAAAAAAAAAAAAAAAAAAAAAAAAANNNNNNNNNNNNNNNNNNNNNNDDDDDDDDDDDDDDDUUUUUUUUUUUUUU 🥰🥰🥰🥰🖕🏻🖕🏻🖕🏻🖕🏻🖕🏻🖕🏻🖕🏻🖕🏻🖕🏻🖕🏻🖕🏻🖕🏻🖕🏻🖕🏻🖕🏻🖕🏻🖕🏻🖕🏻🖕🏻☹️☹️☹️😝😝😝😝😝🤔🤔🤔🤔🤔😂😂😂😂"`, delay: 36000 },
            { text: `🏆 ${fighter1}: "TTTTTTTTTEEEEERRRRRRIIIIIIIIIIIII AAAAAAMMMMMMMAAAAAAAA KKKKKKKIIIIIIIIIIIIIIII LAAAALLLL GGGGGGGGGAAAAAAAANNNNNNNNDDDDD CCCCCCHHHHHHOOOOOOOOODDDDDDDD DDDDDDOIUUUUUUU GAAA TTTTTTTTTEEEEERRRRRRIIIIIIIIIIIII BBBBBBBBBBBAAAAAAHHHHHHHAAAAAAAAANNNNNNNNNNNNNNNNNNN KOOOOOOO LLLLAAAAND DDDDDDOIUUUUUUU GGGGGGGGGGGGGGGGGAAAAAAAAAAAAAAAAAA 😂😂😂😂😂😂😂😂😂😂😂😂😂😂😂😂"`, delay: 38000 },
            { text: `🤝 ${fighter2}: "😆😆😆😆😆😆😆😆😆😆😆👅👅👅👅👅👅👅👅👅👅👅👅👅👅👅👅👅👅👅👅👅👅👅👅👅👅👅👅👅👅👅👅👅👅👅👅👅👅👅👅👅👅👅👅👅👅👅👅👅👅👅👅👅👅👅👅👅👅👅👅👅👅👅👅👅👅👅👅👅👅👅👅👅👅👅👅👅👅👅👅👅👅👅👅👅👅👅👅👅👅👅👅👅👅👅👅👅👅👅👅👅👅👅👅👅👅👅👅👅👅👅👅👅👅👅👅👅👅👅👅👅👅👅👅👅👅👅👅👅👅👅👅👅👅👅👅👅👅👅👅👅TTTTTTEEEEEEERRRRRRRRRRRUUUUUUUUUUUUUUUUUUUUUUUUUUUUUUUUUUUUUUUU😋U😋U😋U😋U😋U😋U😋U😋U😋U😋U😋U😋U😋U😋U😋U😋U😋U😋U😋U😋U😋UU😋😋😋😋😋😋😋😋😋😋😋😋MMMMMMMMMMMMMMMWWWWWWWWWWWWWWWKKKKKKKKKKKKKKOOOOOOOOOOOOOOOOOOOOOOOOOOOOO😋😋😋😋😋😋😋😋😋😋😋😋😋😋😋😋😋XXXXXXXXXXXXXXXXXXXXXXXXXXXXHHHHHHHOOOOOODDDDDDDDDDDUUUUUUUUUUUUUUUUUUUUUUUUUU🤣🤣🤣🤣🤣🤣🤣🤣🤣🤣🤣🤣🤣🤣🤣🤣🤣🤣🤣🤣🤣BBBBIII*NNNNNNNNNNNAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAACCCCCCOOOONNNNNNNNNNNNNDDDD"`, delay: 40000 }
        ];

        // Send fight messages with delays
        for (const message of fightMessages) {
            await new Promise(resolve => setTimeout(resolve, message.delay));
            api.sendMessage(message.text, event.threadID);
        }

        // Send final result after all messages
        setTimeout(() => {
            const results = [
                `🎉 | The epic chatbox war between ${fighter1} and ${fighter2} has concluded! 🎉`,
                `🏅 | Both fighters showed incredible skills and humor!`,
                `🤗 | This battle will be remembered in the halls of chatbox history!`,
                `💖 | Remember, it's all in good fun! No real feelings were harmed! 😊`
            ];
            
            api.sendMessage(results.join('\n\n'), event.threadID);
        }, 45000);

    } catch (error) {
        console.error(error);
        api.sendMessage("❌ | An error occurred while processing the fight command. Please try again later.", event.threadID);
    }
};
