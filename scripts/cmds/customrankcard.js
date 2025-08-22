const { createCanvas, loadImage } = require('canvas');
const { uploadImgbb } = global.utils;

// URL check image regex
const checkUrlRegex = /https?:\/\/.*\.(?:png|jpg|jpeg|gif)/gi;
const regExColor = /#([0-9a-f]{6})|rgb\((\d{1,3}),\s*(\d{1,3}),\s*(\d{1,3})\)|rgba\((\d{1,3}),\s*(\d{1,3}),\s*(\d{1,3}),\s*(\d+\.?\d*)\)/gi;

module.exports.config = {
	name: "customrankcard",
	aliases: ["crc", "customrank", "rankcard"],
	version: "1.12",
	author: "𝑨𝒔𝒊𝒇 𝑴𝒂𝒉𝒎𝒖𝒅",
	countDown: 5,
	role: 0,
	description: {
		vi: "Thiết kế thẻ rank theo ý bạn",
		en: "✨ Design your own stylish rank card with custom colors and backgrounds"
	},
	category: "rank",
	guide: {
		en: {
			body: "🎨 {pn} [maincolor | subcolor | linecolor | expbarcolor | progresscolor | alphasubcolor | textcolor | namecolor | expcolor | rankcolor | levelcolor | reset] <value>"
				+ "\n\n🌈 Available options:"
				+ "\n  • maincolor | background <value> - Main background (gradient/image)"
				+ "\n  • subcolor <value> - Sub background"
				+ "\n  • linecolor <value> - Line between backgrounds"
				+ "\n  • expbarcolor <value> - Experience bar color"
				+ "\n  • progresscolor <value> - Current progress color"
				+ "\n  • alphasubcolor <value> - Sub background opacity (0-1)"
				+ "\n  • textcolor <value> - Text color"
				+ "\n  • namecolor <value> - Name color"
				+ "\n  • expcolor <value> - EXP text color"
				+ "\n  • rankcolor <value> - Rank text color"
				+ "\n  • levelcolor <value> - Level text color"
				+ "\n\n💡 Value can be: hex code, rgb, rgba, gradient (multiple colors), or image URL"
				+ "\n📸 You can also send an image as attachment"
				+ "\n\n🔄 {pn} reset - Reset all settings to default"
				+ "\n\n🎯 Examples:"
				+ "\n  • {pn} maincolor #fff000"
				+ "\n  • {pn} maincolor #0093E9 #80D0C7"
				+ "\n  • {pn} subcolor rgba(255,136,86,0.4)"
				+ "\n  • {pn} reset",
			attachment: {
				[`${__dirname}/assets/guide/customrankcard_1.jpg`]: "https://i.ibb.co/BZ2Qgs1/image.png",
				[`${__dirname}/assets/guide/customrankcard_2.png`]: "https://i.ibb.co/wy1ZHHL/image.png"
			}
		}
	}
};

module.exports.langs = {
	en: {
		invalidImage: "❌ Invalid image URL. Please provide a direct image link (jpg, jpeg, png, gif). You can upload to imgbb.com and use the direct link.",
		invalidAttachment: "❌ Please attach a valid image file",
		invalidColor: "❌ Invalid color code. Please use hex (#RRGGBB) or rgba format",
		notSupportImage: "❌ Image URLs are not supported for \"%1\" option",
		success: "✅ Your custom rank card settings have been saved!\n\n🎉 Preview:",
		reseted: "🔄 All rank card settings have been reset to default",
		invalidAlpha: "❌ Please choose an opacity value between 0 and 1"
	}
};

