const axios = require("axios");
const fs = require("fs-extra");
const path = require("path");

module.exports.config = {
	name: "math",
	version: "1.0.1",
	hasPermssion: 0,
	credits: "𝑨𝒔𝒊𝒇 𝑴𝒂𝒉𝒎𝒖𝒅",
	description: "𝑺𝒊𝒌𝒌𝒉𝒂𝒏 𝒌𝒂𝒋 — calculator, integrals, graphs, vectors",
	category: "𝑺𝒊𝒌𝒌𝒉𝒂",
	usages: "math 1 + 2\nmath -p xdx\nmath -p xdx from 0 to 2\nmath -g y = x^3 - 9\nmath -v (1,2,3) - (5,6,7)",
	cooldowns: 5,
	dependencies: {
		"axios": "",
		"fs-extra": ""
	},
	info: [
		{ key: 'none', prompt: '', type: '𝑶𝒑𝒆𝒓𝒂𝒕𝒊𝒐𝒏', example: 'math x+1=2' },
		{ key: '-p', prompt: '𝑰𝒏𝒕𝒆𝒈𝒓𝒂𝒍', type: '𝑬𝒒𝒖𝒂𝒕𝒊𝒐𝒏', example: 'math -p xdx' },
		{ key: '-p', prompt: '𝑰𝒏𝒕𝒆𝒈𝒓𝒂𝒍 (limits)', type: '𝑬𝒒𝒖𝒂𝒕𝒊𝒐𝒏', example: 'math -p xdx from 0 to 2' },
		{ key: '-g', prompt: '𝑮𝒓𝒂𝒑𝒉', type: '𝑬𝒒𝒖𝒂𝒕𝒊𝒐𝒏', example: 'math -g y = x^3 - 9' },
		{ key: '-v', prompt: '𝑽𝒆𝒄𝒕𝒐𝒓', type: '𝑽𝒆𝒄𝒕𝒐𝒓 𝒄𝒐𝒐𝒓𝒅𝒊𝒏𝒂𝒕𝒆𝒔', example: 'math -v (1, 2, 3) - (5, 6, 7)' }
	],
	envConfig: {
		"WOLFRAM": "T8J8YV-H265UQ762K"
	}
};

