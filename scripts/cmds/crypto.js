const axios = require("axios");
const fs = require("fs-extra");
const path = require("path");

module.exports.config = {
    name: "crypto",
    aliases: ["cryptocurrency", "coin"],
    version: "2.0.0",
    author: "𝐴𝑠𝑖𝑓 𝑀𝑎ℎ𝑚𝑢𝑑",
    countDown: 10,
    role: 0,
    category: "finance",
    shortDescription: {
        en: "𝑅𝑒𝑎𝑙-𝑡𝑖𝑚𝑒 𝑐𝑟𝑦𝑝𝑡𝑜𝑐𝑢𝑟𝑟𝑒𝑛𝑐𝑦 𝑖𝑛𝑓𝑜𝑟𝑚𝑎𝑡𝑖𝑜𝑛"
    },
    longDescription: {
        en: "𝐺𝑒𝑡 𝑟𝑒𝑎𝑙-𝑡𝑖𝑚𝑒 𝑐𝑟𝑦𝑝𝑡𝑜𝑐𝑢𝑟𝑟𝑒𝑛𝑐𝑦 𝑝𝑟𝑖𝑐𝑒𝑠 𝑎𝑛𝑑 𝑖𝑛𝑓𝑜𝑟𝑚𝑎𝑡𝑖𝑜𝑛"
    },
    guide: {
        en: "{p}crypto [𝑐𝑜𝑖𝑛 𝑛𝑎𝑚𝑒] 𝑜𝑟 {p}crypto 𝑙𝑖𝑠𝑡"
    },
    dependencies: {
        "axios": "",
        "fs-extra": "",
        "path": ""
    }
};

