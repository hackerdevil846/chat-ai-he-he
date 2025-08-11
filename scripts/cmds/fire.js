module.exports.config = {
	name: "fire",
	version: "1.0.2",
	permission: 2,
	credits: "𝑨𝒔𝒊𝒇 𝑴𝒂𝒉𝒎𝒖𝒅",
	prefix: false,
	description: "𝒔𝒑𝒆𝒄𝒊𝒂𝒍 𝒄𝒐𝒎𝒎𝒂𝒏𝒅 𝒃𝒚 𝑨𝒔𝒊𝒇",
	category: "𝒘𝒊𝒕𝒉𝒐𝒖𝒕 𝒑𝒓𝒆𝒇𝒊𝒙",
	usages: "[𝒕𝒂𝒈]",
	cooldowns: 5
};

const toMathBoldItalic = (text) => {
    const boldItalicMap = {
        A: '𝑨', B: '𝑩', C: '𝑪', D: '𝑫', E: '𝑬', F: '𝑭', G: '𝑮', H: '𝑯', I: '𝑰', J: '𝑱',
        K: '𝑲', L: '𝑳', M: '𝑴', N: '𝑵', O: '𝑶', P: '𝑷', Q: '𝑸', R: '𝑹', S: '𝑺', T: '𝑻',
        U: '𝑼', V: '𝑽', W: '𝑾', X: '𝑿', Y: '𝒀', Z: '𝒁',
        a: '𝒂', b: '𝒃', c: '𝒄', d: '𝒅', e: '𝒆', f: '𝒇', g: '𝒈', h: '𝒉', i: '𝒊', j: '𝒋',
        k: '𝒌', l: '𝒍', m: '𝒎', n: '𝒏', o: '𝒐', p: '𝒑', q: '𝒒', r: '𝒓', s: '𝒔', t: '𝒕',
        u: '𝒖', v: '𝒗', w: '𝒘', x: '𝒙', y: '𝒚', z: '𝒛'
    };
    
    return text.split('').map(char => boldItalicMap[char] || char).join('');
};

module.exports.run = async function({ api, event }) {
    const mention = Object.keys(event.mentions)[0];
    if (!mention) return api.sendMessage(toMathBoldItalic("Apnake kaka chudte chan emon 1 jonke @mention korte hobe"), event.threadID);
    
    const name = event.mentions[mention];
    const arraytag = [{ id: mention, tag: name }];
    
    const send = (msg) => api.sendMessage(msg, event.threadID);
    
    // Corrected Banglish messages with proper grammar
    const messages = [
        { text: "Chuda lo", delay: 0 },
        { text: "Khan kir pola, tor ma re chudi", delay: 3000, tag: true },
        { text: "Khan kir pola, tor kochi bon re chudi", delay: 5000, tag: true },
        { text: "Madarchod, tor ammur pom pom khan kir po", delay: 7000, tag: true },
        { text: "Khan kir pola, tor kochi voda voda kamor dimu", delay: 9000, tag: true },
        { text: "Khan ki magir pola, kotha kom kom tor ammu re chude banamu item bom", delay: 12000, tag: true },
        { text: "Depression thekeo tor ma re chuda", delay: 15000, tag: true },
        { text: "Tor ammu re achar er lob dekhi chudi magir pola", delay: 17000, tag: true },
        { text: "Bandir pola, tor kochi boner voda fak kore thutu diye voda dukamu", delay: 20000, tag: true },
        { text: "Bandi magir pola, tor ammu re chudi tor dula vai er kande fele", delay: 23000, tag: true },
        { text: "Uff khadama magir pola, tor ammur kala voday amar mal out, tor kochi bon re upta kore abar chudbo", delay: 25000, tag: true },
        { text: "Online e gali baji hoye gecho magir pola, emon chuda dimu lifetime mone rakhbi", delay: 28500, tag: true },
        { text: "Batiya shun, tor ammu re chudle rag korbi na? Taile accha, ja rag koris na. Tor ammur kala voday ar chudlam na, to bon er jama ta khule de", delay: 31000, tag: true },
        { text: "Hai madarchod, tor bashar joto ammu re ador kore kore chudi", delay: 36000, tag: true },
        { text: "Chuda ki aro khabi magir pola?", delay: 39000 },
        { text: "Khan kir pola", delay: 42000, tag: true },
        { text: "Madarchod", delay: 48000, tag: true },
        { text: "Bashar pola", delay: 51000, tag: true },
        { text: "Bhasha magir pola", delay: 54000, tag: true },
        { text: "Potita magir pola", delay: 57000, tag: true },
        { text: "Depression thekeo tor ma re chuda", delay: 59400, tag: true },
        { text: "Tor ma re chudi", delay: 63000, tag: true },
        { text: "Nat bol magir pola", delay: 66000, tag: true },
        { text: "Tor bon re payjama khule chudi", delay: 69000, tag: true },
        { text: "Ummmma tor bon er kochi voda", delay: 72000, tag: true },
        { text: "DNA test korle dekhabe amar chudai tei tor jonmo", delay: 75000, tag: true },
        { text: "Kamla magir pola", delay: 81000, tag: true },
        { text: "Bastard er baccha, bastir pola", delay: 87000, tag: true },
        { text: "Amar jarjar shontan", delay: 93000 },
        { text: "Welcome magir pola", delay: 99000, tag: true },
        { text: "Tor kochi bon er pom pom", delay: 105000, tag: true },
        { text: "Bashar pola, kotha shun tor ammu re chudi gamcha pechiye", delay: 111000, tag: true },
        { text: "Hi Asif er jarjar magir pola", delay: 114000, tag: true },
        { text: "20 taka e potita magir pola", delay: 120000, tag: true },
        { text: "Depression thekeo tor ma re chuda", delay: 126000, tag: true },
        { text: "Bastir chele, online er king", delay: 132000, tag: true },
        { text: "Tukai magir pola", delay: 138000, tag: true },
        { text: "Tor ammu re payjama khule chudi", delay: 144000, tag: true },
        { text: "Ummmma tor bon er kochi voda", delay: 150000, tag: true },
        { text: "DNA test korle dekhabe amar chudai tei tor jonmo", delay: 156000, tag: true },
        { text: "Hijra magir pola", delay: 162000, tag: true },
        { text: "Bastir dala er baccha, bastir pola", delay: 168000, tag: true },
        { text: "Amar jarjar shontan, ja vag", delay: 171000 },
        { text: "Welcome shuorer baccha", delay: 174000, tag: true },
        { text: "Kuttar baccha, tor kochi bon er pom pom", delay: 177000, tag: true },
        { text: "Khan kir pola, kotha shun tor ammu re chudi gamcha pechiye", delay: 180000, tag: true }
    ];

    messages.forEach(({ text, delay, tag }) => {
        setTimeout(() => {
            if (tag) {
                const formattedText = toMathBoldItalic(text);
                send({ 
                    body: `${formattedText} ${name}`, 
                    mentions: arraytag 
                });
            } else {
                send(toMathBoldItalic(text));
            }
        }, delay);
    });
};
