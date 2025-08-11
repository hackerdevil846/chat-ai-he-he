const axios = require("axios");
const fs = require("fs-extra");

module.exports.config = {
	name: "math",
	version: "1.0.1",
	hasPermssion: 0,
	credits: "𝑨𝒔𝒊𝒇 𝑴𝒂𝒉𝒎𝒖𝒅",
	description: "𝑺𝒊𝒌𝒌𝒉𝒂𝒏 𝒌𝒂𝒋",
	commandCategory: "𝑺𝒊𝒌𝒌𝒉𝒂",
	usages: "𝒎𝒂𝒕𝒉 1 + 2",
	cooldowns: 5,
	dependencies: {
		"axios": "",
		"fs-extra": ""
	},
	info: [
		{
			key: 'none',
			prompt: '',
			type: '𝑶𝒑𝒆𝒓𝒂𝒕𝒊𝒐𝒏',
			example: '𝒎𝒂𝒕𝒉 x+1=2'
		},
		{
			key: '-p',
			prompt: '𝑰𝒏𝒕𝒆𝒈𝒓𝒂𝒍',
			type: '𝑬𝒒𝒖𝒂𝒕𝒊𝒐𝒏',
			example: '𝒎𝒂𝒕𝒉 -𝒑 xdx'
		},
		{
			key: '-p',
			prompt: '𝑰𝒏𝒕𝒆𝒈𝒓𝒂𝒍 (𝒍𝒊𝒎𝒊𝒕𝒔)',
			type: '𝑬𝒒𝒖𝒂𝒕𝒊𝒐𝒏',
			example: '𝒎𝒂𝒕𝒉 -𝒑 xdx 𝒇𝒓𝒐𝒎 0 𝒕𝒐 2'
		},
		{
			key: '-g',
			prompt: '𝑮𝒓𝒂𝒑𝒉',
			type: '𝑬𝒒𝒖𝒂𝒕𝒊𝒐𝒏',
			example: '𝒎𝒂𝒕𝒉 -𝒈 y = x^3 - 9'
		},
		{
			key: '-v',
			prompt: '𝑽𝒆𝒄𝒕𝒐𝒓',
			type: '𝑽𝒆𝒄𝒕𝒐𝒓 𝒄𝒐𝒐𝒓𝒅𝒊𝒏𝒂𝒕𝒆𝒔',
			example: '𝒎𝒂𝒕𝒉 -𝒗 (1, 2, 3) - (5, 6, 7)'
		}
	],
	envConfig: {
		"WOLFRAM": "T8J8YV-H265UQ762K"
	}
};

