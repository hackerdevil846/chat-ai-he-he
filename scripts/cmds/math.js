const axios = require("axios");
const fs = require("fs-extra");
const path = require("path");

module.exports = {
    config: {
        name: "math",
        aliases: ["calc", "calculate"],
        version: "1.0.1",
        author: "𝐴𝑠𝑖𝑓 𝑀𝑎ℎ𝑚𝑢𝑑",
        countDown: 5,
        role: 0,
        category: "𝑢𝑡𝑖𝑙𝑖𝑡𝑦",
        shortDescription: {
            en: "💡 𝑺𝒊𝒌𝒌𝒉𝒂𝒏 𝒌𝒂𝒋 — calculator, integrals, graphs, vectors"
        },
        longDescription: {
            en: "𝑪𝒂𝒍𝒄𝒖𝒍𝒂𝒕𝒐𝒓, 𝒊𝒏𝒕𝒆𝒈𝒓𝒂𝒍𝒔, 𝒈𝒓𝒂𝒑𝒉𝒔, 𝒗𝒆𝒄𝒕𝒐𝒓 𝒄𝒂𝒍𝒄𝒖𝒍𝒂𝒕𝒊𝒐𝒏𝒔 𝒖𝒔𝒊𝒏𝒈 𝑾𝒐𝒍𝒇𝒓𝒂𝒎𝑨𝒍𝒑𝒉𝒂"
        },
        guide: {
            en: "{p}math 1 + 2\n{p}math -p xdx\n{p}math -p xdx from 0 to 2\n{p}math -g y = x^3 - 9\n{p}math -v (1,2,3) - (5,6,7)"
        },
        dependencies: {
            "axios": "",
            "fs-extra": ""
        }
    },

    onStart: async function({ message, event, args }) {
        try {
            // Dependency check
            try {
                require("axios");
                require("fs-extra");
            } catch (e) {
                return message.reply("❌ 𝑀𝑖𝑠𝑠𝑖𝑛𝑔 𝑑𝑒𝑝𝑒𝑛𝑑𝑒𝑛𝑐𝑖𝑒𝑠. 𝑃𝑙𝑒𝑎𝑠𝑒 𝑖𝑛𝑠𝑡𝑎𝑙𝑙 𝑎𝑥𝑖𝑜𝑠 𝑎𝑛𝑑 𝑓𝑠-𝑒𝑥𝑡𝑟𝑎.");
            }

            // get content either from reply or args
            let content = (event.type == 'message_reply' && event.messageReply && event.messageReply.body) ? 
                event.messageReply.body : args.join(" ");
            
            const key = "T8J8YV-H265UQ762K"; // WolframAlpha API key

            if (!content) return message.reply("📝 𝐶𝑎𝑙𝑐𝑢𝑙𝑎𝑡𝑖𝑜𝑛 𝑑𝑒𝑛, 𝑏ℎ𝑎𝑖 — 𝑒.𝑔. `𝑚𝑎𝑡ℎ 1+2` 𝑏𝑎 `𝑚𝑎𝑡ℎ -𝑝 𝑥𝑑𝑥`");

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

            // Integral / Primitive calculations
            if (content.startsWith("-p")) {
                content = "primitive " + content.slice(3).trim();
                const url = `http://api.wolframalpha.com/v2/query?appid=${key}&input=${encodeURIComponent(content)}&output=json`;
                const { data } = await axios.get(url);
                const pods = data && data.queryresult && data.queryresult.pods;
                if (!pods) return message.reply("❗ 𝑊𝑜𝑙𝑓𝑟𝑎𝑚 𝑟𝑒𝑠𝑝𝑜𝑛𝑠𝑒 𝑝𝑎𝑤𝑎 𝑗𝑎𝑦 𝑛𝑎𝑖. 𝑇𝑟𝑦 𝑎𝑔𝑎𝑖𝑛.");

                // definite integral with limits
                if (/from\s+\S+\s+to\s+\S+/i.test(content)) {
                    const inputPod = getPod(pods, "Input");
                    if (!inputPod || !inputPod.subpods || !inputPod.subpods[0]) return message.reply("❗ 𝐼𝑛𝑝𝑢𝑡 𝑟𝑒𝑠𝑢𝑙𝑡 𝑛𝑎𝑖.");
                    const value = inputPod.subpods[0].plaintext || "";
                    // value sometimes like "Integral from 0 to 2 of x dx = 2"
                    if (value.includes("≈")) {
                        // attempt split around approximate sign
                        const [a, b] = value.split("≈");
                        const fractional = a.split(" = ").pop().trim();
                        const decimal = b.trim();
                        return message.reply(`📐 𝐼𝑛𝑡𝑒𝑔𝑟𝑎𝑙 (𝑓𝑟𝑎𝑐𝑡𝑖𝑜𝑛𝑎𝑙): ${fractional}\n🔢 𝐷𝑒𝑐𝑖𝑚𝑎𝑙 𝑎𝑝𝑝𝑟𝑜𝑥: ${decimal}`);
                    }
                    if (value.includes(" = ")) {
                        return message.reply(`📐 𝐼𝑛𝑡𝑒𝑔𝑟𝑎𝑙 𝑟𝑒𝑠𝑢𝑙𝑡: ${value.split(" = ").pop().trim()}`);
                    }
                    return message.reply(`📐 𝑅𝑒𝑠𝑢𝑙𝑡: ${value}`);
                }
                // indefinite integral (primitive)
                else {
                    const pod = getPod(pods, ["IndefiniteIntegral", "Indefinite integral", "Indefinite Integral"]);
                    if (!pod || !pod.subpods || !pod.subpods[0] || !pod.subpods[0].plaintext) return message.reply("❗ 𝐼𝑛𝑑𝑒𝑓𝑖𝑛𝑖𝑡𝑒 𝑖𝑛𝑡𝑒𝑔𝑟𝑎𝑙 𝑝𝑎𝑜𝑦𝑎 𝑗𝑎𝑐𝑐ℎ𝑒 𝑛𝑎.");
                    let resultText = pod.subpods[0].plaintext;
                    // common formatting fix
                    resultText = resultText.replace("+ constant", "").trim();
                    // if it's like "∫ x dx = x^2/2 + C"
                    if (resultText.includes(" = ")) resultText = resultText.split(" = ")[1].trim();
                    return message.reply(`🧮 𝐼𝑛𝑡𝑒𝑔𝑟𝑎𝑙 𝑟𝑒𝑠𝑢𝑙𝑡:\n${resultText}`);
                }
            }

            // Graph plotting
            else if (content.startsWith("-g")) {
                content = "plot " + content.slice(3).trim();
                const url = `http://api.wolframalpha.com/v2/query?appid=${key}&input=${encodeURIComponent(content)}&output=json`;
                const { data } = await axios.get(url);
                const pods = data && data.queryresult && data.queryresult.pods;
                if (!pods) return message.reply("❗ 𝑊𝑜𝑙𝑓𝑟𝑎𝑚 𝑟𝑒𝑠𝑝𝑜𝑛𝑠𝑒 𝑝𝑎𝑤𝑎 𝑗𝑎𝑦 𝑛𝑎𝑖. 𝑇𝑟𝑦 𝑎𝑔𝑎𝑖𝑛.");

                const pod = getPod(pods, ["Plot", "Plot of", "Plot"]);
                if (!pod || !pod.subpods || !pod.subpods[0] || !pod.subpods[0].img) return message.reply("❗ 𝐺𝑟𝑎𝑝ℎ 𝑖𝑚𝑎𝑔𝑒 𝑝𝑎𝑤𝑎 𝑗𝑎𝑐𝑐ℎ𝑒 𝑛𝑎.");
                const src = pod.subpods[0].img.src;
                const imgResp = await axios.get(src, { responseType: 'stream' });
                const outPath = path.join(__dirname, "cache", "graph.png");

                await fs.ensureDir(path.dirname(outPath));
                await new Promise((resolve, reject) => {
                    const ws = fs.createWriteStream(outPath);
                    imgResp.data.pipe(ws);
                    ws.on("finish", resolve);
                    ws.on("error", reject);
                });

                await message.reply({
                    body: "📊 𝐺𝑟𝑎𝑝ℎ 𝑟𝑒𝑠𝑢𝑙𝑡 — 𝑑𝑒𝑘ℎ𝑒𝑛 👇",
                    attachment: fs.createReadStream(outPath)
                });

                // Cleanup
                fs.unlinkSync(outPath);
            }

            // Vector calculations
            else if (content.startsWith("-v")) {
                // replace parentheses with angle brackets as original did
                content = "vector " + content.slice(3).trim().replace(/\(/g, "<").replace(/\)/g, ">");
                const url = `http://api.wolframalpha.com/v2/query?appid=${key}&input=${encodeURIComponent(content)}&output=json`;
                const { data } = await axios.get(url);
                const pods = data && data.queryresult && data.queryresult.pods;
                if (!pods) return message.reply("❗ 𝑊𝑜𝑙𝑓𝑟𝑎𝑚 𝑟𝑒𝑠𝑝𝑜𝑛𝑠𝑒 𝑝𝑎𝑤𝑎 𝑗𝑎𝑦 𝑛𝑎𝑖. 𝑇𝑟𝑦 𝑎𝑔𝑎𝑖𝑛.");

                const vectorPlotPod = getPod(pods, ["VectorPlot", "Vector field plot", "VectorPlot"]);
                const vectorLengthPod = getPod(pods, ["VectorLength", "Vector length"]);
                const resultPod = getPod(pods, ["Result", "Result"]);

                let vectorLength = vectorLengthPod && vectorLengthPod.subpods && vectorLengthPod.subpods[0] && vectorLengthPod.subpods[0].plaintext ? vectorLengthPod.subpods[0].plaintext : null;
                let resultText = resultPod && resultPod.subpods && resultPod.subpods[0] && resultPod.subpods[0].plaintext ? resultPod.subpods[0].plaintext : "";

                if (vectorPlotPod && vectorPlotPod.subpods && vectorPlotPod.subpods[0] && vectorPlotPod.subpods[0].img) {
                    const imgSrc = vectorPlotPod.subpods[0].img.src;
                    const imgResp = await axios.get(imgSrc, { responseType: 'stream' });
                    const outPath = path.join(__dirname, "cache", "vector.png");

                    await fs.ensureDir(path.dirname(outPath));
                    await new Promise((resolve, reject) => {
                        const ws = fs.createWriteStream(outPath);
                        imgResp.data.pipe(ws);
                        ws.on("finish", resolve);
                        ws.on("error", reject);
                    });

                    const bodyText = `${resultText ? resultText + "\n" : ""}${vectorLength ? `📏 𝑉𝑒𝑐𝑡𝑜𝑟 𝑙𝑒𝑛𝑔𝑡ℎ: ${vectorLength}` : ""}`;
                    await message.reply({
                        body: bodyText || "🧭 𝑉𝑒𝑐𝑡𝑜𝑟 𝑟𝑒𝑠𝑢𝑙𝑡 — 𝑠𝑒𝑒 𝑖𝑚𝑎𝑔𝑒",
                        attachment: fs.createReadStream(outPath)
                    });

                    // Cleanup
                    fs.unlinkSync(outPath);
                } else {
                    // no image, but maybe plaintext available
                    if (resultText || vectorLength) {
                        return message.reply(`${resultText ? resultText + "\n" : ""}${vectorLength ? `📏 𝑉𝑒𝑐𝑡𝑜𝑟 𝑙𝑒𝑛𝑔𝑡ℎ: ${vectorLength}` : ""}`);
                    }
                    return message.reply("❗ 𝑉𝑒𝑐𝑡𝑜𝑟 𝑝𝑙𝑜𝑡/𝑣𝑎𝑙𝑢𝑒𝑠 𝑝𝑎𝑤𝑎 𝑗𝑎𝑦 𝑛𝑎𝑖.");
                }
            }

            // Default calculations (solution/result)
            else {
                const url = `http://api.wolframalpha.com/v2/query?appid=${key}&input=${encodeURIComponent(content)}&output=json`;
                const { data } = await axios.get(url);
                const pods = data && data.queryresult && data.queryresult.pods;
                if (!pods) return message.reply("❗ 𝑊𝑜𝑙𝑓𝑟𝑎𝑚 𝑟𝑒𝑠𝑝𝑜𝑛𝑠𝑒 𝑝𝑎𝑤𝑎 𝑗𝑎𝑦 𝑛𝑎𝑖. 𝑇𝑟𝑦 𝑎𝑔𝑎𝑖𝑛.");

                let solution = getPod(pods, ["Solution", "Solutions"]) || getPod(pods, ["ComplexSolution", "Complex Solutions", "ComplexSolution"]) || getPod(pods, ["Result", "Result"]);

                if (solution && solution.subpods) {
                    const results = solution.subpods.map(e => e.plaintext || "").filter(Boolean);
                    if (results.length === 0) return message.reply("😢 𝐾𝑜𝑛𝑜𝑜 𝑠𝑜𝑙𝑢𝑡𝑖𝑜𝑛 𝑝𝑎𝑜𝑎 𝑗𝑎𝑐𝑐ℎ𝑒 𝑛𝑎.");
                    return message.reply(`✅ 𝑆𝑜𝑙𝑢𝑡𝑖𝑜𝑛:\n${results.join("\n")}`);
                } else {
                    return message.reply("😢 𝐾𝑜𝑛𝑜𝑜 𝑠𝑜𝑙𝑢𝑡𝑖𝑜𝑛 𝑝𝑎𝑜𝑎 𝑗𝑎𝑐𝑐ℎ𝑒 𝑛𝑎.");
                }
            }
        } catch (error) {
            console.error("𝑀𝑎𝑡ℎ 𝑐𝑜𝑚𝑚𝑎𝑛𝑑 𝑒𝑟𝑟𝑜𝑟:", error);
            return message.reply("⚠️ 𝐸𝑟𝑟𝑜𝑟 ℎ𝑜𝑦𝑒 𝑔𝑒𝑐ℎ𝑒 — 𝑎𝑚𝑖 𝑡𝑟𝑦 𝑘𝑜𝑟𝑒𝑐ℎ𝑖 𝑘𝑖𝑛𝑡𝑢 𝑘𝑎𝑗 𝑘𝑜𝑟𝑡𝑒𝑠𝑒 𝑛𝑎. 𝑃𝑙𝑒𝑎𝑠𝑒 𝑐ℎ𝑒𝑐𝑘 𝑦𝑜𝑢𝑟 𝑖𝑛𝑝𝑢𝑡 𝑜𝑟 𝑡𝑟𝑦 𝑎𝑔𝑎𝑖𝑛.");
        }
    }
};
