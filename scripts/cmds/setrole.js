module.exports.config = {
  name: "setrole",
  version: "1.4",
  author: "𝑨𝒔𝒊𝒇 𝑴𝒂𝒉𝒎𝒖𝒅",
  role: 1,
  description: {
    vi: "Chỉnh sửa quyền sử dụng lệnh (những lệnh có quyền < 2)",
    en: "Edit command usage permissions (commands with role < 2)"
  },
  category: "info",
  cooldowns: 5,
  guide: {
    vi: "{pn} <commandName> <new role>: Cập nhật quyền sử dụng lệnh"
      + "\n   Với:"
      + "\n   + <commandName>: tên lệnh"
      + "\n   + <new role>: quyền mới của lệnh với:"
      + "\n   + <new role> = 0: lệnh có thể được sử dụng bởi mọi thành viên"
      + "\n   + <new role> = 1: lệnh chỉ có thể được sử dụng bởi quản trị viên"
      + "\n   + <new role> = default: khôi phục quyền mặc định"
      + "\n   Ví dụ:"
      + "\n    {pn} rank 1: (lệnh rank chỉ dành cho quản trị viên)"
      + "\n    {pn} rank 0: (lệnh rank dành cho mọi thành viên)"
      + "\n    {pn} rank default: khôi phục quyền mặc định"
      + "\n—————"
      + "\n   {pn} [viewrole|view|show]: xem quyền của các lệnh đã chỉnh sửa",
    en: "{pn} <commandName> <new role>: Update command usage permissions"
      + "\n   With:"
      + "\n   + <commandName>: command name"
      + "\n   + <new role>: new permission level for the command:"
      + "\n   + <new role> = 0: command accessible by all members"
      + "\n   + <new role> = 1: command accessible by admins only"
      + "\n   + <new role> = default: reset to default permissions"
      + "\n   Example:"
      + "\n    {pn} rank 1: (rank command for admins only)"
      + "\n    {pn} rank 0: (rank command for all members)"
      + "\n    {pn} rank default: reset to default permissions"
      + "\n—————"
      + "\n   {pn} [viewrole|view|show]: view roles of edited commands"
  }
};

module.exports.languages = {
  vi: {
    noEditedCommand: "✅ Nhóm bạn chưa chỉnh sửa quyền lệnh nào",
    editedCommand: "⚠️ Các lệnh đã chỉnh sửa quyền trong nhóm bạn:\n",
    noPermission: "❗ Chỉ quản trị viên mới có thể thực hiện lệnh này",
    commandNotFound: "Không tìm thấy lệnh \"%1\"",
    noChangeRole: "❗ Không thể thay đổi quyền lệnh \"%1\"",
    resetRole: "Đã khôi phục quyền lệnh \"%1\" về mặc định",
    changedRole: "Đã thay đổi quyền lệnh \"%1\" thành %2"
  },
  en: {
    noEditedCommand: "✅ No edited commands in your group",
    editedCommand: "⚠️ Edited commands in your group:\n",
    noPermission: "❗ Only admins can execute this command",
    commandNotFound: "Command \"%1\" not found",
    noChangeRole: "❗ Cannot change role of command \"%1\"",
    resetRole: "Reset role of command \"%1\" to default",
    changedRole: "Changed role of command \"%1\" to %2"
  }
};

module.exports.onStart = async function ({ message, event, args, role, threadsData, getLang }) {
  const { commands, aliases } = global.GoatBot;
  const setRole = await threadsData.get(event.threadID, "data.setRole", {});

  if (["view", "viewrole", "show"].includes(args[0])) {
    if (!setRole || Object.keys(setRole).length === 0)
      return message.reply(getLang("noEditedCommand"));
    let msg = getLang("editedCommand");
    for (const cmd in setRole) msg += `- ${cmd} => ${setRole[cmd]}\n`;
    return message.reply(msg);
  }

  let commandName = (args[0] || "").toLowerCase();
  let newRole = args[1];
  if (!commandName || (isNaN(newRole) && newRole !== "default"))
    return message.SyntaxError();
  if (role < 1)
    return message.reply(getLang("noPermission"));

  const command = commands.get(commandName) || commands.get(aliases.get(commandName));
  if (!command)
    return message.reply(getLang("commandNotFound", commandName));
  commandName = command.config.name;
  if (command.config.role > 1)
    return message.reply(getLang("noChangeRole", commandName));

  let Default = false;
  if (newRole === "default" || newRole == command.config.role) {
    Default = true;
    newRole = command.config.role;
  }
  else {
    newRole = parseInt(newRole);
  }

  setRole[commandName] = newRole;
  if (Default)
    delete setRole[commandName];
  await threadsData.set(event.threadID, setRole, "data.setRole");
  message.reply("✅ " + (Default === true ? getLang("resetRole", commandName) : getLang("changedRole", commandName, newRole)));
};
