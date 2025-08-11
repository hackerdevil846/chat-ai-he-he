const chalk = require('chalk');

// Command configuration
module.exports.config = {
    name: "join",
    version: "1.0.1",
    permission: 2,
    credits: "Asif",
    prefix: true,
    description: "Join the bot's groups",
    category: "admin",
    usages: "",
    cooldowns: 5
};

// Required initialization hook for the framework
module.exports.onStart = async function() {
    return true;
};

// Message reply handler for group selection
module.exports.handleReply = async function({ api, event, handleReply, Threads }) {
    const { threadID, messageID, senderID, body } = event;
    const { ID } = handleReply;

    try {
        // Validate input
        if (!body || isNaN(parseInt(body))) {
            return api.sendMessage('Your selection must be a number.', threadID, messageID);
        }

        if ((parseInt(body) - 1) >= ID.length) {
            return api.sendMessage("Your pick is not on the list", threadID, messageID);
        }

        // Get thread information
        const threadInfo = await Threads.getInfo(ID[body - 1]);
        const { participantIDs, approvalMode, adminIDs } = threadInfo;
        const currentUserID = api.getCurrentUserID();

        // Check if user is already in the group
        if (participantIDs.includes(senderID)) {
            return api.sendMessage(`You are already in this group.`, threadID, messageID);
        }

        // Add user to group
        await api.addUserToGroup(senderID, ID[body - 1]);

        // Handle approval mode
        if (approvalMode && !adminIDs.some(item => item.id === currentUserID)) {
            return api.sendMessage(
                "Added you to the group's approval list. Customize yourself.",
                threadID,
                messageID
            );
        }

        // Success message
        return api.sendMessage(
            `You have joined to ${threadInfo.threadName}. Check in the message request or spam message. If the group didn't appear, the group may require admin approval.`,
            threadID,
            messageID
        );

    } catch (error) {
        console.error('Error in join command:', error);
        return api.sendMessage(`I can't add you to that group\nError: ${error}`, threadID, messageID);
    }
};

// Main command execution
module.exports.run = async function({ api, event, Threads }) {
    const { threadID, messageID, senderID } = event;

    try {
        const allThreads = await Threads.getAll();
        let msg = `All groups where this bot is present:\n\n`;
        const IDs = [];

        for (let i = 0; i < allThreads.length; i++) {
            const thread = allThreads[i];
            msg += `${i + 1}. ${thread.threadInfo.threadName}\n`;
            IDs.push(thread.threadID);
        }

        msg += `\nReply to this message with the number of the group you want to join`;

        return api.sendMessage(msg, threadID, async (error, info) => {
            if (error) {
                console.error('Error sending message:', error);
                return;
            }

            global.client.handleReply.push({
                name: this.config.name,
                author: senderID,
                messageID: info.messageID,
                ID: IDs
            });
        }, messageID);

    } catch (error) {
        console.error('Error fetching groups:', error);
        return api.sendMessage('Failed to retrieve group list. Please try again later.', threadID, messageID);
    }
};
