const fs = require("fs-extra");
const child_process = require("child_process");
const path = require("path");

module.exports.config = {
    name: "cmdbackup",
    aliases: ["modulemanager", "cmdmgmt"],
    version: "1.0.0",
    author: "𝐴𝑠𝑖𝑓 𝑀𝑎ℎ𝑚𝑢𝑑",
    countDown: 5,
    role: 2,
    category: "𝑎𝑑𝑚𝑖𝑛",
    shortDescription: {
        en: "𝐵𝑜𝑡 𝑚𝑜𝑑𝑢𝑙𝑒 𝑚𝑎𝑛𝑎𝑔𝑒𝑚𝑒𝑛𝑡 𝑎𝑛𝑑 𝑓𝑢𝑙𝑙 𝑐𝑜𝑛𝑡𝑟𝑜𝑙"
    },
    longDescription: {
        en: "𝑀𝑎𝑛𝑎𝑔𝑒 𝑏𝑜𝑡 𝑚𝑜𝑑𝑢𝑙𝑒𝑠 (𝑙𝑜𝑎𝑑/𝑢𝑛𝑙𝑜𝑎𝑑/𝑖𝑛𝑓𝑜)"
    },
    guide: {
        en: "{p}cmdbackup [𝑙𝑜𝑎𝑑/𝑢𝑛𝑙𝑜𝑎𝑑/𝑙𝑜𝑎𝑑𝐴𝑙𝑙/𝑢𝑛𝑙𝑜𝑎𝑑𝐴𝑙𝑙/𝑖𝑛𝑓𝑜/𝑐𝑜𝑢𝑛𝑡] [𝑚𝑜𝑑𝑢𝑙𝑒 𝑛𝑎𝑚𝑒]"
    },
    dependencies: {
        "fs-extra": "",
        "child_process": "",
        "path": ""
    }
};

function toMathBoldItalic(text) {
    const map = {
        'A': '𝑨', 'B': '𝑩', 'C': '𝑪', 'D': '𝑫', 'E': '𝑬', 'F': '𝑭', 'G': '𝑮', 'H': '𝑯', 'I': '𝑰', 'J': '𝑱', 'K': '𝑲', 'L': '𝑳', 'M': '𝑴',
        'N': '𝑵', 'O': '𝑶', 'P': '𝑷', 'Q': '𝑸', 'R': '𝑹', 'S': '𝑺', 'T': '𝑻', 'U': '𝑼', 'V': '𝑽', 'W': '𝑾', 'X': '𝑿', 'Y': '𝒀', 'Z': '𝒁',
        'a': '𝒂', 'b': '𝒃', 'c': '𝒄', 'd': '𝒅', 'e': '𝒆', 'f': '𝒇', 'g': '𝒈', 'h': '𝒉', 'i': '𝒊', 'j': '𝒋', 'k': '𝒌', 'l': '𝒍', 'm': '𝒎',
        'n': '𝒏', 'o': '𝒐', 'p': '𝒑', 'q': '𝒒', 'r': '𝒓', 's': '𝒔', 't': '𝒕', 'u': '𝒖', 'v': '𝒗', 'w': '𝒘', 'x': '𝒙', 'y': '𝒚', 'z': '𝒛',
        '0': '𝟎', '1': '𝟏', '2': '𝟐', '3': '𝟑', '4': '𝟒', '5': '𝟓', '6': '𝟔', '7': '𝟕', '8': '𝟖', '9': '𝟗',
        ' ': ' ', '!': '!', '?': '?', '.': '.', ',': ',', "'": "'", '"': '"', ':': ':', ';': ';', '-': '-', '_': '_'
    };
    return String(text).split('').map(char => map[char] || char).join('');
}

