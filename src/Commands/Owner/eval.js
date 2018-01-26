const Command = require("../../Constructors/Command.js");
module.exports = class extends Command {
  constructor(client, filePath) {
    super(client, filePath, {"name": "eval"});
  }
  execute(m) {
    if (!m.isOwner) return m.errors.notBotOwner();
    try {
      return m.channel.send(`\`\`\`js\n${eval(this.client.getAllArguments([m.args[0]], m.content))}\n\`\`\``);
    } catch(e) {
      return m.channel.send(`\`\`\`js\n${e.stack}\n\`\`\``);
    }
  }
};