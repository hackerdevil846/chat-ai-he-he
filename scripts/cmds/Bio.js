module.exports.config = {
    name: "bio",
    version: "1.0.0",
    hasPermssion: 2,
    credits: "𝑨𝒔𝒊𝒇 𝑴𝒂𝒉𝒎𝒖𝒅",
    description: "🤖 Bot-er bio poribartan kore",
    commandCategory: "admin",
    usages: "bio [text]",
    cooldowns: 5,
    dependencies: {}
};

module.exports.languages = {
    en: {
        enterText: "❗ Please enter the new bio text.",
        error: "⚠️ Error occurred: %1",
        success: "✅ Bot-er bio successfully changed to:\n%1"
    },
    bn: {
        enterText: "❗ Notun bio text den.",
        error: "⚠️ Somossa ghoteche: %1",
        success: "✅ Bot-er bio saphollo sathe poriborton kora hoyeche:\n%1"
    }
};

module.exports.run = async function ({ api, event, args }) {
    try {
        const newBio = args.join(" ");
        if (!newBio) return api.sendMessage(module.exports.languages.en.enterText, event.threadID);

        api.changeBio(newBio, (error) => {
            if (error) return api.sendMessage(module.exports.languages.en.error.replace('%1', error.message), event.threadID);

            api.sendMessage(module.exports.languages.en.success.replace('%1', newBio), event.threadID);
        });
    } catch (err) {
        console.error(err);
        api.sendMessage(`⚠️ Unexpected error: ${err.message}`, event.threadID);
    }
};
