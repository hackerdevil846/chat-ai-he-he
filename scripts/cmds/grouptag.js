module.exports = {
    config: {
        name: "grouptag",
        aliases: ["grtag"],
        version: "1.6",
        author: "Asif Mahmud",
        countDown: 5,
        role: 0,
        category: "utility",
        shortDescription: {
            en: "Tag members by group"
        },
        longDescription: {
            en: "Manage group tags for easy member mentioning"
        },
        guide: {
            en: "{p}grouptag add/del/remove/list/info/rename/tag <groupTagName>"
        }
    },

    onStart: async function({ api, event, args, threadsData, message }) {
        try {
            const threadID = event.threadID;
            const threadData = await threadsData.get(threadID);
            threadData.data = threadData.data || {};
            const groupTags = threadData.data.groupTags || [];

            const reply = async (msg) => {
                return message.reply(msg);
            };

            const mentionsMap = {};
            if (event.mentions) {
                for (const uid in event.mentions) {
                    mentionsMap[uid] = event.mentions[uid].replace(/^@/, "");
                }
            }

            const cmd = args[0] ? args[0].toLowerCase() : "tag";

            switch (cmd) {
                case 'add': {
                    const mentionsID = Object.keys(event.mentions || {});
                    const content = (args.slice(1) || []).join(' ');
                    
                    if (!mentionsID[0]) {
                        return reply("❗ You haven't tagged any member to add to group tag");
                    }

                    const firstMentionName = event.mentions[mentionsID[0]];
                    const idx = content.indexOf(firstMentionName);
                    const groupTagName = (idx > 0) ? content.slice(0, idx - 1).trim() : content.slice(0, content.indexOf(firstMentionName)).trim();
                    
                    if (!groupTagName) {
                        return reply("❗ Please enter group tag name");
                    }

                    const oldGroupTag = groupTags.find(tag => tag.name.toLowerCase() === groupTagName.toLowerCase());
                    
                    if (oldGroupTag) {
                        const usersIDExist = [];
                        const usersIDNotExist = [];
                        
                        for (const uid in mentionsMap) {
                            if (oldGroupTag.users.hasOwnProperty(uid)) {
                                usersIDExist.push(uid);
                            } else {
                                oldGroupTag.users[uid] = mentionsMap[uid];
                                usersIDNotExist.push(uid);
                            }
                        }
                        
                        threadData.data.groupTags = groupTags;
                        await threadsData.set(threadID, threadData);

                        let msg = "";
                        if (usersIDNotExist.length > 0) {
                            msg += `✅ Added members to group tag "${oldGroupTag.name}":\n${usersIDNotExist.map(uid => mentionsMap[uid]).join('\n')}\n`;
                        }
                        if (usersIDExist.length > 0) {
                            msg += `⚠️ Members:\n${usersIDExist.map(uid => mentionsMap[uid]).join('\n')}\nalready existed in group tag "${oldGroupTag.name}"`;
                        }
                        return reply(msg);
                    } else {
                        const newGroupTag = { 
                            name: groupTagName, 
                            users: { ...mentionsMap } 
                        };
                        groupTags.push(newGroupTag);
                        threadData.data.groupTags = groupTags;
                        await threadsData.set(threadID, threadData);
                        return reply(`✅ Added group tag "${groupTagName}" with members:\n${Object.values(mentionsMap).join('\n')}`);
                    }
                }

                case 'list':
                case 'all': {
                    if (args[1]) {
                        const groupTagName = args.slice(1).join(' ');
                        if (!groupTagName) {
                            return reply("❗ Please enter group tag name");
                        }
                        
                        const groupTag = groupTags.find(tag => tag.name.toLowerCase() === groupTagName.toLowerCase());
                        if (!groupTag) {
                            return reply(`❌ Group tag "${groupTagName}" doesn't exist in your group chat`);
                        }
                        
                        const body = `📑 | Group name: ${groupTag.name}\n👥 | Number of members: ${Object.keys(groupTag.users).length}\n👨‍👩‍👧‍👦 | List of members:\n ${Object.keys(groupTag.users).map(uid => groupTag.users[uid]).join('\n ')}`;
                        return reply(body);
                    }
                    
                    if (groupTags.length === 0) {
                        return reply("📭 Your group chat hasn't added any group tag");
                    }
                    
                    const msg = groupTags.map(group => 
                        `\n📌 ${group.name}:\n ${Object.values(group.users).join('\n ')}`
                    ).join('\n');
                    
                    return reply(msg);
                }

                case 'info': {
                    const groupTagName = args.slice(1).join(' ');
                    if (!groupTagName) {
                        return reply("❗ Please enter group tag name");
                    }
                    
                    const groupTag = groupTags.find(tag => tag.name.toLowerCase() === groupTagName.toLowerCase());
                    if (!groupTag) {
                        return reply(`❌ Group tag "${groupTagName}" doesn't exist in your group chat`);
                    }
                    
                    const body = `📑 | Group name: ${groupTag.name}\n👥 | Number of members: ${Object.keys(groupTag.users).length}\n👨‍👩‍👧‍👦 | List of members:\n ${Object.keys(groupTag.users).map(uid => groupTag.users[uid]).join('\n ')}`;
                    return reply(body);
                }

                case 'del': {
                    const content = (args.slice(1) || []).join(' ');
                    const mentionsID = Object.keys(event.mentions || {});
                    
                    if (!mentionsID[0]) {
                        return reply("❗ Please tag members to remove from group tag");
                    }

                    const firstMentionName = event.mentions[mentionsID[0]];
                    const idx = content.indexOf(firstMentionName);
                    const groupTagName = (idx > 0) ? content.slice(0, idx - 1).trim() : content.slice(0, content.indexOf(firstMentionName)).trim();
                    
                    if (!groupTagName) {
                        return reply("❗ Please enter group tag name");
                    }

                    const oldGroupTag = groupTags.find(tag => tag.name.toLowerCase() === groupTagName.toLowerCase());
                    if (!oldGroupTag) {
                        return reply(`❌ Group tag "${groupTagName}" doesn't exist in your group chat`);
                    }

                    const usersIDExist = [];
                    const usersIDNotExist = [];
                    
                    for (const uid in mentionsMap) {
                        if (oldGroupTag.users.hasOwnProperty(uid)) {
                            delete oldGroupTag.users[uid];
                            usersIDExist.push(uid);
                        } else {
                            usersIDNotExist.push(uid);
                        }
                    }

                    threadData.data.groupTags = groupTags;
                    await threadsData.set(threadID, threadData);

                    let msg = "";
                    if (usersIDNotExist.length > 0) {
                        msg += `❌ Members:\n${usersIDNotExist.map(uid => mentionsMap[uid]).join('\n')}\ndoesn't exist in group tag "${groupTagName}"\n`;
                    }
                    if (usersIDExist.length > 0) {
                        msg += `🗑️ Deleted members:\n${usersIDExist.map(uid => mentionsMap[uid]).join('\n')}\nfrom group tag "${groupTagName}"`;
                    }
                    return reply(msg);
                }

                case 'remove':
                case 'rm': {
                    const groupTagName = (args.slice(1) || []).join(' ').trim();
                    if (!groupTagName) {
                        return reply("❗ Please enter group tag name");
                    }
                    
                    const index = groupTags.findIndex(group => group.name.toLowerCase() === groupTagName.toLowerCase());
                    if (index === -1) {
                        return reply(`❌ Group tag "${groupTagName}" doesn't exist in your group chat`);
                    }
                    
                    groupTags.splice(index, 1);
                    threadData.data.groupTags = groupTags;
                    await threadsData.set(threadID, threadData);
                    return reply(`🗑️ Deleted group tag "${groupTagName}"`);
                }

                case 'rename': {
                    const content = (args.slice(1) || []).join(' ');
                    const arr = content.split('|').map(str => str.trim());
                    const oldGroupTagName = arr[0];
                    const newGroupTagName = arr[1];
                    
                    if (!oldGroupTagName || !newGroupTagName) {
                        return reply('❗ Please enter old group tag name and new group tag name, separated by "|"');
                    }
                    
                    const oldGroupTag = groupTags.find(tag => tag.name.toLowerCase() === oldGroupTagName.toLowerCase());
                    if (!oldGroupTag) {
                        return reply(`❌ Group tag "${oldGroupTagName}" doesn't exist in your group chat`);
                    }
                    
                    oldGroupTag.name = newGroupTagName;
                    threadData.data.groupTags = groupTags;
                    await threadsData.set(threadID, threadData);
                    return reply(`✏️ Renamed group tag "${oldGroupTagName}" to "${newGroupTagName}"`);
                }

                case 'tag':
                default: {
                    const content = (args.slice(cmd === 'tag' ? 1 : 0) || []).join(' ');
                    const groupTagName = content.trim();
                    
                    if (!groupTagName) {
                        return reply("❗ Please enter group tag name");
                    }
                    
                    const oldGroupTag = groupTags.find(tag => tag.name.toLowerCase() === groupTagName.toLowerCase());
                    if (!oldGroupTag) {
                        return reply(`❌ Group tag "${groupTagName}" doesn't exist in your group chat`);
                    }

                    const users = oldGroupTag.users;
                    const mentions = [];
                    let msg = "";
                    
                    for (const uid in users) {
                        const userName = users[uid];
                        mentions.push({ id: uid, tag: userName });
                        msg += `${userName}\n`;
                    }

                    return message.reply({ 
                        body: `🔔 Tag group "${groupTagName}":\n${msg}`, 
                        mentions 
                    });
                }
            }
        } catch (error) {
            console.error("GroupTag Error:", error);
            message.reply("❌ An error occurred while processing the command. Please try again.");
        }
    }
};
