module.exports.config = {
	name: "crypto",
	version: "1.1.0",
	hasPermssion: 0,
	credits: "𝑨𝒔𝒊𝒇 𝑴𝒂𝒉𝒎𝒖𝒅",
	description: "𝑹𝒆𝒂𝒍-𝒕𝒊𝒎𝒆 𝒄𝒓𝒚𝒑𝒕𝒐𝒄𝒖𝒓𝒓𝒆𝒏𝒄𝒚 𝒊𝒏𝒇𝒐𝒓𝒎𝒂𝒕𝒊𝒐𝒏",
	commandCategory: "𝑼𝒕𝒊𝒍𝒊𝒕𝒚",
	usages: "[𝒄𝒐𝒊𝒏 𝒏𝒂𝒎𝒆]",
	cooldowns: 5
};

module.exports.run = async ({ api, event, args }) => {
	const axios = global.nodemodule["axios"];
	const fs = require('fs-extra');
	const path = require('path');
	
	// Mathematical Bold Italic helper
	const formatText = (text) => {
		const boldItalicMap = {
			'A': '𝑨', 'B': '𝑩', 'C': '𝑪', 'D': '𝑫', 'E': '𝑬', 'F': '𝑭', 'G': '𝑮', 'H': '𝑯', 'I': '𝑰', 'J': '𝑱',
			'K': '𝑲', 'L': '𝑳', 'M': '𝑴', 'N': '𝑵', 'O': '𝑶', 'P': '𝑷', 'Q': '𝑸', 'R': '𝑹', 'S': '𝑺', 'T': '𝑻',
			'U': '𝑼', 'V': '𝑽', 'W': '𝑾', 'X': '𝑿', 'Y': '𝒀', 'Z': '𝒁',
			'a': '𝒂', 'b': '𝒃', 'c': '𝒄', 'd': '𝒅', 'e': '𝒆', 'f': '𝒇', 'g': '𝒈', 'h': '𝒉', 'i': '𝒊', 'j': '𝒋',
			'k': '𝒌', 'l': '𝒍', 'm': '𝒎', 'n': '𝒏', 'o': '𝒐', 'p': '𝒑', 'q': '𝒒', 'r': '𝒓', 's': '𝒔', 't': '𝒕',
			'u': '𝒖', 'v': '𝒗', 'w': '𝒘', 'x': '𝒙', 'y': '𝒚', 'z': '𝒛'
		};
		return text.replace(/[a-zA-Z]/g, char => boldItalicMap[char] || char);
	};

	// Format currency with proper symbols
	const formatCurrency = (value) => {
		return parseFloat(value).toLocaleString('en-US', {
			minimumFractionDigits: 2,
			maximumFractionDigits: 8
		});
	};

	// Available coins mapping
	const coinMapping = {
		"bitcoin": "btc-bitcoin",
		"btc": "btc-bitcoin",
		"ethereum": "eth-ethereum",
		"eth": "eth-ethereum",
		"tether": "usdt-tether",
		"usdt": "usdt-tether",
		"binance": "bnb-binance-coin",
		"bnb": "bnb-binance-coin",
		"usd coin": "usdc-usd-coin",
		"usdc": "usdc-usd-coin",
		"hex": "hex-hex",
		"solana": "sol-solana",
		"sol": "sol-solana",
		"xrp": "xrp-xrp",
		"terra": "luna-terra",
		"luna": "luna-terra",
		"cardano": "ada-cardano",
		"ada": "ada-cardano",
		"terrausd": "ust-terrausd",
		"ust": "ust-terrausd",
		"dogecoin": "doge-dogecoin",
		"doge": "doge-dogecoin",
		"polkadot": "dot-polkadot",
		"dot": "dot-polkadot",
		"shiba inu": "shib-shiba-inu",
		"shib": "shib-shiba-inu",
		"avalanche": "avax-avalanche",
		"avax": "avax-avalanche",
		"polygon": "matic-polygon",
		"matic": "matic-polygon",
		"chainlink": "link-chainlink",
		"link": "link-chainlink"
	};

	try {
		const coinName = args.join(" ").toLowerCase();
		if (!coinName) {
			const coinList = Object.keys(coinMapping).filter(key => !key.match(/\d/)).join("\n");
			return api.sendMessage(
				formatText(`🔍 Please specify a cryptocurrency.\n\nAvailable coins:\n${coinList}\n\nExample: crypto btc`),
				event.threadID,
				event.messageID
			);
		}

		const coinId = coinMapping[coinName];
		if (!coinId) {
			const coinList = Object.keys(coinMapping).filter(key => !key.match(/\d/)).join("\n");
			return api.sendMessage(
				formatText(`❌ Invalid coin name. Available coins:\n${coinList}\n\nExample: crypto btc`),
				event.threadID,
				event.messageID
			);
		}

		const response = await axios.get(`https://api.coinpaprika.com/v1/ticker/${coinId}`);
		const coinData = response.data;
		
		if (!coinData || !coinData.name) {
			return api.sendMessage(formatText("❌ Could not retrieve data for this coin. Please try again later."), event.threadID, event.messageID);
		}

		// Create cache directory
		const cachePath = path.join(__dirname, 'cache', 'crypto');
		if (!fs.existsSync(cachePath)) fs.mkdirSync(cachePath, { recursive: true });
		
		const logoPath = path.join(cachePath, `${coinId}.png`);
		const logoUrl = `https://static.coinpaprika.com/coin/${coinId}/logo.png?rev=10557311`;
		
		// Download coin logo
		const logoResponse = await axios.get(logoUrl, { responseType: 'arraybuffer' });
		fs.writeFileSync(logoPath, logoResponse.data);
		
		// Format data with emojis and Mathematical Bold Italic
		const priceChangeEmoji = coinData.percent_change_24h >= 0 ? "📈" : "📉";
		const priceChangeColor = coinData.percent_change_24h >= 0 ? "🟢" : "🔴";
		
		const message = formatText(
			`💰 ${coinData.name} (${coinData.symbol.toUpperCase()})\n\n` +
			`🏆 Rank: #${coinData.rank}\n` +
			`💵 Price: $${formatCurrency(coinData.price_usd)}\n` +
			`₿ BTC Price: ${formatCurrency(coinData.price_btc)} BTC\n` +
			`${priceChangeEmoji} 24h Change: ${priceChangeColor} ${coinData.percent_change_24h}%\n\n` +
			`🔄 Updated: ${new Date().toLocaleString()}`
		);

		api.sendMessage({
			body: message,
			attachment: fs.createReadStream(logoPath)
		}, event.threadID, () => {
			// Clean up after sending
			fs.unlinkSync(logoPath);
		}, event.messageID);

	} catch (error) {
		console.error('[CRYPTO ERROR]', error);
		api.sendMessage(formatText("❌ An error occurred while fetching crypto data. Please try again later."), event.threadID, event.messageID);
	}
};
