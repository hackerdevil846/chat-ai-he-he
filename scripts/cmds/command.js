module.exports.config = {
    name: "cmdbackup",
    version: "1.0.0",
    hasPermssion: 2,
    credits: "𝑨𝒔𝒊𝒇 𝑴𝒂𝒉𝒎𝒖𝒅",
    description: "𝑩𝒐𝒕 𝒆𝒓 𝒎𝒐𝒅𝒖𝒍𝒆 𝒎𝒂𝒏𝒂𝒈𝒆/𝒇𝒖𝒍𝒍 𝒄𝒐𝒏𝒕𝒓𝒐𝒍 𝒌𝒐𝒓𝒂",
    category: "𝑨𝒅𝒎𝒊𝒏-𝒃𝒐𝒕 𝒔𝒚𝒔𝒕𝒆𝒎",
    usages: "[𝒍𝒐𝒂𝒅/𝒖𝒏𝒍𝒐𝒂𝒅/𝒍𝒐𝒂𝒅𝑨𝒍𝒍/𝒖𝒏𝒍𝒐𝒂𝒅𝑨𝒍𝒍/𝒊𝒏𝒇𝒐] [𝒎𝒐𝒅𝒖𝒍𝒆 𝒏𝒂𝒎𝒆]",
    cooldowns: 5,
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

const loadCommand = function ({ moduleList, threadID, messageID }) {
    const { execSync } = global.nodemodule['child_process'];
    const { writeFileSync, readFileSync, unlinkSync } = global.nodemodule['fs-extra'];
    const { join } = global.nodemodule['path'];
    const { configPath, mainPath, api } = global.client;
    const logger = require(mainPath + '/utils/log');

    const errorList = [];

    try {
        delete require.cache[require.resolve(configPath)];
    } catch (e) { }

    let configValue;
    try {
        configValue = require(configPath);
    } catch (e) {
        api.sendMessage(toMathBoldItalic('❌ Config file load korte problem: ' + e.message), threadID, messageID);
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
                throw new Error('𝑴𝒐𝒅𝒖𝒍𝒆 𝒎𝒂𝒍𝒇𝒐𝒓𝒎𝒆𝒅!');

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
                        logger.loader(toMathBoldItalic('⚠️ Package not found: ' + packageName + ' — installing for command ' + command.config.name + '...'), 'warn');
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
                        throw new Error('Unable to load package ' + packageName + ' for command ' + command.config.name + ', error: ' + (lastError ? lastError.message : 'unknown'));
                    }
                }

                logger.loader(toMathBoldItalic('✅ Successfully installed/loaded packages for command ' + command.config.name + '!'));
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
                    logger.loader(toMathBoldItalic('🔧 Loaded config for ' + command.config.name));
                } catch (error) {
                    throw new Error(toMathBoldItalic('Unable to load config module, error: ' + JSON.stringify(error)));
                }
            }

            if (command.onLoad) {
                try {
                    const onLoads = { configValue };
                    command.onLoad(onLoads);
                } catch (error) {
                    throw new Error(toMathBoldItalic('Unable to onLoad module, error: ' + JSON.stringify(error)));
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
            logger.loader(toMathBoldItalic('✅ Loaded command ' + command.config.name + '!'));
        } catch (error) {
            errorList.push(toMathBoldItalic('- ' + nameModule + ' reason: ' + (error && error.message ? error.message : String(error))));
        }
    }

    if (errorList.length !== 0) {
        api.sendMessage(toMathBoldItalic('❌ Command load korte problem hoyeche:\n' + errorList.join('\n')), threadID, messageID);
    }

    api.sendMessage(toMathBoldItalic(`✅ Safollo vabe load kora holo ${moduleList.length - errorList.length} ti command 🎉`), threadID, messageID);

    try {
        writeFileSync(configPath, JSON.stringify(configValue, null, 4), 'utf8');
    } catch (e) {
        api.sendMessage(toMathBoldItalic('⚠️ Config save korte problem: ' + e.message), threadID, messageID);
    }

    try { unlinkSync(configPath + '.temp'); } catch (e) { }
};

