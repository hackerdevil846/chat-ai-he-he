module.exports.config = {
  name: "meme",
  version: "1.0.0",
  hasPermssion: 0,
  credits: "Asif",
  description: "Random meme images",
  category: "image",
  usages: "meme",
  cooldowns: 5,
  dependencies: {
    "axios": "",
    "fs-extra": ""
  }
};

// Added initialization function to fix startup error
module.exports.onStart = async function() {};

module.exports.run = async ({ api, event }) => {
  const axios = global.nodemodule["axios"];
  const fs = global.nodemodule["fs-extra"];
  
  const memeLinks = [
    "https://i.imgur.com/zoQxUwC.jpg", "https://i.imgur.com/bXVBasN.jpg", "https://i.imgur.com/E3bMZMM.jpg", 
    "https://i.imgur.com/pkchwDe.jpg", "https://i.imgur.com/PFV6etU.jpg", "https://i.imgur.com/DLElS0y.jpg", 
    "https://i.imgur.com/6hufzML.jpg", "https://i.imgur.com/ikevA6M.jpg", "https://i.imgur.com/aGuU2tB.jpg", 
    "https://i.imgur.com/tsUsL6B.jpg", "https://i.imgur.com/sAUL2X0.jpg", "https://i.imgur.com/fGSX9z3.jpg", 
    "https://i.imgur.com/TeT8dXA.jpg", "https://i.imgur.com/kCnHvly.jpg", "https://i.imgur.com/wfB1cU7.jpg", 
    "https://i.imgur.com/dmUAjtN.jpg", "https://i.imgur.com/RqaTxa4.jpg", "https://i.imgur.com/gXFNJGi.jpg", 
    "https://i.imgur.com/DwDTSsS.jpg", "https://i.imgur.com/BSreuve.jpg", "https://i.imgur.com/B6TOC4a.jpg", 
    "https://i.imgur.com/S83pmyW.jpg", "https://i.imgur.com/7FNPBkX.jpg", "https://i.imgur.com/SIdbUrD.jpg", 
    "https://i.imgur.com/ErngTHc.jpg", "https://i.imgur.com/onfBoPC.jpg", "https://i.imgur.com/UVk3zcd.jpg", 
    "https://i.imgur.com/3aOuDZ9.jpg", "https://i.imgur.com/OHfqttV.jpg", "https://i.imgur.com/aiNRtVF.jpg", 
    "https://i.imgur.com/rgPnYTJ.jpg", "https://i.imgur.com/YOVZBYH.jpg", "https://i.imgur.com/aiFNcBf.jpg", 
    "https://i.imgur.com/FbI0kGj.jpg", "https://i.imgur.com/QOMUwDy.jpg", "https://i.imgur.com/UP8wysc.jpg", 
    "https://i.imgur.com/seb2NbZ.jpg", "https://i.imgur.com/YdcVmTe.jpg", "https://i.imgur.com/WjkPmwu.jpg", 
    "https://i.imgur.com/z7ZeFky.jpg", "https://i.imgur.com/H8YGlIn.jpg", "https://i.imgur.com/gjCymKq.jpg", 
    "https://i.imgur.com/4XiF5dQ.jpg", "https://i.imgur.com/Nd5nrJW.jpg", "https://i.imgur.com/C4f0pdf.jpg", 
    "https://i.imgur.com/EO0YsOT.jpg", "https://i.imgur.com/dKEAsb9.jpg", "https://i.imgur.com/7zfnhkO.jpg", 
    "https://i.imgur.com/LrOjwMX.jpg", "https://i.imgur.com/7wAImE3.jpg", "https://i.imgur.com/D8Kzo1X.jpg", 
    "https://i.imgur.com/VTXRcYo.jpg", "https://i.imgur.com/BcjRdU8.jpg", "https://i.imgur.com/hNb9WCk.jpg", 
    "https://i.imgur.com/8GM1pn9.jpg", "https://i.imgur.com/SHiXJ0G.jpg", "https://i.imgur.com/0qCoPhR.jpg", 
    "https://i.imgur.com/IhRr8Gx.jpg", "https://i.imgur.com/eAqbfri.jpg", "https://i.imgur.com/Q6m1EEm.jpg", 
    "https://i.imgur.com/SzzeFeV.jpg", "https://i.imgur.com/ZfnJQHj.jpg", "https://i.imgur.com/puwolKD.jpg", 
    "https://i.imgur.com/FQklA6q.jpg", "https://i.imgur.com/SwLufsH.jpg", "https://i.imgur.com/SmOYXY5.jpg", 
    "https://i.imgur.com/7w3hmYF.jpg", "https://i.imgur.com/TmfIRv5.jpg", "https://i.imgur.com/aBwvOal.jpg", 
    "https://i.imgur.com/eGIF9B1.jpg", "https://i.imgur.com/hjmok8Q.jpg", "https://i.imgur.com/RrPuRfT.jpg", 
    "https://i.imgur.com/UzkdFiS.jpg", "https://i.imgur.com/Mn9GMDf.jpg", "https://i.imgur.com/OPZ9857.jpg", 
    "https://i.imgur.com/ZsHL2Y2.jpg", "https://i.imgur.com/MIG763l.jpg", "https://i.imgur.com/1Zr3rcS.jpg", 
    "https://i.imgur.com/flMpukD.jpg", "https://i.imgur.com/u1YieFf.jpg", "https://i.imgur.com/nGG1Rq3.jpg", 
    "https://i.imgur.com/tbXQXmA.jpg", "https://i.imgur.com/2s6oXka.jpg", "https://i.imgur.com/KrAQO5Z.jpg", 
    "https://i.imgur.com/oCeGlm4.jpg", "https://i.imgur.com/m7dBh5G.jpg", "https://i.imgur.com/gvOK3Rk.jpg", 
    "https://i.imgur.com/MwvLw2x.jpg", "https://i.imgur.com/WnuiI8E.jpg", "https://i.imgur.com/7mwcaYl.jpg", 
    "https://i.imgur.com/PwSkA3b.jpg", "https://i.imgur.com/lGUiOWJ.jpg", "https://i.imgur.com/6tILjzR.jpg", 
    "https://i.imgur.com/s2k6F7b.jpg", "https://i.imgur.com/U8snOes.jpg", "https://i.imgur.com/BEpH4tL.jpg", 
    "https://i.imgur.com/LYW6vCV.jpg", "https://i.imgur.com/uL4vzUm.jpg", "https://i.imgur.com/nfaJSc8.jpg", 
    "https://i.imgur.com/2VVnQdy.jpg", "https://i.imgur.com/PiEEsSU.jpg", "https://i.imgur.com/VaKdGyK.jpg", 
    "https://i.imgur.com/DBBCMT5.jpg", "https://i.imgur.com/9SzyANt.jpg", "https://i.imgur.com/8wvo2rv.jpg", 
    "https://i.imgur.com/CZ3u4pG.jpg", "https://i.imgur.com/rDXCZ7T.jpg", "https://i.imgur.com/k7hFQDI.jpg", 
    "https://i.imgur.com/ZUbdLcH.jpg", "https://i.imgur.com/4B6q7qo.jpg", "https://i.imgur.com/uns90FG.jpg", 
    "https://i.imgur.com/BUo8Gip.jpg", "https://i.imgur.com/OEjUJpt.jpg", "https://i.imgur.com/0EMIF5N.jpg", 
    "https://i.imgur.com/pfClCuw.jpg", "https://i.imgur.com/B3xmc6u.jpg", "https://i.imgur.com/r3k76o1.jpg", 
    "https://i.imgur.com/rF7elZ9.jpg", "https://i.imgur.com/sUCiNka.jpg", "https://i.imgur.com/H4txTF9.jpg", 
    "https://i.imgur.com/XJYsBGt.jpg", "https://i.imgur.com/VhUKFn6.jpg", "https://i.imgur.com/4NMv9DQ.jpg", 
    "https://i.imgur.com/BF7REhe.jpg", "https://i.imgur.com/vXJ177V.jpg", "https://i.imgur.com/rpLbigJ.jpg", 
    "https://i.imgur.com/kTH9hI0.jpg", "https://i.imgur.com/qdFVoSy.jpg", "https://i.imgur.com/otrQpMc.jpg", 
    "https://i.imgur.com/D3WqpgT.jpg", "https://i.imgur.com/MW0N2it.jpg", "https://i.imgur.com/GwbXEte.jpg", 
    "https://i.imgur.com/9JR6W3w.jpg", "https://i.imgur.com/YgIPVwa.jpg", "https://i.imgur.com/czv7Fz5.jpg", 
    "https://i.imgur.com/Zw9KZBd.jpg", "https://i.imgur.com/BDVgpWb.jpg", "https://i.imgur.com/0y9UHo3.jpg", 
    "https://i.imgur.com/o13FtAd.jpg", "https://i.imgur.com/caEX9gQ.jpg", "https://i.imgur.com/5HUayMT.jpg", 
    "https://i.imgur.com/mfA3aZm.jpg", "https://i.imgur.com/fvZlGx4.jpg", "https://i.imgur.com/9X7xHrc.jpg", 
    "https://i.imgur.com/fhC0uQO.jpg", "https://i.imgur.com/k0kgL6g.jpg", "https://i.imgur.com/tKJbKC3.jpg", 
    "https://i.imgur.com/XAG9XXY.jpg", "https://i.imgur.com/WOITKH9.jpg", "https://i.imgur.com/AlSxfCU.jpg", 
    "https://i.imgur.com/dcldScy.jpg", "https://i.imgur.com/CGvFkMn.jpg", "https://i.imgur.com/pXC6YUo.jpg", 
    "https://i.imgur.com/loz0CDt.jpg", "https://i.imgur.com/XWbFJ67.jpg", "https://i.imgur.com/bpzaZda.jpg", 
    "https://i.imgur.com/QRoyoSB.jpg", "https://i.imgur.com/VwbnHjt.jpg", "https://i.imgur.com/4CCcn4w.jpg", 
    "https://i.imgur.com/TWnfUPu.jpg", "https://i.imgur.com/jL9zgtp.jpg", "https://i.imgur.com/6Hh2eap.jpg", 
    "https://i.imgur.com/EHD734u.jpg", "https://i.imgur.com/uC2YI3l.jpg", "https://i.imgur.com/zCP4AzS.jpg", 
    "https://i.imgur.com/bovYCdz.jpg", "https://i.imgur.com/2lO8cZg.jpg", "https://i.imgur.com/ehEVYQK.jpg", 
    "https://i.imgur.com/IzhVUTo.jpg", "https://i.imgur.com/nViB6oJ.jpg", "https://i.imgur.com/6YzpZyq.jpg", 
    "https://i.imgur.com/9bwh3qa.jpg", "https://i.imgur.com/oTy9Ylw.jpg", "https://i.imgur.com/jHzuUKA.jpg", 
    "https://i.imgur.com/8Y8NrSw.jpg", "https://i.imgur.com/OTH5p7Z.jpg", "https://i.imgur.com/Yyb0sdO.jpg", 
    "https://i.imgur.com/hA7p8M3.jpg", "https://i.imgur.com/LbwoVjX.jpg", "https://i.imgur.com/z9X2gPw.jpg", 
    "https://i.imgur.com/XzyO1x6.jpg", "https://i.imgur.com/9VLIeHE.jpg", "https://i.imgur.com/bSAggk1.jpg", 
    "https://i.imgur.com/PtiAaHm.jpg", "https://i.imgur.com/VvD1BO7.jpg", "https://i.imgur.com/99QmViE.jpg", 
    "https://i.imgur.com/HAHOYFm.jpg", "https://i.imgur.com/Gw33heq.jpg", "https://i.imgur.com/Oc5v81n.jpg", 
    "https://i.imgur.com/IQLPXsn.jpg", "https://i.imgur.com/b8KE45g.jpg", "https://i.imgur.com/3Adx4WN.jpg", 
    "https://i.imgur.com/N0BCsl7.jpg", "https://i.imgur.com/VFRn575.jpg", "https://i.imgur.com/GJbWcCy.jpg", 
    "https://i.imgur.com/YbWXwDd.jpg", "https://i.imgur.com/BIaJ0rP.jpg"
  ];

  try {
    const randomIndex = Math.floor(Math.random() * memeLinks.length);
    const imageUrl = memeLinks[randomIndex];
    
    // Generate unique filename
    const timestamp = Date.now();
    const path = __dirname + `/cache/meme_${timestamp}.jpg`;
    
    const response = await axios.get(imageUrl, {
      responseType: 'arraybuffer'
    });
    
    fs.writeFileSync(path, Buffer.from(response.data, 'binary'));
    
    api.sendMessage({
      body: `🤣 Random Meme - ${memeLinks.length} memes available`,
      attachment: fs.createReadStream(path)
    }, event.threadID, () => {
      try {
        fs.unlinkSync(path);
      } catch (cleanupError) {
        console.error('Error cleaning up meme file:', cleanupError);
      }
    }, event.messageID);
    
  } catch (error) {
    console.error('Meme command error:', error);
    api.sendMessage('❌ Failed to load meme. Please try again later!', event.threadID, event.messageID);
  }
};
