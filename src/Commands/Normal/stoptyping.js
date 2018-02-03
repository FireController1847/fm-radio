const Command = require("../../Constructors/Command.js");
module.exports = class extends Command {
  constructor(client, filePath) {
    super(client, filePath, {
      name: "stoptyping",
      aliases: ["st"],
      desc: "Forces the bot to stop typing in all channels in the guild or a DM channel."
    });
  }
  execute(m) {
    if (m.isDM) {
      return this.end(m);
    }
    m.guild.channels.filter(ch => ch.type == "text").forEach(ch => {
      ch.stopTyping(true);
    });
    return this.end(m);
  }
};