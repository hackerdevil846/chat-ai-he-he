const fs = require("fs-extra");
const axios = require("axios");
const path = require("path");

const config = {
  name: "menu",
  version: "1.0.0",
  hasPermssion: 0,
  credits: "Asif",
  description: "Display command menu with pagination",
  category: "system",
  usages: "menu [page] or menu -all [page]",
  cooldowns: 5,
  dependencies: {
    "axios": "",
    "fs-extra": ""
  }
};

// All GIF links included in the code
const gifLinks = [
  "https://i.imgur.com/zoQxUwC.gif",
  "https://i.imgur.com/bXVBasN.gif",
  "https://i.imgur.com/E3bMZMM.gif",
  "https://i.imgur.com/pkchwDe.gif",
  "https://i.imgur.com/PFV6etU.gif",
  "https://i.imgur.com/DLElS0y.gif",
  "https://i.imgur.com/6hufzML.gif",
  "https://i.imgur.com/ikevA6M.gif",
  "https://i.imgur.com/aGuU2tB.gif",
  "https://i.imgur.com/tsUsL6B.gif",
  "https://i.imgur.com/sAUL2X0.gif",
  "https://i.imgur.com/fGSX9z3.gif",
  "https://i.imgur.com/TeT8dXA.gif",
  "https://i.imgur.com/kCnHvly.gif",
  "https://i.imgur.com/wfB1cU7.gif",
  "https://i.imgur.com/dmUAjtN.gif",
  "https://i.imgur.com/RqaTxa4.gif",
  "https://i.imgur.com/gXFNJGi.gif",
  "https://i.imgur.com/DwDTSsS.gif",
  "https://i.imgur.com/BSreuve.gif",
  "https://i.imgur.com/B6TOC4a.gif",
  "https://i.imgur.com/S83pmyW.gif",
  "https://i.imgur.com/7FNPBkX.gif",
  "https://i.imgur.com/SIdbUrD.gif",
  "https://i.imgur.com/ErngTHc.gif",
  "https://i.imgur.com/onfBoPC.gif",
  "https://i.imgur.com/UVk3zcd.gif",
  "https://i.imgur.com/3aOuDZ9.gif",
  "https://i.imgur.com/OHfqttV.gif",
  "https://i.imgur.com/aiNRtVF.gif",
  "https://i.imgur.com/rgPnYTJ.gif",
  "https://i.imgur.com/YOVZBYH.gif",
  "https://i.imgur.com/aiFNcBf.gif",
  "https://i.imgur.com/FbI0kGj.gif",
  "https://i.imgur.com/QOMUwDy.gif",
  "https://i.imgur.com/UP8wysc.gif",
  "https://i.imgur.com/seb2NbZ.gif",
  "https://i.imgur.com/YdcVmTe.gif",
  "https://i.imgur.com/WjkPmwu.gif",
  "https://i.imgur.com/z7ZeFky.gif",
  "https://i.imgur.com/H8YGlIn.gif",
  "https://i.imgur.com/gjCymKq.gif",
  "https://i.imgur.com/4XiF5dQ.gif",
  "https://i.imgur.com/Nd5nrJW.gif",
  "https://i.imgur.com/C4f0pdf.gif",
  "https://i.imgur.com/EO0YsOT.gif",
  "https://i.imgur.com/dKEAsb9.gif",
  "https://i.imgur.com/7zfnhkO.gif",
  "https://i.imgur.com/LrOjwMX.gif",
  "https://i.imgur.com/7wAImE3.gif",
  "https://i.imgur.com/D8Kzo1X.gif",
  "https://i.imgur.com/VTXRcYo.gif",
  "https://i.imgur.com/BcjRdU8.gif",
  "https://i.imgur.com/hNb9WCk.gif",
  "https://i.imgur.com/8GM1pn9.gif",
  "https://i.imgur.com/SHiXJ0G.gif",
  "https://i.imgur.com/0qCoPhR.gif",
  "https://i.imgur.com/IhRr8Gx.gif",
  "https://i.imgur.com/eAqbfri.gif",
  "https://i.imgur.com/Q6m1EEm.gif",
  "https://i.imgur.com/SzzeFeV.gif",
  "https://i.imgur.com/ZfnJQHj.gif",
  "https://i.imgur.com/puwolKD.gif",
  "https://i.imgur.com/FQklA6q.gif",
  "https://i.imgur.com/SwLufsH.gif",
  "https://i.imgur.com/SmOYXY5.gif",
  "https://i.imgur.com/7w3hmYF.gif",
  "https://i.imgur.com/TmfIRv5.gif",
  "https://i.imgur.com/aBwvOal.gif",
  "https://i.imgur.com/eGIF9B1.gif",
  "https://i.imgur.com/hjmok8Q.gif",
  "https://i.imgur.com/RrPuRfT.gif",
  "https://i.imgur.com/UzkdFiS.gif",
  "https://i.imgur.com/Mn9GMDf.gif",
  "https://i.imgur.com/OPZ9857.gif",
  "https://i.imgur.com/ZsHL2Y2.gif",
  "https://i.imgur.com/MIG763l.gif",
  "https://i.imgur.com/1Zr3rcS.gif",
  "https://i.imgur.com/flMpukD.gif",
  "https://i.imgur.com/u1YieFf.gif",
  "https://i.imgur.com/nGG1Rq3.gif",
  "https://i.imgur.com/tbXQXmA.gif",
  "https://i.imgur.com/2s6oXka.gif",
  "https://i.imgur.com/KrAQO5Z.gif",
  "https://i.imgur.com/oCeGlm4.gif",
  "https://i.imgur.com/m7dBh5G.gif",
  "https://i.imgur.com/gvOK3Rk.gif",
  "https://i.imgur.com/MwvLw2x.gif",
  "https://i.imgur.com/WnuiI8E.gif",
  "https://i.imgur.com/7mwcaYl.gif",
  "https://i.imgur.com/PwSkA3b.gif",
  "https://i.imgur.com/lGUiOWJ.gif",
  "https://i.imgur.com/6tILjzR.gif",
  "https://i.imgur.com/s2k6F7b.gif",
  "https://i.imgur.com/U8snOes.gif",
  "https://i.imgur.com/BEpH4tL.gif",
  "https://i.imgur.com/LYW6vCV.gif",
  "https://i.imgur.com/uL4vzUm.gif",
  "https://i.imgur.com/nfaJSc8.gif",
  "https://i.imgur.com/2VVnQdy.gif",
  "https://i.imgur.com/PiEEsSU.gif",
  "https://i.imgur.com/VaKdGyK.gif",
  "https://i.imgur.com/DBBCMT5.gif",
  "https://i.imgur.com/9SzyANt.gif",
  "https://i.imgur.com/8wvo2rv.gif",
  "https://i.imgur.com/CZ3u4pG.gif",
  "https://i.imgur.com/rDXCZ7T.gif",
  "https://i.imgur.com/k7hFQDI.gif",
  "https://i.imgur.com/ZUbdLcH.gif",
  "https://i.imgur.com/4B6q7qo.gif",
  "https://i.imgur.com/uns90FG.gif",
  "https://i.imgur.com/BUo8Gip.gif",
  "https://i.imgur.com/OEjUJpt.gif",
  "https://i.imgur.com/0EMIF5N.gif",
  "https://i.imgur.com/pfClCuw.gif",
  "https://i.imgur.com/B3xmc6u.gif",
  "https://i.imgur.com/r3k76o1.gif",
  "https://i.imgur.com/rF7elZ9.gif",
  "https://i.imgur.com/sUCiNka.gif",
  "https://i.imgur.com/H4txTF9.gif",
  "https://i.imgur.com/XJYsBGt.gif",
  "https://i.imgur.com/VhUKFn6.gif",
  "https://i.imgur.com/4NMv9DQ.gif",
  "https://i.imgur.com/BF7REhe.gif",
  "https://i.imgur.com/vXJ177V.gif",
  "https://i.imgur.com/rpLbigJ.gif",
  "https://i.imgur.com/kTH9hI0.gif",
  "https://i.imgur.com/qdFVoSy.gif",
  "https://i.imgur.com/otrQpMc.gif",
  "https://i.imgur.com/D3WqpgT.gif",
  "https://i.imgur.com/MW0N2it.gif",
  "https://i.imgur.com/GwbXEte.gif",
  "https://i.imgur.com/9JR6W3w.gif",
  "https://i.imgur.com/YgIPVwa.gif",
  "https://i.imgur.com/czv7Fz5.gif",
  "https://i.imgur.com/Zw9KZBd.gif",
  "https://i.imgur.com/BDVgpWb.gif",
  "https://i.imgur.com/0y9UHo3.gif",
  "https://i.imgur.com/o13FtAd.gif",
  "https://i.imgur.com/caEX9gQ.gif",
  "https://i.imgur.com/5HUayMT.gif",
  "https://i.imgur.com/mfA3aZm.gif",
  "https://i.imgur.com/fvZlGx4.gif",
  "https://i.imgur.com/9X7xHrc.gif",
  "https://i.imgur.com/fhC0uQO.gif",
  "https://i.imgur.com/k0kgL6g.gif",
  "https://i.imgur.com/tKJbKC3.gif",
  "https://i.imgur.com/XAG9XXY.gif",
  "https://i.imgur.com/WOITKH9.gif",
  "https://i.imgur.com/AlSxfCU.gif",
  "https://i.imgur.com/dcldScy.gif",
  "https://i.imgur.com/CGvFkMn.gif",
  "https://i.imgur.com/pXC6YUo.gif",
  "https://i.imgur.com/loz0CDt.gif",
  "https://i.imgur.com/XWbFJ67.gif",
  "https://i.imgur.com/bpzaZda.gif",
  "https://i.imgur.com/QRoyoSB.gif",
  "https://i.imgur.com/VwbnHjt.gif",
  "https://i.imgur.com/4CCcn4w.gif",
  "https://i.imgur.com/TWnfUPu.gif",
  "https://i.imgur.com/jL9zgtp.gif",
  "https://i.imgur.com/6Hh2eap.gif",
  "https://i.imgur.com/EHD734u.gif",
  "https://i.imgur.com/uC2YI3l.gif",
  "https://i.imgur.com/zCP4AzS.gif",
  "https://i.imgur.com/bovYCdz.gif",
  "https://i.imgur.com/2lO8cZg.gif",
  "https://i.imgur.com/ehEVYQK.gif",
  "https://i.imgur.com/IzhVUTo.gif",
  "https://i.imgur.com/nViB6oJ.gif",
  "https://i.imgur.com/6YzpZyq.gif",
  "https://i.imgur.com/9bwh3qa.gif",
  "https://i.imgur.com/oTy9Ylw.gif",
  "https://i.imgur.com/jHzuUKA.gif",
  "https://i.imgur.com/8Y8NrSw.gif",
  "https://i.imgur.com/OTH5p7Z.gif",
  "https://i.imgur.com/Yyb0sdO.gif",
  "https://i.imgur.com/hA7p8M3.gif",
  "https://i.imgur.com/LbwoVjX.gif",
  "https://i.imgur.com/z9X2gPw.gif",
  "https://i.imgur.com/XzyO1x6.gif",
  "https://i.imgur.com/9VLIeHE.gif",
  "https://i.imgur.com/bSAggk1.gif",
  "https://i.imgur.com/PtiAaHm.gif",
  "https://i.imgur.com/VvD1BO7.gif",
  "https://i.imgur.com/99QmViE.gif",
  "https://i.imgur.com/HAHOYFm.gif",
  "https://i.imgur.com/Gw33heq.gif",
  "https://i.imgur.com/Oc5v81n.gif",
  "https://i.imgur.com/IQLPXsn.gif",
  "https://i.imgur.com/b8KE45g.gif",
  "https://i.imgur.com/3Adx4WN.gif",
  "https://i.imgur.com/N0BCsl7.gif",
  "https://i.imgur.com/VFRn575.gif",
  "https://i.imgur.com/GJbWcCy.gif",
  "https://i.imgur.com/YbWXwDd.gif",
  "https://i.imgur.com/BIaJ0rP.gif"
];