const loadCommand = function ({ moduleList, threadID, messageID, api }) {
    const { execSync } = child_process;
    const { writeFileSync, readFileSync, unlinkSync } = fs;
    const { join } = path;
    const { configPath, mainPath } = global.client;
    const logger = require(mainPath + '/utils/log');

    const errorList = [];

    try {
        delete require.cache[require.resolve(configPath)];
    } catch (e) { }

    let configValue;
    try {
        configValue = require(configPath);
    } catch (e) {
        api.sendMessage(toMathBoldItalic('❌ 𝐶𝑜𝑛𝑓𝑖𝑔 𝑓𝑖𝑙𝑒 𝑙𝑜𝑎𝑑 𝑝𝑟𝑜𝑏𝑙𝑒𝑚: ' + e.message), threadID, messageID);
        return;
    }

    writeFileSync(configPath + '.temp', JSON.stringify(configValue, null, 4), 'utf8');

    for (const nameModule of moduleList) {
        try {
            const dirModule = __dirname + '/' + nameModule + '.js';

            try { delete require.cache[require.resolve(dirModule)]; } catch (e) { }

            const command = require(dirModule);

            if (global.client && global.client.commands && global.client.commands.has(nameModule))
                global.client.commands.delete(nameModule);

            if (!command.config || !command.run || !command.config.commandCategory) 
                throw new Error('𝑀𝑜𝑑𝑢𝑙𝑒 𝑚𝑎𝑙𝑓𝑜𝑟𝑚𝑒𝑑!');

            if (Array.isArray(global.client.eventRegistered))
                global.client.eventRegistered = global.client.eventRegistered.filter(info => info != command.config.name);

            if (command.config.dependencies && typeof command.config.dependencies === 'object') {
                const listPackage = JSON.parse(readFileSync('./package.json')).dependencies || {};
                const listbuiltinModules = require('module').builtinModules || [];

                for (const packageName in command.config.dependencies) {
                    let loadSuccess = false;
                    let lastError = null;
                    const moduleDir = join(global.client.mainPath, 'nodemodules', 'node_modules', packageName);

                    try {
                        if (listPackage.hasOwnProperty(packageName) || listbuiltinModules.includes(packageName))
                            global.nodemodule[packageName] = require(packageName);
                        else
                            global.nodemodule[packageName] = require(moduleDir);
                        loadSuccess = true;
                    } catch (err) {
                        logger.loader(toMathBoldItalic('⚠️ 𝑃𝑎𝑐𝑘𝑎𝑔𝑒 𝑛𝑜𝑡 𝑓𝑜𝑢𝑛𝑑: ' + packageName + ' — 𝑖𝑛𝑠𝑡𝑎𝑙𝑙𝑖𝑛𝑔 𝑓𝑜𝑟 𝑐𝑜𝑚𝑚𝑎𝑛𝑑 ' + command.config.name + '...'), 'warn');
                        const insPack = { stdio: 'inherit', env: process.env, shell: true, cwd: join(global.client.mainPath, 'nodemodules') };
                        try {
                            execSync('npm --package-lock false --save install ' + packageName + (command.config.dependencies[packageName] == '*' || command.config.dependencies[packageName] == '' ? '' : '@' + command.config.dependencies[packageName]), insPack);
                        } catch (e) {
                            lastError = e;
                        }

                        for (let tryLoadCount = 1; tryLoadCount <= 3; tryLoadCount++) {
                            try {
                                require.cache = {};
                                if (listPackage.hasOwnProperty(packageName) || listbuiltinModules.includes(packageName))
                                    global.nodemodule[packageName] = require(packageName);
                                else
                                    global.nodemodule[packageName] = require(moduleDir);
                                loadSuccess = true;
                                break;
                            } catch (e2) {
                                lastError = e2;
                            }
                        }
                    }

                    if (!loadSuccess) {
                        throw new Error('𝑈𝑛𝑎𝑏𝑙𝑒 𝑡𝑜 𝑙𝑜𝑎𝑑 𝑝𝑎𝑐𝑘𝑎𝑔𝑒 ' + packageName + ' 𝑓𝑜𝑟 𝑐𝑜𝑚𝑚𝑎𝑛𝑑 ' + command.config.name + ', 𝑒𝑟𝑟𝑜𝑟: ' + (lastError ? lastError.message : '𝑢𝑛𝑘𝑛𝑜𝑤𝑛'));
                    }
                }

                logger.loader(toMathBoldItalic('✅ 𝑆𝑢𝑐𝑐𝑒𝑠𝑠𝑓𝑢𝑙𝑙𝑦 𝑖𝑛𝑠𝑡𝑎𝑙𝑙𝑒𝑑/𝑙𝑜𝑎𝑑𝑒𝑑 𝑝𝑎𝑐𝑘𝑎𝑔𝑒𝑠 𝑓𝑜𝑟 𝑐𝑜𝑚𝑚𝑎𝑛𝑑 ' + command.config.name + '!'));
            }

            if (command.config.envConfig && typeof command.config.envConfig === 'object') {
                try {
                    global.configModule = global.configModule || {};
                    for (const [key, value] of Object.entries(command.config.envConfig)) {
                        if (typeof global.configModule[command.config.name] === 'undefined')
                            global.configModule[command.config.name] = {};
                        if (typeof configValue[command.config.name] === 'undefined')
                            configValue[command.config.name] = {};

                        if (typeof configValue[command.config.name][key] !== 'undefined')
                            global.configModule[command.config.name][key] = configValue[command.config.name][key];
                        else
                            global.configModule[command.config.name][key] = value || '';

                        if (typeof configValue[command.config.name][key] === 'undefined')
                            configValue[command.config.name][key] = value || '';
                    }
                    logger.loader(toMathBoldItalic('🔧 𝐿𝑜𝑎𝑑𝑒𝑑 𝑐𝑜𝑛𝑓𝑖𝑔 𝑓𝑜𝑟 ' + command.config.name));
                } catch (error) {
                    throw new Error(toMathBoldItalic('𝑈𝑛𝑎𝑏𝑙𝑒 𝑡𝑜 𝑙𝑜𝑎𝑑 𝑐𝑜𝑛𝑓𝑖𝑔 𝑚𝑜𝑑𝑢𝑙𝑒, 𝑒𝑟𝑟𝑜𝑟: ' + JSON.stringify(error)));
                }
            }

            if (command.onLoad) {
                try {
                    const onLoads = { configValue };
                    command.onLoad(onLoads);
                } catch (error) {
                    throw new Error(toMathBoldItalic('𝑈𝑛𝑎𝑏𝑙𝑒 𝑡𝑜 𝑜𝑛𝐿𝑜𝑎𝑑 𝑚𝑜𝑑𝑢𝑙𝑒, 𝑒𝑟𝑟𝑜𝑟: ' + JSON.stringify(error)));
                }
            }

            if (command.handleEvent) {
                global.client.eventRegistered = global.client.eventRegistered || [];
                if (!global.client.eventRegistered.includes(command.config.name))
                    global.client.eventRegistered.push(command.config.name);
            }

            try {
                if ((global.config && Array.isArray(global.config.commandDisabled) && global.config.commandDisabled.includes(nameModule + '.js')) ||
                    (configValue && Array.isArray(configValue.commandDisabled) && configValue.commandDisabled.includes(nameModule + '.js'))) {
                    if (Array.isArray(configValue.commandDisabled) && configValue.commandDisabled.includes(nameModule + '.js')) {
                        configValue.commandDisabled.splice(configValue.commandDisabled.indexOf(nameModule + '.js'), 1);
                    }
                    if (global.config && Array.isArray(global.config.commandDisabled) && global.config.commandDisabled.includes(nameModule + '.js')) {
                        global.config.commandDisabled.splice(global.config.commandDisabled.indexOf(nameModule + '.js'), 1);
                    }
                }
            } catch (e) {
            }

            global.client.commands = global.client.commands || new Map();
            global.client.commands.set(command.config.name, command);
            logger.loader(toMathBoldItalic('✅ 𝐿𝑜𝑎𝑑𝑒𝑑 𝑐𝑜𝑚𝑚𝑎𝑛𝑑 ' + command.config.name + '!'));
        } catch (error) {
            errorList.push(toMathBoldItalic('- ' + nameModule + ' 𝑟𝑒𝑎𝑠𝑜𝑛: ' + (error && error.message ? error.message : String(error))));
        }
    }

    if (errorList.length !== 0) {
        api.sendMessage(toMathBoldItalic('❌ 𝐶𝑜𝑚𝑚𝑎𝑛𝑑 𝑙𝑜𝑎𝑑 𝑝𝑟𝑜𝑏𝑙𝑒𝑚:\n' + errorList.join('\n')), threadID, messageID);
    }

    api.sendMessage(toMathBoldItalic(`✅ 𝑆𝑢𝑐𝑐𝑒𝑠𝑠𝑓𝑢𝑙𝑙𝑦 𝑙𝑜𝑎𝑑𝑒𝑑 ${moduleList.length - errorList.length} 𝑐𝑜𝑚𝑚𝑎𝑛𝑑(𝑠) 🎉`), threadID, messageID);

    try {
        writeFileSync(configPath, JSON.stringify(configValue, null, 4), 'utf8');
    } catch (e) {
        api.sendMessage(toMathBoldItalic('⚠️ 𝐶𝑜𝑛𝑓𝑖𝑔 𝑠𝑎𝑣𝑒 𝑝𝑟𝑜𝑏𝑙𝑒𝑚: ' + e.message), threadID, messageID);
    }

    try { unlinkSync(configPath + '.temp'); } catch (e) { }
};