module.exports.onStart = async function ({ api, event, args }) {
	const out = (msg) => api.sendMessage(msg, event.threadID, event.messageID);
	// get content either from reply or args
	let content = (event.type == 'message_reply' && event.messageReply && event.messageReply.body) ? event.messageReply.body : args.join(" ");
	const key = (global.configModule && global.configModule.math && global.configModule.math.WOLFRAM) ? global.configModule.math.WOLFRAM : (process.env.WOLFRAM || module.exports.config.envConfig.WOLFRAM);

	if (!content) return out("📝 Calculation den, bhai — e.g. `math 1+2` ba `math -p xdx`");

	// helper to safely get pod by id or title
	const getPod = (pods, identifiers) => {
		if (!pods) return null;
		if (!Array.isArray(identifiers)) identifiers = [identifiers];
		return pods.find(p => {
			if (!p) return false;
			if (identifiers.some(id => p.id && p.id.toLowerCase() === id.toLowerCase())) return true;
			if (p.title && identifiers.some(id => p.title.toLowerCase().includes(id.toLowerCase()))) return true;
			return false;
		}) || null;
	};

	try {
		// Integral / Primitive calculations
		if (content.startsWith("-p")) {
			content = "primitive " + content.slice(3).trim();
			const url = `http://api.wolframalpha.com/v2/query?appid=${key}&input=${encodeURIComponent(content)}&output=json`;
			const { data } = await axios.get(url);
			const pods = data && data.queryresult && data.queryresult.pods;
			if (!pods) return out("❗ Wolfram response pawa jay nai. Try again.");

			// definite integral with limits
			if (/from\s+\S+\s+to\s+\S+/i.test(content)) {
				const inputPod = getPod(pods, "Input");
				if (!inputPod || !inputPod.subpods || !inputPod.subpods[0]) return out("❗ Input result nai.");
				const value = inputPod.subpods[0].plaintext || "";
				// value sometimes like "Integral from 0 to 2 of x dx = 2"
				if (value.includes("≈")) {
					// attempt split around approximate sign
					const [a, b] = value.split("≈");
					const fractional = a.split(" = ").pop().trim();
					const decimal = b.trim();
					return out(`📐 Integral (fractional): ${fractional}\n🔢 Decimal approx: ${decimal}`);
				}
				if (value.includes(" = ")) {
					return out(`📐 Integral result: ${value.split(" = ").pop().trim()}`);
				}
				return out(`📐 Result: ${value}`);
			}
			// indefinite integral (primitive)
			else {
				const pod = getPod(pods, ["IndefiniteIntegral", "Indefinite integral", "Indefinite Integral"]);
				if (!pod || !pod.subpods || !pod.subpods[0] || !pod.subpods[0].plaintext) return out("❗ Indefinite integral paoya jacche na.");
				let resultText = pod.subpods[0].plaintext;
				// common formatting fix
				resultText = resultText.replace("+ constant", "").trim();
				// if it's like "∫ x dx = x^2/2 + C"
				if (resultText.includes(" = ")) resultText = resultText.split(" = ")[1].trim();
				return out(`🧮 Integral result:\n${resultText}`);
			}
		}

		// Graph plotting
		else if (content.startsWith("-g")) {
			content = "plot " + content.slice(3).trim();
			const url = `http://api.wolframalpha.com/v2/query?appid=${key}&input=${encodeURIComponent(content)}&output=json`;
			const { data } = await axios.get(url);
			const pods = data && data.queryresult && data.queryresult.pods;
			if (!pods) return out("❗ Wolfram response pawa jay nai. Try again.");

			const pod = getPod(pods, ["Plot", "Plot of", "Plot"]);
			if (!pod || !pod.subpods || !pod.subpods[0] || !pod.subpods[0].img) return out("❗ Graph image pawa jacche na.");
			const src = pod.subpods[0].img.src;
			const imgResp = await axios.get(src, { responseType: 'stream' });
			const outPath = path.join(__dirname, "graph.png");

			await new Promise((resolve, reject) => {
				const ws = fs.createWriteStream(outPath);
				imgResp.data.pipe(ws);
				ws.on("finish", resolve);
				ws.on("error", reject);
			});

			api.sendMessage({
				body: "📊 Graph result — dekhen 👇",
				attachment: fs.createReadStream(outPath)
			}, event.threadID, () => {
				try { fs.unlinkSync(outPath); } catch (e) { /* ignore */ }
			}, event.messageID);
		}

		// Vector calculations
		else if (content.startsWith("-v")) {
			// replace parentheses with angle brackets as original did
			content = "vector " + content.slice(3).trim().replace(/\(/g, "<").replace(/\)/g, ">");
			const url = `http://api.wolframalpha.com/v2/query?appid=${key}&input=${encodeURIComponent(content)}&output=json`;
			const { data } = await axios.get(url);
			const pods = data && data.queryresult && data.queryresult.pods;
			if (!pods) return out("❗ Wolfram response pawa jay nai. Try again.");

			const vectorPlotPod = getPod(pods, ["VectorPlot", "Vector field plot", "VectorPlot"]);
			const vectorLengthPod = getPod(pods, ["VectorLength", "Vector length"]);
			const resultPod = getPod(pods, ["Result", "Result"]);

			let vectorLength = vectorLengthPod && vectorLengthPod.subpods && vectorLengthPod.subpods[0] && vectorLengthPod.subpods[0].plaintext ? vectorLengthPod.subpods[0].plaintext : null;
			let resultText = resultPod && resultPod.subpods && resultPod.subpods[0] && resultPod.subpods[0].plaintext ? resultPod.subpods[0].plaintext : "";

			if (vectorPlotPod && vectorPlotPod.subpods && vectorPlotPod.subpods[0] && vectorPlotPod.subpods[0].img) {
				const imgSrc = vectorPlotPod.subpods[0].img.src;
				const imgResp = await axios.get(imgSrc, { responseType: 'stream' });
				const outPath = path.join(__dirname, "vector.png");

				await new Promise((resolve, reject) => {
					const ws = fs.createWriteStream(outPath);
					imgResp.data.pipe(ws);
					ws.on("finish", resolve);
					ws.on("error", reject);
				});

				const bodyText = `${resultText ? resultText + "\n" : ""}${vectorLength ? `📏 Vector length: ${vectorLength}` : ""}`;
				api.sendMessage({
					body: bodyText || "🧭 Vector result — see image",
					attachment: fs.createReadStream(outPath)
				}, event.threadID, () => {
					try { fs.unlinkSync(outPath); } catch (e) { /* ignore */ }
				}, event.messageID);
			} else {
				// no image, but maybe plaintext available
				if (resultText || vectorLength) {
					return out(`${resultText ? resultText + "\n" : ""}${vectorLength ? `📏 Vector length: ${vectorLength}` : ""}`);
				}
				return out("❗ Vector plot/values pawa jay nai.");
			}
		}

		// Default calculations (solution/result)
		else {
			const url = `http://api.wolframalpha.com/v2/query?appid=${key}&input=${encodeURIComponent(content)}&output=json`;
			const { data } = await axios.get(url);
			const pods = data && data.queryresult && data.queryresult.pods;
			if (!pods) return out("❗ Wolfram response pawa jay nai. Try again.");

			let solution = getPod(pods, ["Solution", "Solutions"]) || getPod(pods, ["ComplexSolution", "Complex Solutions", "ComplexSolution"]) || getPod(pods, ["Result", "Result"]);

			if (solution && solution.subpods) {
				const results = solution.subpods.map(e => e.plaintext || "").filter(Boolean);
				if (results.length === 0) return out("😢 Konoo solution paoa jacche na.");
				return out(`✅ Solution:\n${results.join("\n")}`);
			} else {
				return out("😢 Konoo solution paoa jacche na.");
			}
		}
	} catch (error) {
		console.error("Math command error:", error && (error.stack || error.message || error));
		return out("⚠️ Error hoye geche — ami try korechi kintu kaj kortese na. Please check your input or try again.");
	}
};
