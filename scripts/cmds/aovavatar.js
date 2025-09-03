module.exports = {
	config: {
		name: "aovavatar",
		version: "1.0.0",
		role: 0,
		author: "𝐴𝑠𝑖𝑓 𝑀𝑎ℎ𝑚𝑢𝑑",
		countDown: 5,
		guide: "[reply to image]",
		dependencies: {
			"axios": "",
			"fs-extra": "",
			"request": "",
			"canvas": ""
		}
	},

	onStart: async function ({ api, args, event }) {
		const axios = global.nodemodule['axios'];
		let imageUrl = args.join(" ");

		if (!imageUrl && event.type == 'message_reply') {
			if (!event.messageReply.attachments || event.messageReply.attachments.length == 0)
				return api.sendMessage('Please reply to an image', event.threadID);
			if (event.messageReply.attachments.length > 1) return api.sendMessage('Please reply to only one image!', event.threadID, event.messageID);
			if (event.messageReply.attachments[0].type != 'photo')
				return api.sendMessage('Please reply to an image only', event.threadID, event.messageID);

			imageUrl = event.messageReply.attachments[0].url;
		} else if (!imageUrl) {
			imageUrl = `https://graph.facebook.com/${event.senderID}/picture?width=512&height=512&access_token=6628568379%7Cc1e620fa708a1d5696fb991c1bde5662`;
		} else {
			if (imageUrl.indexOf('http') == -1) {
				imageUrl = 'https://' + imageUrl;
			}
		}
		return api.sendMessage('🌸 Reply to this message and enter character name 🌸', event.threadID, (err, info) => {
			global.client.handleReply.push({
				step: 1,
				name: this.config.name,
				messageID: info.messageID,
				image: imageUrl,
				author: event.senderID
			})
		}, event.messageID);
	},

	handleReply: async function ({ api, event, handleReply }) {
		try {
			const u = ["https://imgur.com/WoD5OoQ.png", "https://imgur.com/x0QrTlQ.png", "https://i.imgur.com/PPzdY41.png"];
			const f = ["https://imgur.com/28aiYVA.png", "https://imgur.com/vCO8LPL.png", "https://imgur.com/OGxx1I4.png", "https://imgur.com/S9igFa6.png"];
			const g = ["https://imgur.com/R1Nc9Lz.png", "https://imgur.com/yd0svOU.png", "https://imgur.com/0MXw7eG.png", "https://imgur.com/HYeoGia.png", "https://imgur.com/KlLrw0y.png", "https://imgur.com/B42txfi.png", "https://imgur.com/JkunRCG.png", "https://imgur.com/yHueKan.png", "https://imgur.com/z2RpozR.png"];
			const h = ["https://imgur.com/WspyTeK.png", "https://imgur.com/2sGb8UV.png", "https://imgur.com/YvuMkJ0.png", "https://imgur.com/NF8nB3U.png", "https://imgur.com/388n5TF.png", "https://imgur.com/WcWC8z8.png", "https://imgur.com/2sCe8GO.png", "https://imgur.com/eDYbG9F.png", "https://imgur.com/4n8FlLJ.png", "https://imgur.com/rGV8aYs.png"];
			const s = ["https://imgur.com/Dkco1Xz.png", "https://imgur.com/Tmpw6me.png", "https://imgur.com/C2HKEHu.png", "https://imgur.com/BAEKMdK.png", "https://imgur.com/LIH4YYl.png", "https://imgur.com/vWE3V9T.png", "https://imgur.com/nJ2qpiY.png", "https://imgur.com/duis8N4.png", "https://imgur.com/i3QC0eV.png", "https://imgur.com/V7ji4IG.png", "https://imgur.com/lAXMleJ.png", "https://imgur.com/jYBBTuf.png", "https://imgur.com/s0oBwea.png", "https://imgur.com/nwJbpwR.png", "https://imgur.com/jwVRzrk.png", "https://imgur.com/tr5JHav.png", "https://imgur.com/pSxLPtt.png", "https://imgur.com/hsZ8GHY.png", "https://imgur.com/Jb8lxQn.png", "https://imgur.com/SLr5fGm.png", "https://imgur.com/RqjgA57.png"];
			const w = ["https://imgur.com/ky7Iu2t.png", "https://imgur.com/1zZcchN.png", "https://imgur.com/EidGfcr.png", "https://imgur.com/Kmt9Hiz.png", "https://imgur.com/wYimMMU.png", "https://imgur.com/kKBLKIg.png", "https://imgur.com/BSoFwWi.png", "https://imgur.com/0eOJSp7.png", "https://imgur.com/UlUnVdU.png", "https://imgur.com/PQRrAOt.png", "https://imgur.com/GhUBZnz.png"];

			let pathImg = __dirname + `/lq/avatar_1111231.png`;
			let pathAva = __dirname + `/lq/avatar_3dsc11.png`;
			let pathBS = __dirname + `/lq/avatar_3ssssc11.png`;
			let pathtop = __dirname + `/lq/avatar_3sscxssc11.png`;
			let paththaku = __dirname + `/lq/avatar_3oxsscxssc11.png`;
			let pathtph = __dirname + `/lq/avatar_xv3oxsscxssc11.png`;
			let pathx = __dirname + `/lq/avas_123456`;
			const fs = global.nodemodule["fs-extra"];
			const { loadImage, createCanvas } = require("canvas");
			const request = global.nodemodule["request"];
			const path = require('path');
			const axios = global.nodemodule["axios"];
			const Canvas = require('canvas');

			if (event.senderID != handleReply.author) return api.sendMessage("Please let the user create the image", event.threadID, event.messageID);

			if (handleReply.step == 1) {
				api.unsendMessage(handleReply.messageID);
				var x = [];
				for (let e = 0; e < u.length; e++) {
					const t = (await axios.get(`${u[e]}`, { responseType: "stream" })).data;
					x.push(t)
				}
				var msg = ({
					body: `You selected character name: ${event.body}, reply to this message and choose rank frame\n🔥 Image 1: "Master"\n🌈 Image 2: "Warrior"\n⚜️ Image 3: "Challenger"`,
					attachment: x
				})
				return api.sendMessage(msg, event.threadID, function (err, info) {
					return global.client.handleReply.push({
						step: 2,
						name: "aovavatar",
						messageID: info.messageID,
						image: handleReply.image,
						name: event.body,
						author: event.senderID
					})
				}, event.messageID);
			}
			else if (handleReply.step == 2) {
				if (isNaN(event.body)) return
				api.unsendMessage(handleReply.messageID);
				var l = [];
				for (let e = 0; e < f.length; e++) {
					const t = (await axios.get(`${f[e]}`, { responseType: "stream" })).data;
					l.push(t)
				}
				var msg = ({
					body: `You selected frame: ${event.body == 1 ? "Master" : event.body == "2" ? "Warrior" : "Challenger"}, reply to choose partner`,
					attachment: l
				})
				return api.sendMessage(msg, event.threadID, function (err, info) {
					return global.client.handleReply.push({
						step: 3,
						name: "aovavatar",
						messageID: info.messageID,
						image: handleReply.image,
						name: handleReply.name,
						frame: event.body,
						author: event.senderID
					})
				}, event.messageID);
			}
			else if (handleReply.step == 3) {
				if (isNaN(event.body)) return
				api.unsendMessage(handleReply.messageID);
				var l = [];
				for (let e = 0; e < g.length; e++) {
					const t = (await axios.get(`${g[e]}`, { responseType: "stream" })).data;
					l.push(t)
				}
				var msg = ({
					body: `You selected partner: ${event.body == 1 ? "Brother" : event.body == "2" ? "Friend" : event.body == "3" ? "Couple" : event.body == 4 ? "Sister" : "Unknown"}, reply to choose proficiency`,
					attachment: l
				})
				return api.sendMessage(msg, event.threadID, function (err, info) {
					return global.client.handleReply.push({
						step: 4,
						name: "aovavatar",
						messageID: info.messageID,
						image: handleReply.image,
						name: handleReply.name,
						frame: handleReply.frame,
						partner: event.body,
						author: event.senderID
					})
				}, event.messageID);
			}
			else if (handleReply.step == 4) {
				if (isNaN(event.body)) return
				api.unsendMessage(handleReply.messageID);
				var l = [];
				for (let e = 0; e < h.length; e++) {
					const t = (await axios.get(`${h[e]}`, { responseType: "stream" })).data;
					l.push(t)
				}
				var msg = ({
					body: `You selected proficiency: ${event.body == 1 ? "Grade D" : event.body == "2" ? "Grade C" : event.body == "3" ? "Grade B" : event.body == "4" ? "Grade A" : event.body == "5" ? "Grade S" : event.body == "6" ? "Top Region" : event.body == "7" ? "Top Area" : event.body == "8" ? "Top Vietnam" : "Top 1"}, reply to choose support spell`,
					attachment: l
				})
				return api.sendMessage(msg, event.threadID, function (err, info) {
					return global.client.handleReply.push({
						step: 5,
						name: "aovavatar",
						messageID: info.messageID,
						image: handleReply.image,
						name: handleReply.name,
						frame: handleReply.frame,
						partner: handleReply.partner,
						proficiency: event.body,
						author: event.senderID
					})
				}, event.messageID);
			}
			else if (handleReply.step == 5) {
				if (isNaN(event.body)) return
				api.unsendMessage(handleReply.messageID);
				var l = [];
				for (let e = 0; e < s.length; e++) {
					const t = (await axios.get(`${s[e]}`, { responseType: "stream" })).data;
					l.push(t)
				}
				var msg = ({
					body: `You selected support spell: ${event.body == 1 ? "Burst" : event.body == "2" ? "Tower Disable" : event.body == "3" ? "Rescue" : event.body == "4" ? "Roar" : event.body == "5" ? "Stun" : event.body == "6" ? "Weaken" : event.body == "7" ? "Purify" : event.body == "8" ? "Flash" : event.body == "9" ? "Sprint" : "Punish"}, reply to choose skin tier`,
					attachment: l
				})
				return api.sendMessage(msg, event.threadID, function (err, info) {
					return global.client.handleReply.push({
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
					})
				}, event.messageID);
			}
			else if (handleReply.step == 6) {
				if (isNaN(event.body)) return
				api.unsendMessage(handleReply.messageID);
				var l = [];
				for (let e = 0; e < w.length; e++) {
					const t = (await axios.get(`${w[e]}`, { responseType: "stream" })).data;
					l.push(t)
				}
				var msg = ({
					body: `You selected skin tier: ${event.body}, reply to choose badge`,
					attachment: l
				})
				return api.sendMessage(msg, event.threadID, function (err, info) {
					return global.client.handleReply.push({
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
					})
				}, event.messageID);
			}
			else if (handleReply.step == 7) {
				api.unsendMessage(handleReply.messageID);
				return api.sendMessage("Reply to this message and enter hero name", event.threadID, function (err, info) {
					return global.client.handleReply.push({
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
					})
				}, event.messageID);
			}
			else if (handleReply.step == 8) {
				api.unsendMessage(handleReply.messageID);
				return api.sendMessage("Reply to this message and enter skin name", event.threadID, function (err, info) {
					return global.client.handleReply.push({
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
					})
				}, event.messageID);
			}
			else if (handleReply.step == 9) {
				const name = handleReply.name;
				const frame = handleReply.frame;
				const partner = handleReply.partner;
				const proficiency = handleReply.proficiency;
				const support = handleReply.support;
				api.unsendMessage(handleReply.messageID);
				let background = (await axios.get(encodeURI(`${u[handleReply.frame - 1]}`), { responseType: "arraybuffer" })).data;
				fs.writeFileSync(pathImg, Buffer.from(background, "utf-8"));
				let ava = (await axios.get(encodeURI(`${handleReply.image}`), { responseType: "arraybuffer" })).data;
				fs.writeFileSync(pathAva, Buffer.from(ava, "utf-8"));
				let skinTierImg = (await axios.get(encodeURI(`${s[handleReply.skinTier - 1]}`), { responseType: "arraybuffer" })).data;
				fs.writeFileSync(pathx, Buffer.from(skinTierImg, "utf-8"));
				let supportImg = (await axios.get(encodeURI(`${h[handleReply.support - 1]}`), { responseType: "arraybuffer" })).data;
				fs.writeFileSync(pathBS, Buffer.from(supportImg, "utf-8"));
				let proficiencyImg = (await axios.get(encodeURI(`${g[handleReply.proficiency - 1]}`), { responseType: "arraybuffer" })).data;
				fs.writeFileSync(pathtop, Buffer.from(proficiencyImg, "utf-8"));
				let badgeImg = (await axios.get(encodeURI(`${w[handleReply.badge - 1]}`), { responseType: "arraybuffer" })).data;
				fs.writeFileSync(paththaku, Buffer.from(badgeImg, "utf-8"));
				let partnerImg = (await axios.get(encodeURI(`${f[handleReply.partner - 1]}`), { responseType: "arraybuffer" })).data;
				fs.writeFileSync(pathtph, Buffer.from(partnerImg, "utf-8"));
				let a = await loadImage(pathImg);
				let az = await loadImage(pathtop);
				let a2 = await loadImage(pathBS);
				let a3 = await loadImage(pathx);
				let a4 = await loadImage(pathtph);
				let a5 = await loadImage(paththaku);
				let a6 = await loadImage(pathAva);
				let canvas = createCanvas(a.width, a.height);
				var ctx = canvas.getContext("2d");
				ctx.clearRect(0, 0, canvas.width, canvas.height);
				Canvas.registerFont(__dirname + `/lq/ArialUnicodeMS.ttf`, { family: "Arial" });
				ctx.drawImage(a6, 0, 0, 720, 890);
				ctx.drawImage(a, 0, 0, canvas.width, canvas.height);
				var btw = 128;
				ctx.drawImage(a2, canvas.width / 2 - btw / 2, 905, btw, btw);
				ctx.drawImage(az, 15, 10, az.width, az.height);
				ctx.drawImage(a4, 108, 930, 90 * 27 / 24, 90);
				ctx.drawImage(a5, 473, 897, 143, 143);
				ctx.save();
				var a3scale = 2
				ctx.drawImage(a3, canvas.width / 2 - a3.width * a3scale / 2, 510, a3.width * a3scale, a3.height * a3scale);
				ctx.restore();
				ctx.save();
				ctx.textAlign = "center";
				ctx.fillStyle = "#f7ecb4"
				ctx.font = "50px Arial";
				ctx.fillText(handleReply.name, canvas.width / 2, 857);
				ctx.restore();
				ctx.save();
				ctx.textAlign = "center";
				ctx.shadowColor = "black";
				ctx.fillStyle = "#5d9af6"
				ctx.font = "50px Arial";
				ctx.lineWidth = 10;
				ctx.lineJoin = "round";
				ctx.strokeText(handleReply.heroName, canvas.width / 2, 770);
				ctx.fillText(handleReply.heroName, canvas.width / 2, 770);
				ctx.restore();
				ctx.save();
				ctx.textAlign = "center";
				ctx.shadowColor = "black";
				ctx.fillStyle = "#f7ecb4"
				ctx.font = "50px Arial";
				ctx.lineWidth = 10;
				ctx.lineJoin = "round";
				ctx.strokeText(event.body, canvas.width / 2, 700);
				ctx.fillText(event.body, canvas.width / 2, 700);
				ctx.restore();
				ctx.save();
				ctx.beginPath();
				const imageBuffer = canvas.toBuffer();
				fs.writeFileSync(pathImg, imageBuffer);
				return api.sendMessage({
					body: `✅ Avatar created successfully!\n\n⚜️ Ingame: ${name}\n🛡 Frame: ${frame == 1 ? "Master" : frame == "2" ? "Warrior" : "Challenger"}\n💕 Partner: ${partner == 1 ? "Brother" : partner == "2" ? "Friend" : partner == "3" ? "Couple" : partner == "4" ? "Sister" : "Unknown"}\n🔥 Proficiency: ${proficiency == 1 ? "Grade D" : proficiency == "2" ? "Grade C" : proficiency == "3" ? "Grade B" : proficiency == "4" ? "Grade A" : proficiency == "5" ? "Grade S" : proficiency == "6" ? "Top Region" : proficiency == "7" ? "Top Area" : proficiency == "8" ? "Top Vietnam" : "Top 1"}\n👑 Support: ${support == 1 ? "Burst" : support == "2" ? "Tower Disable" : support == "3" ? "Rescue" : support == "4" ? "Roar" : support == "5" ? "Stun" : support == "6" ? "Weaken" : support == "7" ? "Purify" : support == "8" ? "Flash" : support == "9" ? "Sprint" : "Punish"}`,
					attachment: fs.createReadStream(pathImg)
				},
					event.threadID,
					() =>
						fs.removeSync(pathImg),
					fs.removeSync(pathAva),
					fs.removeSync(pathBS),
					fs.removeSync(pathtop),
					fs.removeSync(paththaku),
					fs.removeSync(pathx),
					fs.removeSync(pathtph),
					event.messageID
				);
			}
		} catch (e) {
			console.log(e)
		}
	}
};