const unloadModule = function ({ moduleList, threadID, messageID, api }) {
    const { writeFileSync, unlinkSync } = fs;
    const { configPath, mainPath } = global.client;
    const logger = require(mainPath + "/utils/log").loader;

    try {
        delete require.cache[require.resolve(configPath)];
    } catch (e) { }

    let configValue;
    try {
        configValue = require(configPath);
    } catch (e) {
        api.sendMessage(toMathBoldItalic('❌ 𝐶𝑜𝑛𝑓𝑖𝑔 𝑙𝑜𝑎𝑑 𝑒𝑟𝑟𝑜𝑟: ' + e.message), threadID, messageID);
        return;
    }

    writeFileSync(configPath + ".temp", JSON.stringify(configValue, null, 4), 'utf8');

    for (const nameModule of moduleList) {
        try {
            if (global.client && global.client.commands && global.client.commands.has(nameModule))
                global.client.commands.delete(nameModule);

            if (Array.isArray(global.client.eventRegistered))
                global.client.eventRegistered = global.client.eventRegistered.filter(item => item !== nameModule);

            if (!Array.isArray(configValue.commandDisabled)) configValue.commandDisabled = [];
            if (!Array.isArray(global.config.commandDisabled)) global.config.commandDisabled = [];

            if (!configValue.commandDisabled.includes(`${nameModule}.js`)) configValue.commandDisabled.push(`${nameModule}.js`);
            if (!global.config.commandDisabled.includes(`${nameModule}.js`)) global.config.commandDisabled.push(`${nameModule}.js`);

            logger(toMathBoldItalic(`🗑️ 𝑈𝑛𝑙𝑜𝑎𝑑𝑒𝑑 𝑐𝑜𝑚𝑚𝑎𝑛𝑑 ${nameModule}!`));
        } catch (e) {
            logger(toMathBoldItalic(`⚠️ 𝐸𝑟𝑟𝑜𝑟 𝑢𝑛𝑙𝑜𝑎𝑑𝑖𝑛𝑔 ${nameModule}: ${e.message}`));
        }
    }

    try {
        writeFileSync(configPath, JSON.stringify(configValue, null, 4), 'utf8');
    } catch (e) {
        api.sendMessage(toMathBoldItalic('⚠️ 𝐶𝑜𝑛𝑓𝑖𝑔 𝑠𝑎𝑣𝑒 𝑝𝑟𝑜𝑏𝑙𝑒𝑚: ' + e.message), threadID, messageID);
    }

    try { unlinkSync(configPath + ".temp"); } catch (e) { }

    api.sendMessage(toMathBoldItalic(`✅ 𝑆𝑢𝑐𝑐𝑒𝑠𝑠𝑓𝑢𝑙𝑙𝑦 𝑢𝑛𝑙𝑜𝑎𝑑𝑒𝑑 ${moduleList.length} 𝑐𝑜𝑚𝑚𝑎𝑛𝑑(𝑠) 🧾`), threadID, messageID);
};

