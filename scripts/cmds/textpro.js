const axios = global.nodemodule["axios"];
const fs = global.nodemodule["fs-extra"];

module.exports.config = {
    name: "textpro",
    version: "1.0",
    hasPermssion: 0,
    credits: "𝑨𝒔𝒊𝒇 𝑴𝒂𝒉𝒎𝒖𝒅",
    description: "𝙏𝙚𝙭𝙩𝙥𝙧𝙤 𝙡𝙤𝙜𝙤 𝙗𝙖𝙣𝙖𝙤 𝙖𝙥𝙣𝙖𝙧 𝙞𝙘𝙘𝙝𝙖𝙢𝙤𝙩𝙤",
    commandCategory: "𝙇𝙤𝙜𝙤-𝙏𝙤𝙤𝙡𝙨",
    usages: "textpro list [page] | textpro [logo] [text]",
    cooldowns: 10
};

module.exports.run = async function ({ api, event, args }) {
    const { threadID, messageID } = event;
    
    if (args.length < 1) {
        return api.sendMessage("❌ 𝙄𝙣𝙫𝙖𝙡𝙞𝙙 𝙘𝙤𝙢𝙢𝙖𝙣𝙙! 𝙐𝙨𝙚: .𝙩𝙚𝙭𝙩𝙥𝙧𝙤 𝙡𝙞𝙨𝙩 [𝙥𝙖𝙜𝙚] 𝙤𝙧 .𝙩𝙚𝙭𝙩𝙥𝙧𝙤 [𝙡𝙤𝙜𝙤] [𝙩𝙚𝙭𝙩]", threadID, messageID);
    }

    const command = args[0].toLowerCase();
    
    if (command === "list") {
        const page = parseInt(args[1]) || 1;
        switch (page) {
            case 1:
                return api.sendMessage(`📋 𝙇𝙤𝙜𝙤 𝙡𝙞𝙨𝙩 - 𝙋𝙖𝙜𝙚 1:\n
1. 𝙋𝙧𝙚𝙢𝙞𝙪𝙢-𝙠𝙞𝙣𝙜\n2. 𝙎𝙖𝙣𝙙\n3. 𝙎𝙠𝙮\n4. 𝙒𝙖𝙡𝙡𝙥𝙖𝙣𝙩\n5. 𝘽𝙚𝙖𝙘𝙝𝙫2\n6. 𝙋𝙖𝙞𝙣𝙩𝙞𝙣𝙜\n7. 𝘽𝙡𝙖𝙘𝙠-𝙢𝙚𝙩𝙖𝙡\n8. 𝙎𝙠𝙚𝙩𝙘𝙝\n9. 𝙂𝙡𝙞𝙩𝙘𝙝-𝙣𝙚𝙤𝙣\n10. 𝙒𝙖𝙧\n11. 𝙂𝙝𝙤𝙨𝙩-𝙜𝙧𝙚𝙚𝙣\n12. 𝘾𝙖𝙣𝙙𝙮𝙫2\n13. 𝘾𝙝𝙧𝙞𝙨𝙩𝙢𝙪𝙨𝙫2\n14. 𝙈𝙚𝙩𝙖𝙡𝙫2\n15. 𝙍𝙚𝙡𝙞𝙘𝙨\n16. 3𝘿-𝙙𝙧𝙖𝙜𝙤𝙣\n17. 𝙍𝙪𝙨𝙩-𝙢𝙚𝙩𝙖𝙡\n18. 𝙒𝙤𝙤𝙙𝙫2\n19. 𝘽𝙚𝙖𝙘𝙝𝙫3\n20. 𝙉𝙚𝙤𝙣-𝙡𝙤𝙫𝙚\n21. 𝙉𝙚𝙤𝙣-𝙝𝙚𝙖𝙧𝙩\n22. 𝘽𝙞𝙧𝙩𝙝𝙙𝙖𝙮\n23. 𝘿𝙤𝙩-𝙛𝙤𝙣𝙩\n24. 𝙀𝙞𝙙\n25. 𝙎𝙪𝙣𝙨𝙚𝙩\n\n✨ 𝙇𝙞𝙨𝙩 𝙢𝙖𝙙𝙚 𝙗𝙮 𝑨𝒔𝒊𝒇 𝑴𝒂𝒉𝒎𝒖𝒅 𝙪𝙨𝙞𝙣𝙜 𝙏𝙚𝙭𝙩𝙥𝙧𝙤 🌷`, threadID, messageID);
            case 2:
                return api.sendMessage(`📋 𝙇𝙤𝙜𝙤 𝙡𝙞𝙨𝙩 - 𝙋𝙖𝙜𝙚 2:\n
26. 𝙎𝙠𝙮𝙛𝙤𝙣𝙩\n27. 𝘽𝙡𝙪𝙞𝙨𝙝\n28. 𝘽𝙚𝙖𝙘𝙝𝙛𝙤𝙣𝙩\n29. 𝙂𝙝𝙤𝙨𝙩𝙛𝙤𝙣𝙩\n30. 𝙂𝙧𝙚𝙚𝙣𝙡𝙚𝙖𝙛\n31. 𝘽𝙡𝙖𝙘𝙠-𝙙𝙞𝙖𝙢𝙤𝙣𝙙\n32. 𝘽𝙡𝙖𝙘𝙠𝙥𝙞𝙣𝙠𝙫2\n33. 𝙍𝙖𝙞𝙣𝙗𝙤𝙬-𝙨𝙠𝙮\n34. 𝙍𝙞𝙣𝙜-𝙡𝙞𝙜𝙝𝙩\n35. 𝙂𝙤𝙡𝙙𝙚𝙣𝙫2\n36. 𝙎𝙥𝙖𝙧𝙠𝙡𝙚\n37. 𝙂𝙤𝙡𝙙𝙚𝙣\n38. 𝙉𝙚𝙬𝙥𝙪𝙧𝙥𝙡𝙚\n39. 𝙒𝙤𝙤𝙙\n40. 𝙂𝙤𝙡𝙙𝙫2\n41. 𝙒𝙤𝙤𝙙𝙫2\n42. 𝙈𝙖𝙧𝙗𝙡𝙚\n43. 𝘽𝙡𝙤𝙤𝙙𝙗𝙤𝙖𝙧𝙙\n44. 𝘿𝙧𝙪𝙜𝙨\n45. 𝘾𝙝𝙧𝙞𝙨𝙩𝙢𝙪𝙨\n46. 𝙁𝙤𝙤𝙜\n47. 𝙉𝙚𝙤𝙣-𝙧𝙖𝙞𝙣𝙗𝙤𝙬\n48. 𝙂𝙧𝙚𝙚𝙣-𝙡𝙚𝙖𝙨𝙚𝙧\n49. 𝙇𝙞𝙜𝙝𝙩𝙗𝙪𝙗𝙗𝙡𝙚\n\n✨ 𝙇𝙞𝙨𝙩 𝙢𝙖𝙙𝙚 𝙗𝙮 𝑨𝒔𝒊𝒇 𝑴𝒂𝒉𝒎𝒖𝒅 𝙪𝙨𝙞𝙣𝙜 𝙏𝙚𝙭𝙩𝙥𝙧𝙤 🌷`, threadID, messageID);
            case 3:
                return api.sendMessage(`📋 𝙇𝙤𝙜𝙤 𝙡𝙞𝙨𝙩 - 𝙋𝙖𝙜𝙚 3:\n
50. 𝙇𝙚𝙖𝙨𝙚𝙧-𝙣𝙚𝙤𝙣\n51. 3𝘿-𝙗𝙤𝙭\n52. 𝙏𝙝𝙪𝙣𝙙𝙚𝙧𝙫2\n53. 𝙁𝙞𝙨𝙝\n54. 𝙅𝙚𝙬𝙚𝙧𝙡𝙮\n55. 𝙅𝙚𝙬𝙚𝙧𝙡𝙮𝙫2\n56. 𝘽𝙡𝙪𝙚-𝙢𝙖𝙩\n57. 𝙎𝙩𝙤𝙣𝙚-𝙬𝙤𝙤𝙙\n58. 𝙅𝙤𝙠𝙚𝙧𝙡𝙤𝙜𝙤\n59. 𝙒𝙤𝙡𝙛𝙡𝙤𝙜𝙤\n60. 𝙋𝙧𝙚𝙢𝙞𝙪𝙢\n61. 𝙂𝙝𝙤𝙨𝙩-𝙩𝙝𝙚𝙢𝙚\n62. 𝙍𝙖𝙞𝙣𝙗𝙤𝙬-𝙠𝙞𝙣𝙜\n63. 𝙋𝙞𝙣𝙠-𝙠𝙞𝙣𝙜\n64. 2024𝙜𝙞𝙛\n65. 2024\n66. 𝙈𝙖𝙩-𝙣𝙚𝙤𝙣\n67. 𝘼𝙬𝙚𝙨𝙤𝙢𝙚\n68. 𝙄𝙘𝙚𝙫2\n69. 𝙋𝙖𝙞𝙣𝙩𝙞𝙣𝙜𝙫2\n\n✨ 𝙇𝙞𝙨𝙩 𝙢𝙖𝙙𝙚 𝙗𝙮 𝑨𝒔𝒊𝒇 𝑴𝒂𝒉𝒎𝒖𝒅 𝙪𝙨𝙞𝙣𝙜 𝙏𝙚𝙭𝙩𝙥𝙧𝙤 🌷`, threadID, messageID);
            default:
                return api.sendMessage("❌ 𝙄𝙣𝙫𝙖𝙡𝙞𝙙 𝙥𝙖𝙜𝙚! 𝙋𝙡𝙚𝙖𝙨𝙚 𝙪𝙨𝙚 1, 2 𝙤𝙧 3", threadID, messageID);
        }
    }

    const logoType = args[0];
    const text = args.slice(1).join(" ");

    if (!text) {
        return api.sendMessage("❌ 𝙋𝙡𝙚𝙖𝙨𝙚 𝙚𝙣𝙩𝙚𝙧 𝙩𝙚𝙭𝙩 𝙛𝙤𝙧 𝙩𝙝𝙚 𝙡𝙤𝙜𝙤", threadID, messageID);
    }

    api.sendMessage("🔄 𝙋𝙧𝙤𝙘𝙚𝙨𝙨𝙞𝙣𝙜 𝙮𝙤𝙪𝙧 𝙡𝙤𝙜𝙤, 𝙥𝙡𝙚𝙖𝙨𝙚 𝙬𝙖𝙞𝙩...", threadID, messageID);

    try {
        const logoUrls = {
            "premium-king": `https://priyanshu.apitextpro.repl.co/api/textpro?number=166&text=${text}`,
            "sand": `https://priyanshu.apitextpro.repl.co/api/textpro?number=5&text=${text}`,
            "sky": `https://priyanshu.apitextpro.repl.co/api/textpro?number=4&text=${text}`,
            "wallpant": `https://priyanshu.apitextpro.repl.co/api/textpro?number=161&text=${text}`,
            "beachv2": `https://priyanshu.apitextpro.repl.co/api/textpro?number=96&text=${text}`,
            "painting": `https://priyanshu.apitextpro.repl.co/api/textpro?number=95&text=${text}`,
            "black-metal": `https://priyanshu.apitextpro.repl.co/api/textpro?number=94&text=${text}`,
            "sketch": `https://priyanshu.apitextpro.repl.co/api/textpro?number=101&text=${text}`,
            "glitch-neon": `https://priyanshu.apitextpro.repl.co/api/textpro?number=154&text=${text}`,
            "war": `https://priyanshu.apitextpro.repl.co/api/textpro?number=110&text=${text}`,
            "ghost-green": `https://priyanshu.apitextpro.repl.co/api/textpro?number=111&text=${text}`,
            "candyv2": `https://priyanshu.apitextpro.repl.co/api/textpro?number=109&text=${text}`,
            "christmusv2": `https://priyanshu.apitextpro.repl.co/api/textpro?number=117&text=${text}`,
            "metalv2": `https://priyanshu.apitextpro.repl.co/api/textpro?number=105&text=${text}`,
            "relics": `https://priyanshu.apitextpro.repl.co/api/textpro?number=122&text=${text}`,
            "3d-dragon": `https://priyanshu.apitextpro.repl.co/api/textpro?number=192&text=${text}`,
            "rust-metal": `https://priyanshu.apitextpro.repl.co/api/textpro?number=205&text=${text}`,
            "woodv2": `https://priyanshu.apitextpro.repl.co/api/textpro?number=17&text=${text}`,
            "beachv3": `https://priyanshu.apitextpro.repl.co/api/textpro?number=201&text=${text}`,
            "neon-love": `https://priyanshu.apitextpro.repl.co/api/textpro?number=200&text=${text}`,
            "neon-heart": `https://priyanshu.apitextpro.repl.co/api/textpro?number=191&text=${text}`,
            "birthday": `https://priyanshu.apitextpro.repl.co/api/textpro?number=190&text=${text}`,
            "dot-font": `https://priyanshu.apitextpro.repl.co/api/textpro?number=189&text=${text}`,
            "eid": `https://priyanshu.apitextpro.repl.co/api/textpro?number=188&text=${text}`,
            "sunset": `https://priyanshu.apitextpro.repl.co/api/textpro?number=187&text=${text}`,
            "skyfont": `https://priyanshu.apitextpro.repl.co/api/textpro?number=183&text=${text}`,
            "bluish": `https://priyanshu.apitextpro.repl.co/api/textpro?number=182&text=${text}`,
            "beachfont": `https://priyanshu.apitextpro.repl.co/api/textpro?number=175&text=${text}`,
            "ghostfont": `https://priyanshu.apitextpro.repl.co/api/textpro?number=165&text=${text}`,
            "greenleaf": `https://priyanshu.apitextpro.repl.co/api/textpro?number=184&text=${text}`,
            "black-diamond": `https://priyanshu.apitextpro.repl.co/api/textpro?number=196&text=${text}`,
            "blackpinkv2": `https://priyanshu.apitextpro.repl.co/api/textpro?number=198&text=${text}`,
            "rainbow-sky": `https://priyanshu.apitextpro.repl.co/api/textpro?number=197&text=${text}`,
            "ring-light": `https://priyanshu.apitextpro.repl.co/api/textpro?number=204&text=${text}`,
            "goldenv2": `https://priyanshu.apitextpro.repl.co/api/textpro?number=194&text=${text}`,
            "sparkle": `https://priyanshu.apitextpro.repl.co/api/textpro?number=193&text=${text}`,
            "golden": `https://priyanshu.apitextpro.repl.co/api/textpro?number=8&text=${text}`,
            "newpurple": `https://priyanshu.apitextpro.repl.co/api/textpro?number=10&text=${text}`,
            "wood": `https://priyanshu.apitextpro.repl.co/api/textpro?number=16&text=${text}`,
            "goldv2": `https://priyanshu.apitextpro.repl.co/api/textpro?number=13&text=${text}`,
            "marble": `https://priyanshu.apitextpro.repl.co/api/textpro?number=22&text=${text}`,
            "bloodboard": `https://priyanshu.apitextpro.repl.co/api/textpro?number=21&text=${text}`,
            "drugs": `https://priyanshu.apitextpro.repl.co/api/textpro?number=27&text=${text}`,
            "christmus": `https://priyanshu.apitextpro.repl.co/api/textpro?number=26&text=${text}`,
            "foog": `https://priyanshu.apitextpro.repl.co/api/textpro?number=29&text=${text}`,
            "neon-rainbow": `https://priyanshu.apitextpro.repl.co/api/textpro?number=50&text=${text}`,
            "green-leaser": `https://priyanshu.apitextpro.repl.co/api/textpro?number=28&text=${text}`,
            "lightbubble": `https://priyanshu.apitextpro.repl.co/api/textpro?number=43&text=${text}`,
            "leaser-neon": `https://priyanshu.apitextpro.repl.co/api/textpro?number=32&text=${text}`,
            "3d-box": `https://priyanshu.apitextpro.repl.co/api/textpro?number=33&text=${text}`,
            "thunderv2": `https://priyanshu.apitextpro.repl.co/api/textpro?number=34&text=${text}`,
            "fish": `https://priyanshu.apitextpro.repl.co/api/textpro?number=39&text=${text}`,
            "jewerly": `https://priyanshu.apitextpro.repl.co/api/textpro?number=44&text=${text}`,
            "jewerlyv2": `https://priyanshu.apitextpro.repl.co/api/textpro?number=45&text=${text}`,
            "blue-mat": `https://priyanshu.apitextpro.repl.co/api/textpro?number=54&text=${text}`,
            "stone-wood": `https://priyanshu.apitextpro.repl.co/api/textpro?number=58&text=${text}`,
            "jokerlogo": `https://priyanshu.apitextpro.repl.co/api/textpro?number=67&text=${text}`,
            "wolflogo": `https://priyanshu.apitextpro.repl.co/api/textpro?number=66&text=${text}`,
            "premium": `https://priyanshu.apitextpro.repl.co/api/textpro?number=70&text=${text}`,
            "ghost-theme": `https://priyanshu.apitextpro.repl.co/api/textpro?number=71&text=${text}`,
            "rainbow-king": `https://priyanshu.apitextpro.repl.co/api/textpro?number=68&text=${text}`,
            "pink-king": `https://priyanshu.apitextpro.repl.co/api/textpro?number=76&text=${text}`,
            "2024gif": `https://priyanshu.apitextpro.repl.co/api/textpro?number=78&text=${text}`,
            "2024": `https://priyanshu.apitextpro.repl.co/api/textpro?number=79&text=${text}`,
            "mat-neon": `https://priyanshu.apitextpro.repl.co/api/textpro?number=80&text=${text}`,
            "awesome": `https://priyanshu.apitextpro.repl.co/api/textpro?number=85&text=${text}`,
            "icev2": `https://priyanshu.apitextpro.repl.co/api/textpro?number=89&text=${text}`,
            "paintingv2": `https://priyanshu.apitextpro.repl.co/api/textpro?number=93&text=${text}`,
            "neon-pink": `https://priyanshu.apitextpro.repl.co/api/textpro?number=91&text=${text}`,
            "neonv2": `https://priyanshu.apitextpro.repl.co/api/textpro?number=100&text=${text}`,
            "thunder": `https://priyanshu.apitextpro.repl.co/api/textpro?number=97&text=${text}`,
            "strawberryv2": `https://priyanshu.apitextpro.repl.co/api/textpro?number=98&text=${text}`,
            "blackpink": `https://priyanshu.apitextpro.repl.co/api/textpro?number=84&text=${text}`,
            "font": `https://priyanshu.apitextpro.repl.co/api/textpro?number=87&text=${text}`,
            "pinkcandy": `https://priyanshu.apitextpro.repl.co/api/textpro?number=108&text=${text}`,
            "gold-font": `https://priyanshu.apitextpro.repl.co/api/textpro?number=106&text=${text}`,
            "silver": `https://priyanshu.apitextpro.repl.co/api/textpro?number=61&text=${text}`,
            "purple": `https://priyanshu.apitextpro.repl.co/api/textpro?number=59&text=${text}`,
            "strawberry": `https://priyanshu.apitextpro.repl.co/api/textpro?number=68&text=${text}`,
            "rainbow-drop": `https://priyanshu.apitextpro.repl.co/api/textpro?number=206&text=${text}`,
            "rainbow-box": `https://priyanshu.apitextpro.repl.co/api/textpro?number=47&text=${text}`,
            "purple-shiny": `https://priyanshu.apitextpro.repl.co/api/textpro?number=207&text=${text}`,
            "agni": `https://priyanshu.apitextpro.repl.co/api/textpro?number=42&text=${text}`,
            "green-diamond": `https://priyanshu.apitextpro.repl.co/api/textpro?number=20&text=${text}`,
            "bronze": `https://priyanshu.apitextpro.repl.co/api/textpro?number=116&text=${text}`,
            "balloon": `https://priyanshu.apitextpro.repl.co/api/textpro?number=121&text=${text}`,
            "ballonv2": `https://priyanshu.apitextpro.repl.co/api/textpro?number=202&text=${text}`,
            "unknown": `https://priyanshu.apitextpro.repl.co/api/textpro?number=168&text=${text}`,
            "ring": `https://priyanshu.apitextpro.repl.co/api/textpro?number=204&text=${text}`,
            "pinkv4": `https://priyanshu.apitextpro.repl.co/api/textpro?number=184&text=${text}`
        };

        const logoUrl = logoUrls[logoType];
        if (!logoUrl) {
            return api.sendMessage("❌ 𝙄𝙣𝙫𝙖𝙡𝙞𝙙 𝙡𝙤𝙜𝙤 𝙩𝙮𝙥𝙚! 𝙐𝙨𝙚 .𝙩𝙚𝙭𝙩𝙥𝙧𝙤 𝙡𝙞𝙨𝙩 𝙩𝙤 𝙨𝙚𝙚 𝙖𝙫𝙖𝙞𝙡𝙖𝙗𝙡𝙚 𝙡𝙤𝙜𝙤𝙨", threadID, messageID);
        }

        const response = await axios.get(logoUrl, { responseType: "arraybuffer" });
        const imageData = response.data;
        const path = __dirname + `/cache/${logoType}_${text}.png`;
        fs.writeFileSync(path, Buffer.from(imageData, "binary"));
        
        api.sendMessage({
            body: `✨ 𝙔𝙤𝙪𝙧 ${logoType} 𝙡𝙤𝙜𝙤 𝙘𝙧𝙚𝙖𝙩𝙚𝙙 𝙗𝙮 𝑨𝒔𝒊𝒇 𝑴𝒂𝒉𝒎𝒖𝒅\n\n𝙏𝙮𝙥𝙚: ${logoType}\n𝙏𝙚𝙭𝙩: ${text}`,
            attachment: fs.createReadStream(path)
        }, threadID, () => fs.unlinkSync(path), messageID);

    } catch (error) {
        console.error(error);
        return api.sendMessage("❌ 𝙇𝙤𝙜𝙤 𝙘𝙧𝙚𝙖𝙩𝙞𝙤𝙣 𝙛𝙖𝙞𝙡𝙚𝙙! 𝙋𝙡𝙚𝙖𝙨𝙚 𝙩𝙧𝙮 𝙖𝙜𝙖𝙞𝙣 𝙡𝙖𝙩𝙚𝙧.", threadID, messageID);
    }
};
