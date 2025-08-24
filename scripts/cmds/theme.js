module.exports.config = {
  name: "theme",
  version: "2.1.0",
  hasPermssion: 0,
  credits: "𝑨𝒔𝒊𝒇 𝑴𝒂𝒉𝒎𝒖𝒅",
  description: "Change Messenger thread color using available theme list",
  category: "system",
  usages: "[theme]",
  cooldowns: 5,
  dependencies: {},
  envConfig: {}
};

module.exports.languages = {
  "en": {
    "themeList": "Available themes: default, hotpink, aquablue, brightpurple, coralpink, orange, green, lavenderpurple, red, yellow, tealblue, aqua, mango, berry, citrus",
    "noTheme": "⚠️ Please enter a theme name. Use `{pn} help` to see available themes.",
    "invalidTheme": "❌ Invalid theme. Available themes: \n{themeList}",
    "themeChanged": "✅ Theme changed to: {themeName}",
    "themeChangeFailed": "❌ Failed to change theme. Please try again."
  }
};

module.exports.onStart = async function ({ api, args, event, getText }) {
  const colorMap = {
    default: "196241301102133",
    hotpink: "169463077092846",
    aquablue: "2442142322678320",
    brightpurple: "234137870477637",
    coralpink: "980963458735625",
    orange: "175615189761153",
    green: "2136751179887052",
    lavenderpurple: "2058653964378557",
    red: "2129984390566328",
    yellow: "174636906462322",
    tealblue: "1928399724138152",
    aqua: "417639218648241",
    mango: "930060997172551",
    berry: "164535220883264",
    citrus: "370940413392601"
  };

  const themeName = args.join(" ").toLowerCase();
  const { threadID, messageID } = event;

  if (!themeName) {
    return api.sendMessage(getText("noTheme"), threadID, messageID);
  }

  if (!colorMap.hasOwnProperty(themeName)) {
    return api.sendMessage(
      getText("invalidTheme", { themeList: Object.keys(colorMap).join(", ") }),
      threadID,
      messageID
    );
  }

  const colorID = colorMap[themeName];

  api.changeThreadColor(colorID, threadID, (err) => {
    if (err) {
      return api.sendMessage(getText("themeChangeFailed"), threadID, messageID);
    }
    return api.sendMessage(getText("themeChanged", { themeName }), threadID, messageID);
  });
};
