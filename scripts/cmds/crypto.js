module.exports.config = {
	name: "crypto",
	version: "2.0.0",
	hasPermssion: 0,
	credits: "𝑨𝒔𝒊𝒇 𝑴𝒂𝒉𝒎𝒖𝒅",
	description: "𝑹𝒆𝒂𝒍-𝒕𝒊𝒎𝒆 𝒄𝒓𝒚𝒑𝒕𝒐𝒄𝒖𝒓𝒓𝒆𝒏𝒄𝒚 𝒊𝒏𝒇𝒐𝒓𝒎𝒂𝒕𝒊𝒐𝒏 𝒘𝒊𝒕𝒉 𝒂𝒅𝒗𝒂𝒏𝒄𝒆𝒅 𝒇𝒆𝒂𝒕𝒖𝒓𝒆𝒔",
	category: "finance",
	usages: "[coin name] or [list]",
	cooldowns: 10,
	dependencies: {
		"axios": "",
		"fs-extra": "",
		"path": ""
	},
	envConfig: {
		"COIN_API": "https://api.coinpaprika.com/v1"
	}
};

module.exports.onStart = async function({ api, event, args }) {
	const axios = global.nodemodule["axios"];
	const fs = global.nodemodule["fs-extra"];
	const path = global.nodemodule["path"];
	
	// Mathematical Bold Italic formatting
	const formatText = (text) => {
		const boldItalicMap = {
			'A': '𝑨', 'B': '𝑩', 'C': '𝑪', 'D': '𝑫', 'E': '𝑬', 'F': '𝑭', 'G': '𝑮', 'H': '𝑯', 'I': '𝑰', 'J': '𝑱',
			'K': '𝑲', 'L': '𝑳', 'M': '𝑴', 'N': '𝑵', 'O': '𝑶', 'P': '𝑷', 'Q': '𝑸', 'R': '𝑹', 'S': '𝑺', 'T': '𝑻',
			'U': '𝑼', 'V': '𝑽', 'W': '𝑾', 'X': '𝑿', 'Y': '𝒀', 'Z': '𝒁',
			'a': '𝒂', 'b': '𝒃', 'c': '𝒄', 'd': '𝒅', 'e': '𝒆', 'f': '𝒇', 'g': '𝒈', 'h': '𝒉', 'i': '𝒊', 'j': '𝒋',
			'k': '𝒌', 'l': '𝒍', 'm': '𝒎', 'n': '𝒏', 'o': '𝒐', 'p': '𝒑', 'q': '𝒒', 'r': '𝒓', 's': '𝒔', 't': '𝒕',
			'u': '𝒖', 'v': '𝒗', 'w': '𝒘', 'x': '𝒙', 'y': '𝒚', 'z': '𝒛',
			'0': '𝟎', '1': '𝟏', '2': '𝟐', '3': '𝟑', '4': '𝟒', '5': '𝟓', '6': '𝟔', '7': '𝟕', '8': '𝟖', '9': '𝟗'
		};
		return text.split('').map(char => boldItalicMap[char] || char).join('');
	};

	// Format currency with proper symbols
	const formatCurrency = (value) => {
		return parseFloat(value).toLocaleString('en-US', {
			minimumFractionDigits: 2,
			maximumFractionDigits: 8
		});
	};

	// Available coins mapping with more cryptocurrencies
	const coinMapping = {
		"bitcoin": { id: "btc-bitcoin", symbol: "BTC" },
		"btc": { id: "btc-bitcoin", symbol: "BTC" },
		"ethereum": { id: "eth-ethereum", symbol: "ETH" },
		"eth": { id: "eth-ethereum", symbol: "ETH" },
		"tether": { id: "usdt-tether", symbol: "USDT" },
		"usdt": { id: "usdt-tether", symbol: "USDT" },
		"binance": { id: "bnb-binance-coin", symbol: "BNB" },
		"bnb": { id: "bnb-binance-coin", symbol: "BNB" },
		"usd coin": { id: "usdc-usd-coin", symbol: "USDC" },
		"usdc": { id: "usdc-usd-coin", symbol: "USDC" },
		"solana": { id: "sol-solana", symbol: "SOL" },
		"sol": { id: "sol-solana", symbol: "SOL" },
		"xrp": { id: "xrp-xrp", symbol: "XRP" },
		"cardano": { id: "ada-cardano", symbol: "ADA" },
		"ada": { id: "ada-cardano", symbol: "ADA" },
		"dogecoin": { id: "doge-dogecoin", symbol: "DOGE" },
		"doge": { id: "doge-dogecoin", symbol: "DOGE" },
		"polkadot": { id: "dot-polkadot", symbol: "DOT" },
		"dot": { id: "dot-polkadot", symbol: "DOT" },
		"shiba inu": { id: "shib-shiba-inu", symbol: "SHIB" },
		"shib": { id: "shib-shiba-inu", symbol: "SHIB" },
		"avalanche": { id: "avax-avalanche", symbol: "AVAX" },
		"avax": { id: "avax-avalanche", symbol: "AVAX" },
		"polygon": { id: "matic-polygon", symbol: "MATIC" },
		"matic": { id: "matic-polygon", symbol: "MATIC" },
		"chainlink": { id: "link-chainlink", symbol: "LINK" },
		"link": { id: "link-chainlink", symbol: "LINK" },
		"litecoin": { id: "ltc-litecoin", symbol: "LTC" },
		"ltc": { id: "ltc-litecoin", symbol: "LTC" },
		"bitcoin cash": { id: "bch-bitcoin-cash", symbol: "BCH" },
		"bch": { id: "bch-bitcoin-cash", symbol: "BCH" },
		"uniswap": { id: "uni-uniswap", symbol: "UNI" },
		"uni": { id: "uni-uniswap", symbol: "UNI" }
	};

	try {
		const input = args.join(" ").toLowerCase();
		
		// Show coin list if requested
		if (input === "list") {
			const coins = Object.keys(coinMapping).filter(key => !key.match(/\d/) && key.length > 2);
			const chunkSize = 15;
			let message = formatText("📋 Available Cryptocurrencies:\n\n");
			
			for (let i = 0; i < coins.length; i += chunkSize) {
				const chunk = coins.slice(i, i + chunkSize);
				message += chunk.map(coin => `• ${coin.charAt(0).toUpperCase() + coin.slice(1)}`).join('\n') + '\n\n';
			}
			
			message += formatText("💡 Usage: crypto [coin name]\nExample: crypto bitcoin");
			return api.sendMessage(message, event.threadID, event.messageID);
		}
		
		if (!input) {
			return api.sendMessage(
				formatText("🔍 Please specify a cryptocurrency.\n\nUse 'crypto list' to see all available coins.\n\nExample: crypto bitcoin"),
				event.threadID,
				event.messageID
			);
		}

		const coinInfo = coinMapping[input];
		if (!coinInfo) {
			return api.sendMessage(
				formatText("❌ Invalid coin name. Use 'crypto list' to see all available coins."),
				event.threadID,
				event.messageID
			);
		}

		const response = await axios.get(`https://api.coinpaprika.com/v1/ticker/${coinInfo.id}`);
		const coinData = response.data;
		
		if (!coinData || !coinData.name) {
			return api.sendMessage(formatText("❌ Could not retrieve data for this coin. Please try again later."), event.threadID, event.messageID);
		}

		// Create cache directory
		const cachePath = path.join(__dirname, 'cache', 'crypto');
		if (!fs.existsSync(cachePath)) fs.mkdirSync(cachePath, { recursive: true });
		
		const logoPath = path.join(cachePath, `${coinInfo.id}.png`);
		const logoUrl = `https://static.coinpaprika.com/coin/${coinInfo.id}/logo.png?rev=10557311`;
		
		// Download coin logo
		try {
			const logoResponse = await axios.get(logoUrl, { responseType: 'arraybuffer' });
			fs.writeFileSync(logoPath, logoResponse.data);
		} catch (error) {
			console.log("Could not download logo, using text-only response");
		}
		
		// Format data with emojis and Mathematical Bold Italic
		const priceChangeEmoji = coinData.percent_change_24h >= 0 ? "📈" : "📉";
		const priceChangeColor = coinData.percent_change_24h >= 0 ? "🟢" : "🔴";
		
		// Create beautiful message format
		const message = formatText(
			`✨ ─── ${coinData.name} (${coinData.symbol}) ─── ✨\n\n` +
			`🏆  Rank: #${coinData.rank}\n` +
			`💰  Price: $${formatCurrency(coinData.price_usd)}\n` +
			`₿   BTC Price: ${formatCurrency(coinData.price_btc)} BTC\n` +
			`📊  Market Cap: $${formatCurrency(coinData.market_cap_usd)}\n` +
			`🔄  24h Volume: $${formatCurrency(coinData.volume_24h_usd)}\n` +
			`${priceChangeEmoji}  24h Change: ${priceChangeColor} ${coinData.percent_change_24h}%\n\n` +
			`⏰  Updated: ${new Date().toLocaleString()}`
		);

		// Check if logo exists before trying to send it
		if (fs.existsSync(logoPath)) {
			api.sendMessage({
				body: message,
				attachment: fs.createReadStream(logoPath)
			}, event.threadID, () => {
				// Clean up after sending
				try { fs.unlinkSync(logoPath); } catch (e) {}
			}, event.messageID);
		} else {
			api.sendMessage(message, event.threadID, event.messageID);
		}

	} catch (error) {
		console.error('[CRYPTO ERROR]', error);
		api.sendMessage(formatText("❌ An error occurred while fetching crypto data. Please try again later."), event.threadID, event.messageID);
	}
};

module.exports.handleEvent = async function({ api, event }) {
	// Optional: Add periodic crypto updates or other event handling
};

module.exports.onLoad = function() {
	// Create cache directory on load - with proper error handling
	try {
		if (global.nodemodule && global.nodemodule["fs-extra"] && global.nodemodule["path"]) {
			const fs = global.nodemodule["fs-extra"];
			const path = global.nodemodule["path"];
			const cachePath = path.join(__dirname, 'cache', 'crypto');
			if (!fs.existsSync(cachePath)) fs.mkdirSync(cachePath, { recursive: true });
		}
	} catch (error) {
		console.log("Cache directory will be created when needed");
	}
};