module.exports.onStart = async function({ message, event, args }) {
    try {
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

        const input = args.join(" ").toLowerCase();
        
        // Show coin list if requested
        if (input === "list") {
            const coins = Object.keys(coinMapping).filter(key => !key.match(/\d/) && key.length > 2);
            const chunkSize = 15;
            let msg = formatText("📋 𝐴𝑣𝑎𝑖𝑙𝑎𝑏𝑙𝑒 𝐶𝑟𝑦𝑝𝑡𝑜𝑐𝑢𝑟𝑟𝑒𝑛𝑐𝑖𝑒𝑠:\n\n");
            
            for (let i = 0; i < coins.length; i += chunkSize) {
                const chunk = coins.slice(i, i + chunkSize);
                msg += chunk.map(coin => `• ${coin.charAt(0).toUpperCase() + coin.slice(1)}`).join('\n') + '\n\n';
            }
            
            msg += formatText("💡 𝑈𝑠𝑎𝑔𝑒: 𝑐𝑟𝑦𝑝𝑡𝑜 [𝑐𝑜𝑖𝑛 𝑛𝑎𝑚𝑒]\n𝐸𝑥𝑎𝑚𝑝𝑙𝑒: 𝑐𝑟𝑦𝑝𝑡𝑜 𝑏𝑖𝑡𝑐𝑜𝑖𝑛");
            return message.reply(msg);
        }
        
        if (!input) {
            return message.reply(
                formatText("🔍 𝑃𝑙𝑒𝑎𝑠𝑒 𝑠𝑝𝑒𝑐𝑖𝑓𝑦 𝑎 𝑐𝑟𝑦𝑝𝑡𝑜𝑐𝑢𝑟𝑟𝑒𝑛𝑐𝑦.\n\n𝑈𝑠𝑒 '𝑐𝑟𝑦𝑝𝑡𝑜 𝑙𝑖𝑠𝑡' 𝑡𝑜 𝑠𝑒𝑒 𝑎𝑙𝑙 𝑎𝑣𝑎𝑖𝑙𝑎𝑏𝑙𝑒 𝑐𝑜𝑖𝑛𝑠.\n\n𝐸𝑥𝑎𝑚𝑝𝑙𝑒: 𝑐𝑟𝑦𝑝𝑡𝑜 𝑏𝑖𝑡𝑐𝑜𝑖𝑛")
            );
        }

        const coinInfo = coinMapping[input];
        if (!coinInfo) {
            return message.reply(
                formatText("❌ 𝐼𝑛𝑣𝑎𝑙𝑖𝑑 𝑐𝑜𝑖𝑛 𝑛𝑎𝑚𝑒. 𝑈𝑠𝑒 '𝑐𝑟𝑦𝑝𝑡𝑜 𝑙𝑖𝑠𝑡' 𝑡𝑜 𝑠𝑒𝑒 𝑎𝑙𝑙 𝑎𝑣𝑎𝑖𝑙𝑎𝑏𝑙𝑒 𝑐𝑜𝑖𝑛𝑠.")
            );
        }

        const response = await axios.get(`https://api.coinpaprika.com/v1/ticker/${coinInfo.id}`);
        const coinData = response.data;
        
        if (!coinData || !coinData.name) {
            return message.reply(formatText("❌ 𝐶𝑜𝑢𝑙𝑑 𝑛𝑜𝑡 𝑟𝑒𝑡𝑟𝑖𝑒𝑣𝑒 𝑑𝑎𝑡𝑎 𝑓𝑜𝑟 𝑡ℎ𝑖𝑠 𝑐𝑜𝑖𝑛. 𝑃𝑙𝑒𝑎𝑠𝑒 𝑡𝑟𝑦 𝑎𝑔𝑎𝑖𝑛 𝑙𝑎𝑡𝑒𝑟."));
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
            console.log("𝐶𝑜𝑢𝑙𝑑 𝑛𝑜𝑡 𝑑𝑜𝑤𝑛𝑙𝑜𝑎𝑑 𝑙𝑜𝑔𝑜, 𝑢𝑠𝑖𝑛𝑔 𝑡𝑒𝑥𝑡-𝑜𝑛𝑙𝑦 𝑟𝑒𝑠𝑝𝑜𝑛𝑠𝑒");
        }
        
        // Format data with emojis and Mathematical Bold Italic
        const priceChangeEmoji = coinData.percent_change_24h >= 0 ? "📈" : "📉";
        const priceChangeColor = coinData.percent_change_24h >= 0 ? "🟢" : "🔴";
        
        // Create beautiful message format
        const msg = formatText(
            `✨ ─── ${coinData.name} (${coinData.symbol}) ─── ✨\n\n` +
            `🏆  𝑅𝑎𝑛𝑘: #${coinData.rank}\n` +
            `💰  𝑃𝑟𝑖𝑐𝑒: $${formatCurrency(coinData.price_usd)}\n` +
            `₿   𝐵𝑇𝐶 𝑃𝑟𝑖𝑐𝑒: ${formatCurrency(coinData.price_btc)} 𝐵𝑇𝐶\n` +
            `📊  𝑀𝑎𝑟𝑘𝑒𝑡 𝐶𝑎𝑝: $${formatCurrency(coinData.market_cap_usd)}\n` +
            `🔄  24ℎ 𝑉𝑜𝑙𝑢𝑚𝑒: $${formatCurrency(coinData.volume_24h_usd)}\n` +
            `${priceChangeEmoji}  24ℎ 𝐶ℎ𝑎𝑛𝑔𝑒: ${priceChangeColor} ${coinData.percent_change_24h}%\n\n` +
            `⏰  𝑈𝑝𝑑𝑎𝑡𝑒𝑑: ${new Date().toLocaleString()}`
        );

        // Check if logo exists before trying to send it
        if (fs.existsSync(logoPath)) {
            message.reply({
                body: msg,
                attachment: fs.createReadStream(logoPath)
            }, (err) => {
                if (err) {
                    message.reply(msg);
                }
                // Clean up after sending
                try { fs.unlinkSync(logoPath); } catch (e) {}
            });
        } else {
            message.reply(msg);
        }

    } catch (error) {
        console.error('[𝐶𝑅𝑌𝑃𝑇𝑂 𝐸𝑅𝑅𝑂𝑅]', error);
        message.reply(formatText("❌ 𝐴𝑛 𝑒𝑟𝑟𝑜𝑟 𝑜𝑐𝑐𝑢𝑟𝑟𝑒𝑑 𝑤ℎ𝑖𝑙𝑒 𝑓𝑒𝑡𝑐ℎ𝑖𝑛𝑔 𝑐𝑟𝑦𝑝𝑡𝑜 𝑑𝑎𝑡𝑎. 𝑃𝑙𝑒𝑎𝑠𝑒 𝑡𝑟𝑦 𝑎𝑔𝑎𝑖𝑛 𝑙𝑎𝑡𝑒𝑟."));
    }
};

module.exports.onLoad = function() {
    // Create cache directory on load
    try {
        const cachePath = path.join(__dirname, 'cache', 'crypto');
        if (!fs.existsSync(cachePath)) fs.mkdirSync(cachePath, { recursive: true });
    } catch (error) {
        console.log("𝐶𝑎𝑐ℎ𝑒 𝑑𝑖𝑟𝑒𝑐𝑡𝑜𝑟𝑦 𝑤𝑖𝑙𝑙 𝑏𝑒 𝑐𝑟𝑒𝑎𝑡𝑒𝑑 𝑤ℎ𝑒𝑛 𝑛𝑒𝑒𝑑𝑒𝑑");
    }
};