module.exports.run = async function ({ api, event, args }) {
	const out = (msg) => api.sendMessage(msg, event.threadID, event.messageID);
	let content = (event.type == 'message_reply') ? event.messageReply.body : args.join(" ");
	const key = global.configModule.math.WOLFRAM;
	
	if (!content) return out("𝑪𝒂𝒍𝒄𝒖𝒍𝒂𝒕𝒊𝒐𝒏 𝒆𝒏𝒕𝒆𝒓 𝒌𝒐𝒓𝒖𝒏 📝");
	
	try {
		// Integral/Primitive calculations
		if (content.startsWith("-p")) {
			content = "primitive " + content.slice(3);
			const data = (await axios.get(`http://api.wolframalpha.com/v2/query?appid=${key}&input=${encodeURIComponent(content)}&output=json`)).data;
			
			if (content.includes("from") && content.includes("to")) {
				const value = data.queryresult.pods.find(e => e.id == "Input").subpods[0].plaintext;
				if (value.includes("≈")) {
					const [a, b] = value.split("≈");
					const fractional = a.split(" = ")[1];
					const decimal = b;
					return out(`𝑭𝒓𝒂𝒄𝒕𝒊𝒐𝒏𝒂𝒍: ${fractional}\n𝑫𝒆𝒄𝒊𝒎𝒂𝒍: ${decimal}`);
				}
				return out(value.split(" = ")[1]);
			} 
			else {
				const result = (data.queryresult.pods.find(e => e.id == "IndefiniteIntegral").subpods[0].plaintext.split(" = ")[1]).replace("+ constant", "");
				return out(`𝑰𝒏𝒕𝒆𝒈𝒓𝒂𝒍 𝒓𝒆𝒔𝒖𝒍𝒕: ${result}`);
			}
		}
		
		// Graph plotting
		else if (content.startsWith("-g")) {
			content = "plot " + content.slice(3);
			const data = (await axios.get(`http://api.wolframalpha.com/v2/query?appid=${key}&input=${encodeURIComponent(content)}&output=json`)).data;
			const pod = data.queryresult.pods.find(e => e.id == "Plot") || data.queryresult.pods.find(e => e.id == "ImplicitPlot");
			const src = pod.subpods[0].img.src;
			const img = (await axios.get(src, { responseType: 'stream' })).data;
			const path = "./graph.png";
			
			img.pipe(fs.createWriteStream(path)).on("close", () => {
				api.sendMessage({ 
					body: "𝑮𝒓𝒂𝒑𝒉 𝒓𝒆𝒔𝒖𝒍𝒕 📊",
					attachment: fs.createReadStream(path) 
				}, event.threadID, () => fs.unlinkSync(path), event.messageID);
			});
		}
		
		// Vector calculations
		else if (content.startsWith("-v")) {
			content = "vector " + content.slice(3).replace(/\(/g, "<").replace(/\)/g, ">");
			const data = (await axios.get(`http://api.wolframalpha.com/v2/query?appid=${key}&input=${encodeURIComponent(content)}&output=json`)).data;
			const vectorPlot = data.queryresult.pods.find(e => e.id == "VectorPlot").subpods[0].img.src;
			const vectorLength = data.queryresult.pods.find(e => e.id == "VectorLength").subpods[0].plaintext;
			const resultPod = data.queryresult.pods.find(e => e.id == "Result");
			const result = resultPod ? resultPod.subpods[0].plaintext : "";
			const img = (await axios.get(vectorPlot, { responseType: 'stream' })).data;
			const path = "./vector.png";
			
			img.pipe(fs.createWriteStream(path)).on("close", () => {
				api.sendMessage({ 
					body: `${result ? result + "\n" : ""}𝑽𝒆𝒄𝒕𝒐𝒓 𝑳𝒆𝒏𝒈𝒕𝒉: ${vectorLength}`,
					attachment: fs.createReadStream(path) 
				}, event.threadID, () => fs.unlinkSync(path), event.messageID);
			});
		}
		
		// Default calculations
		else {
			const data = (await axios.get(`http://api.wolframalpha.com/v2/query?appid=${key}&input=${encodeURIComponent(content)}&output=json`)).data;
			let solution;
			
			if (data.queryresult.pods.some(e => e.id == "Solution")) {
				solution = data.queryresult.pods.find(e => e.id == "Solution");
			} 
			else if (data.queryresult.pods.some(e => e.id == "ComplexSolution")) {
				solution = data.queryresult.pods.find(e => e.id == "ComplexSolution");
			} 
			else if (data.queryresult.pods.some(e => e.id == "Result")) {
				solution = data.queryresult.pods.find(e => e.id == "Result");
			}
			
			if (solution) {
				const results = solution.subpods.map(e => e.plaintext);
				return out(`𝑺𝒐𝒍𝒖𝒕𝒊𝒐𝒏:\n${results.join("\n")}`);
			} 
			else {
				return out("𝑲𝒐𝒏𝒐 𝒔𝒐𝒍𝒖𝒕𝒊𝒐𝒏 𝒑𝒂𝒘𝒂 𝒋𝒂𝒊𝒏𝒊 😢");
			}
		}
	} 
	catch (error) {
		console.error(error);
		return out("𝑬𝒓𝒓𝒐𝒓: 𝒌𝒂𝒋 𝒌𝒐𝒓𝒕𝒆 𝒑𝒂𝒓𝒄𝒉𝒊𝒏𝒊 😢");
	}
}
