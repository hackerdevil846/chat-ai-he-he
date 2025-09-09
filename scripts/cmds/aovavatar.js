const axios = require("axios");
const fs = require("fs-extra");
const { createCanvas, loadImage, registerFont } = require("canvas");

module.exports.config = {
    name: "aovavatar",
    aliases: ["aovcard", "arenaavatar"],
    version: "1.0.0",
    author: "𝐴𝑠𝑖𝑓 𝑀𝑎ℎ𝑚𝑢𝑑",
    countDown: 5,
    role: 0,
    category: "𝑢𝑡𝑖𝑙𝑖𝑡𝑦",
    shortDescription: {
        en: "𝐶𝑟𝑒𝑎𝑡𝑒 𝐴𝑂𝑉-𝑠𝑡𝑦𝑙𝑒 𝑎𝑣𝑎𝑡𝑎𝑟 𝑐𝑎𝑟𝑑𝑠"
    },
    longDescription: {
        en: "𝐶𝑟𝑒𝑎𝑡𝑒 𝑐𝑢𝑠𝑡𝑜𝑚𝑖𝑧𝑎𝑏𝑙𝑒 𝐴𝑟𝑒𝑛𝑎 𝑜𝑓 𝑉𝑎𝑙𝑜𝑟 𝑠𝑡𝑦𝑙𝑒 𝑎𝑣𝑎𝑡𝑎𝑟 𝑐𝑎𝑟𝑑𝑠 𝑤𝑖𝑡ℎ 𝑚𝑢𝑙𝑡𝑖𝑝𝑙𝑒 𝑜𝑝𝑡𝑖𝑜𝑛𝑠"
    },
    guide: {
        en: "{p}aovavatar [𝑟𝑒𝑝𝑙𝑦 𝑡𝑜 𝑖𝑚𝑎𝑔𝑒]"
    },
    dependencies: {
        "axios": "",
        "fs-extra": "",
        "canvas": ""
    }
};