async function run({ api, event, args }) {
  try {
    const { threadID, messageID } = event;
    const { commands } = global.client;
    const threadData = global.data.threadData.get(parseInt(threadID)) || {};
    const PREFIX = threadData.PREFIX || global.config.PREFIX;
    
    // Select random GIF
    const randomGif = gifLinks[Math.floor(Math.random() * gifLinks.length)];
    
    // Create cache directory if not exists
    const cacheDir = path.join(__dirname, 'cache');
    if (!fs.existsSync(cacheDir)) {
      fs.mkdirSync(cacheDir);
    }
    
    // Download GIF with unique filename
    const gifPath = path.join(cacheDir, `menu_${Date.now()}.gif`);
    const response = await axios.get(randomGif, { responseType: 'arraybuffer' });
    await fs.writeFile(gifPath, Buffer.from(response.data, 'binary'));

    // Organize commands by category
    const commandGroups = new Map();
    
    for (const [name, cmd] of commands) {
      const category = cmd.config.category?.toLowerCase() || 'uncategorized';
      if (!commandGroups.has(category)) {
        commandGroups.set(category, []);
      }
      commandGroups.get(category).push(name);
    }
    
    // Convert to array for pagination
    const groupsArray = Array.from(commandGroups, ([group, cmds]) => ({ group, cmds }));
    
    // Handle menu modes
    let page = 1;
    const isAllMode = args[0] === "-all" || args[0] === "-a";
    const pageArgIndex = isAllMode ? 1 : 0;
    
    if (args[pageArgIndex]) {
      page = parseInt(args[pageArgIndex]);
      if (isNaN(page) || page < 1) page = 1;
    }
    
    if (isAllMode) {
      const allCmdNames = Array.from(commands.keys());
      const totalPages = Math.ceil(allCmdNames.length / 10);
      page = Math.min(page, totalPages);
      return sendAllCommandsMenu(allCmdNames, totalPages);
    }
    
    const totalPages = Math.ceil(groupsArray.length / 10);
    page = Math.min(page, totalPages);
    return sendCategorizedMenu(groupsArray, totalPages);
    
    // Helper functions
    async function sendCategorizedMenu(groups, total) {
      const startIdx = (page - 1) * 10;
      const pageGroups = groups.slice(startIdx, startIdx + 10);
      
      let menuText = `╭─────── ✦ MENU ✦ ───────╮\n`;
      menuText += `│ 📄 Page: ${page}/${total}\n\n`;
      menuText += `╭─── ✦ CATEGORIES ✦ ───╮\n`;
      
      pageGroups.forEach((group, idx) => {
        menuText += `│ ${startIdx + idx + 1}. ${group.group.toUpperCase()}\n`;
      });
      
      menuText += `╰───────────────────────╯\n\n`;
      menuText += `» Use "${PREFIX}menu [page]" to view commands\n`;
      menuText += `» Use "${PREFIX}menu -all" to view all commands`;
      menuText += `\n╰───────────────────────╯`;
      
      const attachment = fs.createReadStream(gifPath);
      
      api.sendMessage({
        body: menuText,
        attachment: attachment
      }, threadID, (err, info) => {
        // Clean up GIF file after sending
        fs.unlink(gifPath, () => {});
        if (err) return console.error(err);
        
        // Setup reply handler
        global.client.handleReply.push({
          type: "categorized",
          name: config.name,
          messageID: info.messageID,
          content: groups,
          startIdx: startIdx
        });
      }, messageID);
    }
    
    async function sendAllCommandsMenu(allCmds, total) {
      const startIdx = (page - 1) * 10;
      const pageCommands = allCmds.slice(startIdx, startIdx + 10);
      
      let menuText = `╭─────── ✦ MENU ✦ ───────╮\n`;
      menuText += `│ 📄 Page: ${page}/${total}\n\n`;
      menuText += `╭─── ✦ ALL COMMANDS ✦ ───╮\n`;
      
      pageCommands.forEach((cmdName, idx) => {
        const cmd = commands.get(cmdName);
        menuText += `│ ${startIdx + idx + 1}. ${cmdName}: ${cmd.config.description}\n`;
      });
      
      menuText += `╰───────────────────────╯\n\n`;
      menuText += `» Use "${PREFIX}menu -all [page]" for more`;
      menuText += `\n╰───────────────────────╯`;
      
      const attachment = fs.createReadStream(gifPath);
      
      api.sendMessage({
        body: menuText,
        attachment: attachment
      }, threadID, (err, info) => {
        // Clean up GIF file after sending
        fs.unlink(gifPath, () => {});
        if (err) return console.error(err);
        
        // Setup reply handler
        global.client.handleReply.push({
          type: "all",
          name: config.name,
          messageID: info.messageID,
          content: allCmds,
          startIdx: startIdx
        });
      }, messageID);
    }
  } catch (error) {
    console.error('Menu command error:', error);
    api.sendMessage('❌ An error occurred while generating the menu. Please try again later!', threadID, messageID);
  }
}

