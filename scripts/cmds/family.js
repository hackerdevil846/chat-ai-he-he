module.exports.config = {
    name: "family",
    version: "1.0.0",
    hasPermssion: 1,
    credits: "𝑨𝒔𝒊𝒇 𝑴𝒂𝒉𝒎𝒖𝒅",
    description: "𝑮𝒓𝒐𝒖𝒑 𝒆𝒓 𝒔𝒐𝒃 𝒎𝒆𝒎𝒃𝒆𝒓 𝒅𝒆𝒓 𝒇𝒐𝒕𝒐 𝒃𝒂𝒏𝒂𝒐",
    commandCategory: "𝑭𝒐𝒕𝒐 𝒆𝒅𝒊𝒕",
    usages: "𝒇𝒂𝒎𝒊𝒍𝒚 <𝒔𝒊𝒛𝒆> [#𝒄𝒐𝒍𝒐𝒓 𝒄𝒐𝒅𝒆] 𝒂𝒕𝒉𝒂𝒃𝒂 𝒇𝒂𝒎𝒊𝒍𝒚 <𝒔𝒊𝒛𝒆>\n𝑺𝒚𝒏𝒕𝒂𝒙 𝒎𝒐𝒕𝒐 𝒍𝒆𝒌𝒉𝒂𝒏 𝒆𝒏𝒕𝒆𝒓 𝒌𝒐𝒓𝒖𝒏:\n$𝒇𝒂𝒎𝒊𝒍𝒚 <𝒔𝒊𝒛𝒆> <𝒄𝒐𝒍𝒐𝒓 𝒄𝒐𝒅𝒆> <𝒕𝒊𝒕𝒍𝒆>\n𝑱𝒆𝒌𝒉𝒂𝒏𝒆:\n•𝒔𝒊𝒛𝒆: 𝑷𝒓𝒐𝒕𝒊𝒐𝒏 𝒎𝒆𝒎𝒃𝒆𝒓 𝒆𝒓 𝒂𝒗𝒂𝒕𝒂𝒓 𝒆𝒓 𝒔𝒊𝒛𝒆\n•𝒄𝒐𝒍𝒐𝒓 𝒄𝒐𝒅𝒆: 𝑯𝒆𝒙 𝒄𝒐𝒍𝒐𝒓 𝒄𝒐𝒅𝒆\n•𝒕𝒊𝒕𝒍𝒆: 𝑰𝒎𝒂𝒈𝒆 𝒆𝒓 𝒕𝒊𝒕𝒍𝒆, 𝒅𝒆𝒇𝒂𝒖𝒍𝒕 𝒉𝒐𝒍𝒆 𝒈𝒓𝒐𝒖𝒑 𝒆𝒓 𝒏𝒂𝒎\n𝑼𝒅𝒂𝒉𝒂𝒓𝒐𝒏: $𝒇𝒂𝒎𝒊𝒍𝒚 200 #𝒘𝒉𝒊𝒕𝒆 𝑬𝒌𝒕𝒊 𝒈𝒉𝒐𝒓 𝒆𝒓 𝒃𝒉𝒂𝒊\n𝑱𝒐𝒅𝒊 𝒔𝒊𝒛𝒆 = 0 𝒍𝒆𝒌𝒉𝒂 𝒉𝒐𝒚 𝒕𝒂𝒉𝒐𝒍𝒆 𝒔𝒊𝒛𝒆 𝒂𝒖𝒕𝒐 𝒂𝒅𝒋𝒖𝒔𝒕 𝒉𝒐𝒃𝒆",
    cooldowns: 5,
    dependencies: {
      "fs-extra": "", 
      "axios":"", 
      "canvas": "", 
      "jimp": "", 
      "node-superfetch": "",
      "chalk": ""
    }
};