module.exports.onReply = async function({ api, event, handleReply }) {
    try {
        const u = ["https://imgur.com/WoD5OoQ.png", "https://imgur.com/x0QrTlQ.png", "https://i.imgur.com/PPzdY41.png"];
        const f = ["https://imgur.com/28aiYVA.png", "https://imgur.com/vCO8LPL.png", "https://imgur.com/OGxx1I4.png", "https://imgur.com/S9igFa6.png"];
        const g = ["https://imgur.com/R1Nc9Lz.png", "https://imgur.com/yd0svOU.png", "https://imgur.com/0MXw7eG.png", "https://imgur.com/HYeoGia.png", "https://imgur.com/KlLrw0y.png", "https://imgur.com/B42txfi.png", "https://imgur.com/JkunRCG.png", "https://imgur.com/yHueKan.png", "https://imgur.com/z2RpozR.png"];
        const h = ["https://imgur.com/WspyTeK.png", "https://imgur.com/2sGb8UV.png", "https://imgur.com/YvuMkJ0.png", "https://imgur.com/NF8nB3U.png", "https://imgur.com/388n5TF.png", "https://imgur.com/WcWC8z8.png", "https://imgur.com/2sCe8GO.png", "https://imgur.com/eDYbG9F.png", "https://imgur.com/4n8FlLJ.png", "https://imgur.com/rGV8aYs.png"];
        const s = ["https://imgur.com/Dkco1Xz.png", "https://imgur.com/Tmpw6me.png", "https://imgur.com/C2HKEHu.png", "https://imgur.com/BAEKMdK.png", "https://imgur.com/LIH4YYl.png", "https://imgur.com/vWE3V9T.png", "https://imgur.com/nJ2qpiY.png", "https://imgur.com/duis8N4.png", "https://imgur.com/i3QC0eV.png", "https://imgur.com/V7ji4IG.png", "https://imgur.com/lAXMleJ.png", "https://imgur.com/jYBBTuf.png", "https://imgur.com/s0oBwea.png", "https://imgur.com/nwJbpwR.png", "https://imgur.com/jwVRzrk.png", "https://imgur.com/tr5JHav.png", "https://imgur.com/pSxLPtt.png", "https://imgur.com/hsZ8GHY.png", "https://imgur.com/Jb8lxQn.png", "https://imgur.com/SLr5fGm.png", "https://imgur.com/RqjgA57.png"];
        const w = ["https://imgur.com/ky7Iu2t.png", "https://imgur.com/1zZcchN.png", "https://imgur.com/EidGfcr.png", "https://imgur.com/Kmt9Hiz.png", "https://imgur.com/wYimMMU.png", "https://imgur.com/kKBLKIg.png", "https://imgur.com/BSoFwWi.png", "https://imgur.com/0eOJSp7.png", "https://imgur.com/UlUnVdU.png", "https://imgur.com/PQRrAOt.png", "https://imgur.com/GhUBZnz.png"];

        let pathImg = __dirname + `/cache/avatar_1111231.png`;
        let pathAva = __dirname + `/cache/avatar_3dsc11.png`;
        let pathBS = __dirname + `/cache/avatar_3ssssc11.png`;
        let pathtop = __dirname + `/cache/avatar_3sscxssc11.png`;
        let paththaku = __dirname + `/cache/avatar_3oxsscxssc11.png`;
        let pathtph = __dirname + `/cache/avatar_xv3oxsscxssc11.png`;
        let pathx = __dirname + `/cache/avas_123456.png`;

        if (event.senderID != handleReply.author) {
            return api.sendMessage("𝑃𝑙𝑒𝑎𝑠𝑒 𝑙𝑒𝑡 𝑡ℎ𝑒 𝑢𝑠𝑒𝑟 𝑐𝑟𝑒𝑎𝑡𝑒 𝑡ℎ𝑒 𝑖𝑚𝑎𝑔𝑒", event.threadID, event.messageID);
        }

        if (handleReply.step == 1) {
            api.unsendMessage(handleReply.messageID);
            const attachments = [];
            for (let e = 0; e < u.length; e++) {
                const t = (await axios.get(`${u[e]}`, { responseType: "stream" })).data;
                attachments.push(t);
            }
            
            const msg = {
                body: `𝑌𝑜𝑢 𝑠𝑒𝑙𝑒𝑐𝑡𝑒𝑑 𝑐ℎ𝑎𝑟𝑎𝑐𝑡𝑒𝑟 𝑛𝑎𝑚𝑒: ${event.body}, 𝑟𝑒𝑝𝑙𝑦 𝑡𝑜 𝑡ℎ𝑖𝑠 𝑚𝑒𝑠𝑠𝑎𝑔𝑒 𝑎𝑛𝑑 𝑐ℎ𝑜𝑜𝑠𝑒 𝑟𝑎𝑛𝑘 𝑓𝑟𝑎𝑚𝑒\n🔥 𝐼𝑚𝑎𝑔𝑒 1: "𝑀𝑎𝑠𝑡𝑒𝑟"\n🌈 𝐼𝑚𝑎𝑔𝑒 2: "𝑊𝑎𝑟𝑟𝑖𝑜𝑟"\n⚜️ 𝐼𝑚𝑎𝑔𝑒 3: "𝐶ℎ𝑎𝑙𝑙𝑒𝑛𝑔𝑒𝑟"`,
                attachment: attachments
            };
            
            return api.sendMessage(msg, event.threadID, (err, info) => {
                global.client.handleReply.push({
                    step: 2,
                    name: "aovavatar",
                    messageID: info.messageID,
                    image: handleReply.image,
                    name: event.body,
                    author: event.senderID
                });
            }, event.messageID);
        }
        else if (handleReply.step == 2) {
            if (isNaN(event.body)) return;
            api.unsendMessage(handleReply.messageID);
            const attachments = [];
            for (let e = 0; e < f.length; e++) {
                const t = (await axios.get(`${f[e]}`, { responseType: "stream" })).data;
                attachments.push(t);
            }
            
            const frameName = event.body == 1 ? "𝑀𝑎𝑠𝑡𝑒𝑟" : event.body == "2" ? "𝑊𝑎𝑟𝑟𝑖𝑜𝑟" : "𝐶ℎ𝑎𝑙𝑙𝑒𝑛𝑔𝑒𝑟";
            const msg = {
                body: `𝑌𝑜𝑢 𝑠𝑒𝑙𝑒𝑐𝑡𝑒𝑑 𝑓𝑟𝑎𝑚𝑒: ${frameName}, 𝑟𝑒𝑝𝑙𝑦 𝑡𝑜 𝑐ℎ𝑜𝑜𝑠𝑒 𝑝𝑎𝑟𝑡𝑛𝑒𝑟`,
                attachment: attachments
            };
            
            return api.sendMessage(msg, event.threadID, (err, info) => {
                global.client.handleReply.push({
                    step: 3,
                    name: "aovavatar",
                    messageID: info.messageID,
                    image: handleReply.image,
                    name: handleReply.name,
                    frame: event.body,
                    author: event.senderID
                });
            }, event.messageID);
        }
        else if (handleReply.step == 3) {
            if (isNaN(event.body)) return;
            api.unsendMessage(handleReply.messageID);
            const attachments = [];
            for (let e = 0; e < g.length; e++) {
                const t = (await axios.get(`${g[e]}`, { responseType: "stream" })).data;
                attachments.push(t);
            }
            
            const partnerName = event.body == 1 ? "𝐵𝑟𝑜𝑡ℎ𝑒𝑟" : event.body == "2" ? "𝐹𝑟𝑖𝑒𝑛𝑑" : event.body == "3" ? "𝐶𝑜𝑢𝑝𝑙𝑒" : event.body == 4 ? "𝑆𝑖𝑠𝑡𝑒𝑟" : "𝑈𝑛𝑘𝑛𝑜𝑤𝑛";
            const msg = {
                body: `𝑌𝑜𝑢 𝑠𝑒𝑙𝑒𝑐𝑡𝑒𝑑 𝑝𝑎𝑟𝑡𝑛𝑒𝑟: ${partnerName}, 𝑟𝑒𝑝𝑙𝑦 𝑡𝑜 𝑐ℎ𝑜𝑜𝑠𝑒 𝑝𝑟𝑜𝑓𝑖𝑐𝑖𝑒𝑛𝑐𝑦`,
                attachment: attachments
            };
            
            return api.sendMessage(msg, event.threadID, (err, info) => {
                global.client.handleReply.push({
                    step: 4,
                    name: "aovavatar",
                    messageID: info.messageID,
                    image: handleReply.image,
                    name: handleReply.name,
                    frame: handleReply.frame,
                    partner: event.body,
                    author: event.senderID
                });
            }, event.messageID);
        }
        else if (handleReply.step == 4) {
            if (isNaN(event.body)) return;
            api.unsendMessage(handleReply.messageID);
            const attachments = [];
            for (let e = 0; e < h.length; e++) {
                const t = (await axios.get(`${h[e]}`, { responseType: "stream" })).data;
                attachments.push(t);
            }
            
            const proficiencyName = event.body == 1 ? "𝐺𝑟𝑎𝑑𝑒 𝐷" : event.body == "2" ? "𝐺𝑟𝑎𝑑𝑒 𝐶" : event.body == "3" ? "𝐺𝑟𝑎𝑑𝑒 𝐵" : event.body == "4" ? "𝐺𝑟𝑎𝑑𝑒 𝐴" : event.body == "5" ? "𝐺𝑟𝑎𝑑𝑒 𝑆" : event.body == "6" ? "𝑇𝑜𝑝 𝑅𝑒𝑔𝑖𝑜𝑛" : event.body == "7" ? "𝑇𝑜𝑝 𝐴𝑟𝑒𝑎" : event.body == "8" ? "𝑇𝑜𝑝 𝑉𝑖𝑒𝑡𝑛𝑎𝑚" : "𝑇𝑜𝑝 1";
            const msg = {
                body: `𝑌𝑜𝑢 𝑠𝑒𝑙𝑒𝑐𝑡𝑒𝑑 𝑝𝑟𝑜𝑓𝑖𝑐𝑖𝑒𝑛𝑐𝑦: ${proficiencyName}, 𝑟𝑒𝑝𝑙𝑦 𝑡𝑜 𝑐ℎ𝑜𝑜𝑠𝑒 𝑠𝑢𝑝𝑝𝑜𝑟𝑡 𝑠𝑝𝑒𝑙𝑙`,
                attachment: attachments
            };
            
            return api.sendMessage(msg, event.threadID, (err, info) => {
                global.client.handleReply.push({
                    step: 5,
                    name: "aovavatar",
                    messageID: info.messageID,
                    image: handleReply.image,
                    name: handleReply.name,
                    frame: handleReply.frame,
                    partner: handleReply.partner,
                    proficiency: event.body,
                    author: event.senderID
                });
            }, event.messageID);
        }
        else if (handleReply.step == 5) {
            if (isNaN(event.body)) return;
            api.unsendMessage(handleReply.messageID);
            const attachments = [];
            for (let e = 0; e < s.length; e++) {
                const t = (await axios.get(`${s[e]}`, { responseType: "stream" })).data;
                attachments.push(t);
            }
            
            const supportName = event.body == 1 ? "𝐵𝑢𝑟𝑠𝑡" : event.body == "2" ? "𝑇𝑜𝑤𝑒𝑟 𝐷𝑖𝑠𝑎𝑏𝑙𝑒" : event.body == "3" ? "𝑅𝑒𝑠𝑐𝑢𝑒" : event.body == "4" ? "𝑅𝑜𝑎𝑟" : event.body == "5" ? "𝑆𝑡𝑢𝑛" : event.body == "6" ? "𝑊𝑒𝑎𝑘𝑒𝑛" : event.body == "7" ? "𝑃𝑢𝑟𝑖𝑓𝑦" : event.body == "8" ? "𝐹𝑙𝑎𝑠ℎ" : event.body == "9" ? "𝑆𝑝𝑟𝑖𝑛𝑡" : "𝑃𝑢𝑛𝑖𝑠ℎ";
            const msg = {
                body: `𝑌𝑜𝑢 𝑠𝑒𝑙𝑒𝑐𝑡𝑒𝑑 𝑠𝑢𝑝𝑝𝑜𝑟𝑡 𝑠𝑝𝑒𝑙𝑙: ${supportName}, 𝑟𝑒𝑝𝑙𝑦 𝑡𝑜 𝑐ℎ𝑜𝑜𝑠𝑒 𝑠𝑘𝑖𝑛 𝑡𝑖𝑒𝑟`,
                attachment: attachments
            };
            
            return api.sendMessage(msg, event.threadID, (err, info) => {
                global.client.handleReply.push({
                    step: 6,
                    name: "aovavatar",
                    messageID: info.messageID,
                    image: handleReply.image,
                    name: handleReply.name,
                    frame: handleReply.frame,
                    partner: handleReply.partner,
                    proficiency: handleReply.proficiency,
                    support: event.body,
                    author: event.senderID
                });
            }, event.messageID);
        }
        else if (handleReply.step == 6) {
            if (isNaN(event.body)) return;
            api.unsendMessage(handleReply.messageID);
            const attachments = [];
            for (let e = 0; e < w.length; e++) {
                const t = (await axios.get(`${w[e]}`, { responseType: "stream" })).data;
                attachments.push(t);
            }
            
            const msg = {
                body: `𝑌𝑜𝑢 𝑠𝑒𝑙𝑒𝑐𝑡𝑒𝑑 𝑠𝑘𝑖𝑛 𝑡𝑖𝑒𝑟: ${event.body}, 𝑟𝑒𝑝𝑙𝑦 𝑡𝑜 𝑐ℎ𝑜𝑜𝑠𝑒 𝑏𝑎𝑑𝑔𝑒`,
                attachment: attachments
            };
            
            return api.sendMessage(msg, event.threadID, (err, info) => {
                global.client.handleReply.push({
                    step: 7,
                    name: "aovavatar",
                    messageID: info.messageID,
                    image: handleReply.image,
                    name: handleReply.name,
                    frame: handleReply.frame,
                    partner: handleReply.partner,
                    proficiency: handleReply.proficiency,
                    support: handleReply.support,
                    skinTier: event.body,
                    author: event.senderID
                });
            }, event.messageID);
        }
        else if (handleReply.step == 7) {
            api.unsendMessage(handleReply.messageID);
            return api.sendMessage("𝑅𝑒𝑝𝑙𝑦 𝑡𝑜 𝑡ℎ𝑖𝑠 𝑚𝑒𝑠𝑠𝑎𝑔𝑒 𝑎𝑛𝑑 𝑒𝑛𝑡𝑒𝑟 ℎ𝑒𝑟𝑜 𝑛𝑎𝑚𝑒", event.threadID, (err, info) => {
                global.client.handleReply.push({
                    step: 8,
                    name: "aovavatar",
                    messageID: info.messageID,
                    image: handleReply.image,
                    name: handleReply.name,
                    frame: handleReply.frame,
                    partner: handleReply.partner,
                    proficiency: handleReply.proficiency,
                    support: handleReply.support,
                    skinTier: handleReply.skinTier,
                    badge: event.body,
                    author: event.senderID
                });
            }, event.messageID);
        }
        else if (handleReply.step == 8) {
            api.unsendMessage(handleReply.messageID);
            return api.sendMessage("𝑅𝑒𝑝𝑙𝑦 𝑡𝑜 𝑡ℎ𝑖𝑠 𝑚𝑒𝑠𝑠𝑎𝑔𝑒 𝑎𝑛𝑑 𝑒𝑛𝑡𝑒𝑟 𝑠𝑘𝑖𝑛 𝑛𝑎𝑚𝑒", event.threadID, (err, info) => {
                global.client.handleReply.push({
                    step: 9,
                    name: "aovavatar",
                    messageID: info.messageID,
                    image: handleReply.image,
                    name: handleReply.name,
                    frame: handleReply.frame,
                    partner: handleReply.partner,
                    proficiency: handleReply.proficiency,
                    support: handleReply.support,
                    skinTier: handleReply.skinTier,
                    badge: handleReply.badge,
                    heroName: event.body,
                    author: event.senderID,
                });
            }, event.messageID);
        }
        else if (handleReply.step == 9) {
            const name = handleReply.name;
            const frame = handleReply.frame;
            const partner = handleReply.partner;
            const proficiency = handleReply.proficiency;
            const support = handleReply.support;
            
            api.unsendMessage(handleReply.messageID);
            
            // Download all required images
            const [background, avatar, skinTierImg, supportImg, proficiencyImg, badgeImg, partnerImg] = await Promise.all([
                axios.get(encodeURI(`${u[handleReply.frame - 1]}`), { responseType: "arraybuffer" }),
                axios.get(encodeURI(`${handleReply.image}`), { responseType: "arraybuffer" }),
                axios.get(encodeURI(`${s[handleReply.skinTier - 1]}`), { responseType: "arraybuffer" }),
                axios.get(encodeURI(`${h[handleReply.support - 1]}`), { responseType: "arraybuffer" }),
                axios.get(encodeURI(`${g[handleReply.proficiency - 1]}`), { responseType: "arraybuffer" }),
                axios.get(encodeURI(`${w[handleReply.badge - 1]}`), { responseType: "arraybuffer" }),
                axios.get(encodeURI(`${f[handleReply.partner - 1]}`), { responseType: "arraybuffer" })
            ]);

            // Save images to cache
            fs.writeFileSync(pathImg, Buffer.from(background.data, "utf-8"));
            fs.writeFileSync(pathAva, Buffer.from(avatar.data, "utf-8"));
            fs.writeFileSync(pathx, Buffer.from(skinTierImg.data, "utf-8"));
            fs.writeFileSync(pathBS, Buffer.from(supportImg.data, "utf-8"));
            fs.writeFileSync(pathtop, Buffer.from(proficiencyImg.data, "utf-8"));
            fs.writeFileSync(paththaku, Buffer.from(badgeImg.data, "utf-8"));
            fs.writeFileSync(pathtph, Buffer.from(partnerImg.data, "utf-8"));

            // Load images for canvas
            const [a, az, a2, a3, a4, a5, a6] = await Promise.all([
                loadImage(pathImg),
                loadImage(pathtop),
                loadImage(pathBS),
                loadImage(pathx),
                loadImage(pathtph),
                loadImage(paththaku),
                loadImage(pathAva)
            ]);

            // Create canvas
            let canvas = createCanvas(a.width, a.height);
            let ctx = canvas.getContext("2d");
            ctx.clearRect(0, 0, canvas.width, canvas.height);

            // Register font
            try {
                registerFont(__dirname + `/cache/ArialUnicodeMS.ttf`, { family: "Arial" });
            } catch (e) {
                console.log("𝐹𝑜𝑛𝑡 𝑛𝑜𝑡 𝑓𝑜𝑢𝑛𝑑, 𝑢𝑠𝑖𝑛𝑔 𝑑𝑒𝑓𝑎𝑢𝑙𝑡 𝑓𝑜𝑛𝑡");
            }

            // Draw images
            ctx.drawImage(a6, 0, 0, 720, 890);
            ctx.drawImage(a, 0, 0, canvas.width, canvas.height);
            
            const btw = 128;
            ctx.drawImage(a2, canvas.width / 2 - btw / 2, 905, btw, btw);
            ctx.drawImage(az, 15, 10, az.width, az.height);
            ctx.drawImage(a4, 108, 930, 90 * 27 / 24, 90);
            ctx.drawImage(a5, 473, 897, 143, 143);
            
            ctx.save();
            const a3scale = 2;
            ctx.drawImage(a3, canvas.width / 2 - a3.width * a3scale / 2, 510, a3.width * a3scale, a3.height * a3scale);
            ctx.restore();

            // Draw text
            ctx.save();
            ctx.textAlign = "center";
            ctx.fillStyle = "#f7ecb4";
            ctx.font = "50px Arial";
            ctx.fillText(handleReply.name, canvas.width / 2, 857);
            ctx.restore();

            ctx.save();
            ctx.textAlign = "center";
            ctx.shadowColor = "black";
            ctx.fillStyle = "#5d9af6";
            ctx.font = "50px Arial";
            ctx.lineWidth = 10;
            ctx.lineJoin = "round";
            ctx.strokeText(handleReply.heroName, canvas.width / 2, 770);
            ctx.fillText(handleReply.heroName, canvas.width / 2, 770);
            ctx.restore();

            ctx.save();
            ctx.textAlign = "center";
            ctx.shadowColor = "black";
            ctx.fillStyle = "#f7ecb4";
            ctx.font = "50px Arial";
            ctx.lineWidth = 10;
            ctx.lineJoin = "round";
            ctx.strokeText(event.body, canvas.width / 2, 700);
            ctx.fillText(event.body, canvas.width / 2, 700);
            ctx.restore();

            // Save final image
            const imageBuffer = canvas.toBuffer();
            fs.writeFileSync(pathImg, imageBuffer);

            // Format names for output
            const frameName = frame == 1 ? "𝑀𝑎𝑠𝑡𝑒𝑟" : frame == "2" ? "𝑊𝑎𝑟𝑟𝑖𝑜𝑟" : "𝐶ℎ𝑎𝑙𝑙𝑒𝑛𝑔𝑒𝑟";
            const partnerName = partner == 1 ? "𝐵𝑟𝑜𝑡ℎ𝑒𝑟" : partner == "2" ? "𝐹𝑟𝑖𝑒𝑛𝑑" : partner == "3" ? "𝐶𝑜𝑢𝑝𝑙𝑒" : partner == "4" ? "𝑆𝑖𝑠𝑡𝑒𝑟" : "𝑈𝑛𝑘𝑛𝑜𝑤𝑛";
            const proficiencyName = proficiency == 1 ? "𝐺𝑟𝑎𝑑𝑒 𝐷" : proficiency == "2" ? "𝐺𝑟𝑎𝑑𝑒 𝐶" : proficiency == "3" ? "𝐺𝑟𝑎𝑑𝑒 𝐵" : proficiency == "4" ? "𝐺𝑟𝑎𝑑𝑒 𝐴" : proficiency == "5" ? "𝐺𝑟𝑎𝑑𝑒 𝑆" : proficiency == "6" ? "𝑇𝑜𝑝 𝑅𝑒𝑔𝑖𝑜𝑛" : proficiency == "7" ? "𝑇𝑜𝑝 𝐴𝑟𝑒𝑎" : proficiency == "8" ? "𝑇𝑜𝑝 𝑉𝑖𝑒𝑡𝑛𝑎𝑚" : "𝑇𝑜𝑝 1";
            const supportName = support == 1 ? "𝐵𝑢𝑟𝑠𝑡" : support == "2" ? "𝑇𝑜𝑤𝑒𝑟 𝐷𝑖𝑠𝑎𝑏𝑙𝑒" : support == "3" ? "𝑅𝑒𝑠𝑐𝑢𝑒" : support == "4" ? "𝑅𝑜𝑎𝑟" : support == "5" ? "𝑆𝑡𝑢𝑛" : support == "6" ? "𝑊𝑒𝑎𝑘𝑒𝑛" : support == "7" ? "𝑃𝑢𝑟𝑖𝑓𝑦" : support == "8" ? "𝐹𝑙𝑎𝑠ℎ" : support == "9" ? "𝑆𝑝𝑟𝑖𝑛𝑡" : "𝑃𝑢𝑛𝑖𝑠ℎ";

            // Send final result
            return api.sendMessage({
                body: `✅ 𝐴𝑣𝑎𝑡𝑎𝑟 𝑐𝑟𝑒𝑎𝑡𝑒𝑑 𝑠𝑢𝑐𝑐𝑒𝑠𝑠𝑓𝑢𝑙𝑙𝑦!\n\n⚜️ 𝐼𝑛𝑔𝑎𝑚𝑒: ${name}\n🛡 𝐹𝑟𝑎𝑚𝑒: ${frameName}\n💕 𝑃𝑎𝑟𝑡𝑛𝑒𝑟: ${partnerName}\n🔥 𝑃𝑟𝑜𝑓𝑖𝑐𝑖𝑒𝑛𝑐𝑦: ${proficiencyName}\n👑 𝑆𝑢𝑝𝑝𝑜𝑟𝑡: ${supportName}`,
                attachment: fs.createReadStream(pathImg)
            }, event.threadID, () => {
                // Cleanup cache files
                [pathImg, pathAva, pathBS, pathtop, paththaku, pathx, pathtph].forEach(file => {
                    if (fs.existsSync(file)) fs.unlinkSync(file);
                });
            }, event.messageID);
        }
    } catch (e) {
        console.error("𝐴𝑂𝑉 𝐴𝑣𝑎𝑡𝑎𝑟 𝐸𝑟𝑟𝑜𝑟:", e);
        api.sendMessage("❌ 𝐴𝑛 𝑒𝑟𝑟𝑜𝑟 𝑜𝑐𝑐𝑢𝑟𝑟𝑒𝑑 𝑤ℎ𝑖𝑙𝑒 𝑐𝑟𝑒𝑎𝑡𝑖𝑛𝑔 𝑡ℎ𝑒 𝑎𝑣𝑎𝑡𝑎𝑟", event.threadID, event.messageID);
    }
};