const unloadModule = function ({ moduleList, threadID, messageID }) {
    const { writeFileSync, unlinkSync, readFileSync } = global.nodemodule["fs-extra"];
    const { configPath, mainPath, api } = global.client;
    const logger = require(mainPath + "/utils/log").loader;

    try {
        delete require.cache[require.resolve(configPath)];
    } catch (e) { }

    let configValue;
    try {
        configValue = require(configPath);
    } catch (e) {
        api.sendMessage(toMathBoldItalic('❌ Config load error: ' + e.message), threadID, messageID);
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

            logger(toMathBoldItalic(`🗑️ Unloaded command ${nameModule}!`));
        } catch (e) {
            logger(toMathBoldItalic(`⚠️ Error unloading ${nameModule}: ${e.message}`));
        }
    }

    try {
        writeFileSync(configPath, JSON.stringify(configValue, null, 4), 'utf8');
    } catch (e) {
        api.sendMessage(toMathBoldItalic('⚠️ Config save korte problem: ' + e.message), threadID, messageID);
    }

    try { unlinkSync(configPath + ".temp"); } catch (e) { }

    api.sendMessage(toMathBoldItalic(`✅ Safollo vabe unload kora holo ${moduleList.length} ti command 🧾`), threadID, messageID);
};

module.exports.onStart = function ({ api, event, args, client }) {
    const { readdirSync } = global.nodemodule["fs-extra"];
    const { threadID, messageID } = event;
    const permission = global.config && global.config.GOD ? global.config.GOD : [];

    if (!Array.isArray(permission) || !permission.includes(event.senderID)) {
        return api.sendMessage(toMathBoldItalic("⚠️ Apni ei command use korar permission paen na!"), threadID, messageID);
    }

    let moduleList = args.slice(1);

    switch (args[0]) {
        case "count": {
            api.sendMessage(toMathBoldItalic(`ℹ️ Ekhon available ${client.commands ? client.commands.size : 0} ti command`), threadID, messageID);
            break;
        }
        case "load": {
            if (!moduleList || moduleList.length === 0) {
                return api.sendMessage(toMathBoldItalic("❌ Module nam khali rakha jabe na!"), threadID, messageID);
            }
            return loadCommand({ moduleList, threadID, messageID });
        }
        case "unload": {
            if (!moduleList || moduleList.length === 0) {
                return api.sendMessage(toMathBoldItalic("❌ Module nam khali rakha jabe na!"), threadID, messageID);
            }
            return unloadModule({ moduleList, threadID, messageID });
        }
        case "loadAll": {
            moduleList = readdirSync(__dirname).filter((file) => file.endsWith(".js") && !file.includes('example'));
            moduleList = moduleList.map(item => item.replace(/\.js$/g, ""));
            return loadCommand({ moduleList, threadID, messageID });
        }
        case "unloadAll": {
            moduleList = readdirSync(__dirname).filter((file) => file.endsWith(".js") && !file.includes('example') && !file.includes("command"));
            moduleList = moduleList.map(item => item.replace(/\.js$/g, ""));
            return unloadModule({ moduleList, threadID, messageID });
        }
        case "info": {
            const targetName = moduleList.join("").trim() || "";
            const command = global.client.commands.get(targetName);
            if (!command) {
                return api.sendMessage(toMathBoldItalic("❌ Apni enter kora module ti exist kore na!"), threadID, messageID);
            }

            const { name, version, hasPermssion, credits, cooldowns, dependencies } = command.config;
            const permissionLevel =
                hasPermssion == 0 ? "Sadharon user" :
                hasPermssion == 1 ? "Admin" :
                "Bot operator";

            const infoMsg = toMathBoldItalic(
                `=== ${String(name).toUpperCase()} ===\n` +
                `- Coded by: ${credits}\n` +
                `- Version: ${version}\n` +
                `- Permission Level: ${permissionLevel}\n` +
                `- Cooldown: ${cooldowns} second(s)\n` +
                `- Packages required: ${Object.keys(dependencies || {}).length ? Object.keys(dependencies || {}).join(", ") : "Not available"}`
            );

            return api.sendMessage(infoMsg, threadID, messageID);
        }
        default: {
            return api.sendMessage(toMathBoldItalic("❌ Vul command! Usage: cmdbackup [load/unload/loadAll/unloadAll/info] [module name]"), threadID, messageID);
        }
    }
};
