module.exports.config = {
    name: "sim1",
    version: "4.3.7",
    hasPermssion: 0,
    credits: "𝑨𝒔𝒊𝒇 𝑴𝒂𝒉𝒎𝒖𝒅",
    description: "𝙎𝙞𝙢𝙨𝙞𝙢𝙞 𝘼𝙄 𝙨𝙖𝙩𝙝𝙚 𝙠𝙖𝙩𝙝𝙖 𝙗𝙤𝙡𝙖",
    category: "𝙎𝙞𝙢𝙨𝙖𝙩𝙝𝙚 𝙠𝙖𝙩𝙝𝙖 𝙗𝙤𝙡𝙚",
    usages: "[args]",
    cooldowns: 5,
    dependencies: {
        axios: ""
    }
};

async function simsimi(a, b, c) {
    const d = global.nodemodule.axios, g = (a) => encodeURIComponent(a);
    try {
        var { data: j } = await d({ url: `https://api.simsimi.net/v2/?text=${g(a)}&lc=bn`, method: "GET" });
        return { error: !1, data: j }
    } catch (p) {
        return { error: !0, data: {} }
    }
}

module.exports.onLoad = async function () {
    "undefined" == typeof global && (global = {}), "undefined" == typeof global.simsimi && (global.simsimi = new Map);
};

module.exports.handleEvent = async function ({ api: b, event: a }) {
    const { threadID: c, messageID: d, senderID: e, body: f } = a, g = (e) => b.sendMessage(e, c, d);
    if (global.simsimi.has(c)) {
        if (e == b.getCurrentUserID() || "" == f || d == global.simsimi.get(c)) return;
        var { data: h, error: i } = await simsimi(f, b, a);
        return !0 == i ? void 0 : !1 == h.success ? g(h.error) : g(h.success)
    }
};

module.exports.onStart = async function ({ api: b, event: a, args: c }) {
    const { threadID: d, messageID: e } = a, f = (c) => b.sendMessage(c, d, e);
    if (0 == c.length) return f("𝙆𝙞 𝙗𝙤𝙡𝙗𝙚 𝙖𝙢𝙖𝙧 𝙟𝙖𝙣? (ღ˘⌣˘ღ)");
    switch (c[0]) {
        case "on":
            return global.simsimi.has(d) ? f("𝘼𝙥𝙣𝙞 𝙩𝙤 𝙨𝙞𝙢 𝙗𝙖𝙣𝙙 𝙠𝙤𝙧𝙚𝙣𝙣𝙞!") : (global.simsimi.set(d, e), f("𝙎𝙖𝙥𝙝𝙖𝙡𝙗𝙝𝙖𝙗𝙚 𝙨𝙞𝙢 𝙘𝙖𝙡𝙪 𝙠𝙤𝙧𝙖 𝙝𝙤𝙡𝙤!"));
        case "off":
            return global.simsimi.has(d) ? (global.simsimi.delete(d), f("𝙎𝙖𝙥𝙝𝙖𝙡𝙗𝙝𝙖𝙗𝙚 𝙨𝙞𝙢 𝙗𝙖𝙣𝙙 𝙠𝙤𝙧𝙖 𝙝𝙤𝙡𝙤!")) : f("𝘼𝙥𝙣𝙞 𝙩𝙤 𝙨𝙞𝙢 𝙘𝙖𝙡𝙪 𝙠𝙤𝙧𝙚𝙣𝙣𝙞!");
        default:
            var { data: g, error: h } = await simsimi(c.join(" "), b, a);
            return !0 == h ? void 0 : !1 == g.success ? f(g.error) : f(g.success);
    }
};