module.exports.run = async function ({ event, args, message, getLang, Threads, Users }) {
	if (!args[0]) return message.SyntaxError();

	const customRankCard = (await Threads.getData(event.threadID, "data.customRankCard")) || {};
	const key = args[0].toLowerCase();
	let value = args.slice(1).join(" ");

	const supportImage = ["maincolor", "background", "bg", "subcolor", "expbarcolor", "progresscolor", "linecolor"];
	const notSupportImage = ["textcolor", "namecolor", "expcolor", "rankcolor", "levelcolor", "lvcolor"];

	if ([...notSupportImage, ...supportImage].includes(key)) {
		const attachmentsReply = event.messageReply?.attachments;
		const attachments = [
			...event.attachments.filter(({ type }) => ["photo", "animated_image"].includes(type)),
			...attachmentsReply?.filter(({ type }) => ["photo", "animated_image"].includes(type)) || []
		];
		
		if (value === 'reset') {
			// Handle reset case
		}
		else if (value.match(/^https?:\/\//)) {
			const matchUrl = value.match(checkUrlRegex);
			if (!matchUrl) return message.reply(getLang("invalidImage"));
			const infoFile = await uploadImgbb(matchUrl[0], 'url');
			value = infoFile.image.url;
		}
		else if (attachments.length > 0) {
			if (!["photo", "animated_image"].includes(attachments[0].type))
				return message.reply(getLang("invalidAttachment"));
			const url = attachments[0].url;
			const infoFile = await uploadImgbb(url, 'url');
			value = infoFile.image.url;
		}
		else {
			const colors = value.match(regExColor);
			if (!colors) return message.reply(getLang("invalidColor"));
			value = colors.length === 1 ? colors[0] : colors;
		}

		if (value !== "reset" && notSupportImage.includes(key) && value.startsWith?.("http"))
			return message.reply(getLang("notSupportImage", key));

		switch (key) {
			case "maincolor":
			case "background":
			case "bg":
				value === "reset" ? delete customRankCard.main_color : customRankCard.main_color = value;
				break;
			case "subcolor":
				value === "reset" ? delete customRankCard.sub_color : customRankCard.sub_color = value;
				break;
			case "linecolor":
				value === "reset" ? delete customRankCard.line_color : customRankCard.line_color = value;
				break;
			case "progresscolor":
				value === "reset" ? delete customRankCard.exp_color : customRankCard.exp_color = value;
				break;
			case "expbarcolor":
				value === "reset" ? delete customRankCard.expNextLevel_color : customRankCard.expNextLevel_color = value;
				break;
			case "textcolor":
				value === "reset" ? delete customRankCard.text_color : customRankCard.text_color = value;
				break;
			case "namecolor":
				value === "reset" ? delete customRankCard.name_color : customRankCard.name_color = value;
				break;
			case "rankcolor":
				value === "reset" ? delete customRankCard.rank_color : customRankCard.rank_color = value;
				break;
			case "levelcolor":
			case "lvcolor":
				value === "reset" ? delete customRankCard.level_color : customRankCard.level_color = value;
				break;
			case "expcolor":
				value === "reset" ? delete customRankCard.exp_text_color : customRankCard.exp_text_color = value;
				break;
		}
		
		try {
			await Threads.setData(event.threadID, { customRankCard }, "data");
			
			// Generate preview with canvas
			const userData = await Users.getData(event.senderID);
			const rankCardPreview = await generateRankCardPreview(userData, customRankCard);
			
			message.reply({
				body: getLang("success"),
				attachment: rankCardPreview
			});
		}
		catch (err) {
			message.reply("❌ An error occurred: " + err.message);
		}
	}
	else if (["alphasubcolor", "alphasubcard"].includes(key)) {
		const alphaValue = parseFloat(value);
		if (isNaN(alphaValue) || alphaValue < 0 || alphaValue > 1)
			return message.reply(getLang("invalidAlpha"));
		customRankCard.alpha_subcard = alphaValue;
		
		try {
			await Threads.setData(event.threadID, { customRankCard }, "data");
			
			// Generate preview with canvas
			const userData = await Users.getData(event.senderID);
			const rankCardPreview = await generateRankCardPreview(userData, customRankCard);
			
			message.reply({
				body: getLang("success"),
				attachment: rankCardPreview
			});
		}
		catch (err) {
			message.reply("❌ An error occurred: " + err.message);
		}
	}
	else if (key === "reset") {
		try {
			await Threads.setData(event.threadID, { customRankCard: {} }, "data");
			message.reply(getLang("reseted"));
		}
		catch (err) {
			message.reply("❌ An error occurred: " + err.message);
		}
	}
	else {
		message.SyntaxError();
	}
};

// Function to generate rank card preview using canvas
async function generateRankCardPreview(userData, customRankCard) {
	const canvas = createCanvas(800, 300);
	const ctx = canvas.getContext('2d');
	
	// Background - main color
	if (customRankCard.main_color) {
		if (Array.isArray(customRankCard.main_color)) {
			// Gradient background
			const gradient = ctx.createLinearGradient(0, 0, canvas.width, canvas.height);
			customRankCard.main_color.forEach((color, i) => {
				gradient.addColorStop(i / (customRankCard.main_color.length - 1), color);
			});
			ctx.fillStyle = gradient;
		} else if (customRankCard.main_color.startsWith('http')) {
			// Image background
			try {
				const img = await loadImage(customRankCard.main_color);
				ctx.drawImage(img, 0, 0, canvas.width, canvas.height);
			} catch (e) {
				ctx.fillStyle = '#36393f';
				ctx.fillRect(0, 0, canvas.width, canvas.height);
			}
		} else {
			// Solid color background
			ctx.fillStyle = customRankCard.main_color;
			ctx.fillRect(0, 0, canvas.width, canvas.height);
		}
	} else {
		ctx.fillStyle = '#36393f';
		ctx.fillRect(0, 0, canvas.width, canvas.height);
	}
	
	// Sub background with alpha
	const alpha = customRankCard.alpha_subcard || 0.5;
	ctx.fillStyle = customRankCard.sub_color ? adjustAlpha(customRankCard.sub_color, alpha) : `rgba(0, 0, 0, ${alpha})`;
	ctx.fillRect(20, 20, canvas.width - 40, canvas.height - 40);
	
	// Line color
	if (customRankCard.line_color) {
		ctx.strokeStyle = customRankCard.line_color;
		ctx.lineWidth = 2;
		ctx.beginPath();
		ctx.moveTo(20, 60);
		ctx.lineTo(canvas.width - 20, 60);
		ctx.stroke();
	}
	
	// User name
	ctx.fillStyle = customRankCard.name_color || '#ffffff';
	ctx.font = 'bold 28px Arial';
	ctx.fillText(userData.name || 'User', 150, 80);
	
	// Level and rank
	ctx.fillStyle = customRankCard.level_color || '#f1c40f';
	ctx.font = '20px Arial';
	ctx.fillText('Level: 25', 150, 120);
	
	ctx.fillStyle = customRankCard.rank_color || '#e74c3c';
	ctx.fillText('Rank: #15', 300, 120);
	
	// Experience bar background
	ctx.fillStyle = customRankCard.expNextLevel_color || '#2c3e50';
	ctx.fillRect(150, 160, 500, 20);
	
	// Experience progress
	ctx.fillStyle = customRankCard.exp_color || '#3498db';
	ctx.fillRect(150, 160, 350, 20); // 70% filled
	
	// Experience text
	ctx.fillStyle = customRankCard.exp_text_color || '#ecf0f1';
	ctx.font = '16px Arial';
	ctx.fillText('3500/5000 XP', 150, 200);
	
	// Avatar placeholder
	ctx.beginPath();
	ctx.arc(80, 150, 60, 0, Math.PI * 2);
	ctx.closePath();
	ctx.clip();
	ctx.fillStyle = '#7f8c8d';
	ctx.fillRect(20, 90, 120, 120);
	
	return canvas.toBuffer();
}

// Helper function to adjust alpha for colors
function adjustAlpha(color, alpha) {
	if (color.startsWith('#')) {
		// Hex color
		const r = parseInt(color.slice(1, 3), 16);
		const g = parseInt(color.slice(3, 5), 16);
		const b = parseInt(color.slice(5, 7), 16);
		return `rgba(${r}, ${g}, ${b}, ${alpha})`;
	} else if (color.startsWith('rgb')) {
		// RGB or RGBA
		const match = color.match(/(\d+),\s*(\d+),\s*(\d+)(,\s*[\d.]+)?/);
		if (match) {
			return `rgba(${match[1]}, ${match[2]}, ${match[3]}, ${alpha})`;
		}
	}
	return color;
}