module.exports.run = async ({ event, api, args }) => {
  var TOKEN = "6628568379%7Cc1e620fa708a1d5696fb991c1bde5662";
  try {
    if(global.client.family == true) return api.sendMessage("𝑨𝒏𝒚𝒐 𝒈𝒓𝒐𝒖𝒑 𝒆𝒓 𝒓𝒆𝒒𝒖𝒆𝒔𝒕 𝒑𝒓𝒐𝒄𝒆𝒔𝒔 𝒉𝒐𝒄𝒄𝒉𝒆, 𝒅𝒆𝒓𝒊 𝒌𝒉𝒖𝒏 𝒑𝒐𝒓𝒆𝒏", event.threadID, event.messageID);
    global.client.family = true;
    var timestart = Date.now();
    const fs = global.nodemodule["fs-extra"];
    const axios = global.nodemodule["axios"];
    const { threadID, messageID } = event;
    const request = global.nodemodule["request"];
    const superfetch = global.nodemodule["node-superfetch"];
    
    if(!fs.existsSync(__dirname+'/cache/VNCORSI.ttf')) {
      let getfont = (await axios.get(`https://drive.google.com/uc?id=1q0FPVuJ-Lq7-tvOYH0ILgbjrX1boW7KW&export=download`, { responseType: "arraybuffer" })).data;
      fs.writeFileSync(__dirname+"/cache/VNCORSI.ttf", Buffer.from(getfont, "utf-8"));
    };
    
    if(!args[0] || isNaN(args[0]) == true || args[0] == "help") {
      if(!fs.existsSync(__dirname+"/cache/color1.png")) {
        let getimg = (await axios.get(`https://i.ibb.co/m9R36Pp/image.png`, { responseType: "arraybuffer" })).data;
        fs.writeFileSync(__dirname+"/cache/color1.png", Buffer.from(getimg, "utf-8"));
      }
      global.client.family = false;
      return api.sendMessage({
        body: "𝑺𝒚𝒏𝒕𝒂𝒙 𝒎𝒐𝒕𝒐 𝒍𝒆𝒌𝒉𝒂𝒏 𝒆𝒏𝒕𝒆𝒓 𝒌𝒐𝒓𝒖𝒏:\n$𝒇𝒂𝒎𝒊𝒍𝒚 <𝒔𝒊𝒛𝒆> <𝒄𝒐𝒍𝒐𝒓 𝒄𝒐𝒅𝒆> <𝒕𝒊𝒕𝒍𝒆>\n𝑱𝒆𝒌𝒉𝒂𝒏𝒆:\n•𝒔𝒊𝒛𝒆: 𝑷𝒓𝒐𝒕𝒊𝒐𝒏 𝒎𝒆𝒎𝒃𝒆𝒓 𝒆𝒓 𝒂𝒗𝒂𝒕𝒂𝒓 𝒆𝒓 𝒔𝒊𝒛𝒆\n•𝒄𝒐𝒍𝒐𝒓 𝒄𝒐𝒅𝒆: 𝑯𝒆𝒙 𝒄𝒐𝒍𝒐𝒓 𝒄𝒐𝒅𝒆\n•𝒕𝒊𝒕𝒍𝒆: 𝑰𝒎𝒂𝒈𝒆 𝒆𝒓 𝒕𝒊𝒕𝒍𝒆, 𝒅𝒆𝒇𝒂𝒖𝒍𝒕 𝒉𝒐𝒍𝒆 𝒈𝒓𝒐𝒖𝒑 𝒆𝒓 𝒏𝒂𝒎",
        attachment: fs.createReadStream(__dirname+"/cache/color1.png")
      }, threadID, messageID);
    };
    
    const jimp = global.nodemodule["jimp"];
    const chalk = global.nodemodule["chalk"];
    const Canvas = global.nodemodule["canvas"];
  
    var threadInfo = await api.getThreadInfo(threadID);
    var arrob = threadInfo.adminIDs;
    var arrad = [];
    for(let qtv of arrob) {
      arrad.push(qtv.id)
    };
    const background = await Canvas.loadImage("https://i.ibb.co/QvG4LTw/image.png");
    
    var idtv = threadInfo.participantIDs;
    var xbground = background.width,
        ybground = background.height;

    var dem = 1;
    var tds = 200,
        s = parseInt(args[0]);
    var mode = "";
    if(s == 0) {
      var dtich = xbground*(ybground-tds);
      var dtichtv = Math.floor(dtich/idtv.length);
      var s = Math.floor(Math.sqrt(dtichtv));
      mode += " (𝑨𝒖𝒕𝒐 𝒔𝒊𝒛𝒆)"
    };
    
    var l = parseInt(s/15),
        x = parseInt(l),
        y = parseInt(tds),
        xcrop = parseInt(idtv.length*s),
        ycrop = parseInt(tds+s);
        
    var color = args[1];
    if(!color || !color.includes("#")) {
      color = "#FFFFFF";
      autocolor = true;
    };
    
    if(s > ybground || s > xbground) {
      global.client.family = false;
      return api.sendMessage(`𝑨𝒗𝒂𝒕𝒂𝒓 𝒔𝒊𝒛𝒆 𝒃𝒂𝒄𝒌𝒈𝒓𝒐𝒖𝒏𝒅 𝒆𝒓 𝒔𝒊𝒛𝒆 𝒆𝒓 𝒄𝒉𝒆𝒚𝒆 𝒄𝒉𝒐𝒕𝒐 𝒉𝒐𝒕𝒆 𝒉𝒐𝒃𝒆\n𝑩𝒂𝒄𝒌𝒈𝒓𝒐𝒖𝒏𝒅 𝒔𝒊𝒛𝒆: X: ${xbground}, Y: ${ybground}`, threadID, messageID);
    }
    
    api.sendMessage(
      `🔢 𝑬𝒔𝒕𝒊𝒎𝒂𝒕𝒆𝒅 𝒏𝒖𝒎𝒃𝒆𝒓 𝒐𝒇 𝒑𝒉𝒐𝒕𝒐𝒔: ${idtv.length}\n` +
      `🆒 𝑩𝒂𝒄𝒌𝒈𝒓𝒐𝒖𝒏𝒅 𝑺𝒊𝒛𝒆: ${xbground} x ${ybground}\n` +
      `🆕 𝑨𝒗𝒂𝒕𝒂𝒓 𝑺𝒊𝒛𝒆: ${s}${mode}\n` +
      `#️⃣ 𝑪𝒐𝒍𝒐𝒓: ${color}\n` +
      `⏳ 𝑷𝒓𝒐𝒄𝒆𝒔𝒔𝒊𝒏𝒈 𝒚𝒐𝒖𝒓 𝒓𝒆𝒒𝒖𝒆𝒔𝒕, 𝒊𝒕 𝒎𝒂𝒚 𝒕𝒂𝒌𝒆 𝒖𝒑 𝒕𝒐 1 𝒎𝒊𝒏𝒖𝒕𝒆...`,
      threadID, messageID
    );
    
    var loadkhung = await Canvas.loadImage("https://i.ibb.co/H41cdDM/1624768781720.png");
    var title = args.slice(2).join(" ") || threadInfo.name;
    var path_alltv = __dirname+`/cache/family_${threadID}_${Date.now()}.png`;
    
    function delay(ms) {
       return new Promise(resolve => setTimeout(resolve, ms));
    };
    
    const canvas = Canvas.createCanvas(xbground, ybground);
    let ctx = canvas.getContext('2d');
    ctx.drawImage(background, 0, 0, canvas.width, canvas.height);

    var ngdung = 0;
    
    for(let id of idtv) {
        try {
          var avatar = await superfetch.get(`https://graph.facebook.com/${id}/picture?width=512&height=512&access_token=${TOKEN}`);
          if(avatar.url.includes(".gif")) {throw Error};
        }
        catch(e) {
            ngdung += 1;
            continue; 
        };

        if(x+s > xbground) {
          xcrop = x;
          x += (-x)+l;
          y += s+l;
          ycrop += s+l;
        };
        
        if(ycrop > ybground) {
          ycrop += (-s);
          break;
        }; 
      
        avatar = avatar.body;
        const avatarload = await Canvas.loadImage(avatar);
        ctx.drawImage(avatarload, x, y, s, s);

        if(arrad.includes(id)) {
          ctx.drawImage(loadkhung, x, y, s, s);
        };
        
        dem++;
        x += parseInt(s+l);
    };
    
    Canvas.registerFont(__dirname+"/cache/VNCORSI.ttf", {
        family: "Dancing Script"
    });
    
    ctx.font = "110px Dancing Script";
    ctx.fillStyle = color;
    ctx.textAlign = "center";
    ctx.fillText(title, xcrop/2, 133);
    
    try {
      const imagecut = await jimp.read(canvas.toBuffer());
      imagecut.crop(0, 0, xcrop, ycrop+l-30).writeAsync(path_alltv);
      await delay(200);
      
      api.sendMessage({
        body: `🟦 𝑵𝒖𝒎𝒃𝒆𝒓 𝒐𝒇 𝒑𝒉𝒐𝒕𝒐𝒔: ${dem} (𝑭𝒊𝒍𝒕𝒆𝒓𝒆𝒅 ${ngdung} 𝒖𝒔𝒆𝒓𝒔)\n` +
              `🆒 𝑩𝒂𝒄𝒌𝒈𝒓𝒐𝒖𝒏𝒅 𝑺𝒊𝒛𝒆: ${xbground} x ${ybground}\n` +
              `🆕 𝑨𝒗𝒂𝒕𝒂𝒓 𝑺𝒊𝒛𝒆: ${s}${mode}\n` +
              `⏱️ 𝑷𝒓𝒐𝒄𝒆𝒔𝒔𝒊𝒏𝒈 𝑻𝒊𝒎𝒆: ${Math.floor((Date.now()-timestart)/1000)} 𝒔𝒆𝒄𝒐𝒏𝒅`,
        attachment: fs.createReadStream(path_alltv, { 'highWaterMark': 128 * 1024 })
      }, threadID, (e, info) => {
        if(e) {
          api.sendMessage("𝑬𝒓𝒓𝒐𝒓 𝒉𝒐𝒄𝒄𝒉𝒆, 𝒅𝒆𝒓𝒊 𝒌𝒉𝒖𝒏 𝒂𝒂𝒃𝒂𝒓 𝒄𝒆𝒔𝒕𝒂 𝒌𝒐𝒓𝒖𝒏", threadID, messageID);
        };
        fs.unlinkSync(path_alltv);
        global.client.family = false;
      }, messageID);
    }
    catch(e) {
      fs.writeFileSync(path_alltv, canvas.toBuffer());
      api.sendMessage({
        body: `𝑨𝒏 𝑨𝒖𝒕𝒐 𝒄𝒖𝒕 𝒆𝒓𝒓𝒐𝒓 𝒉𝒂𝒔 𝒐𝒄𝒄𝒖𝒓𝒆𝒅\n` +
              `🟦 𝑵𝒖𝒎𝒃𝒆𝒓 𝒐𝒇 𝒑𝒉𝒐𝒕𝒐𝒔: ${dem}\n` +
              `(𝑭𝒊𝒍𝒕𝒆𝒓𝒆𝒅 ${ngdung} 𝒖𝒔𝒆𝒓𝒔)\n` +
              `🆒 𝑩𝒂𝒄𝒌𝒈𝒓𝒐𝒖𝒏𝒅 𝑺𝒊𝒛𝒆: ${xbground} x ${ybground}\n` +
              `🆕 𝑨𝒗𝒂𝒕𝒂𝒓 𝑺𝒊𝒛𝒆: ${s}${mode}\n` +
              `⏱️ 𝑷𝒓𝒐𝒄𝒆𝒔𝒔𝒊𝒏𝒈 𝑻𝒊𝒎𝒆: ${Math.floor((Date.now()-timestart)/1000)} 𝒔𝒆𝒄𝒐𝒏𝒅`,
        attachment: fs.createReadStream(path_alltv, { 'highWaterMark': 128 * 1024 })
      }, threadID, (e, info) => {
        if(e) {
          api.sendMessage("𝑬𝒓𝒓𝒐𝒓 𝒉𝒐𝒄𝒄𝒉𝒆, 𝒅𝒆𝒓𝒊 𝒌𝒉𝒖𝒏 𝒂𝒂𝒃𝒂𝒓 𝒄𝒆𝒔𝒕𝒂 𝒌𝒐𝒓𝒖𝒏", threadID, messageID);
        };
        fs.unlinkSync(path_alltv);
        global.client.family = false;
      }, messageID);
    }
  }
  catch(e) {
    global.client.family = false;
  }
};