module.exports.onStart = async function({ api, event, args }) {
    const { readdirSync } = fs;
    const { threadID, messageID, senderID } = event;
    const permission = global.config && global.config.GOD ? global.config.GOD : [];

    if (!Array.isArray(permission) || !permission.includes(senderID)) {
        return api.sendMessage(toMathBoldItalic("⚠️ 𝑌𝑜𝑢 𝑑𝑜𝑛'𝑡 ℎ𝑎𝑣𝑒 𝑝𝑒𝑟𝑚𝑖𝑠𝑠𝑖𝑜𝑛 𝑡𝑜 𝑢𝑠𝑒 𝑡ℎ𝑖𝑠 𝑐𝑜𝑚𝑚𝑎𝑛𝑑!"), threadID, messageID);
    }

    let moduleList = args.slice(1);

    switch (args[0]) {
        case "count": {
            api.sendMessage(toMathBoldItalic(`ℹ️ 𝐶𝑢𝑟𝑟𝑒𝑛𝑡𝑙𝑦 𝑎𝑣𝑎𝑖𝑙𝑎𝑏𝑙𝑒 ${global.client.commands ? global.client.commands.size : 0} 𝑐𝑜𝑚𝑚𝑎𝑛𝑑(𝑠)`), threadID, messageID);
            break;
        }
        case "load": {
            if (!moduleList || moduleList.length === 0) {
                return api.sendMessage(toMathBoldItalic("❌ 𝑀𝑜𝑑𝑢𝑙𝑒 𝑛𝑎𝑚𝑒 𝑐𝑎𝑛𝑛𝑜𝑡 𝑏𝑒 𝑒𝑚𝑝𝑡𝑦!"), threadID, messageID);
            }
            return loadCommand({ moduleList, threadID, messageID, api });
        }
        case "unload": {
            if (!moduleList || moduleList.length === 0) {
                return api.sendMessage(toMathBoldItalic("❌ 𝑀𝑜𝑑𝑢𝑙𝑒 𝑛𝑎𝑚𝑒 𝑐𝑎𝑛𝑛𝑜𝑡 𝑏𝑒 𝑒𝑚𝑝𝑡𝑦!"), threadID, messageID);
            }
            return unloadModule({ moduleList, threadID, messageID, api });
        }
        case "loadAll": {
            moduleList = readdirSync(__dirname).filter((file) => file.endsWith(".js") && !file.includes('example'));
            moduleList = moduleList.map(item => item.replace(/\.js$/g, ""));
            return loadCommand({ moduleList, threadID, messageID, api });
        }
        case "unloadAll": {
            moduleList = readdirSync(__dirname).filter((file) => file.endsWith(".js") && !file.includes('example') && !file.includes("command"));
            moduleList = moduleList.map(item => item.replace(/\.js$/g, ""));
            return unloadModule({ moduleList, threadID, messageID, api });
        }
        case "info": {
            const targetName = moduleList.join("").trim() || "";
            const command = global.client.commands.get(targetName);
            if (!command) {
                return api.sendMessage(toMathBoldItalic("❌ 𝑇ℎ𝑒 𝑚𝑜𝑑𝑢𝑙𝑒 𝑦𝑜𝑢 𝑒𝑛𝑡𝑒𝑟𝑒𝑑 𝑑𝑜𝑒𝑠 𝑛𝑜𝑡 𝑒𝑥𝑖𝑠𝑡!"), threadID, messageID);
            }

            const { name, version, role, credits, countDown, dependencies } = command.config;
            const permissionLevel =
                role == 0 ? "𝑅𝑒𝑔𝑢𝑙𝑎𝑟 𝑢𝑠𝑒𝑟" :
                role == 1 ? "𝐴𝑑𝑚𝑖𝑛" :
                "𝐵𝑜𝑡 𝑜𝑝𝑒𝑟𝑎𝑡𝑜𝑟";

            const infoMsg = toMathBoldItalic(
                `=== ${String(name).toUpperCase()} ===\n` +
                `- 𝐶𝑜𝑑𝑒𝑑 𝑏𝑦: ${credits}\n` +
                `- 𝑉𝑒𝑟𝑠𝑖𝑜𝑛: ${version}\n` +
                `- 𝑃𝑒𝑟𝑚𝑖𝑠𝑠𝑖𝑜𝑛 𝐿𝑒𝑣𝑒𝑙: ${permissionLevel}\n` +
                `- 𝐶𝑜𝑜𝑙𝑑𝑜𝑤𝑛: ${countDown} 𝑠𝑒𝑐𝑜𝑛𝑑(𝑠)\n` +
                `- 𝑃𝑎𝑐𝑘𝑎𝑔𝑒𝑠 𝑟𝑒𝑞𝑢𝑖𝑟𝑒𝑑: ${Object.keys(dependencies || {}).length ? Object.keys(dependencies || {}).join(", ") : "𝑁𝑜𝑛𝑒"}`
            );

            return api.sendMessage(infoMsg, threadID, messageID);
        }
        default: {
            return api.sendMessage(toMathBoldItalic("❌ 𝐼𝑛𝑣𝑎𝑙𝑖𝑑 𝑐𝑜𝑚𝑚𝑎𝑛𝑑! 𝑈𝑠𝑎𝑔𝑒: cmdbackup [𝑙𝑜𝑎𝑑/𝑢𝑛𝑙𝑜𝑎𝑑/𝑙𝑜𝑎𝑑𝐴𝑙𝑙/𝑢𝑛𝑙𝑜𝑎𝑑𝐴𝑙𝑙/𝑖𝑛𝑓𝑜/𝑐𝑜𝑢𝑛𝑡] [𝑚𝑜𝑑𝑢𝑙𝑒 𝑛𝑎𝑚𝑒]"), threadID, messageID);
        }
    }
};