function onReply({ api, event, handleReply }) {
  try {
    const { threadID, messageID } = event;
    const args = event.body.trim().split(/\s+/);
    
    if (!args[0]) return;
    
    let page = parseInt(args[0]);
    if (isNaN(page)) {
      return api.sendMessage('❌ Please enter a valid page number!', threadID, messageID);
    }
    
    const { content, type } = handleReply;
    const threadData = global.data.threadData.get(parseInt(threadID)) || {};
    const PREFIX = threadData.PREFIX || global.config.PREFIX;
    const commands = global.client.commands;
    
    if (type === "categorized") {
      const totalPages = Math.ceil(content.length / 10);
      page = Math.max(1, Math.min(page, totalPages));
      
      const startIdx = (page - 1) * 10;
      const pageGroups = content.slice(startIdx, startIdx + 10);
      
      let menuText = `╭─────── ✦ MENU ✦ ───────╮\n`;
      menuText += `│ 📄 Page: ${page}/${totalPages}\n\n`;
      menuText += `╭─── ✦ CATEGORIES ✦ ───╮\n`;
      
      pageGroups.forEach((group, idx) => {
        menuText += `│ ${startIdx + idx + 1}. ${group.group.toUpperCase()}\n`;
      });
      
      menuText += `╰───────────────────────╯\n\n`;
      menuText += `» Use "${PREFIX}menu [page]" to continue`;
      menuText += `\n╰───────────────────────╯`;
      
      api.sendMessage(menuText, threadID, messageID);
    } 
    else if (type === "all") {
      const totalPages = Math.ceil(content.length / 10);
      page = Math.max(1, Math.min(page, totalPages));
      
      const startIdx = (page - 1) * 10;
      const pageCommands = content.slice(startIdx, startIdx + 10);
      
      let menuText = `╭─────── ✦ MENU ✦ ───────╮\n`;
      menuText += `│ 📄 Page: ${page}/${totalPages}\n\n`;
      menuText += `╭─── ✦ ALL COMMANDS ✦ ───╮\n`;
      
      pageCommands.forEach((cmdName, idx) => {
        const cmd = commands.get(cmdName);
        menuText += `│ ${startIdx + idx + 1}. ${cmdName}: ${cmd.config.description}\n`;
      });
      
      menuText += `╰───────────────────────╯\n\n`;
      menuText += `» Use "${PREFIX}menu -all [page]" to continue`;
      menuText += `\n╰───────────────────────╯`;
      
      api.sendMessage(menuText, threadID, messageID);
    }
  } catch (error) {
    console.error('Menu reply error:', error);
    api.sendMessage('❌ An error occurred while processing your request. Please try again!', event.threadID, event.messageID);
  }
}

// Add empty onStart to prevent initialization errors
function onStart() {}

module.exports = { 
  config,
  run,
  onReply,
  onStart
};