module.exports.onStart = async function({ api, args, event }) {
    try {
        let imageUrl = args.join(" ");

        if (!imageUrl && event.type == 'message_reply') {
            if (!event.messageReply.attachments || event.messageReply.attachments.length == 0) {
                return api.sendMessage('𝑃𝑙𝑒𝑎𝑠𝑒 𝑟𝑒𝑝𝑙𝑦 𝑡𝑜 𝑎𝑛 𝑖𝑚𝑎𝑔𝑒', event.threadID);
            }
            if (event.messageReply.attachments.length > 1) {
                return api.sendMessage('𝑃𝑙𝑒𝑎𝑠𝑒 𝑟𝑒𝑝𝑙𝑦 𝑡𝑜 𝑜𝑛𝑙𝑦 𝑜𝑛𝑒 𝑖𝑚𝑎𝑔𝑒!', event.threadID, event.messageID);
            }
            if (event.messageReply.attachments[0].type != 'photo') {
                return api.sendMessage('𝑃𝑙𝑒𝑎𝑠𝑒 𝑟𝑒𝑝𝑙𝑦 𝑡𝑜 𝑎𝑛 𝑖𝑚𝑎𝑔𝑒 𝑜𝑛𝑙𝑦', event.threadID, event.messageID);
            }

            imageUrl = event.messageReply.attachments[0].url;
        } else if (!imageUrl) {
            imageUrl = `https://graph.facebook.com/${event.senderID}/picture?width=512&height=512&access_token=6628568379%7Cc1e620fa708a1d5696fb991c1bde5662`;
        } else {
            if (imageUrl.indexOf('http') == -1) {
                imageUrl = 'https://' + imageUrl;
            }
        }
        
        return api.sendMessage('🌸 𝑅𝑒𝑝𝑙𝑦 𝑡𝑜 𝑡ℎ𝑖𝑠 𝑚𝑒𝑠𝑠𝑎𝑔𝑒 𝑎𝑛𝑑 𝑒𝑛𝑡𝑒𝑟 𝑐ℎ𝑎𝑟𝑎𝑐𝑡𝑒𝑟 𝑛𝑎𝑚𝑒 🌸', event.threadID, (err, info) => {
            global.client.handleReply.push({
                step: 1,
                name: this.config.name,
                messageID: info.messageID,
                image: imageUrl,
                author: event.senderID
            });
        }, event.messageID);
    } catch (error) {
        console.error("𝐴𝑂𝑉 𝐴𝑣𝑎𝑡𝑎𝑟 𝑆𝑡𝑎𝑟𝑡 𝐸𝑟𝑟𝑜𝑟:", error);
        api.sendMessage("❌ 𝐹𝑎𝑖𝑙𝑒𝑑 𝑡𝑜 𝑠𝑡𝑎𝑟𝑡 𝑎𝑣𝑎𝑡𝑎𝑟 𝑐𝑟𝑒𝑎𝑡𝑖𝑜𝑛", event.threadID, event.messageID);
    }
};
